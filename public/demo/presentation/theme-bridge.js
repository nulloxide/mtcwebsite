// Shared adapter so per-dashboard theme toggles work when the page is embedded
// in the investor deck (public/demo/presentation/investor_presentation.html).
//
// Each dashboard already:
//   - ships [data-theme="light"] CSS variable overrides
//   - has a toggle button that writes data-theme onto <html>
//   - retints Chart.js instances on toggle
// This adapter adds three things without touching that code:
//   1. On load, if we're in an iframe, ask the parent for the current theme.
//   2. On receiving a parent 'pres:theme' message, call the page's own toggle
//      path by simulating a click on its toggle button — that way charts retint.
//   3. When the page's own toggle flips data-theme, mirror the value to
//      localStorage['mcp-theme'] and postMessage the parent so the deck and
//      sibling dashboards stay in sync.
//
// Protocol:
//   parent → child   { type: 'pres:theme',         theme: 'dark' | 'light' }
//   child  → parent  { type: 'pres:theme',         theme: 'dark' | 'light' }   (on local toggle)
//   child  → parent  { type: 'pres:theme:request' }                            (on load)
(function () {
  const KEY = 'mcp-theme';
  const html = document.documentElement;
  const embedded = window.parent && window.parent !== window;
  if (embedded) html.setAttribute('data-embedded', 'true');

  function current() {
    return html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function findToggle() {
    return document.getElementById('themeToggle')
        || document.getElementById('theme-toggle')
        || document.querySelector('.theme-toggle, [data-role="theme-toggle"]');
  }

  function setThemeTo(target) {
    if (target !== 'light' && target !== 'dark') return;
    if (current() === target) return;
    const btn = findToggle();
    if (btn) {
      // Click the page's own toggle so charts retint & button icon updates.
      btn.click();
    } else {
      html.setAttribute('data-theme', target);
    }
  }

  // Seed initial theme BEFORE the page's own init runs.
  // We can't do this safely from the bottom of <body> because per-dashboard
  // scripts already ran. So we just mirror whatever is current to storage.
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'light' || stored === 'dark') {
      // If the page hasn't applied the stored theme (some dashboards use a
      // different storage key), flip to match.
      setThemeTo(stored);
    }
  } catch {}

  // --- Universal Chart.js retint ---------------------------------------------
  // Reads current CSS custom properties and rewrites every Chart.js instance's
  // axes/grid/legend/tooltip colors, so charts follow CSS var changes without
  // per-dashboard code duplication. Dataset colors are left alone by default
  // (they encode data, not chrome), except the donut center ring which we
  // force to --card / --c1 to match the containing card.
  function cssVar(name, fallback) {
    const v = getComputedStyle(html).getPropertyValue(name).trim();
    return v || fallback;
  }
  function palette() {
    const theme = current();
    // Support both dashboard families.
    // Family A: --t1/--t2/--t3/--c1 ; Family B: --t1/--t2/--t3/--card/--border
    // Both expose --t1..--t3 and a card-ish color.
    const card = cssVar('--card', cssVar('--c1', theme === 'light' ? '#ffffff' : '#111827'));
    const grid = theme === 'light' ? 'rgba(15,23,42,0.08)' : 'rgba(148,163,184,0.12)';
    const tick = cssVar('--t3', theme === 'light' ? '#64748b' : '#94a3b8');
    const legend = cssVar('--t2', theme === 'light' ? '#475569' : '#94a3b8');
    const tooltipBg = theme === 'light' ? '#ffffff' : '#0a0e17';
    const tooltipText = cssVar('--t1', theme === 'light' ? '#0f172a' : '#f1f5f9');
    const tooltipBorder = cssVar('--border', cssVar('--brd', theme === 'light' ? '#e2e8f0' : '#1e293b'));
    return { theme, card, grid, tick, legend, tooltipBg, tooltipText, tooltipBorder };
  }
  function retintCharts() {
    if (typeof window.Chart === 'undefined' || !window.Chart.instances) return;
    const p = palette();
    Object.values(window.Chart.instances).forEach((c) => {
      if (!c || !c.options) return;
      // Scales
      const scales = c.options.scales || {};
      Object.values(scales).forEach((s) => {
        if (!s) return;
        if (s.ticks) s.ticks.color = p.tick;
        if (s.grid)  s.grid.color  = p.grid;
        if (s.pointLabels) s.pointLabels.color = p.legend;
        if (s.title)  s.title.color = p.tick;
      });
      // Legend
      const plugins = c.options.plugins || {};
      if (plugins.legend && plugins.legend.labels) plugins.legend.labels.color = p.legend;
      // Tooltip
      if (plugins.tooltip) {
        plugins.tooltip.backgroundColor = p.tooltipBg;
        plugins.tooltip.titleColor = p.tooltipText;
        plugins.tooltip.bodyColor  = p.tooltipText;
        plugins.tooltip.borderColor = p.tooltipBorder;
        plugins.tooltip.borderWidth = plugins.tooltip.borderWidth ?? 1;
      }
      // Donut center ring should match the card it sits in
      if (c.config && c.config.type === 'doughnut') {
        (c.data && c.data.datasets || []).forEach((ds) => { ds.borderColor = p.card; });
      }
      c.update('none');
    });
  }

  // Broadcast local changes upward + persist to the shared key + retint charts.
  const observer = new MutationObserver(() => {
    const t = current();
    try { localStorage.setItem(KEY, t); } catch {}
    if (embedded) {
      try { window.parent.postMessage({ type: 'pres:theme', theme: t }, '*'); } catch {}
    }
    retintCharts();
  });
  observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });

  // Retint once on load in case Chart instances are created after the bridge.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(retintCharts, 0));
  } else {
    setTimeout(retintCharts, 0);
  }

  // Accept parent updates.
  window.addEventListener('message', (e) => {
    const d = e.data;
    if (d && typeof d === 'object' && d.type === 'pres:theme' && (d.theme === 'light' || d.theme === 'dark')) {
      setThemeTo(d.theme);
    }
  });

  // Handshake: ask the parent for the authoritative theme.
  if (embedded) {
    try { window.parent.postMessage({ type: 'pres:theme:request' }, '*'); } catch {}
  }

  // Also listen for cross-tab changes on the shared key.
  window.addEventListener('storage', (e) => {
    if (e.key === KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
      setThemeTo(e.newValue);
    }
  });
})();
