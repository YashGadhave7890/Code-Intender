const inputCode = document.getElementById('inputCode');
const outputCode = document.getElementById('outputCode');
const langSelect = document.getElementById('langSelect');
const themeToggle = document.getElementById('themeToggle');

// Language Detection
function detectLanguage(code) {
  if (/^\s*{.*}\s*$/.test(code.trim()) || code.trim().startsWith('[')) return 'json';
  if (code.includes('<') && code.includes('>')) return 'html';
  if (code.includes('def ') || code.includes('print(')) return 'python';
  if (code.includes('function') || code.includes('=>')) return 'javascript';
  if (code.includes('{') && code.includes('}')) return 'css';
  if (code.includes('#include') || code.includes('int main')) return 'c';
  if (code.includes('public static void main')) return 'java';
  if (code.toLowerCase().includes('select') && code.includes('from')) return 'sql';
  return 'javascript';
}

// Formatter
function formatCode(code, lang) {
  try {
    switch (lang) {
      case 'javascript': return js_beautify(code, { indent_size: 2 });
      case 'html': return html_beautify(code, { indent_size: 2 });
      case 'css': return css_beautify(code, { indent_size: 2 });
      case 'json': return JSON.stringify(JSON.parse(code), null, 2);
      default: return code;
    }
  } catch (e) {
    return code;
  }
}

// Update Output
function updateOutput() {
  let raw = inputCode.value;
  let lang = langSelect.value === 'auto' ? detectLanguage(raw) : langSelect.value;

  const formatted = formatCode(raw, lang);
  outputCode.className = `language-${lang}`;
  outputCode.textContent = formatted;
  Prism.highlightElement(outputCode);
}

// Real-time Formatting
inputCode.addEventListener('input', updateOutput);
langSelect.addEventListener('change', updateOutput);

// Theme toggle
themeToggle.addEventListener('change', (e) => {
  document.body.classList.toggle('dark', e.target.checked);
});

// Copy button
document.getElementById('copyBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(outputCode.textContent)
    .then(() => alert('✅ Code copied!'))
    .catch(() => alert('❌ Failed to copy!'));
});

// Download button
document.getElementById('downloadBtn').addEventListener('click', () => {
  const lang = langSelect.value === 'auto' ? detectLanguage(inputCode.value) : langSelect.value;
  const blob = new Blob([outputCode.textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `formatted-code.${lang}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});
