import { NextRequest, NextResponse } from 'next/server';
import { db, generateHeuristicDiagnosis } from '@/lib/db';
import { GoogleGenAI, Type } from '@google/genai';
import { DiagnosisReport, Alert } from '@/src/types';

let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log('Gemini AI initialized successfully.');
    } catch (err) {
      console.error('Failed to initialize Gemini AI Client:', err);
    }
  }
  return ai;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const lang = body.language || 'en';
  const isZh = lang === 'zh';

  const client = getGeminiClient();
  const currentAlerts = db.getAlerts();

  const pendingAlerts = currentAlerts.filter(a => a.status === 'Pending');
  if (pendingAlerts.length === 0) {
    return NextResponse.json({ message: 'No pending alerts to diagnose', alerts: currentAlerts });
  }

  const diagnoseAlert = async (alert: Alert) => {
    const alertIdx = currentAlerts.findIndex(a => a.id === alert.id);
    if (alertIdx === -1) return;

    currentAlerts[alertIdx].status = 'Diagnosing';

    const devices = db.getDevices();
    const matchedDev = devices.find(d => alert.device && (d.name.toLowerCase() === alert.device.toLowerCase() || alert.device.toLowerCase().includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(alert.device.toLowerCase())));
    const sparklineContext = matchedDev ? matchedDev.sparkline.join(', ') : 'N/A';

    if (client) {
      try {
        const prompt = `
          Generate a technical diagnostics report in valid JSON format for industrial telemetry.
          Anomaly:
          - Device: "${alert.device}"
          - Metric: "${alert.metric}"
          - Trigger Value: "${alert.triggerValue}"
          - Threshold: "${alert.threshold}"
          - Severity: "${alert.severity}"
          - Recent Telemetry Waveform Trend (Last 9 Time Windows): [${sparklineContext}]

          Analyze this waveform trend carefully: determine whether the anomaly is a sudden sharp impulse spike or a progressive gradual wear/drift.

          LANGUAGE REQUIREMENT:
          Generate all text fields (rootCause, timeline titles/descriptions, metric labels, and suggestedActionPlan items) strictly in ${isZh ? 'Simplified Chinese (专业工业控制工程规范中文)' : 'Professional Industrial English'}.
        `;

        const responseSchema = {
          type: Type.OBJECT,
          properties: {
            rootCause: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  metrics: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.STRING },
                        status: { type: Type.STRING }
                      }
                    }
                  },
                  docs: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["title", "description"]
              }
            },
            suggestedActionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["id", "text"]
              }
            }
          },
          required: ["rootCause", "confidence", "timeline", "suggestedActionPlan"]
        };

        const response = await client.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema as any
          }
        });
        let text = response.text ? response.text.trim() : '';
        if (text.startsWith('```json')) {
          text = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
        } else if (text.startsWith('```')) {
          text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        let parsed: any = null;
        if (text) {
          try {
            parsed = JSON.parse(text);
          } catch {
            console.warn('Failed to parse auto-diagnose JSON:', text);
          }
        }
        if (!parsed) {
          throw new Error('Invalid JSON from AI model');
        }
        const report: DiagnosisReport = {
          rootCause: parsed.rootCause || (isZh ? '未指定零部件缓变漂移' : 'Unspecified Component Drift'),
          confidence: parsed.confidence || 82,
          timeline: (parsed.timeline || []).map((t: any) => ({
            title: t.title || (isZh ? '诊断系统排查' : 'Diagnostics Check'),
            description: t.description || (isZh ? '核对安全限制条件并检索波形。' : 'Checked limits.'),
            metrics: (t.metrics || []).map((m: any) => ({
              label: m.label || 'Value',
              value: m.value || alert.triggerValue,
              status: (['normal', 'error', 'warning'].includes(m.status) ? m.status : 'warning') as any
            })),
            docs: t.docs
          })),
          suggestedActionPlan: (parsed.suggestedActionPlan || []).map((item: any, idx: number) => ({
            id: item.id || `act-${idx}-${Date.now()}`,
            text: item.text || (isZh ? '定期复核设备工况。' : 'Check operational parameters.'),
            completed: false
          })),
          approved: false
        };

        currentAlerts[alertIdx].status = 'Diagnosed';
        currentAlerts[alertIdx].diagnosis = report;
        return;
      } catch (err) {
        console.error('Auto diagnose failed for', alert.id, 'using fallback', err);
      }
    }

    // Fallback
    const report = generateHeuristicDiagnosis(alert, lang);
    currentAlerts[alertIdx].status = 'Diagnosed';
    currentAlerts[alertIdx].diagnosis = report;
  };

  await Promise.all(pendingAlerts.map(a => diagnoseAlert(a)));
  db.setAlerts(currentAlerts);

  return NextResponse.json(currentAlerts);
}
