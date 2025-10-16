(function () {
  if (typeof unlayer === 'undefined') return;

  console.log('✅ custom-tool.js loaded inside Unlayer iframe');

  // 1️⃣ Register the border radius editor
unlayer.registerPropertyEditor({
  name: 'my_color_picker',
  layout: 'bottom',
  Widget: unlayer.createWidget({
    render(value, updateValue, data) {
      return `
        <input class="value" type="text" value="${value}" />
        <button class="red">Red</button>
        <button class="green">Green</button>
        <button class="blue">Blue</button>
      `;
    },
    mount(node, value, updateValue, data) {
      var input = node.querySelector('.value');
      var redBtn = node.querySelector('.red');
      var greenBtn = node.querySelector('.green');
      var blueBtn = node.querySelector('.blue');

      input.onchange = function (e) {
        updateValue(e.target.value);
      };

      redBtn.onclick = function () {
        updateValue('#FF0000');
      };

      greenBtn.onclick = function () {
        updateValue('#00ff00');
      };

      blueBtn.onclick = function () {
        updateValue('#0000ff');
      };
    },
  }),
});
unlayer.registerTool({
  name: 'my_tool',
  label: 'My Tool',
  icon: 'fa-smile',
  supportedDisplayModes: ['web', 'email'],
  options: {
    default: {
      title: null,
    },
    text: {
      title: 'Color',
      position: 1,
      options: {
        textColor: {
          label: 'Color',
          defaultValue: '#ff0000',
          widget: 'my_color_picker', // custom property editor
        },
      },
    },
  },
  values: {},
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        return `<div style="color: ${values.textColor};">I am a custom tool.</div>`;
      },
    }),
    exporters: {
      web: function (values) {
        return `<div style="color: ${values.textColor};">I am a custom tool.</div>`;
      },
      email: function (values) {
        return `<div style="color: ${values.textColor};">I am a custom tool.</div>`;
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
