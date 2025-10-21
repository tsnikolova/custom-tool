(function () {
  // guard for double registration (hot-reload)
  if (window.__custom_column_registered) return;
  window.__custom_column_registered = true;

  function whenUnlayerReady(cb) {
    const interval = setInterval(function () {
      if (window.unlayer && typeof unlayer.registerPropertyEditor === 'function' && typeof unlayer.registerTool === 'function' && typeof unlayer.createWidget === 'function') {
        clearInterval(interval);
        cb();
      }
    }, 100);

    setTimeout(function () { clearInterval(interval); }, 10000);
  }

  whenUnlayerReady(function () {
    // ---------- property editor ----------
    unlayer.registerPropertyEditor({
      name: 'borderRadiusFour',
      layout: 'right',
      Widget: unlayer.createWidget({
        render: function (value) {
          const v = value || { tl: 0, tr: 0, br: 0, bl: 0, moreOptions: false, linked: true };
          // collapsed view (all sides) and expanded view (four corners)
          return `
            <div class="br4-wrap" style="font-family: Arial, sans-serif; padding:8px;">
              <style>
                .br4-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
                .br4-label { width:90px; font-size:13px; color:#444; }
                .br4-input { width:72px; display:flex; align-items:center; gap:6px; }
                .br4-input input[type="number"] { width:48px; padding:6px; border:1px solid #ddd; border-radius:4px; }
                .br4-btn { width:28px; height:28px; border:1px solid #ddd; background:#fff; border-radius:4px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; }
                .br4-range { flex:1; }
                .br4-toggle { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
                .br4-more { color:#666; font-size:13px; }
                .br4-corners { display:grid; grid-template-columns: 1fr 1fr; gap:8px; }
              </style>

              <div class="br4-toggle">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div style="font-weight:600;">Rounded Border</div>
                  <div style="color:#888;font-size:12px;">More Options</div>
                </div>
                <div>
                  <label style="display:inline-flex; align-items:center; gap:6px;">
                    <input type="checkbox" id="br4-more-cb" ${v.moreOptions ? 'checked' : ''}/>
                    <span style="width:40px; height:22px; display:inline-block; background:#eee; border-radius:12px; position:relative;"></span>
                  </label>
                </div>
              </div>

              <!-- Collapsed: All Sides -->
              <div id="br4-collapsed" style="${v.moreOptions ? 'display:none' : ''}">
                <div style="font-size:12px; color:#666; margin-bottom:6px;">All Sides</div>
                <div class="br4-row">
                  <div class="br4-input">
                    <button class="br4-btn" data-op="decrement">−</button>
                    <input type="number" min="0" max="200" id="br4-all-num" value="${v.tl || 0}" />
                    <div style="padding:6px;border:1px solid #eee;background:#f7f7f7;border-radius:4px;">px</div>
                    <button class="br4-btn" data-op="increment">+</button>
                  </div>
                </div>
              </div>

              <!-- Expanded: Four Corners -->
              <div id="br4-expanded" style="${v.moreOptions ? '' : 'display:none'}">
                <div class="br4-corners">
                  <div>
                    <div style="font-size:12px;color:#666;margin-bottom:6px;">Top Left</div>
                    <div class="br4-row">
                      <input type="range" min="0" max="200" class="br4-range" data-corner="tl" value="${v.tl || 0}"/>
                      <div class="br4-input"><input type="number" min="0" max="200" data-corner-num="tl" value="${v.tl || 0}"/><div style="padding:6px;border:1px solid #eee;background:#f7f7f7;border-radius:4px;">px</div></div>
                    </div>
                  </div>
                  <div>
                    <div style="font-size:12px;color:#666;margin-bottom:6px;">Top Right</div>
                    <div class="br4-row">
                      <input type="range" min="0" max="200" class="br4-range" data-corner="tr" value="${v.tr || 0}"/>
                      <div class="br4-input"><input type="number" min="0" max="200" data-corner-num="tr" value="${v.tr || 0}"/><div style="padding:6px;border:1px solid #eee;background:#f7f7f7;border-radius:4px;">px</div></div>
                    </div>
                  </div>
                  <div>
                    <div style="font-size:12px;color:#666;margin-bottom:6px;">Bottom Left</div>
                    <div class="br4-row">
                      <input type="range" min="0" max="200" class="br4-range" data-corner="bl" value="${v.bl || 0}"/>
                      <div class="br4-input"><input type="number" min="0" max="200" data-corner-num="bl" value="${v.bl || 0}"/><div style="padding:6px;border:1px solid #eee;background:#f7f7f7;border-radius:4px;">px</div></div>
                    </div>
                  </div>
                  <div>
                    <div style="font-size:12px;color:#666;margin-bottom:6px;">Bottom Right</div>
                    <div class="br4-row">
                      <input type="range" min="0" max="200" class="br4-range" data-corner="br" value="${v.br || 0}"/>
                      <div class="br4-input"><input type="number" min="0" max="200" data-corner-num="br" value="${v.br || 0}"/><div style="padding:6px;border:1px solid #eee;background:#f7f7f7;border-radius:4px;">px</div></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Link corners toggle when collapsed -->
              <div style="margin-top:8px;">
                <label style="display:inline-flex; align-items:center; gap:8px;">
                  <input type="checkbox" id="br4-link-cb" ${v.linked ? 'checked' : ''}/>
                  <span style="font-size:13px;color:#666;">Link corners</span>
                </label>
              </div>
            </div>
          `;
        },

        mount: function (node, value, updateValue /* , data */) {
          const root = node;
          // ensure base shape
          let v = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0, moreOptions: false, linked: true }, value || {});

          // helper to normalize numbers
          function num(x) { return Number(x || 0); }

          // find elements
          const collapsed = root.querySelector('#br4-collapsed');
          const expanded = root.querySelector('#br4-expanded');
          const moreCb = root.querySelector('#br4-more-cb');
          const linkCb = root.querySelector('#br4-link-cb');
          const allNum = root.querySelector('#br4-all-num');
          const decBtn = root.querySelector('[data-op="decrement"]');
          const incBtn = root.querySelector('[data-op="increment"]');
          const ranges = Array.from(root.querySelectorAll('input.br4-range[data-corner]'));
          const nums = Array.from(root.querySelectorAll('input[data-corner-num]'));

          // update UI controls to match v
          function syncUI() {
            if (allNum) allNum.value = num(v.tl);
            ranges.forEach(r => {
              const c = r.getAttribute('data-corner');
              r.value = num(v[c]);
            });
            nums.forEach(n => {
              const c = n.getAttribute('data-corner-num');
              n.value = num(v[c]);
            });
            if (moreCb) moreCb.checked = !!v.moreOptions;
            if (linkCb) linkCb.checked = !!v.linked;
            if (collapsed) collapsed.style.display = v.moreOptions ? 'none' : '';
            if (expanded) expanded.style.display = v.moreOptions ? '' : 'none';
          }

          // push values to unlayer (do not include internal-only keys? we will persist moreOptions & linked for state)
          function push() {
            // we persist tl/tr/br/bl plus moreOptions and linked (so UI state survives)
            const payload = {
              tl: num(v.tl),
              tr: num(v.tr),
              br: num(v.br),
              bl: num(v.bl),
              moreOptions: !!v.moreOptions,
              linked: !!v.linked
            };
            updateValue(payload);
          }

          // when collapsed and we are syncing back -> copy TL to all corners (Button behavior)
          function collapseSyncFromTL() {
            const tlVal = num(v.tl);
            v.tl = v.tr = v.br = v.bl = tlVal;
          }

          // events for All Sides input and +/- buttons
          if (allNum) {
            allNum.addEventListener('input', function (e) {
              const val = num(e.target.value);
              v.tl = val;
              if (v.linked || !v.moreOptions) {
                // when linked or collapsed, change all
                v.tr = v.br = v.bl = val;
              }
              syncUI();
              push();
            });
          }
          if (decBtn) decBtn.addEventListener('click', function () {
            const cur = num(v.tl);
            const next = Math.max(0, cur - 1);
            v.tl = next;
            if (v.linked || !v.moreOptions) v.tr = v.br = v.bl = next;
            syncUI(); push();
          });
          if (incBtn) incBtn.addEventListener('click', function () {
            const cur = num(v.tl);
            const next = Math.min(200, cur + 1);
            v.tl = next;
            if (v.linked || !v.moreOptions) v.tr = v.br = v.bl = next;
            syncUI(); push();
          });

          // ranges (expanded)
          ranges.forEach(r => {
            const corner = r.getAttribute('data-corner');
            r.addEventListener('input', function (e) {
              const val = num(e.target.value);
              v[corner] = val;
              // if linking is on, sync all
              if (v.linked) v.tl = v.tr = v.br = v.bl = val;
              syncUI(); push();
            });
          });

          // numeric corner inputs
          nums.forEach(n => {
            const corner = n.getAttribute('data-corner-num');
            n.addEventListener('input', function (e) {
              const val = num(e.target.value);
              v[corner] = val;
              if (v.linked) v.tl = v.tr = v.br = v.bl = val;
              syncUI(); push();
            });
          });

          // More Options toggle
          if (moreCb) {
            moreCb.addEventListener('change', function (e) {
              const wasExpanded = !!v.moreOptions;
              v.moreOptions = !!e.target.checked;

              if (!v.moreOptions && wasExpanded) {
                // Collapsing: apply TL -> all corners (Button logic)
                collapseSyncFromTL();
              }
              // show/hide handled by syncUI
              syncUI();
              push();
            });
          }

          // Link toggle
          if (linkCb) {
            linkCb.addEventListener('change', function (e) {
              v.linked = !!e.target.checked;
              if (v.linked) {
                // unify to TL when enabling link
                const tlVal = num(v.tl);
                v.tl = v.tr = v.br = v.bl = tlVal;
              }
              syncUI(); push();
            });
          }

          // initial sync
          syncUI();
        },

        unmount: function (node) {
          // no-op
        }
      })
    });

    // ---------- register tool ----------
    unlayer.registerTool({
      name: 'custom_column', // per your request
      label: 'Advanced Column',
      icon: 'fa-columns',
      supportedDisplayModes: ['email', 'web'],
      options: {
        // using named groups for the sidebar; note some platforms show only limited widgets for custom tools,
        // but registerPropertyEditor should link our custom editor into the group.
        general: {
          title: 'General',
          position: 1,
          options: {
            backgroundColor: { widget: 'color_picker', label: 'Background Color', defaultValue: '#ffffff' },
            // Use built-in padding if available; otherwise apps may show alternate UI
            containerPadding: { widget: 'padding', label: 'Padding', defaultValue: '0px' }
          }
        },
        border: {
          title: 'Border',
          position: 3,
          options: {
            // our custom per-corner editor
            borderRadius: { widget: 'borderRadiusFour', label: 'Rounded Border', defaultValue: { tl: 0, tr: 0, br: 0, bl: 0, moreOptions: false, linked: true } }
          }
        }
      },

      values: {
        backgroundColor: '#ffffff',
        containerPadding: '0px',
        borderRadius: { tl: 0, tr: 0, br: 0, bl: 0, moreOptions: false, linked: true }
      },

      renderer: {
        Viewer: unlayer.createViewer({
          render: function (values) {
            const bg = values.backgroundColor || '#ffffff';
            const padding = parsePaddingValue(values.containerPadding) || { top: 0, right: 0, bottom: 0, left: 0 };
            const br = values.borderRadius || { tl: 0, tr: 0, br: 0, bl: 0 };
            const style = `
              display:block;
              width:100%;
              background-color:${escapeHtml(bg)};
              padding:${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
              border-radius:${px(br.tl)} ${px(br.tr)} ${px(br.br)} ${px(br.bl)};
              box-sizing:border-box;
            `;
            return `<div style="${style}">Advanced Column</div>`;
          }
        }),

        exporters: {
          web: function (values) {
            const bg = values.backgroundColor || '#ffffff';
            const padding = parsePaddingValue(values.containerPadding) || { top: 0, right: 0, bottom: 0, left: 0 };
            const br = values.borderRadius || { tl: 0, tr: 0, br: 0, bl: 0 };
            const style = `
              display:block;
              width:100%;
              background-color:${bg};
              padding:${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
              border-radius:${px(br.tl)} ${px(br.tr)} ${px(br.br)} ${px(br.bl)};
              box-sizing:border-box;
            `;
            return `<div style="${style}">Advanced Column</div>`;
          },
          email: function (values) {
            const bg = values.backgroundColor || '#ffffff';
            const padding = parsePaddingValue(values.containerPadding) || { top: 0, right: 0, bottom: 0, left: 0 };
            const br = values.borderRadius || { tl: 0, tr: 0, br: 0, bl: 0 };
            const style = `
              display:block;
              width:100%;
              background-color:${bg};
              padding:${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
              border-radius:${px(br.tl)} ${px(br.tr)} ${px(br.br)} ${px(br.bl)};
              box-sizing:border-box;
            `;
            return `<div style="${style}">Advanced Column</div>`;
          }
        },

        head: {
          css: function () { return ''; },
          js: function () { return ''; }
        }
      }
    });

    console.log('✅ custom_column tool + borderRadiusFour editor registered (Button-like UI)');
  });

  // helpers
  function px(n) {
    if (n === undefined || n === null) return '0px';
    const s = String(n);
    return s.match(/px$/) ? s : s + 'px';
  }
  function parsePaddingValue(val) {
    if (!val) return { top: 0, right: 0, bottom: 0, left: 0 };
    if (typeof val === 'object') return {
      top: numberFromMaybePx(val.top), right: numberFromMaybePx(val.right),
      bottom: numberFromMaybePx(val.bottom), left: numberFromMaybePx(val.left)
    };
    if (typeof val === 'string') {
      const parts = val.trim().split(/\s+/).map(numberFromMaybePx);
      if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
      if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
      if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
      return { top: parts[0]||0, right: parts[1]||0, bottom: parts[2]||0, left: parts[3]||0 };
    }
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  function numberFromMaybePx(v) {
    if (v === undefined || v === null) return 0;
    if (typeof v === 'number') return v;
    const m = String(v).trim().match(/^(-?\d+(?:\.\d+)?)/);
    return m ? Number(m[1]) : 0;
  }
  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();
