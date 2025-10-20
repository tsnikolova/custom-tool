(function () {
  if (typeof unlayer === 'undefined') return;

 unlayer.registerTool({
    name: 'custom-column',
    label: 'Advanced Column',
    icon: 'fa-columns',
    supportedDisplayModes: ['email', 'web'],
    options: {
      properties: [
        // Only padding will appear in sidebar
        {
          label: 'General',
          properties: [
            { id: 'padding', type: 'padding', label: 'Padding', defaultValue: { top:0, right:0, bottom:0, left:0 } }
          ]
        }
      ]
    },
    renderer: {
      Viewer: unlayer.createViewer({
        render(values) {
          // Set defaults
          const v = {
            width: values.width || 100,
            align: values.align || 'left',
            backgroundColor: values.backgroundColor || '#ffffff',
            borderWidth: values.borderWidth || 0,
            borderColor: values.borderColor || '#000000',
            borderStyle: values.borderStyle || 'solid',
            borderRadius: values.borderRadius || 0,
            padding: values.padding || { top:0, right:0, bottom:0, left:0 }
          };

          // Return HTML with embedded controls for editing
          return `
            <div style="
              width: ${v.width}%;
              text-align: ${v.align};
              background-color: ${v.backgroundColor};
              padding: ${v.padding.top}px ${v.padding.right}px ${v.padding.bottom}px ${v.padding.left}px;
              border-width: ${v.borderWidth}px;
              border-color: ${v.borderColor};
              border-style: ${v.borderStyle};
              border-radius: ${v.borderRadius}px;
              position: relative;
            ">
              <div style="margin-bottom: 5px; font-weight: bold;">Advanced Column</div>

              <!-- Width -->
              <label>Width: <input type="range" min="10" max="100" value="${v.width}" data-prop="width"></label><br>

              <!-- Background -->
              <label>Background: <input type="color" value="${v.backgroundColor}" data-prop="backgroundColor"></label><br>

              <!-- Border -->
              <label>Border Width: <input type="number" value="${v.borderWidth}" data-prop="borderWidth"></label><br>
              <label>Border Color: <input type="color" value="${v.borderColor}" data-prop="borderColor"></label><br>
              <label>Border Radius: <input type="range" min="0" max="50" value="${v.borderRadius}" data-prop="borderRadius"></label><br>

              <!-- Padding -->
              <label>Padding Top: <input type="number" value="${v.padding.top}" data-prop="paddingTop"></label>
              <label>Padding Right: <input type="number" value="${v.padding.right}" data-prop="paddingRight"></label>
              <label>Padding Bottom: <input type="number" value="${v.padding.bottom}" data-prop="paddingBottom"></label>
              <label>Padding Left: <input type="number" value="${v.padding.left}" data-prop="paddingLeft"></label>
            </div>

            <script>
              const container = document.currentScript.parentElement;
              const inputs = container.querySelectorAll('input[data-prop]');
              inputs.forEach(input => {
                input.addEventListener('input', e => {
                  const prop = e.target.getAttribute('data-prop');
                  const val = e.target.type === 'range' || e.target.type === 'number' ? Number(e.target.value) : e.target.value;

                  switch(prop) {
                    case 'width': values.width = val; break;
                    case 'backgroundColor': values.backgroundColor = val; break;
                    case 'borderWidth': values.borderWidth = val; break;
                    case 'borderColor': values.borderColor = val; break;
                    case 'borderRadius': values.borderRadius = val; break;
                    case 'paddingTop': values.padding.top = val; break;
                    case 'paddingRight': values.padding.right = val; break;
                    case 'paddingBottom': values.padding.bottom = val; break;
                    case 'paddingLeft': values.padding.left = val; break;
                  }

                  // force re-render
                  container.style.width = values.width + '%';
                  container.style.backgroundColor = values.backgroundColor;
                  container.style.borderWidth = values.borderWidth + 'px';
                  container.style.borderColor = values.borderColor;
                  container.style.borderRadius = values.borderRadius + 'px';
                  container.style.padding = values.padding.top + 'px ' + values.padding.right + 'px ' + values.padding.bottom + 'px ' + values.padding.left + 'px';
                });
              });
            </script>
          `;
        }
      }),
      exporters: {
        web(values) {
          return `<div style="
            width: ${values.width || 100}%;
            text-align: ${values.align || 'left'};
            background-color: ${values.backgroundColor || '#ffffff'};
            padding: ${values.padding?.top || 0}px ${values.padding?.right || 0}px ${values.padding?.bottom || 0}px ${values.padding?.left || 0}px;
            border-width: ${values.borderWidth || 0}px;
            border-color: ${values.borderColor || '#000'};
            border-style: ${values.borderStyle || 'solid'};
            border-radius: ${values.borderRadius || 0}px;
          ">I am a custom tool.</div>`;
        },
        email(values) {
          return `<div style="
            width: ${values.width || 100}%;
            text-align: ${values.align || 'left'};
            background-color: ${values.backgroundColor || '#ffffff'};
            padding: ${values.padding?.top || 0}px ${values.padding?.right || 0}px ${values.padding?.bottom || 0}px ${values.padding?.left || 0}px;
            border-width: ${values.borderWidth || 0}px;
            border-color: ${values.borderColor || '#000'};
            border-style: ${values.borderStyle || 'solid'};
            border-radius: ${values.borderRadius || 0}px;
          ">I am a custom tool.</div>`;
        }
      },
      head: { css() {}, js() {} }
    }
  });

  console.log('✅ Advanced Column with in-renderer mini editor registered');
})();
