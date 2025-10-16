(function () {
  if (typeof unlayer === 'undefined') return;

  console.log('✅ custom-tool.js loaded inside Unlayer iframe');

  // 1️⃣ Register the border radius editor
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

  // 2️⃣ Register the custom Column+ tool
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
        // ✅ Return proper HTML string
        return `
          <div style="
            border: 1px solid #ccc;
            border-radius: ${radius};
            padding: 10px;
            min-height: 50px;
            box-sizing: border-box;
          ">
            <div style="text-align:center;color:#999;font-size:13px;">
              Drop content here
            </div>
          </div>
        `;
      },
      exporters: {
        email({ values }) {
          const radius = values.border_radius || '0px';
          return `
            <div style="border:1px solid #ccc;border-radius:${radius};padding:10px;">
              <div>Drop content here</div>
            </div>
          `;
        }
      },
      head: '',
    },
  });

  console.log('✅ Column+ tool registered');
})();(function () {
  if (typeof unlayer === 'undefined') return;

  console.log('✅ custom-tool.js loaded inside Unlayer iframe');

  // 1️⃣ Register the border radius editor
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

  // 2️⃣ Register the custom Column+ tool
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
        // ✅ Return proper HTML string
        return `
          <div style="
            border: 1px solid #ccc;
            border-radius: ${radius};
            padding: 10px;
            min-height: 50px;
            box-sizing: border-box;
          ">
            <div style="text-align:center;color:#999;font-size:13px;">
              Drop content here
            </div>
          </div>
        `;
      },
      exporters: {
        email({ values }) {
          const radius = values.border_radius || '0px';
          return `
            <div style="border:1px solid #ccc;border-radius:${radius};padding:10px;">
              <div>Drop content here</div>
            </div>
          `;
        }
      },
      head: '',
    },
  });

  console.log('✅ Column+ tool registered');
})();
