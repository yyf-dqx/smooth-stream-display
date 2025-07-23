import { useState, useCallback, useEffect, useRef } from 'react';
import { StreamChunk, ReportConfig } from '@/types/report';
import { CSSInliner } from '@/utils/cssInliner';

interface UseStreamingHtmlOptions {
  config?: ReportConfig;
  onComplete?: (finalContent: string) => void;
  onError?: (error: Error) => void;
}

export const useStreamingHtml = (options: UseStreamingHtmlOptions = {}) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const cssInliner = useRef(new CSSInliner()).current;
  const accumulatedContent = useRef<string>('');
  const updateTimeout = useRef<NodeJS.Timeout>();

  /**
   * 处理流式数据块
   */
  const processChunk = useCallback(async (chunk: StreamChunk) => {
    try {
      accumulatedContent.current += chunk.content;
      
      // 防抖更新，避免过于频繁的重渲染
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
      
      updateTimeout.current = setTimeout(async () => {
        const inlineHtml = await cssInliner.generateInlineHTML(
          accumulatedContent.current,
          options.config?.externalCSS,
          options.config?.baseCSS
        );
        
        setHtmlContent(inlineHtml);
        
        if (chunk.isComplete) {
          setIsComplete(true);
          setIsStreaming(false);
          options.onComplete?.(accumulatedContent.current);
        }
      }, options.config?.enableSmoothing ? 100 : 0);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
    }
  }, [cssInliner, options]);

  /**
   * 开始流式接收
   */
  const startStreaming = useCallback(() => {
    setIsStreaming(true);
    setIsComplete(false);
    setError(null);
    accumulatedContent.current = '';
    setHtmlContent('');
  }, []);

  /**
   * 停止流式接收
   */
  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }
  }, []);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    stopStreaming();
    setHtmlContent('');
    setIsComplete(false);
    setError(null);
    accumulatedContent.current = '';
  }, [stopStreaming]);

  /**
   * 模拟流式数据接收（用于测试）
   */
  const simulateStream = useCallback(async (fullContent: string, chunkSize = 100) => {
    startStreaming();
    
    const chunks = [];
    for (let i = 0; i < fullContent.length; i += chunkSize) {
      chunks.push(fullContent.slice(i, i + chunkSize));
    }
    
    for (let i = 0; i < chunks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50)); // 模拟网络延迟
      
      await processChunk({
        content: chunks[i],
        isComplete: i === chunks.length - 1,
        timestamp: Date.now()
      });
    }
  }, [startStreaming, processChunk]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
    };
  }, []);

  return {
    htmlContent,
    isStreaming,
    isComplete,
    error,
    processChunk,
    startStreaming,
    stopStreaming,
    reset,
    simulateStream, // 用于测试
    accumulatedText: accumulatedContent.current
  };
};