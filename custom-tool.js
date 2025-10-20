(function () {
  if (typeof unlayer === 'undefined') return;

 unlayer.registerTool({
    name: 'custom-column',
    label: 'Advanced Column',
    icon: 'fa-smile',
    supportedDisplayModes: ['email'],
    options: {
  properties: [
    {
      label: 'Column',
      properties: [
        { id: 'width', type: 'slider', label: 'Width', ... },
        { id: 'align', type: 'select', label: 'Alignment', options: [...] }
      ]
    },
    {
      label: 'Background',
      properties: [
        { id: 'backgroundColor', type: 'color', label: 'Background Color', ... },
        { id: 'backgroundImage', type: 'image', label: 'Background Image', ... }
      ]
    },
    {
      label: 'Borders',
      properties: [
        { id: 'borderWidth', type: 'text', label: 'Border Width', ... },
        { id: 'borderColor', type: 'color', label: 'Border Color', ... },
        { id: 'borderStyle', type: 'select', label: 'Border Style', ... },
        { id: 'borderRadius', type: 'slider', label: 'Border Radius', ... }
      ]
    },
    {
      label: 'Padding',
      properties: [
        { id: 'padding', type: 'padding', label: 'Padding', ... }
      ]
    }
  ]
},
    renderer: {
      Viewer: unlayer.createViewer({
        render(values) {
          const style = `
            border-radius: ${values.borderRadius || 0}px;
            background-color: ${values.backgroundColor || '#3AAEE0'};
            width: ${values.width || 100}%;
            padding: ${values.padding?.top || 0}px ${values.padding?.right || 0}px ${values.padding?.bottom || 0}px ${values.padding?.left || 0}px;
            border-width: ${values.borderWidth || 0}px;
            border-color: ${values.borderColor || '#000'};
            border-style: ${values.borderStyle || 'solid'};
          `;
          return `<div style="${style}">I am a custom tool.</div>`;
        },
      }),
      exporters: {
        web(values) {
          const style = `
            border-radius: ${values.borderRadius || 0}px;
            background-color: ${values.backgroundColor || '#3AAEE0'};
            width: ${values.width || 100}%;
            padding: ${values.padding?.top || 0}px ${values.padding?.right || 0}px ${values.padding?.bottom || 0}px ${values.padding?.left || 0}px;
            border-width: ${values.borderWidth || 0}px;
            border-color: ${values.borderColor || '#000'};
            border-style: ${values.borderStyle || 'solid'};
          `;
          return `<div style="${style}">I am a custom tool.</div>`;
        },
        email(values) {
          const style = `
            border-radius: ${values.borderRadius || 0}px;
            background-color: ${values.backgroundColor || '#3AAEE0'};
            width: ${values.width || 100}%;
            padding: ${values.padding?.top || 0}px ${values.padding?.right || 0}px ${values.padding?.bottom || 0}px ${values.padding?.left || 0}px;
            border-width: ${values.borderWidth || 0}px;
            border-color: ${values.borderColor || '#000'};
            border-style: ${values.borderStyle || 'solid'};
          `;
          return `<div style="${style}">I am a custom tool.</div>`;
        }
      },
      head: {
        css(values) { return ''; },
        js(values) { return ''; }
      }
    },
  });

  console.log('✅ Advanced Column tool registered (standalone, with borderRadius slider)');

})();
