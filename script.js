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
            input.placeholder = `Value in ${unit}`;

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

        if (isNaN(sourceValue) || sourceValue === 0) {
            clearInputs(category, sourceUnit);
            return;
        }

        const baseValue = sourceValue * units[category][sourceUnit];

        Object.keys(units[category]).forEach(targetUnit => {
            if (targetUnit !== sourceUnit) {
                const targetInput = document.getElementById(`${category}-${targetUnit}`);
                const targetValue = baseValue / units[category][targetUnit];
                targetInput.value = targetValue.toLocaleString(undefined, { maximumFractionDigits: 4 });
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

    document.getElementById('reset-unit-converter').addEventListener('click', () => {
        clearInputs('length');
        clearInputs('mass');
    });

    // --- CBM Calculator ---
    const cbmForm = document.getElementById('cbm-form');
    cbmForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const getVal = id => parseFloat(document.getElementById(id).value) || 0;
        const getUnit = id => document.getElementById(id).value;

        const length = getVal('cbm-length');
        const width = getVal('cbm-width');
        const height = getVal('cbm-height');
        const packages = getVal('cbm-packages');

        const lengthUnit = getUnit('cbm-length-unit');
        const widthUnit = getUnit('cbm-width-unit');
        const heightUnit = getUnit('cbm-height-unit');

        const toMeters = (val, unit) => {
            if (unit === 'm') return val;
            if (unit === 'in') return val * 0.0254;
            return val * 0.01; // cm
        };

        const lengthInM = toMeters(length, lengthUnit);
        const widthInM = toMeters(width, widthUnit);
        const heightInM = toMeters(height, heightUnit);

        const totalCBM = lengthInM * widthInM * heightInM * packages;
        document.getElementById('cbm-result').textContent = totalCBM.toFixed(4) + ' CBM';
    });

    document.getElementById('reset-cbm-calculator').addEventListener('click', () => {
        document.getElementById('cbm-form').reset();
        document.getElementById('cbm-result').textContent = '0.0000 CBM';
    });

    // --- Currency Converter ---
    const currencyForm = document.getElementById('currency-form');
    currencyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const currencyInput = document.getElementById('currency-input').value;
        const currencyFrom = document.getElementById('currency-from').value;
        const currencyTo = document.getElementById('currency-to').value;

        if (!currencyInput) return;

        if (currencyFrom === currencyTo) {
            document.getElementById('currency-result').textContent = parseFloat(currencyInput).toFixed(2);
            return;
        }

        fetch(`https://api.frankfurter.app/latest?from=${currencyFrom}&to=${currencyTo}&amount=${currencyInput}`)
            .then(response => response.json())
            .then(data => {
                const convertedAmount = data.rates[currencyTo];
                document.getElementById('currency-result').textContent = convertedAmount.toFixed(2);
            })
            .catch(error => {
                console.error('Error fetching currency data:', error);
                document.getElementById('currency-result').textContent = 'Error';
            });
    });

    document.getElementById('reset-currency-converter').addEventListener('click', () => {
        document.getElementById('currency-form').reset();
        document.getElementById('currency-result').textContent = '';
    });
});
