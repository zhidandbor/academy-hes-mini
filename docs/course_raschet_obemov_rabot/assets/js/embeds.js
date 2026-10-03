document.querySelectorAll('.embedded').forEach((block) => {
  const frame = block.querySelector('iframe');
  const primary = block.querySelector('[data-embed-primary]');
  const fallback = block.querySelector('[data-embed-fallback]');
  const button = block.querySelector('[data-embed-recovery]');
  let loaded = false;
  let timer;
  const showFallback = () => {
    primary.hidden = true;
    fallback.hidden = false;
    button.textContent = 'Повторить загрузку';
    button.setAttribute('aria-expanded', 'true');
  };
  const retry = () => {
    loaded = false;
    fallback.hidden = true;
    primary.hidden = false;
    button.textContent = 'Материал не открылся? Показать статическое содержание';
    button.setAttribute('aria-expanded', 'false');
    frame.src = frame.getAttribute('src');
    clearTimeout(timer);
    if (block.dataset.embedType === 'external') timer = setTimeout(() => { if (!loaded) showFallback(); }, 15000);
  };
  frame.addEventListener('load', () => { loaded = true; clearTimeout(timer); });
  frame.addEventListener('error', showFallback);
  button.addEventListener('click', () => fallback.hidden ? showFallback() : retry());
  block.addEventListener('toggle', () => {
    if (!block.open) { clearTimeout(timer); return; }
    if (block.dataset.embedType === 'external' && !navigator.onLine) showFallback();
    else if (!loaded && block.dataset.embedType === 'external') timer = setTimeout(() => { if (!loaded) showFallback(); }, 15000);
  });
  if (block.dataset.embedType === 'external') window.addEventListener('offline', showFallback);
});
