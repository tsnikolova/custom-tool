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
            {
              id: 'backgroundColor',
              type: 'color',
              label: 'Background Color',
              defaultValue: '#ffffff'
            },
            {
              id: 'width',
              type: 'slider',
              label: 'Width',
              min: 10,
              max: 100,
              defaultValue: 100,
              unit: '%'
            },
            {
              id: 'padding',
              type: 'padding',
              label: 'Padding',
              defaultValue: { top: 0, right: 0, bottom: 0, left: 0 }
            }
          ]
        },
        {
          label: 'Borders',
          properties: [
            {
              id: 'borderWidth',
              type: 'text',
              label: 'Border Width',
              defaultValue: '0px'
            },
            {
              id: 'borderColor',
              type: 'color',
              label: 'Border Color',
              defaultValue: '#000000'
            },
            {
              id: 'borderStyle',
              type: 'select',
              label: 'Border Style',
              options: [
                { label: 'solid', value: 'solid' },
                { label: 'dashed', value: 'dashed' },
                { label: 'dotted', value: 'dotted' },
                { label: 'none', value: 'none' }
              ],
              defaultValue: 'solid'
            },
            {
              id: 'borderRadius',
              type: 'slider',
              label: 'Border Radius',
              min: 0,
              max: 50,
              defaultValue: 4,
              unit: 'px'
            }
          ]
        }
      ]
    }
  });

  console.log('✅ Advanced Column tool registered (standalone, with borderRadius slider)');

})();
