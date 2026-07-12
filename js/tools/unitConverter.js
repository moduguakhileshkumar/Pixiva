export function initUnitConverter() {
  const categorySelect = document.getElementById('unit-category');
  const fromVal = document.getElementById('unit-from-val');
  const toVal = document.getElementById('unit-to-val');
  const fromSelect = document.getElementById('unit-from-select');
  const toSelect = document.getElementById('unit-to-select');

  // Conversions data
  const unitsData = {
    data: {
      label: "Data Capacity",
      base: "byte",
      units: {
        bit: { label: "Bits (b)", factor: 0.125 },
        byte: { label: "Bytes (B)", factor: 1 },
        kb: { label: "Kilobytes (KB)", factor: 1024 },
        mb: { label: "Megabytes (MB)", factor: 1024 * 1024 },
        gb: { label: "Gigabytes (GB)", factor: 1024 * 1024 * 1024 },
        tb: { label: "Terabytes (TB)", factor: 1024 * 1024 * 1024 * 1024 }
      }
    },
    length: {
      label: "Length",
      base: "meter",
      units: {
        mm: { label: "Millimeters (mm)", factor: 0.001 },
        cm: { label: "Centimeters (cm)", factor: 0.01 },
        meter: { label: "Meters (m)", factor: 1 },
        km: { label: "Kilometers (km)", factor: 1000 },
        in: { label: "Inches (in)", factor: 0.0254 },
        ft: { label: "Feet (ft)", factor: 0.3048 },
        yd: { label: "Yards (yd)", factor: 0.9144 },
        mi: { label: "Miles (mi)", factor: 1609.344 }
      }
    },
    mass: {
      label: "Mass / Weight",
      base: "gram",
      units: {
        mg: { label: "Milligrams (mg)", factor: 0.001 },
        gram: { label: "Grams (g)", factor: 1 },
        kg: { label: "Kilograms (kg)", factor: 1000 },
        oz: { label: "Ounces (oz)", factor: 28.3495 },
        lbs: { label: "Pounds (lbs)", factor: 453.592 },
        stone: { label: "Stones (st)", factor: 6350.29 }
      }
    },
    temp: {
      label: "Temperature",
      units: {
        c: { label: "Celsius (°C)" },
        f: { label: "Fahrenheit (°F)" },
        k: { label: "Kelvin (K)" }
      }
    }
  };

  // Change category listener
  categorySelect.addEventListener('change', () => {
    populateDropdowns();
    runConversion();
  });

  // Value change listeners
  fromVal.addEventListener('input', runConversion);
  fromSelect.addEventListener('change', runConversion);
  toSelect.addEventListener('change', runConversion);

  // Initialize
  populateDropdowns();
  runConversion();

  function populateDropdowns() {
    const category = categorySelect.value;
    const data = unitsData[category];
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    Object.keys(data.units).forEach((key, idx) => {
      const optionFrom = document.createElement('option');
      optionFrom.value = key;
      optionFrom.textContent = data.units[key].label;
      fromSelect.appendChild(optionFrom);

      const optionTo = document.createElement('option');
      optionTo.value = key;
      optionTo.textContent = data.units[key].label;
      toSelect.appendChild(optionTo);

      // Set defaults: first item and second item
      if (idx === 0) optionFrom.selected = true;
      if (idx === 1) optionTo.selected = true;
    });

    // Handle single-item fallback (should not happen)
    if (Object.keys(data.units).length === 1) {
      toSelect.appendChild(fromSelect.firstChild.cloneNode(true));
    }
  }

  function runConversion() {
    const category = categorySelect.value;
    const value = parseFloat(fromVal.value);
    
    if (isNaN(value)) {
      toVal.value = '';
      return;
    }

    const fromUnit = fromSelect.value;
    const toUnit = toSelect.value;

    if (fromUnit === toUnit) {
      toVal.value = value;
      return;
    }

    if (category === 'temp') {
      // Temperature custom formulas
      toVal.value = parseFloat(convertTemperature(value, fromUnit, toUnit).toFixed(4));
    } else {
      // Standard factor based multiplication
      const data = unitsData[category];
      const valInBase = value * data.units[fromUnit].factor;
      const convertedVal = valInBase / data.units[toUnit].factor;
      toVal.value = parseFloat(convertedVal.toFixed(6));
    }
  }

  function convertTemperature(value, from, to) {
    let celsius = 0;
    
    // Normalize to Celsius
    if (from === 'c') celsius = value;
    else if (from === 'f') celsius = (value - 32) * 5/9;
    else if (from === 'k') celsius = value - 273.15;

    // Convert from Celsius to Target
    if (to === 'c') return celsius;
    else if (to === 'f') return (celsius * 9/5) + 32;
    else if (to === 'k') return celsius + 273.15;
    
    return value;
  }
}
