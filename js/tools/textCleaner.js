import { showToast } from '../app.js';

export function initTextCleaner() {
  const inputArea = document.getElementById('cleaner-input');
  const outputArea = document.getElementById('cleaner-output');
  const wordCount = document.getElementById('cleaner-words');
  const charCount = document.getElementById('cleaner-chars');
  const sentenceCount = document.getElementById('cleaner-sentences');

  const btnSpace = document.getElementById('btn-clean-space');
  const btnHtml = document.getElementById('btn-clean-html');
  const btnHumanize = document.getElementById('btn-clean-humanize');
  const btnPro = document.getElementById('btn-clean-pro');
  const btnCopy = document.getElementById('btn-copy-cleaner');

  // Input changes
  inputArea.addEventListener('input', () => {
    updateStats(inputArea.value);
  });

  // 1. Clean Whitespaces
  btnSpace.addEventListener('click', () => {
    let txt = inputArea.value;
    if (!txt.trim()) return showToast('Please enter some text!', true);
    
    // Replace multiple spaces with single, clean trailing spaces on line-breaks
    txt = txt.replace(/[ \t]+/g, ' ');
    txt = txt.replace(/\n\s*\n+/g, '\n\n'); // Limit consecutive linebreaks
    txt = txt.trim();
    
    outputArea.value = txt;
    updateStats(txt);
    showToast('Spaces normalized!');
  });

  // 2. Strip HTML and Markdown
  btnHtml.addEventListener('click', () => {
    let txt = inputArea.value;
    if (!txt.trim()) return showToast('Please enter some text!', true);
    
    // Strip HTML
    txt = txt.replace(/<\/?[^>]+(>|$)/g, "");
    
    // Strip Markdown
    txt = txt.replace(/[\#\*\_\[\]\(\)\`\>\-\+]/g, "");
    
    outputArea.value = txt.trim();
    updateStats(txt);
    showToast('HTML & Markdown elements removed!');
  });

  // 3. Humanize AI Text (Heuristic-based)
  btnHumanize.addEventListener('click', () => {
    let txt = inputArea.value;
    if (!txt.trim()) return showToast('Please enter some text!', true);

    // AI Fluff Filter - remove typical robotic transitional constructs
    const fluffWords = [
      /Additionally,\s*/gi,
      /Furthermore,\s*/gi,
      /Moreover,\s*/gi,
      /In conclusion,\s*/gi,
      /Consequently,\s*/gi,
      /It is crucial to remember that\s*/gi,
      /Importantly,\s*/gi,
      /As previously mentioned,\s*/gi,
      /Last but not least,\s*/gi
    ];
    
    fluffWords.forEach(pattern => {
      txt = txt.replace(pattern, '');
    });

    // Simplify overly complex words
    const simplifications = [
      { complex: /\butilize\b/gi, simple: 'use' },
      { complex: /\butilizing\b/gi, simple: 'using' },
      { complex: /\bfacilitate\b/gi, simple: 'help' },
      { complex: /\bsubsequently\b/gi, simple: 'then' },
      { complex: /\bconsequently\b/gi, simple: 'so' },
      { complex: /\bterminate\b/gi, simple: 'end' },
      { complex: /\bimplement\b/gi, simple: 'build' }
    ];

    simplifications.forEach(pair => {
      txt = txt.replace(pair.complex, pair.simple);
    });

    // Heuristically capitalize first letter of sentences
    txt = txt.replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());

    outputArea.value = txt.trim();
    updateStats(txt);
    showToast('Robotic transitions removed!');
  });

  // 4. Professional Rewrite (Heuristic style mapping)
  btnPro.addEventListener('click', () => {
    let txt = inputArea.value;
    if (!txt.trim()) return showToast('Please enter some text!', true);

    // Formal rewrites for contractions & slang
    const expansions = [
      { contraction: /\bcan't\b/gi, expansion: 'cannot' },
      { contraction: /\bdon't\b/gi, expansion: 'do not' },
      { contraction: /\bwon't\b/gi, expansion: 'will not' },
      { contraction: /\bit's\b/gi, expansion: 'it is' },
      { contraction: /\bgonna\b/gi, expansion: 'going to' },
      { contraction: /\bwanna\b/gi, expansion: 'want to' },
      { contraction: /\bkids\b/gi, expansion: 'children' },
      { contraction: /\bstuff\b/gi, expansion: 'materials' },
      { contraction: /\bcool\b/gi, expansion: 'excellent' },
      { contraction: /\bbad\b/gi, expansion: 'unfavorable' }
    ];

    expansions.forEach(pair => {
      txt = txt.replace(pair.contraction, pair.expansion);
    });

    outputArea.value = txt.trim();
    updateStats(txt);
    showToast('Upgraded text style to formal!');
  });

  // Copy output
  btnCopy.addEventListener('click', () => {
    if (!outputArea.value) {
      showToast('No output to copy!', true);
      return;
    }
    navigator.clipboard.writeText(outputArea.value);
    showToast('Clean text copied to clipboard!');
  });

  function updateStats(text) {
    const cleanText = text.trim();
    if (!cleanText) {
      wordCount.textContent = '0';
      charCount.textContent = '0';
      sentenceCount.textContent = '0';
      return;
    }

    const words = cleanText.split(/\s+/).filter(w => w.length > 0).length;
    const chars = cleanText.length;
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    wordCount.textContent = words;
    charCount.textContent = chars;
    sentenceCount.textContent = sentences;
  }
}
