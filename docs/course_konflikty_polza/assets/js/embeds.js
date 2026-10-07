document.querySelectorAll('.embedded').forEach((block) => {
  const primary = block.querySelector('[data-embed-primary]');
  const fallback = block.querySelector('[data-embed-fallback]');
  const button = block.querySelector('[data-embed-recovery]');
  const frame = primary.querySelector('iframe');
  const object = primary.querySelector('object');
  let loaded = false;
  let timer;
  const showFallback = () => {
    clearTimeout(timer);
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
    if (frame) frame.src = frame.getAttribute('src');
    if (object) object.data = object.getAttribute('data');
    if (block.dataset.embedType === 'external') timer = setTimeout(() => { if (!loaded) showFallback(); }, 15000);
  };
  if (frame) {
    frame.addEventListener('load', () => { loaded = true; clearTimeout(timer); });
    frame.addEventListener('error', showFallback);
  }
  if (object) object.addEventListener('error', showFallback);
  button.addEventListener('click', () => fallback.hidden ? showFallback() : retry());
  block.addEventListener('toggle', () => {
    if (!block.open) { clearTimeout(timer); return; }
    if (block.dataset.embedType === 'external' && !navigator.onLine) showFallback();
    else if (!loaded && block.dataset.embedType === 'external') timer = setTimeout(() => { if (!loaded) showFallback(); }, 15000);
  });
  if (block.dataset.embedType === 'external') window.addEventListener('offline', showFallback);
  if (block.open && block.dataset.embedType === 'external') {
    if (!navigator.onLine) showFallback();
    else timer = setTimeout(() => { if (!loaded) showFallback(); }, 15000);
  }
});
