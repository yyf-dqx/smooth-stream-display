import { StreamingReport } from "@/components/StreamingReport";
import { OptimizedStreamRenderer } from "@/components/OptimizedStreamRenderer";
import { CharacterStreamRenderer } from "@/components/CharacterStreamRenderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">智能问答流式报告系统</h1>
          <p className="text-muted-foreground">
            多种优化方案对比：iframe方案 vs 原生DOM方案
          </p>
        </div>
        
        <Tabs defaultValue="character" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="optimized">🚀 优化渲染器</TabsTrigger>
            <TabsTrigger value="character">⚡ 字符流渲染 (推荐)</TabsTrigger>
            <TabsTrigger value="iframe">📱 iframe方案</TabsTrigger>
          </TabsList>
          
          <TabsContent value="character" className="mt-6">
            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">⚡ 字符级流式渲染:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 逐字符接收HTML流，实时解析</li>
                <li>• 智能缓冲，避免不完整标签渲染</li>
                <li>• iframe隔离，完整CSS样式支持</li>
                <li>• 防抖更新，60fps流畅体验</li>
                <li>• 专为字符级流式接口优化</li>
              </ul>
            </div>
            
            <CharacterStreamRenderer
              onComplete={(content) => {
                console.log('字符流渲染完成:', content.length, '字符');
              }}
            />
          </TabsContent>
          
          <TabsContent value="optimized" className="mt-6">
            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">✨ 核心优化技术:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• DocumentFragment批量DOM更新</li>
                <li>• CSS Containment布局隔离</li>
                <li>• GPU硬件加速渲染</li>
                <li>• ResizeObserver智能高度调整</li>
                <li>• 零重排重绘，完全无闪屏</li>
              </ul>
            </div>
            
            <OptimizedStreamRenderer
              onComplete={(content) => {
                console.log('优化渲染器完成:', content.length, '字符');
              }}
            />
          </TabsContent>
          
          <TabsContent value="iframe" className="mt-6">
            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">🔧 iframe方案特性:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 外部CSS自动内联处理</li>
                <li>• 沙盒隔离环境</li>
                <li>• 自适应高度调整</li>
                <li>• 兼容性好，支持复杂HTML</li>
              </ul>
            </div>
            
            <StreamingReport
              config={{
                externalCSS: [],
                enableSmoothing: true,
                preserveFormatting: true
              }}
              onComplete={(content) => {
                console.log('iframe方案完成:', content.length, '字符');
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
