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
  name: 'my_tool',
  label: 'My Tool',
  icon: 'fa-smile',
  supportedDisplayModes: ['web', 'email'],
  options: {},
  values: {},
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        return '<div>I am a custom tool.</div>';
      },
    }),
    exporters: {
      web: function (values) {
        return '<div>I am a custom tool.</div>';
      },
      email: function (values) {
        return '<div>I am a custom tool.</div>';
      },
    },
    head: {
      css: function (values) {},
      js: function (values) {},
    },
  },
});

  console.log('✅ Column+ tool registered');
})();
