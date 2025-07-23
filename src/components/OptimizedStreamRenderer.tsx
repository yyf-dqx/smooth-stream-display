import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, RotateCcw } from 'lucide-react';

interface StreamChunk {
  content: string;
  isComplete: boolean;
}

interface OptimizedStreamRendererProps {
  onComplete?: (content: string) => void;
  className?: string;
}

export const OptimizedStreamRenderer: React.FC<OptimizedStreamRendererProps> = ({
  onComplete,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver>();
  const accumulatedContent = useRef<string>('');
  
  const [status, setStatus] = useState<'idle' | 'streaming' | 'completed'>('idle');
  const [charCount, setCharCount] = useState(0);

  /**
   * 核心渲染函数 - 使用DocumentFragment批量更新
   */
  const appendContentOptimized = useCallback((htmlChunk: string) => {
    if (!contentRef.current) return;

    // 使用DocumentFragment避免多次重排
    const fragment = document.createDocumentFragment();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlChunk;

    // 将解析的内容添加到fragment
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }

    // 一次性批量更新DOM
    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.appendChild(fragment);
        
        // 更新统计
        accumulatedContent.current += htmlChunk;
        setCharCount(accumulatedContent.current.length);
      }
    });
  }, []);

  /**
   * 流式处理函数
   */
  const processStreamChunk = useCallback((chunk: StreamChunk) => {
    appendContentOptimized(chunk.content);
    
    if (chunk.isComplete) {
      setStatus('completed');
      onComplete?.(accumulatedContent.current);
    }
  }, [appendContentOptimized, onComplete]);

  /**
   * 模拟真实的流式数据
   */
  const simulateRealStream = useCallback(async () => {
    setStatus('streaming');
    
    const reportSections = [
      {
        content: `<div class="report-section" style="margin-bottom: 24px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700;">🤖 AI智能分析报告</h1>
          <p style="margin: 0; opacity: 0.9; font-size: 16px;">基于深度学习算法的实时数据分析</p>
        </div>`,
        delay: 100
      },
      {
        content: `<div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center;">
            <div style="font-size: 32px; font-weight: 700; color: #3b82f6; margin-bottom: 8px;">96.7%</div>
            <div style="color: #64748b; font-size: 14px;">准确率</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center;">
            <div style="font-size: 32px; font-weight: 700; color: #10b981; margin-bottom: 8px;">2.3s</div>
            <div style="color: #64748b; font-size: 14px;">处理时间</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center;">
            <div style="font-size: 32px; font-weight: 700; color: #f59e0b; margin-bottom: 8px;">10.2K</div>
            <div style="color: #64748b; font-size: 14px;">数据量</div>
          </div>
        </div>`,
        delay: 200
      },
      {
        content: `<div class="analysis-section" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">📊 数据趋势分析</h2>
          <div style="background: linear-gradient(90deg, #ddd6fe 0%, #c7d2fe 100%); border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="margin: 0 0 12px 0; color: #4c1d95; font-weight: 600;">核心发现</h3>
            <ul style="margin: 0; padding-left: 20px; color: #6b46c1; line-height: 1.6;">
              <li>数据呈现明显的周期性波动模式</li>
              <li>异常值检测发现3个关键数据点</li>
              <li>预测模型置信度达到94.2%</li>
            </ul>
          </div>`,
        delay: 300
      },
      {
        content: `
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 8px 0; color: #92400e; font-weight: 600;">⚠️ 重要提醒</h4>
            <p style="margin: 0; color: #78350f; line-height: 1.6;">建议在下个季度增加数据采样频率以提高预测精度</p>
          </div>
        </div>`,
        delay: 150
      },
      {
        content: `<div class="detailed-analysis" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; font-weight: 600;">🔍 详细技术分析</h2>
          <div style="display: grid; gap: 16px;">
            <div style="background: #f1f5f9; border-radius: 8px; padding: 16px;">
              <h3 style="margin: 0 0 12px 0; color: #334155; font-weight: 600;">算法性能</h3>
              <div style="background: #e2e8f0; border-radius: 4px; height: 8px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #3b82f6, #1d4ed8); height: 100%; width: 87%; transition: width 0.3s ease;"></div>
              </div>
              <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">模型准确率: 87%</p>
            </div>
            
            <div style="background: #f1f5f9; border-radius: 8px; padding: 16px;">
              <h3 style="margin: 0 0 12px 0; color: #334155; font-weight: 600;">数据质量</h3>
              <div style="background: #e2e8f0; border-radius: 4px; height: 8px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #10b981, #047857); height: 100%; width: 93%; transition: width 0.3s ease;"></div>
              </div>
              <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">数据完整性: 93%</p>
            </div>
          </div>
        </div>`,
        delay: 250
      },
      {
        content: `<div class="conclusion-section" style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; color: #0f766e; font-size: 20px; font-weight: 600;">✅ 结论与建议</h2>
          <div style="background: rgba(255,255,255,0.9); border-radius: 8px; padding: 20px;">
            <h3 style="margin: 0 0 12px 0; color: #134e4a; font-weight: 600;">核心建议</h3>
            <ol style="margin: 0; padding-left: 20px; color: #155e63; line-height: 1.8;">
              <li><strong>短期目标</strong>: 优化数据收集流程，提升数据质量至95%以上</li>
              <li><strong>中期规划</strong>: 部署实时监控系统，建立预警机制</li>
              <li><strong>长期战略</strong>: 引入更先进的AI模型，提升预测准确率至98%</li>
            </ol>
          </div>
        </div>`,
        delay: 400
      },
      {
        content: `<div class="footer-section" style="background: #1e293b; color: white; border-radius: 12px; padding: 20px; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.8;">报告生成时间: ${new Date().toLocaleString()}</p>
          <p style="margin: 0; font-size: 12px; opacity: 0.6;">由AI智能分析引擎自动生成 • 版本 v2.1.0</p>
        </div>`,
        delay: 200
      }
    ];

    // 分块流式传输
    for (let i = 0; i < reportSections.length; i++) {
      await new Promise(resolve => setTimeout(resolve, reportSections[i].delay));
      
      processStreamChunk({
        content: reportSections[i].content,
        isComplete: i === reportSections.length - 1
      });
    }
  }, [processStreamChunk]);

  /**
   * 重置函数
   */
  const handleReset = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = '';
    }
    accumulatedContent.current = '';
    setCharCount(0);
    setStatus('idle');
  }, []);

  /**
   * 停止流式传输
   */
  const handleStop = useCallback(() => {
    setStatus('completed');
  }, []);

  /**
   * 设置ResizeObserver监听内容变化
   */
  useEffect(() => {
    if (contentRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        // 内容变化时的处理逻辑
        for (const entry of entries) {
          const { height } = entry.contentRect;
          if (containerRef.current) {
            containerRef.current.style.setProperty('--content-height', `${height}px`);
          }
        }
      });

      resizeObserverRef.current.observe(contentRef.current);

      return () => {
        resizeObserverRef.current?.disconnect();
      };
    }
  }, []);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            优化渲染器
            <Badge variant={
              status === 'streaming' ? 'default' :
              status === 'completed' ? 'secondary' : 'outline'
            }>
              {status === 'idle' && '待开始'}
              {status === 'streaming' && '流式输出中'}
              {status === 'completed' && '已完成'}
            </Badge>
          </CardTitle>
          
          <div className="flex gap-2">
            {status === 'idle' && (
              <Button onClick={simulateRealStream} size="sm">
                <Play className="h-4 w-4 mr-1" />
                开始生成
              </Button>
            )}
            
            {status === 'streaming' && (
              <Button onClick={handleStop} variant="destructive" size="sm">
                <Square className="h-4 w-4 mr-1" />
                停止
              </Button>
            )}
            
            {status === 'completed' && (
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                重置
              </Button>
            )}
          </div>
        </div>
        
        {status === 'streaming' && (
          <div className="text-sm text-muted-foreground">
            正在生成报告... ({charCount} 字符)
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div 
          ref={containerRef}
          className="border rounded-lg overflow-hidden"
          style={{
            contain: 'layout style paint', // CSS containment优化
            willChange: 'auto', // 启用GPU加速
            transform: 'translateZ(0)' // 强制硬件加速
          }}
        >
          <div 
            ref={contentRef}
            className="p-4 min-h-[200px]"
            style={{
              contain: 'layout', // 布局隔离
              transformStyle: 'preserve-3d' // 3D变换优化
            }}
          />
        </div>
        
        {status === 'completed' && (
          <div className="mt-4 text-xs text-muted-foreground text-center">
            报告生成完成 • 内容长度: {charCount} 字符 • 零闪屏渲染
          </div>
        )}
      </CardContent>
    </Card>
  );
};