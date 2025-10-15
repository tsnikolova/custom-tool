(function () {
  if (typeof unlayer === 'undefined') {
    console.warn('❌ Unlayer not found in iframe yet.');
    return;
  }

  console.log('✅ custom-tool.js loaded inside Unlayer iframe');

  // 1️⃣ Register your new property editor (simple input)
  unlayer.registerPropertyEditor({
    name: 'border_radius_editor',
    Widget: {
      render(value) {
        const val = value || '0px';
        return `<input 
          type="text" 
          value="${val}" 
          style="width:100%;padding:6px;border:1px solid #ccc;border-radius:4px;" 
        />`;
      },
      mount(node, value, updateValue) {
        const input = node.querySelector('input');
        input.addEventListener('input', (e) => updateValue(e.target.value));
      },
      unmount() {}
    }
  });

  console.log('✅ border_radius_editor registered');

  // 2️⃣ Patch the existing "column" tool
  const patchColumnTool = () => {
    const columnTool = unlayer.getToolByName('column');
    if (!columnTool) {
      console.warn('⏳ Column tool not ready yet, retrying...');
      setTimeout(patchColumnTool, 500);
      return;
    }

    console.log('✅ Column tool found, patching...');

    // Add new property to the Column tool
    const properties = columnTool.properties || {};
    properties.border_radius = {
      label: 'Border Radius',
      widget: 'border_radius_editor',
      defaultValue: '0px'
    };

    // Apply it back
    columnTool.properties = properties;

    // Ensure live visual update
    const oldRender = columnTool.render;
    columnTool.render = function (values) {
      const el = oldRender ? oldRender(values) : '<div></div>';
      const borderRadius = values.border_radius || '0px';
      const wrapper = document.createElement('div');
      wrapper.innerHTML = el;
      wrapper.firstChild.style.borderRadius = borderRadius;
      return wrapper.innerHTML;
    };

    unlayer.registerTool('column', columnTool);
    console.log('✅ Column tool patched with Border Radius');
  };

  patchColumnTool();
})();
