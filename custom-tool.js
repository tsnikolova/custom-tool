(function () {
  function patchColumn() {
    try {
      const editor = unlayer || window.unlayer;
      if (!editor || !editor.registerTool) {
        console.warn('⏳ Waiting for Unlayer core...');
        return setTimeout(patchColumn, 500);
      }

      console.log('✅ custom-tool.js loaded inside Unlayer iframe');

      // Register property editor once
      editor.registerPropertyEditor({
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

      // Instead of patching, redefine column tool options
      const oldColumn = editor.tools?.column;
      if (!oldColumn) {
        console.warn('⏳ Column tool not yet registered, retrying...');
        return setTimeout(patchColumn, 500);
      }

      console.log('✅ Column tool found, extending...');

      const newColumn = {
        ...oldColumn,
        properties: {
          ...(oldColumn.properties || {}),
          border_radius: {
            label: 'Border Radius',
            widget: 'border_radius_editor',
            defaultValue: '0px'
          }
        },
        renderer: {
          ...oldColumn.renderer,
          Viewer({ values }) {
            const borderRadius = values.border_radius || '0px';
            // Use Unlayer's wrapper so rendering continues normally
            return `
              <div style="border-radius:${borderRadius};overflow:hidden;">
                ${oldColumn.renderer?.Viewer
                  ? oldColumn.renderer.Viewer({ values })
                  : ''}
              </div>
            `;
          }
        }
      };

      editor.registerTool('column', newColumn);

      console.log('✅ Column tool patched successfully');
    } catch (err) {
      console.error('❌ Error patching Column:', err);
      setTimeout(patchColumn, 1000);
    }
  }

  patchColumn();
})();
