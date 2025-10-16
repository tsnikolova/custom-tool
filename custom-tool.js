(function () {
  if (typeof unlayer === 'undefined') return;

  console.log('✅ custom-tool.js loaded inside Unlayer iframe');

  unlayer.registerPropertyEditor({
    name: 'border_radius_editor',
    Widget: {
      render(value) {
        const val = value || '0px';
        return `<input type="text" value="${val}" style="width:100%;padding:6px;border:1px solid #ccc;border-radius:4px;" />`;
      },
      mount(node, value, updateValue) {
        const input = node.querySelector('input');
        input.addEventListener('input', (e) => updateValue(e.target.value));
      },
      unmount() {}
    }
  });

  console.log('✅ border_radius_editor registered');

  unlayer.registerTool({
    name: 'column_plus',
    label: 'Column+',
    icon: 'fa-columns',
    supportedDisplayModes: ['email', 'web'],
    options: {
      border_radius: {
        label: 'Border Radius',
        widget: 'border_radius_editor',
        defaultValue: '0px'
      }
    },
    values: {},
    renderer: {
      Viewer({ values }) {
        const radius = values.border_radius || '0px';
        return unlayer.createElement('div', {
          style: {
            border: '1px solid #ccc',
            borderRadius: radius,
            padding: '10px',
            minHeight: '50px',
          },
          children: [
            unlayer.createElement('div', {
              style: { textAlign: 'center', color: '#999', fontSize: '13px' },
              children: 'Drop content here',
            }),
          ],
        });
      },
    },
  });

  console.log('✅ Column+ tool registered');
})();
