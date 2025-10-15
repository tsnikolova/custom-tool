(function () {
  // Wait until unlayer is available in the iframe
  if (typeof unlayer === 'undefined') {
    console.error('Unlayer not found inside iframe.');
    return;
  }

  console.log('✅ custom-tool.js loaded inside Unlayer iframe');

  // Register a custom property editor for Border Radius
  unlayer.registerPropertyEditor({
    name: 'border_radius_editor',
    Widget: {
      render: function (value) {
        var val = value || '0px';
        return '<input type="text" style="width:100%;padding:6px;" value="' + val + '" placeholder="e.g. 8px" />';
      },
      mount: function (node, value, updateValue) {
        var input = node.querySelector('input');
        input.addEventListener('input', function (e) {
          updateValue(e.target.value);
          var selected = unlayer.getSelected();
          if (selected) {
            selected.setStyle('border-radius', e.target.value);
          }
        });
      },
      unmount: function () { }
    }
  });

  console.log('✅ border_radius_editor registered');
})();
