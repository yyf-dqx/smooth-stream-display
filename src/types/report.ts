export interface StreamChunk {
  content: string;
  isComplete: boolean;
  timestamp: number;
}

export interface ReportConfig {
  baseCSS?: string;
  externalCSS?: string[];
  preserveFormatting?: boolean;
  enableSmoothing?: boolean;
}

export interface IframeState {
  isLoading: boolean;
  isReady: boolean;
  error?: string;
  contentHeight?: number;
}