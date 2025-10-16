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

  console.log('✅ Column+ tool registered');
})();
