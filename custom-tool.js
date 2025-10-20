(function () {
  if (typeof unlayer === 'undefined') return;

  unlayer.registerPropertyEditor({
      name: 'borderRadiusFour',
      // layout can be 'right' or 'bottom'; 'right' usually fits the sidebar panel
      layout: 'right',
      Widget: unlayer.createWidget({
        // render returns HTML string used inside the sidebar property area
        render: function (value) {
          // ensure value object shape
          const v = value || { tl: 0, tr: 0, br: 0, bl: 0 };
          const linked = (v.__linked === undefined) ? true : !!v.__linked; // local hint (not persisted unless we want)
          // Each corner: top-left (tl), top-right (tr), bottom-right (br), bottom-left (bl)
          return `
            <div class="urbf-br4-editor" style="font-family: Arial, sans-serif; padding: 8px;">
              <style>
                .urbf-br4-row { display:flex; gap:8px; align-items:center; margin-bottom:8px; }
                .urbf-br4-label {width:80px; font-size:13px;}
                .urbf-br4-range {flex:1;}
                .urbf-br4-num {width:60px;}
                .urbf-br4-link {display:flex; align-items:center; gap:6px; margin-bottom:10px;}
                .urbf-br4-link input { vertical-align: middle; }
              </style>

              <div class="urbf-br4-link">
                <input type="checkbox" id="urbf-br4-link-cb" ${linked ? 'checked' : ''}/>
                <label for="urbf-br4-link-cb" style="user-select:none;">Link corners</label>
              </div>

              <div class="urbf-br4-row">
                <div class="urbf-br4-label">Top-Left</div>
                <input class="urbf-br4-range" type="range" min="0" max="200" value="${v.tl || 0}" data-corner="tl"/>
                <input class="urbf-br4-num" type="number" min="0" max="200" value="${v.tl || 0}" data-corner-num="tl"/>
              </div>

              <div class="urbf-br4-row">
                <div class="urbf-br4-label">Top-Right</div>
                <input class="urbf-br4-range" type="range" min="0" max="200" value="${v.tr || 0}" data-corner="tr"/>
                <input class="urbf-br4-num" type="number" min="0" max="200" value="${v.tr || 0}" data-corner-num="tr"/>
              </div>

              <div class="urbf-br4-row">
                <div class="urbf-br4-label">Bottom-Right</div>
                <input class="urbf-br4-range" type="range" min="0" max="200" value="${v.br || 0}" data-corner="br"/>
                <input class="urbf-br4-num" type="number" min="0" max="200" value="${v.br || 0}" data-corner-num="br"/>
              </div>

              <div class="urbf-br4-row">
                <div class="urbf-br4-label">Bottom-Left</div>
                <input class="urbf-br4-range" type="range" min="0" max="200" value="${v.bl || 0}" data-corner="bl"/>
                <input class="urbf-br4-num" type="number" min="0" max="200" value="${v.bl || 0}" data-corner-num="bl"/>
              </div>
            </div>
          `;
        },

        // mount receives the DOM node, currentValue, updateValue callback, and optional data
        // signature: mount(node, value, updateValue, data)
        mount: function (node, value, updateValue /* , data */) {
          const root = node;
          // ensure value object exists
          let v = value || { tl: 0, tr: 0, br: 0, bl: 0, __linked: true };

          function safeValue(obj) {
            return {
              tl: Number(obj.tl || 0),
              tr: Number(obj.tr || 0),
              br: Number(obj.br || 0),
              bl: Number(obj.bl || 0),
              __linked: !!obj.__linked
            };
          }

          v = safeValue(v);
          // find elements
          const linkCb = root.querySelector('#urbf-br4-link-cb');
          const ranges = Array.from(root.querySelectorAll('input[type="range"][data-corner]'));
          const nums = Array.from(root.querySelectorAll('input[type="number"][data-corner-num]'));

          // helper: write UI from v
          function syncUI() {
            ranges.forEach(r => {
              const corner = r.getAttribute('data-corner');
              r.value = v[corner];
            });
            nums.forEach(n => {
              const corner = n.getAttribute('data-corner-num');
              n.value = v[corner];
            });
            if (linkCb) linkCb.checked = !!v.__linked;
          }

          // helper: push updated value back to unlayer (call updateValue)
          function push() {
            // copy to avoid passing DOM nodes etc
            const payload = { tl: Number(v.tl), tr: Number(v.tr), br: Number(v.br), bl: Number(v.bl) };
            // note: we don't persist __linked into exported value (internal-only)
            updateValue(payload);
          }

          // if linked, set all corners equal to first corner when changing
          function setCorner(corner, numberValue) {
            v[corner] = Number(numberValue || 0);
            if (v.__linked) {
              // set all corners to the same value
              v.tl = v.tr = v.br = v.bl = Number(v[corner]);
            }
            syncUI();
            push();
          }

          // attach listeners for ranges
          ranges.forEach(r => {
            const corner = r.getAttribute('data-corner');
            r.addEventListener('input', function (e) {
              setCorner(corner, e.target.value);
            });
          });

          // attach listeners for number inputs
          nums.forEach(n => {
            const corner = n.getAttribute('data-corner-num');
            n.addEventListener('change', function (e) {
              setCorner(corner, e.target.value);
            });
            // support immediate feedback on input for number fields too
            n.addEventListener('input', function (e) {
              setCorner(corner, e.target.value);
            });
          });

          // link toggle behavior
          if (linkCb) {
            linkCb.addEventListener('change', function (e) {
              v.__linked = !!e.target.checked;
              if (v.__linked) {
                // when enabling link, unify to top-left current value
                const unify = Number(v.tl || 0);
                v.tl = v.tr = v.br = v.bl = unify;
                syncUI();
                push();
              } else {
                // just update internal state, keep values as-is
                // no push necessary (values unchanged)
              }
            });
          }

          // initialize UI
          syncUI();

          // store a small reference for potential debugging
          root.__urbf_br4_value = v;
        },

        // unmount if necessary
        unmount: function (node) {
          // nothing special; listeners are attached to elements that will be removed
        }
      })
    });

    // ---------- 2) Register the custom-column tool ----------
    // Use the property editor in the tool options (Border group).
    // Format for options uses the property-editor style (groups as keys with options inside).
    // We include:
    // - general: backgroundColor (built-in color_picker) and containerPadding (built-in padding if available)
    // - border: borderRadius (custom), and also keep a simple border widget for future expansion (uses built-in 'border' if needed)
    // Note: some built-in editors accept 'widget' while others use 'editor' keys; the docs and examples show 'widget'.
    unlayer.registerTool({
      name: 'custom-column',
      label: 'Advanced Column',
      icon: 'fa-columns',
      supportedDisplayModes: ['email', 'web'],
      // the `options` object uses named groups with `title`, `position`, and `options` containing the properties
      options: {
        // main/general group
        general: {
          title: 'General',
          position: 1,
          options: {
            // background color using built-in color picker
            backgroundColor: {
              widget: 'color_picker',
              label: 'Background Color',
              defaultValue: '#ffffff'
            },
            // container padding (attempt common built-in name)
            containerPadding: {
              widget: 'padding',
              label: 'Padding',
              defaultValue: '0px'
            }
          }
        },

        // Border group — we put our custom borderRadius editor here
        border: {
          title: 'Border',
          position: 3,
          options: {
            // use a built-in border editor for width/style/color if you want:
            // border: { widget: 'border', label: 'Border', defaultValue: {...} },

            // CUSTOM per-corner border radius
            borderRadius: {
              widget: 'borderRadiusFour',   // must match registered editor name
              label: 'Border Radius',
              // defaultValue is the M1 object; Unlayer will pass this as initial values
              defaultValue: { tl: 0, tr: 0, br: 0, bl: 0 }
            }
          }
        }
      },

      // default values for new blocks (tool values)
      values: {
        backgroundColor: '#ffffff',
        containerPadding: '0px',
        borderRadius: { tl: 0, tr: 0, br: 0, bl: 0 }
      },

      // renderer: Viewer (in-editor preview) + exporters
      renderer: {
        Viewer: unlayer.createViewer({
          render: function (values) {
            // Pull values safely
            const bg = values.backgroundColor || '#ffffff';
            const padding = parsePaddingValue(values.containerPadding) || { top: 0, right: 0, bottom: 0, left: 0 };
            const br = values.borderRadius || { tl: 0, tr: 0, br: 0, bl: 0 };

            const style = `
              display: block;
              width: 100%;
              background-color: ${escapeHtml(bg)};
              padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
              border-radius: ${px(br.tl)} ${px(br.tr)} ${px(br.br)} ${px(br.bl)};
              box-sizing: border-box;
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

            // For email we keep inline styles
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
          css: function (values) { return ''; },
          js: function (values) { return ''; }
        }
      }
    });

    console.log('✅ Advanced Column + borderRadiusFour registered');
})();

 function px(n) {
    if (n === undefined || n === null) return '0px';
    return (String(n).match(/px$/) ? String(n) : String(n) + 'px');
  }

  // very small helper to parse the various padding value formats that Unlayer may pass
  function parsePaddingValue(val) {
    // Accept object { top,right,bottom,left } OR string "10px" or "10px 5px" etc.
    if (!val) return { top: 0, right: 0, bottom: 0, left: 0 };
    if (typeof val === 'object') {
      // maybe { top: 10, right: 10, ... } or { top: '10px' ... }
      return {
        top: numberFromMaybePx(val.top),
        right: numberFromMaybePx(val.right),
        bottom: numberFromMaybePx(val.bottom),
        left: numberFromMaybePx(val.left)
      };
    }
    if (typeof val === 'string') {
      // split CSS shorthand
      const parts = val.trim().split(/\s+/);
      const nums = parts.map(numberFromMaybePx);
      if (nums.length === 1) {
        return { top: nums[0], right: nums[0], bottom: nums[0], left: nums[0] };
      } else if (nums.length === 2) {
        return { top: nums[0], right: nums[1], bottom: nums[0], left: nums[1] };
      } else if (nums.length === 3) {
        return { top: nums[0], right: nums[1], bottom: nums[2], left: nums[1] };
      } else if (nums.length >= 4) {
        return { top: nums[0], right: nums[1], bottom: nums[2], left: nums[3] };
      }
    }
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  function numberFromMaybePx(v) {
    if (v === undefined || v === null) return 0;
    if (typeof v === 'number') return v;
    const m = String(v).trim().match(/^(-?\d+(?:\.\d+)?)/);
    if (m) return Number(m[1]);
    return 0;
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
