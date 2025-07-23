import React, { useState, useEffect } from 'react';
import { ReportIframe } from './ReportIframe';
import { useStreamingHtml } from '@/hooks/useStreamingHtml';
import { ReportConfig } from '@/types/report';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Square, RotateCcw } from 'lucide-react';

interface StreamingReportProps {
  config?: ReportConfig;
  apiEndpoint?: string;
  onComplete?: (content: string) => void;
  className?: string;
}

export const StreamingReport: React.FC<StreamingReportProps> = ({
  config = {
    externalCSS: [
      // 示例外部CSS，可根据实际需求配置
      'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
    ],
    enableSmoothing: true,
    preserveFormatting: true
  },
  apiEndpoint,
  onComplete,
  className = ''
}) => {
  const [streamStatus, setStreamStatus] = useState<'idle' | 'connecting' | 'streaming' | 'completed' | 'error'>('idle');
  
  const {
    htmlContent,
    isStreaming,
    isComplete,
    error,
    processChunk,
    startStreaming,
    stopStreaming,
    reset,
    simulateStream,
    accumulatedText
  } = useStreamingHtml({
    config,
    onComplete: (content) => {
      setStreamStatus('completed');
      onComplete?.(content);
    },
    onError: () => {
      setStreamStatus('error');
    }
  });

  /**
   * 实际的流式API调用
   */
  const startRealStream = async () => {
    if (!apiEndpoint) {
      console.warn('No API endpoint provided, using simulation');
      handleSimulateStream();
      return;
    }

    try {
      setStreamStatus('connecting');
      startStreaming();

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 根据实际API需求配置参数
          stream: true,
          format: 'html'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      setStreamStatus('streaming');
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value);
          
          // 处理SSE格式或其他流式格式
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                await processChunk({
                  content: '',
                  isComplete: true,
                  timestamp: Date.now()
                });
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                await processChunk({
                  content: parsed.content || '',
                  isComplete: false,
                  timestamp: Date.now()
                });
              } catch (e) {
                // 如果不是JSON，直接作为HTML内容处理
                await processChunk({
                  content: data,
                  isComplete: false,
                  timestamp: Date.now()
                });
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      console.error('Streaming error:', error);
      setStreamStatus('error');
    }
  };

  /**
   * 模拟流式传输（用于演示）
   */
  const handleSimulateStream = async () => {
    setStreamStatus('connecting');
    
    const sampleHtmlReport = `
      <div class="report-container">
        <h1 style="color: #2563eb; margin-bottom: 20px;">智能分析报告</h1>
        
        <div class="section">
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">执行摘要</h2>
          <p style="line-height: 1.6; margin: 15px 0;">本次分析基于提供的数据，通过AI智能算法进行深度挖掘和模式识别。</p>
          <p style="line-height: 1.6; margin: 15px 0;">主要发现包括：数据趋势分析、异常检测结果、预测模型输出等关键信息。</p>
        </div>

        <div class="section" style="margin-top: 30px;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">数据概览</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #374151; margin-bottom: 10px;">关键指标</h3>
            <ul style="list-style-type: disc; margin-left: 20px; line-height: 1.8;">
              <li>总数据量: 10,234 条记录</li>
              <li>处理时间: 2.3 秒</li>
              <li>准确率: 96.7%</li>
              <li>置信度: 94.2%</li>
            </ul>
          </div>
        </div>

        <div class="section" style="margin-top: 30px;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">详细分析</h2>
          <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0;">
            <h3 style="color: #374151; margin-bottom: 15px;">趋势分析</h3>
            <p style="line-height: 1.6; color: #6b7280;">通过时间序列分析，我们发现数据呈现明显的季节性波动模式。</p>
            <p style="line-height: 1.6; color: #6b7280; margin-top: 10px;">预测模型显示，未来3个月内数据将保持稳定增长趋势，增长率约为15-20%。</p>
          </div>
        </div>

        <div class="section" style="margin-top: 30px;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">建议与结论</h2>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0;">
            <h4 style="color: #92400e; margin-bottom: 10px;">重要建议</h4>
            <ol style="margin-left: 20px; line-height: 1.8; color: #78350f;">
              <li>建议优化数据收集流程，提高数据质量</li>
              <li>建议增加实时监控机制，及时发现异常</li>
              <li>建议定期更新预测模型，保持准确性</li>
            </ol>
          </div>
        </div>
      </div>
    `;

    await simulateStream(sampleHtmlReport, 50);
  };

  /**
   * 停止流式传输
   */
  const handleStopStream = () => {
    stopStreaming();
    setStreamStatus('idle');
  };

  /**
   * 重置组件状态
   */
  const handleReset = () => {
    reset();
    setStreamStatus('idle');
  };

  // 监听流式状态变化
  useEffect(() => {
    if (isStreaming) {
      setStreamStatus('streaming');
    } else if (isComplete) {
      setStreamStatus('completed');
    }
  }, [isStreaming, isComplete]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            智能问答报告
            <Badge variant={
              streamStatus === 'streaming' ? 'default' :
              streamStatus === 'completed' ? 'secondary' :
              streamStatus === 'error' ? 'destructive' : 'outline'
            }>
              {streamStatus === 'idle' && '待开始'}
              {streamStatus === 'connecting' && '连接中'}
              {streamStatus === 'streaming' && '流式输出中'}
              {streamStatus === 'completed' && '已完成'}
              {streamStatus === 'error' && '错误'}
            </Badge>
          </CardTitle>
          
          <div className="flex gap-2">
            {streamStatus === 'idle' && (
              <Button onClick={startRealStream} size="sm">
                <Play className="h-4 w-4 mr-1" />
                开始生成
              </Button>
            )}
            
            {(streamStatus === 'streaming' || streamStatus === 'connecting') && (
              <Button onClick={handleStopStream} variant="destructive" size="sm">
                <Square className="h-4 w-4 mr-1" />
                停止
              </Button>
            )}
            
            {(streamStatus === 'completed' || streamStatus === 'error') && (
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                重置
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* 流式状态指示器 */}
        {streamStatus === 'streaming' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>正在接收数据...</span>
            <span className="text-xs">({accumulatedText.length} 字符)</span>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="text-sm text-destructive mb-4 p-3 bg-destructive/10 rounded-lg">
            错误: {error.message}
          </div>
        )}

        {/* 报告内容iframe */}
        <div className="border rounded-lg overflow-hidden">
          <ReportIframe
            htmlContent={htmlContent}
            className="min-h-[300px]"
            enableAutoResize={true}
            minHeight={200}
            maxHeight={800}
            onLoad={() => console.log('Report loaded')}
            onError={(error) => console.error('Iframe error:', error)}
          />
        </div>

        {/* 底部信息 */}
        {streamStatus === 'completed' && (
          <div className="mt-4 text-xs text-muted-foreground text-center">
            报告生成完成 • 内容长度: {accumulatedText.length} 字符
          </div>
        )}
      </CardContent>
    </Card>
  );
};