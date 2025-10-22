(function () {
  // prevent double registration on hot reload
  if (window.__custom_media_registered) return;
  window.__custom_media_registered = true;

  // wait for unlayer to be ready
  function whenUnlayerReady(cb) {
    const interval = setInterval(function () {
      if (window.unlayer && typeof unlayer.registerTool === 'function' && typeof unlayer.createWidget === 'function') {
        clearInterval(interval);
        cb();
      }
    }, 120);
    setTimeout(() => clearInterval(interval), 10000);
  }

  // helpers
  function px(v) { return (v === undefined || v === null) ? '0px' : (typeof v === 'number' ? v + 'px' : (String(v).match(/px$/) ? v : v + 'px')); }
  function escapeHtml(s) { if (s === undefined || s === null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function parsePaddingValue(val) {
    if (!val) return { top:0,right:0,bottom:0,left:0 };
    if (typeof val === 'object') return { top: val.top||0, right: val.right||0, bottom: val.bottom||0, left: val.left||0 };
    const parts = String(val).trim().split(/\s+/).map(v => parseInt(v,10)||0);
    if (parts.length===1) return {top:parts[0],right:parts[0],bottom:parts[0],left:parts[0]};
    if (parts.length===2) return {top:parts[0],right:parts[1],bottom:parts[0],left:parts[1]};
    if (parts.length===3) return {top:parts[0],right:parts[1],bottom:parts[2],left:parts[1]};
    return {top:parts[0]||0,right:parts[1]||0,bottom:parts[2]||0,left:parts[3]||0};
  }

  whenUnlayerReady(function () {
    // 1️⃣ register borderRadiusFour editor first
    if (!window.__br4_registered) {
      window.__br4_registered = true;

      unlayer.registerPropertyEditor({
        name: 'borderRadiusFour',
        layout: 'right',
        Widget: unlayer.createWidget({
          render: function(value) {
            const v = Object.assign({ tl:0,tr:0,br:0,bl:0,moreOptions:false,linked:true }, value||{});
            return `<div style="font-family:Arial,sans-serif;padding:8px;">
              <style>
                .br-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
                .br-input{display:flex;gap:6px;align-items:center}
                .br-num{width:56px;padding:6px;border:1px solid #ddd;border-radius:4px}
                .br-range{flex:1}
              </style>
              <div>
                <label><input type="checkbox" id="br-link" ${v.linked?'checked':''}/> Link corners</label>
                <div class="br-row">
                  <input class="br-range" type="range" min="0" max="500" data-corner="tl" value="${v.tl}"/>
                  <input class="br-num" type="number" data-corner-num="tl" value="${v.tl}"/>
                  <input class="br-range" type="range" min="0" max="500" data-corner="tr" value="${v.tr}"/>
                  <input class="br-num" type="number" data-corner-num="tr" value="${v.tr}"/>
                  <input class="br-range" type="range" min="0" max="500" data-corner="br" value="${v.br}"/>
                  <input class="br-num" type="number" data-corner-num="br" value="${v.br}"/>
                  <input class="br-range" type="range" min="0" max="500" data-corner="bl" value="${v.bl}"/>
                  <input class="br-num" type="number" data-corner-num="bl" value="${v.bl}"/>
                </div>
              </div>`;
          },
          mount: function(node, value, updateValue){
            let v = Object.assign({ tl:0,tr:0,br:0,bl:0,moreOptions:false,linked:true }, value||{});
            const root = node;
            const ranges = Array.from(root.querySelectorAll('input.br-range[data-corner]'));
            const nums = Array.from(root.querySelectorAll('input.br-num[data-corner-num]'));
            const linkCb = root.querySelector('#br-link');

            function syncUI() {
              ranges.forEach(r=>{const c=r.dataset.corner;r.value=v[c];});
              nums.forEach(nm=>{const c=nm.dataset.cornerNum;nm.value=v[c];});
              linkCb.checked = !!v.linked;
            }

            function push(){ updateValue(Object.assign({}, v)); }

            ranges.forEach(r=>{
              r.addEventListener('input',e=>{
                const c=r.dataset.corner;
                v[c]=Number(e.target.value);
                if(v.linked){ const t=v[c]; v.tl=v.tr=v.br=v.bl=t; }
                syncUI(); push();
              });
            });

            nums.forEach(nm=>{
              nm.addEventListener('input',e=>{
                const c=nm.dataset.cornerNum;
                v[c]=Number(e.target.value);
                if(v.linked){ const t=v[c]; v.tl=v.tr=v.br=v.bl=t; }
                syncUI(); push();
              });
            });

            if(linkCb){
              linkCb.addEventListener('change', e=>{ v.linked=!!e.target.checked; if(v.linked){ const t=v.tl; v.tl=v.tr=v.br=v.bl=t; } syncUI(); push(); });
            }
            syncUI();
          },
          unmount: function(){}
        })
      });
    }

    // 2️⃣ register Image + Text tool
    unlayer.registerTool({
      name: 'custom_column',
      label: 'Image + Text',
      icon: 'fa-picture-o',
      supportedDisplayModes: ['email','web'],
      options: {
        general: {
          title:'General',
          position:1,
          options:{
            backgroundColor:{widget:'color_picker',label:'Background Color',defaultValue:'#ffffff'},
            containerPadding:{widget:'padding',label:'Padding',defaultValue:'0px'}
          }
        },
        media: {
          title:'Media',
          position:2,
          options:{
            image:{widget:'image',label:'Image',defaultValue:''},
            imageWidth:{widget:'slider',label:'Image Width (%)',defaultValue:40,min:10,max:90},
            gap:{widget:'slider',label:'Gap (px)',defaultValue:15,min:0,max:60},
            imagePosition:{widget:'select',label:'Image Position',options:[{label:'Left',value:'left'},{label:'Right',value:'right'}],defaultValue:'left'}
          }
        },
        border: {
          title:'Border',
          position:3,
          options:{
            borderRadius:{widget:'borderRadiusFour',label:'Rounded Border',defaultValue:{tl:0,tr:0,br:0,bl:0,moreOptions:false,linked:true}}
          }
        }
      },
      values:{
        text:'Edit this text',
        image:'',
        imageWidth:40,
        gap:15,
        imagePosition:'left',
        backgroundColor:'#ffffff',
        containerPadding:'0px',
        borderRadius:{tl:0,tr:0,br:0,bl:0,moreOptions:false,linked:true}
      },
      renderer:{
        Viewer: unlayer.createViewer({
          render:function(values){
            const txt = values.text||'Edit this text';
            const img = values.image||'';
            const imgW = values.imageWidth||40;
            const gap = values.gap||15;
            const pos = values.imagePosition==='right'?'row-reverse':'row';
            const bg = values.backgroundColor||'#fff';
            const pad = parsePaddingValue(values.containerPadding);
            const br = values.borderRadius||{tl:0,tr:0,br:0,bl:0};

            return `<div style="display:flex;flex-direction:${pos};align-items:flex-start;gap:${gap}px;background-color:${bg};padding:${pad.top}px ${pad.right}px ${pad.bottom}px ${pad.left}px;border-radius:${px(br.tl)} ${px(br.tr)} ${px(br.br)} ${px(br.bl)};box-sizing:border-box;">
              <div style="flex:0 0 ${imgW}%;"><img src="${escapeHtml(img)}" style="width:100%;height:auto;border-radius:inherit;" /></div>
              <div style="flex:1 1 auto;min-width:0;">${txt}</div>
            </div>`;
          }
        }),
        exporters:{
          web:function(values){ return this.Viewer.render(values); },
          email:function(values){ return this.Viewer.render(values); }
        },
        head:{css:()=>'',js:()=>''}
      }
    });

    console.log('✅ custom_column (Image + Text) registered');
  });
})();
