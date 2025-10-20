(function () {
  if (typeof unlayer === 'undefined') return;

  unlayer.registerTool({
    name: 'custom-column',
    label: 'Advanced Column',
    icon: 'fa-columns',
    supportedDisplayModes: ['email', 'web'],
    options: {
      properties: [
        {
          label: 'Column',
          properties: [
            { id: 'width', type: 'slider', label: 'Width', min: 10, max: 100, defaultValue: 100, unit: '%' },
            { id: 'align', type: 'select', label: 'Alignment', options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' }
              ], defaultValue: 'left'
            }
          ]
        },
        {
          label: 'Background',
          properties: [
            { id: 'backgroundColor', type: 'color', label: 'Background Color', defaultValue: '#ffffff' },
            { id: 'backgroundImage', type: 'image', label: 'Background Image', defaultValue: '' }
          ]
        },
        {
          label: 'Borders',
          properties: [
            { id: 'borderWidth', type: 'text', label: 'Border Width', defaultValue: '0px' },
            { id: 'borderColor', type: 'color', label: 'Border Color', defaultValue: '#000000' },
            { id: 'borderStyle', type: 'select', label: 'Border Style', options: [
                { label: 'solid', value: 'solid' },
                { label: 'dashed', value: 'dashed' },
                { label: 'dotted', value: 'dotted' },
                { label: 'none', value: 'none' }
              ], defaultValue: 'solid'
            },
            { id: 'borderRadius', type: 'slider', label: 'Border Radius', min:0, max:50, defaultValue: 4, unit: 'px' }
          ]
        },
        {
          label: 'Padding',
          properties: [
            { id: 'padding', type: 'padding', label: 'Padding', defaultValue: { top: 0, right: 0, bottom: 0, left: 0 } }
          ]
        }
      ]
    },
    renderer: {
      Viewer: unlayer.createViewer({
        render(values) {
          const style = `
            width: ${values.width || 100}%;
            text-align: ${values.align || 'left'};
            background-color: ${values.backgroundColor || '#ffffff'};
            background-image: url(${values.backgroundImage || ''});
            padding: ${values.padding?.top || 0}px ${values.padding?.right || 0}px ${values.padding?.bottom || 0}px ${values.padding?.left || 0}px;
            border-width: ${values.borderWidth || '0px'};
            border-color: ${values.borderColor || '#000'};
            border-style: ${values.borderStyle || 'solid'};
            border-radius: ${values.borderRadius || 0}px;
          `;
          return `<div style="${style}">I am a custom tool.</div>`;
        }
      }),
      exporters: {
        web(values) {
          const style = `
            width: ${values.width || 100}%;
            text-align: ${values.align || 'left'};
            background-color: ${values.backgroundColor || '#ffffff'};
            background-image: url(${values.backgroundImage || ''});
            padding: ${values.padding?.top || 0}px ${values.padding?.right || 0}px ${values.padding?.bottom || 0}px ${values.padding?.left || 0}px;
            border-width: ${values.borderWidth || '0px'};
            border-color: ${values.borderColor || '#000'};
            border-style: ${values.borderStyle || 'solid'};
            border-radius: ${values.borderRadius || 0}px;
          `;
          return `<div style="${style}">I am a custom tool.</div>`;
        },
        email(values) {
          const style = `
            width: ${values.width || 100}%;
            text-align: ${values.align || 'left'};
            background-color: ${values.backgroundColor || '#ffffff'};
            background-image: url(${values.backgroundImage || ''});
            padding: ${values.padding?.top || 0}px ${values.padding?.right || 0}px ${values.padding?.bottom || 0}px ${values.padding?.left || 0}px;
            border-width: ${values.borderWidth || '0px'};
            border-color: ${values.borderColor || '#000'};
            border-style: ${values.borderStyle || 'solid'};
            border-radius: ${values.borderRadius || 0}px;
          `;
          return `<div style="${style}">I am a custom tool.</div>`;
        }
      },
      head: {
        css(values){ return ''; },
        js(values){ return ''; }
      }
    }
  });

  console.log('✅ Advanced Column tool registered with full property groups');

})();
