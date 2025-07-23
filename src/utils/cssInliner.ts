/**
 * CSS内联处理工具，解决iframe外部CSS依赖问题
 */

export class CSSInliner {
  private cssCache = new Map<string, string>();
  private baseCSS = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    
    body.loaded {
      opacity: 1;
    }
    
    /* 防闪屏样式 */
    .content-wrapper {
      min-height: 100px;
      position: relative;
    }
    
    .loading-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      height: 20px;
      margin: 10px 0;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* 流式内容动画 */
    .streaming-content {
      animation: fadeInUp 0.3s ease-out;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  /**
   * 获取外部CSS内容
   */
  async fetchCSS(url: string): Promise<string> {
    if (this.cssCache.has(url)) {
      return this.cssCache.get(url)!;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to fetch CSS: ${url}`);
        return '';
      }
      
      const css = await response.text();
      // 处理相对路径
      const processedCSS = this.processRelativePaths(css, url);
      this.cssCache.set(url, processedCSS);
      return processedCSS;
    } catch (error) {
      console.warn(`Error fetching CSS ${url}:`, error);
      return '';
    }
  }

  /**
   * 处理CSS中的相对路径
   */
  private processRelativePaths(css: string, baseUrl: string): string {
    const base = new URL(baseUrl).href.replace(/\/[^\/]*$/, '/');
    
    return css.replace(/url\(['"]?([^'")\s]+)['"]?\)/g, (match, url) => {
      if (url.startsWith('http') || url.startsWith('//') || url.startsWith('data:')) {
        return match;
      }
      
      const absoluteUrl = new URL(url, base).href;
      return `url('${absoluteUrl}')`;
    });
  }

  /**
   * 生成内联样式的HTML文档
   */
  async generateInlineHTML(
    content: string, 
    externalCSS: string[] = [],
    customCSS: string = ''
  ): Promise<string> {
    // 获取所有外部CSS
    const cssPromises = externalCSS.map(url => this.fetchCSS(url));
    const externalStyles = await Promise.all(cssPromises);
    
    const allCSS = [
      this.baseCSS,
      ...externalStyles,
      customCSS
    ].filter(Boolean).join('\n');

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${allCSS}
  </style>
</head>
<body>
  <div class="content-wrapper">
    <div id="streaming-content" class="streaming-content">
      ${content}
    </div>
  </div>
  
  <script>
    // 防闪屏处理
    document.addEventListener('DOMContentLoaded', function() {
      document.body.classList.add('loaded');
      
      // 通知父窗口内容已加载
      if (window.parent) {
        window.parent.postMessage({
          type: 'iframe-loaded',
          height: document.body.scrollHeight
        }, '*');
      }
    });
    
    // 监听内容变化，自动调整高度
    const observer = new MutationObserver(function() {
      if (window.parent) {
        window.parent.postMessage({
          type: 'iframe-resize',
          height: document.body.scrollHeight
        }, '*');
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
  </script>
</body>
</html>
    `.trim();
  }

  /**
   * 更新iframe内容（流式）
   */
  updateStreamingContent(iframe: HTMLIFrameElement, newContent: string): void {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const contentElement = doc.getElementById('streaming-content');
      if (contentElement) {
        contentElement.innerHTML = newContent;
        
        // 触发重新计算高度
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'content-updated'
          }, '*');
        }
      }
    } catch (error) {
      console.warn('Failed to update iframe content:', error);
    }
  }
}