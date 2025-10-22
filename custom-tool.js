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
        render: function(value){ /* your existing render code */ },
        mount: function(node, value, updateValue){ /* your mount code */ },
        unmount: function(){ }
      })
    });
  }
    // --- register the composite image+text tool ---
    unlayer.registerTool({
    name: 'custom_column',
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
          image: { widget: 'image', label: 'Image', defaultValue: '' },
          imageWidth: { widget: 'slider', label: 'Image Width (%)', defaultValue: 40, min:10, max:90 },
          gap: { widget: 'slider', label: 'Gap (px)', defaultValue: 15, min:0, max:60 },
          imagePosition: { widget: 'select', label: 'Image Position', options:[{label:'Left',value:'left'},{label:'Right',value:'right'}], defaultValue:'left' }
        }
      },
      border: {
        title: 'Border',
        position: 3,
        options: {
          borderRadius: { widget: 'borderRadiusFour', label: 'Rounded Border', defaultValue:{ tl:0,tr:0,br:0,bl:0,moreOptions:false,linked:true } }
        }
      }
    },
    values: { 
      text:'Edit this text',
      image:'',
      imageWidth:40,
      gap:15,
      imagePosition:'left',
      backgroundColor:'#ffffff',
      containerPadding:'0px',
      borderRadius:{ tl:0,tr:0,br:0,bl:0,moreOptions:false,linked:true }
    },
    renderer: { 
      Viewer: unlayer.createViewer({ render: function(values){ /* your render code */ } }),
      exporters: { web:function(values){ /* ... */ }, email:function(values){ /* ... */ } },
      head: { css:()=>'', js:()=>'' }
    }
  });

});
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
