(function () {
  if (typeof unlayer === 'undefined') {
    console.warn('❌ Unlayer not found in iframe yet.');
    return;
  }

  console.log('✅ custom-tool.js loaded inside Unlayer iframe');

  // 1️⃣ Register your property editor (simple text input)
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

  // 2️⃣ Wait for Unlayer to finish loading all tools
  unlayer.addEventListener('editor:ready', function () {
    console.log('🧱 Unlayer editor ready — patching Column tool...');

    const tools = unlayer.getRegisteredTools?.() || unlayer.tools || {};
    const columnTool = tools['column'];

    if (!columnTool) {
      console.warn('⚠️ Column tool not found yet.');
      return;
    }

    // Add our new property to its existing ones
    columnTool.properties = {
      ...columnTool.properties,
      border_radius: {
        label: 'Border Radius',
        widget: 'border_radius_editor',
        defaultValue: '0px'
      }
    };

    // Re-register the tool with modified properties
    unlayer.registerTool('column', columnTool);

    console.log('✅ Column tool patched with Border Radius property');
  });
})();
