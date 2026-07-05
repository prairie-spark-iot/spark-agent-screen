import { NextRequest, NextResponse } from 'next/server';
import { db, generateHeuristicDiagnosis } from '@/lib/db';
import { GoogleGenAI, Type } from '@google/genai';
import { DiagnosisReport } from '@/src/types';

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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  const body = await req.json().catch(() => ({}));
  const lang = body.language || 'en';
  const isZh = lang === 'zh';

  const currentAlerts = db.getAlerts();
  const alertIndex = currentAlerts.findIndex(a => a.id === alertId);

  if (alertIndex === -1) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }

  const alert = currentAlerts[alertIndex];
  alert.status = 'Diagnosing';

  // Inject device temporal sparkline context
  const devices = db.getDevices();
  const matchedDev = devices.find(d => alert.device && (d.name.toLowerCase() === alert.device.toLowerCase() || alert.device.toLowerCase().includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(alert.device.toLowerCase())));
  const sparklineContext = matchedDev ? matchedDev.sparkline.join(', ') : 'N/A';

  const client = getGeminiClient();
  if (client) {
    try {
      console.log(`Running real Gemini AI diagnosis for alert: ${alert.device} (Lang: ${lang})`);
      
      const prompt = `
        You are Spark IoT Agent, an expert AI diagnostics engine in an industrial control room.
        We have detected a critical telemetry anomaly:
        - Device / Entity: "${alert.device}"
        - Metric Anomaly: "${alert.metric}"
        - Trigger Value: "${alert.triggerValue}"
        - Threshold Limit: "${alert.threshold}"
        - Severity Level: "${alert.severity}"
        - Details: "${alert.details || 'None'}"
        - Recent Telemetry Waveform Trend (Last 9 Time Windows): [${sparklineContext}]

        Analyze this waveform trend carefully: determine whether the anomaly is a sudden sharp impulse spike (突发冲击尖峰) or a progressive gradual wear/drift (缓慢渐进磨损), and explicitly discuss this pattern in the timeline description.

        LANGUAGE REQUIREMENT:
        Generate all text fields (rootCause, timeline titles/descriptions, metric labels, and suggestedActionPlan items) strictly in ${isZh ? 'Simplified Chinese (专业工业控制工程规范中文)' : 'Professional Industrial English'}.

        Generate a diagnostic report matching our schema.
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

      let responseText = response.text ? response.text.trim() : '';
      console.log('Gemini AI Raw Response:', responseText);

      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      } else if (responseText.startsWith('```')) {
        responseText = responseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      let parsed: any = null;
      if (responseText) {
        try {
          parsed = JSON.parse(responseText);
        } catch (e) {
          console.warn('Failed to parse JSON from AI model:', responseText);
        }
      }

      if (!parsed) {
        throw new Error('Invalid or empty JSON response from AI model');
      }

      const report: DiagnosisReport = {
        rootCause: parsed.rootCause || (isZh ? '传感器漂移或部件磨损' : 'Unknown Component Failure'),
        confidence: parsed.confidence || 88,
        timeline: (parsed.timeline || []).map((t: any) => ({
          title: t.title || (isZh ? '遥测诊断分析' : 'Diagnostic Step'),
          description: t.description || (isZh ? '综合历史趋势和指标阈值完成根因分析。' : 'Verified anomaly readings against baseline limits.'),
          metrics: (t.metrics || []).map((m: any) => ({
            label: m.label || 'Value',
            value: m.value || alert.triggerValue,
            status: (['normal', 'error', 'warning'].includes(m.status) ? m.status : 'warning') as any
          })),
          docs: t.docs
        })),
        suggestedActionPlan: (parsed.suggestedActionPlan || []).map((item: any, idx: number) => ({
          id: item.id || `act-${idx}-${Date.now()}`,
          text: item.text || (isZh ? '执行标准设备点检流程。' : 'Verify component status manually.'),
          completed: false
        })),
        approved: false
      };

      currentAlerts[alertIndex].status = 'Diagnosed';
      currentAlerts[alertIndex].diagnosis = report;
      db.setAlerts(currentAlerts);
      
      return NextResponse.json(currentAlerts[alertIndex]);

    } catch (err) {
      console.error('Gemini AI Diagnosis error, using heuristics fallback:', err);
    }
  }

  // Graceful heuristics fallback
  const report = generateHeuristicDiagnosis(alert, lang);
  currentAlerts[alertIndex].status = 'Diagnosed';
  currentAlerts[alertIndex].diagnosis = report;
  db.setAlerts(currentAlerts);

  return NextResponse.json(currentAlerts[alertIndex]);
}
