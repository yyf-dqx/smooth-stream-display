import React, { useRef, useEffect, useState, useCallback } from 'react';
import { IframeState } from '@/types/report';
import { CSSInliner } from '@/utils/cssInliner';

interface ReportIframeProps {
  htmlContent: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  enableAutoResize?: boolean;
  minHeight?: number;
  maxHeight?: number;
}

export const ReportIframe: React.FC<ReportIframeProps> = ({
  htmlContent,
  className = '',
  onLoad,
  onError,
  enableAutoResize = true,
  minHeight = 200,
  maxHeight = 1000
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cssInliner = useRef(new CSSInliner()).current;
  
  const [iframeState, setIframeState] = useState<IframeState>({
    isLoading: true,
    isReady: false
  });

  /**
   * 处理iframe消息
   */
  const handleMessage = useCallback((event: MessageEvent) => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const iframeWindow = iframe.contentWindow;
    
    if (event.source !== iframeWindow) return;

    const { type, height, error } = event.data;

    switch (type) {
      case 'iframe-loaded':
        setIframeState(prev => ({
          ...prev,
          isLoading: false,
          isReady: true,
          contentHeight: height
        }));
        
        if (enableAutoResize && height) {
          const newHeight = Math.min(Math.max(height, minHeight), maxHeight);
          iframe.style.height = `${newHeight}px`;
        }
        
        onLoad?.();
        break;

      case 'iframe-resize':
        if (enableAutoResize && height) {
          const newHeight = Math.min(Math.max(height, minHeight), maxHeight);
          iframe.style.height = `${newHeight}px`;
          
          setIframeState(prev => ({
            ...prev,
            contentHeight: height
          }));
        }
        break;

      case 'iframe-error':
        setIframeState(prev => ({
          ...prev,
          isLoading: false,
          error: error || 'Unknown iframe error'
        }));
        onError?.(error || 'Unknown iframe error');
        break;
    }
  }, [enableAutoResize, minHeight, maxHeight, onLoad, onError]);

  /**
   * 更新iframe内容
   */
  const updateIframeContent = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe || !htmlContent) return;

    try {
      setIframeState(prev => ({ ...prev, isLoading: true }));

      // 如果iframe已经有内容，进行流式更新
      if (iframeState.isReady && iframe.contentDocument) {
        // 直接更新内容，不重新加载整个页面
        const contentMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        if (contentMatch) {
          const bodyContent = contentMatch[1];
          const contentWrapper = iframe.contentDocument.querySelector('.content-wrapper');
          const streamingContent = iframe.contentDocument.querySelector('#streaming-content');
          
          if (streamingContent) {
            streamingContent.innerHTML = bodyContent;
            return;
          }
        }
      }

      // 首次加载或需要完全重新加载
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      iframe.src = url;
      
      // 清理URL
      iframe.onload = () => {
        URL.revokeObjectURL(url);
      };

    } catch (error) {
      console.error('Failed to update iframe content:', error);
      setIframeState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load content'
      }));
      onError?.('Failed to load content');
    }
  }, [htmlContent, iframeState.isReady, onError]);

  /**
   * 监听消息事件
   */
  useEffect(() => {
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  /**
   * 内容变化时更新iframe
   */
  useEffect(() => {
    if (htmlContent) {
      updateIframeContent();
    }
  }, [htmlContent, updateIframeContent]);

  return (
    <div className={`relative ${className}`}>
      {/* 加载状态 */}
      {iframeState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">加载中...</span>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {iframeState.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-10">
          <div className="text-center p-4">
            <div className="text-destructive text-sm font-medium mb-2">加载失败</div>
            <div className="text-destructive/70 text-xs">{iframeState.error}</div>
          </div>
        </div>
      )}

      {/* iframe容器 */}
      <iframe
        ref={iframeRef}
        className={`w-full border-0 transition-opacity duration-300 ${
          iframeState.isReady ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          minHeight: `${minHeight}px`,
          height: enableAutoResize ? `${minHeight}px` : '100%'
        }}
        sandbox="allow-scripts allow-same-origin"
        title="报告内容"
      />
    </div>
  );
};