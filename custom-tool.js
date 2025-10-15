(function () {
  if (typeof unlayer === 'undefined') {
    console.warn('❌ Unlayer not found in iframe yet.');
    return;
  }

  console.log('✅ Custom tool script loaded.');

  // --- 1. Register property editor (simple input for border radius)
  unlayer.registerPropertyEditor({
    name: 'border_radius_editor',
    Widget: {
      render(value) {
        var val = value || '0px';
        return '<input type="text" value="' + val + '" style="width:100%;padding:6px;border:1px solid #ccc;border-radius:4px;" />';
      },
      mount(node, value, updateValue) {
        var input = node.querySelector('input');
        input.addEventListener('input', function (e) {
          updateValue(e.target.value);
        });
      },
      unmount() {}
    }
  });

  // --- 2. Register new property for column blocks
  unlayer.registerTool({
    name: 'custom_column',
    label: 'Column+',
    icon: 'fa-columns',
    supportedDisplayModes: ['email'],
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
        const borderRadius = values.border_radius || '0px';
        return `
          <div style="border-radius:${borderRadius};padding:10px;border:1px solid #ccc;">
            <div class="inner-column">Your column content</div>
          </div>
        `;
      },
      exporters: {
        email: function (values) {
          const borderRadius = values.border_radius || '0px';
          return {
            type: 'container',
            values: {
              border_radius: borderRadius
            }
          };
        }
      }
    }
  });

  console.log('✅ Custom column tool registered.');
})();
