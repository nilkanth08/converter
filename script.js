document.addEventListener('DOMContentLoaded', () => {
    // --- Unit Definitions ---
    const units = {
        length: {
            mm: 1,
            cm: 10,
            m: 1000,
            in: 25.4,
        },
        mass: {
            g: 1,
            kg: 1000,
            oz: 28.3495,
            lb: 453.592,
        }
    };

    // --- Real-time Unit Converter ---
    function createUnitConverters(category, containerId) {
        const container = document.getElementById(containerId);
        const unitDefs = units[category];

        Object.keys(unitDefs).forEach(unit => {
            const inputRow = document.createElement('div');
            inputRow.classList.add('input-row');

            const input = document.createElement('input');
            input.type = 'number';
            input.id = `${category}-${unit}`;
            input.dataset.unit = unit;
            input.dataset.category = category;
            input.placeholder = `Enter value in ${unit}`;

            const label = document.createElement('span');
            label.textContent = unit;

            inputRow.appendChild(input);
            inputRow.appendChild(label);
            container.appendChild(inputRow);

            input.addEventListener('input', handleUnitConversion);
        });
    }

    function handleUnitConversion(event) {
        const sourceInput = event.target;
        const category = sourceInput.dataset.category;
        const sourceUnit = sourceInput.dataset.unit;
        const sourceValue = parseFloat(sourceInput.value);

        if (isNaN(sourceValue)) {
            clearInputs(category, sourceUnit);
            return;
        }

        const baseValue = sourceValue * units[category][sourceUnit];

        Object.keys(units[category]).forEach(targetUnit => {
            if (targetUnit !== sourceUnit) {
                const targetInput = document.getElementById(`${category}-${targetUnit}`);
                const targetValue = baseValue / units[category][targetUnit];
                targetInput.value = targetValue.toFixed(4);
            }
        });
    }

    function clearInputs(category, exceptUnit) {
        Object.keys(units[category]).forEach(unit => {
            if (unit !== exceptUnit) {
                document.getElementById(`${category}-${unit}`).value = '';
            }
        });
    }

    createUnitConverters('length', 'length-converters');
    createUnitConverters('mass', 'mass-converters');

    // --- CBM Calculator ---
    const cbmForm = document.getElementById('cbm-form');
    cbmForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const getVal = id => parseFloat(document.getElementById(id).value);
        const getUnit = id => document.getElementById(id).value;

        const length = getVal('cbm-length');
        const width = getVal('cbm-width');
        const height = getVal('cbm-height');
        const packages = getVal('cbm-packages');

        const lengthUnit = getUnit('cbm-length-unit');
        const widthUnit = getUnit('cbm-width-unit');
        const heightUnit = getUnit('cbm-height-unit');

        const toMeters = (val, unit) => val * (units.length[unit] / 1000);

        const lengthInM = toMeters(length, lengthUnit === 'm' ? 'm' : (lengthUnit === 'in' ? 'in' : 'cm'));
        const widthInM = toMeters(width, widthUnit === 'm' ? 'm' : (widthUnit === 'in' ? 'in' : 'cm'));
        const heightInM = toMeters(height, heightUnit === 'm' ? 'm' : (heightUnit === 'in' ? 'in' : 'cm'));

        const totalCBM = lengthInM * widthInM * heightInM * packages;
        document.getElementById('cbm-result').textContent = totalCBM.toFixed(4) + ' CBM';
    });


    // --- Currency Converter ---
    const currencyForm = document.getElementById('currency-form');
    currencyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const currencyInput = document.getElementById('currency-input').value;
        const currencyFrom = document.getElementById('currency-from').value;
        const currencyTo = document.getElementById('currency-to').value;

        if (currencyFrom === currencyTo) {
            document.getElementById('currency-result').textContent = parseFloat(currencyInput).toFixed(2);
            return;
        }

        fetch(`https://api.frankfurter.app/latest?from=${currencyFrom}&to=${currencyTo}`)
            .then(response => response.json())
            .then(data => {
                const rate = data.rates[currencyTo];
                const convertedAmount = currencyInput * rate;
                document.getElementById('currency-result').textContent = convertedAmount.toFixed(2);
            })
            .catch(error => {
                console.error('Error fetching currency data:', error);
                document.getElementById('currency-result').textContent = 'Error';
            });
    });
});
