document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('nav a');

    function showSection(id) {
        sections.forEach(section => {
            if (section.id === id) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Show the first section by default
    if (sections.length > 0) {
        showSection(sections[0].id);
    }

    // CBM Calculator
    const cbmForm = document.getElementById('cbm-form');
    cbmForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const length = document.getElementById('cbm-length').value;
        const width = document.getElementById('cbm-width').value;
        const height = document.getElementById('cbm-height').value;
        const cbm = (length * width * height) / 1000000;
        document.getElementById('cbm-result').textContent = cbm.toFixed(4) + ' CBM';
    });

    // Length Converter
    const lengthForm = document.getElementById('length-form');
    lengthForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const lengthInput = document.getElementById('length-input').value;
        const lengthFrom = document.getElementById('length-from').value;
        const lengthTo = document.getElementById('length-to').value;

        const conversionRates = {
            m: 1,
            km: 1000,
            cm: 0.01,
            mm: 0.001,
            mi: 1609.34,
            yd: 0.9144,
            ft: 0.3048,
            in: 0.0254
        };

        const lengthInMeters = lengthInput * conversionRates[lengthFrom];
        const convertedLength = lengthInMeters / conversionRates[lengthTo];

        document.getElementById('length-result').textContent = convertedLength.toFixed(4);
    });

    // Mass Converter
    const massForm = document.getElementById('mass-form');
    massForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const massInput = document.getElementById('mass-input').value;
        const massFrom = document.getElementById('mass-from').value;
        const massTo = document.getElementById('mass-to').value;

        const conversionRates = {
            g: 1,
            kg: 1000,
            mg: 0.001,
            t: 1000000,
            lb: 453.592,
            oz: 28.3495
        };

        const massInGrams = massInput * conversionRates[massFrom];
        const convertedMass = massInGrams / conversionRates[massTo];

        document.getElementById('mass-result').textContent = convertedMass.toFixed(4);
    });

    // Currency Converter
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
