/**
 * Global Centralized Design Palette & Theme Configuration
 * 全局统一设计理念与颜色规范体系
 * 
 * Instead of hardcoding hex colors inside individual pages and components,
 * all pages, charts, statuses, and UI cards refer to this central design system.
 */

export const THEME_COLORS = {
  // Brand / Main Accent (青蓝色品牌主色 - 用于正常状态、AI智能、主按钮与核心指标)
  accent: '#00cfbf',
  accentHover: '#00e5d4',
  accentDark: '#009a8e',
  accentGlow: 'rgba(0, 207, 191, 0.25)',

  // Status & Alerts (告警严重等级与诊断状态颜色规范)
  status: {
    normal: '#00cfbf',      // 正常 / Info / 恢复
    warning: '#ffba43',     // 警告 / 阈值逼近 (温和橘黄)
    critical: '#ffb4ab',    // 严重 / 危险 / 硬件异常 (偏红色)
    info: '#64b5f6',        // 普通通知 / 系统消息
  },

  // Surface & Layout Panels (深色宇宙板岩暗色主题卡片与容器规范)
  surface: {
    background: '#0b0e15',  // 页面底层全局背景
    panel: '#141822',       // 卡片/图表模块层级背景
    panelHover: '#1a1f2c',  // 卡片悬停高亮背景
    panelActive: '#23293a', // 激活态或选中项背景
    border: '#2d3240',      // 默认常规边框
    borderHover: 'rgba(0, 207, 191, 0.4)', // 交互高亮边框
  },

  // Text & Typography (全局文字颜色层级)
  text: {
    primary: '#ffffff',     // 主标题 / 核心数据数字
    secondary: '#e2e8f0',   // 正文描述
    muted: '#b9cacb',       // 辅助标签与列标题
    subtle: '#849495',      // 时间戳与说明注释
  },

  // Chart Gradients & Visuals (数据图表与遥测专用配色)
  charts: {
    temperature: '#00cfbf',
    pressure: '#ffba43',
    vibration: '#ffb4ab',
    efficiency: '#64b5f6',
    gridLine: '#2d3240',
  }
} as const;

export type ThemeColorKey = keyof typeof THEME_COLORS;
