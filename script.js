const history = document.getElementById("historyAreaBox");
const searchButtonNow = document.getElementById("searchButtonNow");
const xyz = document.getElementById("cityInputBox");
const consoleBox = document.getElementById("consoleBlackScreen");

// 👉 FIX 1: Console logger (you missed this)
function logToScreen(message) {
    const p = document.createElement("p");
    p.textContent = message;
    consoleBox.appendChild(p);

    // auto scroll
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

// 👉 MAIN FUNCTION
async function weatherData(city) {
    const display = document.getElementById("weatherDisplayResult");

    display.innerHTML = "<p>Loading...</p>";

    logToScreen("Sync Start");

    Promise.resolve().then(() => logToScreen("Promise.then (Microtask)"));
    setTimeout(() => logToScreen("setTimeout (Macrotask)"), 0);

    try {
        const apiKey = "0201f292126f678a397019e6aabd74df"; // ⚠️ replace this
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        logToScreen("[ASYNC] Data received");

        display.innerHTML = `
            <p><b>City:</b> ${data.name}, ${data.sys.country}</p>
            <p><b>Temp:</b> ${data.main.temp}°C</p>
            <p><b>Weather:</b> ${data.weather[0].main}</p>
            <p><b>Humidity:</b> ${data.main.humidity}%</p>
            <p><b>Wind:</b> ${data.wind.speed} m/s</p>
        `;

        // 👉 FIX 2: Avoid duplicates properly
        let alreadyExist = false;

        const items = history.querySelectorAll("span");

        items.forEach((item) => {
            if (item.textContent.toLowerCase() === city.toLowerCase()) {
                alreadyExist = true;
            }
        });

        if (!alreadyExist) {
            const his = document.createElement("span");
            his.textContent = city;
            his.className = "span";

            history.appendChild(his);

            his.onclick = () => {
                weatherData(his.textContent);
            };
        }

    } catch (err) {
        display.innerHTML = "<p style='color:red'>City not found</p>";
        logToScreen("Error: " + err.message);
    }

    logToScreen("Sync End");

    xyz.value = "";
}

// 👉 FIX 3: Button click
searchButtonNow.addEventListener("click", () => {
    const city = xyz.value.trim();

    if (city === "") {
        alert("Enter city name");
        return;
    }

    weatherData(city);
});

// 👉 FIX 4: Enter key support (IMPORTANT UX)
xyz.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchButtonNow.click();
    }
});