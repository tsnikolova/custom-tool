(function () {
  if (typeof unlayer === 'undefined') return;

  console.log('✅ custom-tool.js loaded inside Unlayer iframe');

  // 1️⃣ Register the border radius editor
unlayer.registerPropertyEditor({
  name: 'my_rounded-border',
  layout: 'bottom',
  Widget: unlayer.createWidget({
    render(value, updateValue, data) {
      return `
        <input class="value" type="text" value="${value}" />
      `;
    },
    mount(node, value, updateValue, data) {
      var input = node.querySelector('.value');
     

      input.onchange = function (e) {
        updateValue(e.target.value);
      };

      
    },
  }),
});
unlayer.registerTool({
  name: 'my_tool',
  label: 'My Tool',
  icon: 'fa-smile',
  supportedDisplayModes: ['web', 'email'],
  properties:{
  buttonColors: {
          value: {
            color: '#FFFFFF',
            backgroundColor: '#3AAEE0',
            hoverColor: '#FFFFFF',
            hoverBackgroundColor: '#3AAEE0',
          },
        },
  }
  options: {
    default: {
      title: null,
    },
    text: {
      title: 'Border Radius',
      position: 1,
      options: {
        borderRadius: {
          label: 'Border Radius',
          defaultValue: '0',
          widget: 'my_rounded-border', // custom property editor
        },
		
      },
    },
  },
  values: {},
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        return `<div style="border-radius: ${values.borderRadius};">I am a custom tool.</div>`;
      },
    }),
    exporters: {
      web: function (values) {
        return `<div style="border-radius: ${values.borderRadius};">I am a custom tool.</div>`;
      },
      email: function (values) {
        return `<div style="border-radius: ${values.borderRadius};">I am a custom tool.</div>`;
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
