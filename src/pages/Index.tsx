import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Zap, Code2 } from "lucide-react";
import MdRender from "@/components/MdRender";

const Index = () => {
  // 测试数据，包含转义字符的HTML代码
  const testMarkdown = `# Markdown Renderer Test

Here's some regular text and a code block with escaped characters:

\`\`\`html
<!DOCTYPE html>\\n<html lang=\\"zh-CN\\">\\n<head>\\n  <meta charset=\\"utf-8\\" />\\n  <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\" />\\n  <title>Test Page</title>\\n</head>\\n<body>\\n  <div class=\\"container\\">\\n    <h1>Hello World</h1>\\n    <p>This is a test paragraph with \\"quotes\\" and line breaks.</p>\\n  </div>\\n</body>\\n</html>
\`\`\`

## JavaScript Example

\`\`\`javascript
function test() {\\n  const message = \\"Hello\\\\nWorld\\";\\n  console.log(message);\\n}
\`\`\`

Regular paragraph text continues here.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Markdown Renderer Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Testing HTML code block rendering with proper escape character handling
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Rendered Markdown</CardTitle>
              <CardDescription>
                HTML code blocks should display with proper line breaks and formatting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MdRender markdown={testMarkdown} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Fast Development</CardTitle>
              </div>
              <CardDescription>
                Get started quickly with our pre-configured setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Modern tooling with Vite, TypeScript, and hot reload for rapid development.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Type Safety</CardTitle>
              </div>
              <CardDescription>
                Built-in TypeScript support for better code quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Catch errors early with comprehensive type checking and IntelliSense.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Ready to Deploy</CardTitle>
              </div>
              <CardDescription>
                Optimized build process for production deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Zero-config deployment with optimized bundles and assets.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Tech Stack
          </Badge>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
            <Badge variant="outline">Vite</Badge>
            <Badge variant="outline">Shadcn/ui</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;