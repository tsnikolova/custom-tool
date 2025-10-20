(function () {
  unlayer.onLoad(function() {
  if (typeof unlayer === 'undefined') return;

  const buttonTool = unlayer.getTool('button'); // safe now
  const columnTool = unlayer.getTool('column'); // safe now

  if (!buttonTool || !buttonTool.options || !buttonTool.options.properties) {
    console.warn('Button tool or its properties not found!');
    return;
  }

  // --- Step 2: Extract the borderRadius property from Button ---
  var borderRadiusProp = buttonTool.options.properties.find(
    (prop) => prop.id === 'borderRadius'
  );

  if (!borderRadiusProp) {
    console.warn('borderRadius property not found in Button tool!');
    return;
  }

  // --- Step 3: Get the built-in Column tool ---
  var columnTool = unlayer.getTool('column');

  if (!columnTool || !columnTool.options || !columnTool.options.properties) {
    console.warn('Column tool or its properties not found!');
    return;
  }

  // --- Step 4: Clone the column properties ---
  var newColumnProps = JSON.parse(JSON.stringify(columnTool.options.properties));

  // --- Step 5: Find the Borders group ---
  var bordersGroup = newColumnProps.find((group) => group.label === 'Borders');

  if (bordersGroup && bordersGroup.properties) {
    // Add the Button-style borderRadius property
    bordersGroup.properties.push(borderRadiusProp);
  } else {
    // If no Borders group, create one
    newColumnProps.push({
      label: 'Borders',
      properties: [borderRadiusProp],
    });
  }

  // --- Step 6: Register the new custom column tool ---
  unlayer.registerTool({
    name: 'custom-column',       // currently shows separately
    label: 'Advanced Column',    // sidebar name
    icon: columnTool.icon,       // reuse original icon
    supportedDisplayModes: columnTool.supportedDisplayModes,
    options: {
      ...columnTool.options,
      properties: newColumnProps,
    },
  });

  console.log('✅ Advanced Column tool registered with Button-style borderRadius!');
  }
})();
