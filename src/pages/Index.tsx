import { StreamingReport } from "@/components/StreamingReport";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">智能问答流式报告系统</h1>
          <p className="text-muted-foreground">
            优化的iframe方案，解决闪屏问题，支持外部CSS内联处理
          </p>
        </div>
        
        <StreamingReport
          config={{
            externalCSS: [
              // 可以配置需要的外部CSS文件
            ],
            enableSmoothing: true,
            preserveFormatting: true
          }}
          onComplete={(content) => {
            console.log('报告生成完成:', content.length, '字符');
          }}
        />
      </div>
    </div>
  );
};

export default Index;
