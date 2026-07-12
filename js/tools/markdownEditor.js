import { showToast } from '../app.js';

export function initMarkdownEditor() {
  const inputArea = document.getElementById('md-editor-input');
  const outputPreview = document.getElementById('md-editor-output');
  const exportBtn = document.getElementById('btn-md-export');
  const printBtn = document.getElementById('btn-md-print');

  // Initial parse
  renderMarkdown();

  // Listen to inputs
  inputArea.addEventListener('input', renderMarkdown);

  function renderMarkdown() {
    const rawText = inputArea.value;
    outputPreview.innerHTML = parseMarkdownToHTML(rawText);
  }

  function parseMarkdownToHTML(text) {
    const lines = text.split('\n');
    let html = [];
    let inList = false;
    let inCodeBlock = false;
    let codeContent = [];

    lines.forEach(line => {
      let trimmed = line.trim();

      // 1. Code Block Handling
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          html.push(`<pre><code>${escapeHtml(codeContent.join('\n'))}</code></pre>`);
          codeContent = [];
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Close list if line is empty or not a list item
      if (inList && !trimmed.startsWith('* ') && !trimmed.startsWith('- ')) {
        html.push('</ul>');
        inList = false;
      }

      // 2. Headers
      if (trimmed.startsWith('# ')) {
        html.push(`<h1>${parseInline(trimmed.substring(2))}</h1>`);
      } else if (trimmed.startsWith('## ')) {
        html.push(`<h2>${parseInline(trimmed.substring(3))}</h2>`);
      } else if (trimmed.startsWith('### ')) {
        html.push(`<h3>${parseInline(trimmed.substring(4))}</h3>`);
      }
      // 3. Blockquotes
      else if (trimmed.startsWith('> ')) {
        html.push(`<blockquote>${parseInline(trimmed.substring(2))}</blockquote>`);
      }
      // 4. Unordered Lists
      else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (!inList) {
          html.push('<ul>');
          inList = true;
        }
        html.push(`<li>${parseInline(trimmed.substring(2))}</li>`);
      }
      // 5. Empty Lines
      else if (trimmed === '') {
        html.push('<br>');
      }
      // 6. Regular Paragraphs
      else {
        html.push(`<p>${parseInline(line)}</p>`);
      }
    });

    // Close any trailing lists
    if (inList) {
      html.push('</ul>');
    }

    return html.join('\n');
  }

  // Parse bold, italics, inline code, and links
  function parseInline(text) {
    let output = escapeHtml(text);
    
    // Bold: **text**
    output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text*
    output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Inline code: `code`
    output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Hyperlinks: [anchor](url)
    output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: var(--color-secondary); font-weight: 500;">$1</a>');

    return output;
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Export .md file
  exportBtn.addEventListener('click', () => {
    const rawText = inputArea.value;
    if (!rawText.trim()) {
      showToast('Markdown is empty!', true);
      return;
    }
    const blob = new Blob([rawText], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Markdown file saved!');
  });

  // Print/Save PDF
  printBtn.addEventListener('click', () => {
    if (!inputArea.value.trim()) {
      showToast('Nothing to print!', true);
      return;
    }
    
    // Create print window focusing purely on preview styles
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Export PDF | Toolverse</title>
          <style>
            body {
              font-family: 'Plus Jakarta Sans', Arial, sans-serif;
              padding: 40px;
              color: #1e293b;
              line-height: 1.6;
            }
            h1, h2, h3 {
              font-family: 'Outfit', sans-serif;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 8px;
              margin-top: 24px;
            }
            code {
              background: #f1f5f9;
              padding: 2px 6px;
              border-radius: 4px;
              font-family: monospace;
            }
            pre {
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              padding: 16px;
              border-radius: 8px;
              overflow-x: auto;
            }
            blockquote {
              border-left: 4px solid #a855f7;
              padding-left: 16px;
              margin: 16px 0;
              color: #64748b;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          ${outputPreview.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  });
}
