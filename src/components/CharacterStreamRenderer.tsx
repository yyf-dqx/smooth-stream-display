import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, RotateCcw } from 'lucide-react';

interface CharacterStreamRendererProps {
  onComplete?: (content: string) => void;
  className?: string;
}

export const CharacterStreamRenderer: React.FC<CharacterStreamRendererProps> = ({
  onComplete,
  className = ''
}) => {
  const previewRef = useRef<HTMLIFrameElement>(null);
  const bufferRef = useRef<string>('');
  const renderTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  
  const [status, setStatus] = useState<'idle' | 'streaming' | 'completed'>('idle');
  const [charCount, setCharCount] = useState(0);
  const [displayContent, setDisplayContent] = useState<string>('');

  /**
   * 安全的HTML解析和渲染
   */
  const renderBufferedContent = useCallback(() => {
    const htmlContent = bufferRef.current;
    
    // 创建临时容器来解析HTML
    const tempDiv = document.createElement('div');
    try {
      tempDiv.innerHTML = htmlContent;
      
      // 检查是否有未闭合的标签，如果有则不渲染
      const openTags = htmlContent.match(/<[^/>][^>]*[^/]>/g) || [];
      const closeTags = htmlContent.match(/<\/[^>]+>/g) || [];
      
      // 简单的标签平衡检查
      if (openTags.length <= closeTags.length || htmlContent.endsWith('>')) {
        setDisplayContent(htmlContent);
      }
    } catch (error) {
      // HTML解析错误时不更新显示
      console.warn('HTML parsing error:', error);
    }
  }, []);

  /**
   * 处理单个字符输入
   */
  const appendCharacter = useCallback((char: string) => {
    bufferRef.current += char;
    setCharCount(bufferRef.current.length);
    
    // 防抖渲染，避免过于频繁的更新
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    
    renderTimeoutRef.current = setTimeout(() => {
      renderBufferedContent();
    }, 16); // ~60fps
  }, [renderBufferedContent]);

  /**
   * 模拟字符级流式输出
   */
  const simulateCharacterStream = useCallback(async () => {
    setStatus('streaming');
    
    const sampleHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI分析报告</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .report-container { max-width: 800px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 24px; }
        .header h1 { margin: 0 0 12px 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 0; opacity: 0.9; font-size: 16px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .metric-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .metric-value { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
        .metric-label { color: #64748b; font-size: 14px; }
        .section { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .section h2 { margin: 0 0 20px 0; color: #1e293b; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
        .highlight-box { background: #ddd6fe; border-radius: 8px; padding: 20px; margin: 16px 0; }
        .highlight-box h3 { margin: 0 0 12px 0; color: #4c1d95; font-weight: 600; }
        .highlight-box ul { margin: 0; padding-left: 20px; color: #6b46c1; line-height: 1.6; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
        .warning h4 { margin: 0 0 8px 0; color: #92400e; font-weight: 600; }
        .warning p { margin: 0; color: #78350f; line-height: 1.6; }
        .progress-bar { background: #e2e8f0; border-radius: 4px; height: 8px; overflow: hidden; margin: 8px 0; }
        .progress-fill { height: 100%; transition: width 0.3s ease; }
        .conclusion { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; }
        .conclusion h2 { margin: 0 0 16px 0; color: #0f766e; font-size: 20px; font-weight: 600; }
        .conclusion-content { background: rgba(255,255,255,0.9); border-radius: 8px; padding: 20px; }
        .conclusion h3 { margin: 0 0 12px 0; color: #134e4a; font-weight: 600; }
        .conclusion ol { margin: 0; padding-left: 20px; color: #155e63; line-height: 1.8; }
        .footer { background: #1e293b; color: white; border-radius: 12px; padding: 20px; text-align: center; }
        .footer p { margin: 0 0 8px 0; font-size: 14px; opacity: 0.8; }
        .footer .version { margin: 0; font-size: 12px; opacity: 0.6; }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="header">
            <h1>🤖 AI智能分析报告</h1>
            <p>基于深度学习算法的实时数据分析</p>
        </div>
        
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value" style="color: #3b82f6;">96.7%</div>
                <div class="metric-label">准确率</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" style="color: #10b981;">2.3s</div>
                <div class="metric-label">处理时间</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" style="color: #f59e0b;">10.2K</div>
                <div class="metric-label">数据量</div>
            </div>
        </div>
        
        <div class="section">
            <h2>📊 数据趋势分析</h2>
            <div class="highlight-box">
                <h3>核心发现</h3>
                <ul>
                    <li>数据呈现明显的周期性波动模式</li>
                    <li>异常值检测发现3个关键数据点</li>
                    <li>预测模型置信度达到94.2%</li>
                </ul>
            </div>
            
            <div class="warning">
                <h4>⚠️ 重要提醒</h4>
                <p>建议在下个季度增加数据采样频率以提高预测精度</p>
            </div>
        </div>
        
        <div class="section">
            <h2>🔍 详细技术分析</h2>
            <div style="display: grid; gap: 16px;">
                <div style="background: #f1f5f9; border-radius: 8px; padding: 16px;">
                    <h3 style="margin: 0 0 12px 0; color: #334155; font-weight: 600;">算法性能</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="background: linear-gradient(90deg, #3b82f6, #1d4ed8); width: 87%;"></div>
                    </div>
                    <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">模型准确率: 87%</p>
                </div>
                
                <div style="background: #f1f5f9; border-radius: 8px; padding: 16px;">
                    <h3 style="margin: 0 0 12px 0; color: #334155; font-weight: 600;">数据质量</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="background: linear-gradient(90deg, #10b981, #047857); width: 93%;"></div>
                    </div>
                    <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">数据完整性: 93%</p>
                </div>
            </div>
        </div>
        
        <div class="conclusion">
            <h2>✅ 结论与建议</h2>
            <div class="conclusion-content">
                <h3>核心建议</h3>
                <ol>
                    <li><strong>短期目标</strong>: 优化数据收集流程，提升数据质量至95%以上</li>
                    <li><strong>中期规划</strong>: 部署实时监控系统，建立预警机制</li>
                    <li><strong>长期战略</strong>: 引入更先进的AI模型，提升预测准确率至98%</li>
                </ol>
            </div>
        </div>
        
        <div class="footer">
            <p>报告生成时间: ${new Date().toLocaleString()}</p>
            <p class="version">由AI智能分析引擎自动生成 • 版本 v2.1.0</p>
        </div>
    </div>
</body>
</html>`;

    // 逐字符流式输出
    for (let i = 0; i < sampleHtml.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2)); // 2ms per character
      appendCharacter(sampleHtml[i]);
    }
    
    setStatus('completed');
    onComplete?.(bufferRef.current);
  }, [appendCharacter, onComplete]);

  /**
   * 重置函数
   */
  const handleReset = useCallback(() => {
    bufferRef.current = '';
    setDisplayContent('');
    setCharCount(0);
    setStatus('idle');
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
  }, []);

  /**
   * 停止流式传输
   */
  const handleStop = useCallback(() => {
    setStatus('completed');
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            字符流渲染器
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
              <Button onClick={simulateCharacterStream} size="sm">
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
            正在逐字符生成HTML... ({charCount} 字符)
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div 
          className="border rounded-lg overflow-hidden"
          style={{
            contain: 'layout style paint',
            willChange: 'auto'
          }}
        >
          <iframe
            ref={previewRef}
            srcDoc={displayContent}
            className="w-full min-h-[400px] border-0"
            style={{
              backgroundColor: '#f8fafc',
              opacity: displayContent ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out'
            }}
            sandbox="allow-same-origin"
          />
        </div>
        
        {status === 'completed' && (
          <div className="mt-4 text-xs text-muted-foreground text-center">
            HTML流式生成完成 • 总字符数: {charCount} • 零闪屏渲染
          </div>
        )}
      </CardContent>
    </Card>
  );
};