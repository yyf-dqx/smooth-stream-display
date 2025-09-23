import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import './MdRender.module.css'

// 扩展 marked 的类型定义
declare module 'marked' {
  interface MarkedOptions {
    highlight?: (code: string, lang?: string) => string | Promise<string>
  }
}

const MdRender = ({
  markdown,
  jsonData,
}: {
  markdown: string
  jsonData?: Array<{name: string; arguments: Record<string, any>}>
}) => {
  // 改进的反斜杠转义处理函数
  const normalizeEscapes = (str: string) => {
    if (!str) return str
    return str
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\')
      .replace(/\\\//g, '/')
  }

  // 专门处理代码块中的转义字符
  const normalizeCodeBlock = (codeContent: string) => {
    return codeContent
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\')
      .replace(/\\\//g, '/')
  }

  let jsonMarkdown = ''
  if (jsonData) {
    jsonData.forEach(({name, arguments: args}) => {
      jsonMarkdown += `### 工具名称: ${name}\n\n#### 参数详情:\n\`\`\`json\n${JSON.stringify(
        args,
        null,
        2,
      )}\n\`\`\`\n`
    })
  }

  // 简化的 renderer 配置，重点处理代码块
  marked.use({
    renderer: {
      code(token) {
        const lang = token.lang || ''
        
        // 标准化代码内容
        const normalizedCode = normalizeCodeBlock(token.text)
        
        let highlightedCode = normalizedCode
        if (lang && hljs.getLanguage(lang)) {
          highlightedCode = hljs.highlight(normalizedCode, {language: lang}).value
        } else {
          highlightedCode = hljs.highlightAuto(normalizedCode).value
        }
        
        const langClass = lang ? `language-${lang}` : ''
        return `<pre class="markdown-code-block"><code class="hljs ${langClass}">${highlightedCode}</code></pre>`
      }
    }
  })

  // 预处理整个markdown内容，特别处理代码块
  const preprocessMarkdown = (md: string) => {
    // 先处理代码块外的转义字符
    let processed = normalizeEscapes(md)
    
    // 特殊处理HTML代码块，确保其中的转义字符被正确处理
    processed = processed.replace(/```html([\s\S]*?)```/g, (match, codeContent) => {
      const normalizedCode = normalizeCodeBlock(codeContent)
      return `\`\`\`html\n${normalizedCode}\n\`\`\``
    })
    
    // 处理其他类型的代码块
    processed = processed.replace(/```(\w+)?([\s\S]*?)```/g, (match, lang, codeContent) => {
      if (lang === 'html') return match // 已经处理过了
      const normalizedCode = normalizeCodeBlock(codeContent)
      return `\`\`\`${lang || ''}\n${normalizedCode}\n\`\`\``
    })
    
    return processed
  }

  const combinedMarkdown = jsonMarkdown + markdown
  const processedMarkdown = preprocessMarkdown(combinedMarkdown)
  
  const _html = marked(processedMarkdown.replace(/color:/g, 'color：'))

  return (
    <div
      className="markdown-container"
      dangerouslySetInnerHTML={{__html: _html}}
    />
  )
}

export default MdRender