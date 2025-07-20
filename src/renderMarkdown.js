window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('content.md');
    const md = await res.text();
    const html = window.marked.parse(md);
    document.getElementById('markdown-target').innerHTML = html;
  } catch (err) {
    console.error('加载 Markdown 失败:', err);
  }
});
