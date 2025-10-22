(function () {
  // guard to avoid double registration on hot reload
  if (window.__custom_media_registered) return;
  window.__custom_media_registered = true;

  function whenUnlayerReady(cb) {
    const interval = setInterval(function () {
      if (window.unlayer && typeof unlayer.registerTool === 'function' && typeof unlayer.createWidget === 'function') {
        clearInterval(interval);
        cb();
      }
    }, 120);
    // safety cutoff
    setTimeout(function () { clearInterval(interval); }, 10000);
  }

  whenUnlayerReady(function () {
    // --- register borderRadiusFour editor if not yet registered (reuse earlier code) ---
    if (!window.__br4_registered) {
      window.__br4_registered = true;

      unlayer.registerPropertyEditor({
        name: 'borderRadiusFour',
        layout: 'right',
        Widget: unlayer.createWidget({
          render: function (value) {
            const v = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0, moreOptions: false, linked: true }, value || {});
            return `
              <div style="font-family: Arial, sans-serif; padding:8px;">
                <style>
                  .br-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
                  .br-label{width:86px;font-size:13px;color:#444}
                  .br-input{display:flex;gap:6px;align-items:center}
                  .br-num{width:56px;padding:6px;border:1px solid #ddd;border-radius:4px}
                  .br-btn{width:28px;height:28px;border:1px solid #ddd;background:#fff;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
                  .br-range{flex:1}
                  .br-toggle{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
                  .br-corners{display:grid;grid-template-columns:1fr 1fr;gap:8px}
                </style>

                <div class="br-toggle">
                  <div style="font-weight:600">Rounded Border</div>
                  <div style="font-size:12px;color:#666">More Options</div>
                  <div>
                    <input id="br-more" type="checkbox" ${v.moreOptions ? 'checked' : ''}/>
                  </div>
                </div>

                <div id="br-collapsed" style="${v.moreOptions ? 'display:none' : ''}">
                  <div style="font-size:12px;color:#666;margin-bottom:6px">All Sides</div>
                  <div class="br-row">
                    <div class="br-input">
                      <button class="br-btn" data-op="dec">−</button>
                      <input id="br-all" type="number" min="0" max="500" value="${v.tl}" class="br-num" />
                      <div style="padding:6px;border:1px solid #eee;background:#f7f7f7;border-radius:4px">px</div>
                      <button class="br-btn" data-op="inc">+</button>
                    </div>
                  </div>
                </div>

                <div id="br-expanded" style="${v.moreOptions ? '' : 'display:none'}">
                  <div class="br-corners">
                    <div>
                      <div style="font-size:12px;color:#666;margin-bottom:6px">Top Left</div>
                      <div class="br-row">
                        <input class="br-range" type="range" min="0" max="500" data-corner="tl" value="${v.tl}"/>
                        <div class="br-input"><input type="number" class="br-num" data-corner-num="tl" value="${v.tl}"/><div style="padding:6px;border:1px solid #eee;background:#f7f7f7;border-radius:4px">px</div></div>
                      </div>
                    </div>
                    <div>
                      <div style="font-size:12px;color:#666;margin-bottom:6px">Top Right</div>
                      <div class="br-row">
                        <input class="br-range" type="range" min="0" max="500" data-corner="tr" value="${v.tr}"/>
                        <div class="br-input"><input type="number" class="br-num" data-corner-num="tr" value="${v.tr}"/><div style="padding:6px;border:1px solid #eee;background:#f7f7f7;border-radius:4px">px</div></div>
                      </div>
                    </div>
                    <div>
                      <div style="font-size:12px;color:#666;margin-bottom:6px">Bottom Left</div>
                      <div class="br-row">
                        <input class="br-range" type="range" min="0" max="500" data-corner="bl" value="${v.bl}"/>
                        <div class="br-input"><input type="number" class="br-num" data-corner-num="bl" value="${v.bl}"/><div style="padding:6px;border:1px solid #eee;background:#f7f7f7;border-radius:4px">px</div></div>
                      </div>
                    </div>
                    <div>
                      <div style="font-size:12px;color:#666;margin-bottom:6px">Bottom Right</div>
                      <div class="br-row">
                        <input class="br-range" type="range" min="0" max="500" data-corner="br" value="${v.br}"/>
                        <div class="br-input"><input type="number" class="br-num" data-corner-num="br" value="${v.br}"/><div style="padding:6px;border:1px solid #eee;background:#f7f7f7;border-radius:4px">px</div></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style="margin-top:8px">
                  <label style="display:inline-flex;align-items:center;gap:8px"><input id="br-link" type="checkbox" ${v.linked ? 'checked' : ''}/> <span style="font-size:13px;color:#666">Link corners</span></label>
                </div>
              </div>
            `;
          },

          mount: function (node, value, updateValue) {
            const root = node;
            let v = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0, moreOptions: false, linked: true }, value || {});

            function n(x) { return Number(x || 0); }
            const moreCb = root.querySelector('#br-more');
            const linkCb = root.querySelector('#br-link');
            const allNum = root.querySelector('#br-all');
            const decBtn = root.querySelector('[data-op="dec"]');
            const incBtn = root.querySelector('[data-op="inc"]');
            const ranges = Array.from(root.querySelectorAll('input.br-range[data-corner]'));
            const nums = Array.from(root.querySelectorAll('input.br-num[data-corner-num]'));

            function syncUI() {
              if (allNum) allNum.value = n(v.tl);
              ranges.forEach(r => { const c = r.getAttribute('data-corner'); r.value = n(v[c]); });
              nums.forEach(nm => { const c = nm.getAttribute('data-corner-num'); nm.value = n(v[c]); });
              if (moreCb) moreCb.checked = !!v.moreOptions;
              if (linkCb) linkCb.checked = !!v.linked;
              const collapsed = root.querySelector('#br-collapsed');
              const expanded = root.querySelector('#br-expanded');
              if (collapsed) collapsed.style.display = v.moreOptions ? 'none' : '';
              if (expanded) expanded.style.display = v.moreOptions ? '' : 'none';
            }

            function push() {
              const payload = { tl: n(v.tl), tr: n(v.tr), br: n(v.br), bl: n(v.bl), moreOptions: !!v.moreOptions, linked: !!v.linked };
              updateValue(payload);
            }

            function collapseSyncTL() {
              const t = n(v.tl);
              v.tl = v.tr = v.br = v.bl = t;
            }

            if (allNum) {
              allNum.addEventListener('input', function (e) {
                const val = n(e.target.value);
                v.tl = val;
                if (v.linked || !v.moreOptions) v.tr = v.br = v.bl = val;
                syncUI(); push();
              });
            }
            if (decBtn) decBtn.addEventListener('click', function () { const cur = n(v.tl); const next = Math.max(0, cur - 1); v.tl = next; if (v.linked || !v.moreOptions) v.tr = v.br = v.bl = next; syncUI(); push(); });
            if (incBtn) incBtn.addEventListener('click', function () { const cur = n(v.tl); const next = Math.min(500, cur + 1); v.tl = next; if (v.linked || !v.moreOptions) v.tr = v.br = v.bl = next; syncUI(); push(); });

            ranges.forEach(r => {
              const c = r.getAttribute('data-corner');
              r.addEventListener('input', e => {
                const val = n(e.target.value);
                v[c] = val;
                if (v.linked) v.tl = v.tr = v.br = v.bl = val;
                syncUI(); push();
              });
            });

            nums.forEach(nm => {
              const c = nm.getAttribute('data-corner-num');
              nm.addEventListener('input', e => {
                const val = n(e.target.value);
                v[c] = val;
                if (v.linked) v.tl = v.tr = v.br = v.bl = val;
                syncUI(); push();
              });
            });

            if (moreCb) {
              moreCb.addEventListener('change', function (e) {
                const was = !!v.moreOptions;
                v.moreOptions = !!e.target.checked;
                if (!v.moreOptions && was) collapseSyncTL();
                syncUI(); push();
              });
            }
            if (linkCb) {
              linkCb.addEventListener('change', function (e) {
                v.linked = !!e.target.checked;
                if (v.linked) { const tlv = n(v.tl); v.tl = v.tr = v.br = v.bl = tlv; }
                syncUI(); push();
              });
            }

            syncUI();
          },

          unmount: function () {}
        })
      });
    } // end register border editor

    // --- register the composite image+text tool ---
    unlayer.registerTool({
      name: 'custom_column', // chosen name (keeps previous name)
      label: 'Image + Text',
      icon: 'fa-picture-o',
      supportedDisplayModes: ['email', 'web'],
      options: {
        general: {
          title: 'General',
          position: 1,
          options: {
            backgroundColor: { widget: 'color_picker', label: 'Background Color', defaultValue: '#ffffff' },
            containerPadding: { widget: 'padding', label: 'Padding', defaultValue: '0px' }
          }
        },
        media: {
          title: 'Media',
          position: 2,
          options: {
            // image source - use built-in image widget when possible
            image: { widget: 'image', label: 'Image', defaultValue: '' },
            imageWidth: { widget: 'text', label: 'Image Width (px or %)', defaultValue: '80px' },
            gap: { widget: 'text', label: 'Image / Text gap (px)', defaultValue: '12px' },
            imagePosition: { widget: 'select', label: 'Image Position', defaultValue: 'left', options: [
              { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }
            ] }
          }
        },
        border: {
          title: 'Border',
          position: 3,
          options: {
            borderRadius: { widget: 'borderRadiusFour', label: 'Rounded Border', defaultValue: { tl:0,tr:0,br:0,bl:0, moreOptions:false, linked:true } }
          }
        }
      },

      // default values when user drops the block
      values: {
        text: 'Edit this text',
        image: '',
        imageWidth: '80px',
        gap: '12px',
        imagePosition: 'left',
        backgroundColor: '#ffffff',
        containerPadding: '0px',
        borderRadius: { tl:0,tr:0,br:0,bl:0, moreOptions:false, linked:true }
      },

      renderer: {
        Viewer: unlayer.createViewer({
          render: function (values) {
            // safe read helpers
            const txt = (values.text !== undefined && values.text !== null) ? values.text : 'Edit this text';
            const img = values.image || '';
            const imageWidth = values.imageWidth || '80px';
            const gap = values.gap || '12px';
            const pos = values.imagePosition === 'right' ? 'right' : 'left';
            const bg = values.backgroundColor || '#ffffff';
            const padding = parsePaddingValue(values.containerPadding) || { top:0,right:0,bottom:0,left:0 };
            const br = values.borderRadius || { tl:0,tr:0,br:0,bl:0 };

            // contenteditable area: attempt to persist changes back to unlayer's values
            // We'll include a small script that hooks events and calls known unlayer methods if available.
            // The persistence is best-effort: if your Unlayer version exposes a setter, it will persist.
            const styleBlock = `
              display:flex;
              align-items:center;
              gap:${escapeHtml(gap)};
              background-color:${escapeHtml(bg)};
              padding:${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
              border-radius:${px(br.tl)} ${px(br.tr)} ${px(br.br)} ${px(br.bl)};
              box-sizing:border-box;
            `;

            // Build HTML: either image left or right
            const imgHtml = img ? `<img src="${escapeHtml(img)}" style="display:block; width:${escapeHtml(imageWidth)}; height:auto; border-radius:inherit;" />` : `<div style="width:${escapeHtml(imageWidth)};height:60px;background:#eee;display:inline-block"></div>`;

            // text area: contenteditable
            // we add data-prop and data-tool-name to help script find & persist
            const textHtml = `<div contenteditable="true" data-prop="text" style="outline:none;min-height:24px;flex:1;">${escapeHtml(txt)}</div>`;

            // layout: place image & text in the requested order
            const children = (pos === 'left') ? (imgHtml + textHtml) : (textHtml + imgHtml);

            return `
              <div class="custom_media_root" style="${styleBlock}">
                ${children}
              </div>

              <script>
                (function(){
                  try {
                    const root = document.currentScript.parentElement;
                    const editable = root.querySelector('[contenteditable][data-prop]');
                    if (!editable) return;
                    // debounce
                    let timeout = null;
                    function saveTextToValues(text) {
                      // try multiple update APIs, best-effort
                      try {
                        // Preferred: if unlayer provides a method to update selected component
                        if (window.unlayer && typeof unlayer.getSelected === 'function' && typeof unlayer.updateComponent === 'function') {
                          const selected = unlayer.getSelected && unlayer.getSelected();
                          if (selected && selected.id) {
                            // try updateComponent (some versions)
                            unlayer.updateComponent && unlayer.updateComponent(selected.id, { text: text });
                            return;
                          }
                        }
                        // Alternative common API: unlayer.update (componentId, values)
                        if (window.unlayer && typeof unlayer.update === 'function') {
                          const sel = unlayer.getSelected && unlayer.getSelected();
                          if (sel && sel.id) {
                            unlayer.update(sel.id, { values: Object.assign({}, sel.values || {}, { text: text }) });
                            return;
                          }
                        }
                        // Last resort: try window.postMessage for parent app to catch and handle
                        window.parent && window.parent.postMessage && window.parent.postMessage({ type: 'unlayer-custom-text-update', text: text }, '*');
                      } catch (err) {
                        console.warn('Could not persist inline text automatically:', err);
                        // fallback: write to a data attribute so at least the rendered DOM shows updated text
                        editable.innerText = text;
                      }
                    }

                    editable.addEventListener('input', function(e){
                      if (timeout) clearTimeout(timeout);
                      timeout = setTimeout(function(){
                        saveTextToValues(editable.innerText);
                      }, 500);
                    });

                    // also blur -> save immediately
                    editable.addEventListener('blur', function(){
                      if (timeout) clearTimeout(timeout);
                      saveTextToValues(editable.innerText);
                    });
                  } catch (e) {
                    console.warn('inline editable hook failed', e);
                  }
                })();
              </script>
            `;
          }
        }),

        exporters: {
          web: function (values) {
            const txt = (values.text !== undefined && values.text !== null) ? values.text : 'Edit this text';
            const img = values.image || '';
            const imageWidth = values.imageWidth || '80px';
            const gap = values.gap || '12px';
            const pos = values.imagePosition === 'right' ? 'right' : 'left';
            const bg = values.backgroundColor || '#ffffff';
            const padding = parsePaddingValue(values.containerPadding) || { top:0,right:0,bottom:0,left:0 };
            const br = values.borderRadius || { tl:0,tr:0,br:0,bl:0 };

            const styleBlock = `
              display:flex;
              align-items:center;
              gap:${gap};
              background-color:${bg};
              padding:${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
              border-radius:${px(br.tl)} ${px(br.tr)} ${px(br.br)} ${px(br.bl)};
              box-sizing:border-box;
            `;

            const imgHtml = img ? `<img src="${img}" style="display:block; width:${imageWidth}; height:auto; border-radius:inherit;" />` : `<div style="width:${imageWidth};height:60px;background:#eee;display:inline-block"></div>`;
            const textHtml = `<div style="flex:1">${txt}</div>`;
            const children = pos === 'left' ? (imgHtml + textHtml) : (textHtml + imgHtml);

            return `<div style="${styleBlock}">${children}</div>`;
          },

          email: function (values) {
            // for email, inline styles similar to web
            const txt = (values.text !== undefined && values.text !== null) ? values.text : 'Edit this text';
            const img = values.image || '';
            const imageWidth = values.imageWidth || '80px';
            const gap = values.gap || '12px';
            const pos = values.imagePosition === 'right' ? 'right' : 'left';
            const bg = values.backgroundColor || '#ffffff';
            const padding = parsePaddingValue(values.containerPadding) || { top:0,right:0,bottom:0,left:0 };
            const br = values.borderRadius || { tl:0,tr:0,br:0,bl:0 };

            const styleBlock = `display:block;width:100%;background-color:${bg};padding:${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;border-radius:${px(br.tl)} ${px(br.tr)} ${px(br.br)} ${px(br.bl)};box-sizing:border-box;`;

            // Table fallback for some email clients: minimal; keep simple and rely on modern clients
            const imgHtml = img ? `<img src="${img}" style="display:block; width:${imageWidth}; height:auto; border-radius:inherit;" />` : `<div style="width:${imageWidth};height:60px;background:#eee;display:inline-block"></div>`;
            const textHtml = `<div style="display:inline-block;vertical-align:top;margin-left:8px">${txt}</div>`;
            const children = pos === 'left' ? (imgHtml + textHtml) : (textHtml + imgHtml);

            return `<div style="${styleBlock}">${children}</div>`;
          }
        },

        head: {
          css: function () { return ''; },
          js: function () { return ''; }
        }
      } // end renderer
    });

    console.log('✅ custom_column (Image + Text) registered');
  }); // end whenUnlayerReady

  // ---------- helpers ----------
  function px(n) { if (n === undefined || n === null) return '0px'; const s = String(n); return s.match(/px$/) ? s : s + 'px'; }
  function parsePaddingValue(val) {
    if (!val) return { top:0,right:0,bottom:0,left:0 };
    if (typeof val === 'object') return { top:numberFromMaybePx(val.top), right:numberFromMaybePx(val.right), bottom:numberFromMaybePx(val.bottom), left:numberFromMaybePx(val.left) };
    if (typeof val === 'string') {
      const parts = val.trim().split(/\s+/).map(numberFromMaybePx);
      if (parts.length === 1) return { top:parts[0], right:parts[0], bottom:parts[0], left:parts[0] };
      if (parts.length === 2) return { top:parts[0], right:parts[1], bottom:parts[0], left:parts[1] };
      if (parts.length === 3) return { top:parts[0], right:parts[1], bottom:parts[2], left:parts[1] };
      return { top:parts[0]||0, right:parts[1]||0, bottom:parts[2]||0, left:parts[3]||0 };
    }
    return { top:0,right:0,bottom:0,left:0 };
  }
  function numberFromMaybePx(v) {
    if (v === undefined || v === null) return 0;
    if (typeof v === 'number') return v;
    const m = String(v).trim().match(/^(-?\d+(?:\.\d+)?)/);
    return m ? Number(m[1]) : 0;
  }
  function escapeHtml(s) { if (s === undefined || s === null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

})();
