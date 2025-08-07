let countdowns = [];
let countdownIdCounter = 0;

// Load saved countdowns from localStorage
function loadCountdowns() {
    const saved = localStorage.getItem('countdowns');
    if (saved) {
        countdowns = JSON.parse(saved);
        countdownIdCounter = countdowns.length > 0 ? Math.max(...countdowns.map(c => c.id)) + 1 : 0;
        renderCountdowns();
    }
}

// Save countdowns to localStorage
function saveCountdowns() {
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
}

// Add new countdown
function addCountdown() {
    const startDateInput = document.getElementById("startDate").value;
    const daysToAdd = parseInt(document.getElementById("daysToAdd").value);
    const name = document.getElementById("countdownName").value;

    if (!startDateInput || !daysToAdd) {
        alert("Please fill in both start date and days to add");
        return;
    }

    const startDate = new Date(startDateInput);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + daysToAdd);

    const countdown = {
        id: countdownIdCounter++,
        name: name || `${daysToAdd} days from ${startDate.toLocaleDateString()}`,
        startDate: startDate.toISOString(),
        targetDate: targetDate.getTime(),
        daysAdded: daysToAdd
    };

    countdowns.push(countdown);
    saveCountdowns();
    renderCountdowns();

    // Clear inputs
    document.getElementById("startDate").value = "";
    document.getElementById("daysToAdd").value = "";
    document.getElementById("countdownName").value = "";
}

// Delete countdown
function deleteCountdown(id) {
    countdowns = countdowns.filter(countdown => countdown.id !== id);
    saveCountdowns();
    renderCountdowns();
}

// Update all countdowns
function updateAllCountdowns() {
    countdowns.forEach(countdown => {
        const now = new Date().getTime();
        const distance = countdown.targetDate - now;

        const countdownElement = document.getElementById(`countdown-${countdown.id}`);
        if (!countdownElement) return;

        if (distance < 0) {
            countdownElement.querySelector('.countdown-display').innerHTML =
                '<span class="finished">🎉 Finished!</span>';
            return;
        }

        const totalDays = Math.floor(distance / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / 1000 / 60) % 60);
        const seconds = Math.floor((distance / 1000) % 60);

        countdownElement.querySelector('.countdown-display').innerHTML = `
            <div class="time-units">
                <span class="time-unit">
                    <span class="number">${weeks}</span>
                    <span class="label">Weeks</span>
                </span>
                <span class="time-unit">
                    <span class="number">${days}</span>
                    <span class="label">Days</span>
                </span>
                <span class="time-unit">
                    <span class="number">${hours}</span>
                    <span class="label">Hours</span>
                </span>
                <span class="time-unit">
                    <span class="number">${minutes}</span>
                    <span class="label">Minutes</span>
                </span>
                <span class="time-unit">
                    <span class="number">${seconds}</span>
                    <span class="label">Seconds</span>
                </span>
            </div>
            <div class="total-days">Total Days: ${totalDays}</div>
        `;
    });
}

// Render all countdowns
function renderCountdowns() {
    const container = document.getElementById('countdowns-list');

    if (countdowns.length === 0) {
        container.innerHTML = '<p class="no-countdowns">No active countdowns. Add one above!</p>';
        return;
    }

    container.innerHTML = countdowns.map(countdown => {
        const targetDate = new Date(countdown.targetDate);
        return `
            <div class="countdown-item" id="countdown-${countdown.id}">
                <div class="countdown-header">
                    <h3>${countdown.name}</h3>
                    <button class="delete-btn" onclick="deleteCountdown(${countdown.id})">×</button>
                </div>
                <div class="countdown-info">
                    <p>Target: ${targetDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</p>
                </div>
                <div class="countdown-display"></div>
            </div>
        `;
    }).join('');
}

// Initialize
loadCountdowns();
setInterval(updateAllCountdowns, 1000);
updateAllCountdowns();