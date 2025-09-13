// --- SETTINGS ---
const API_KEY = "54e9fa50b7c99e471e715c740dc958af"; // <— put your key here
const DEFAULTS = [
  { name: "Toronto", lat: 43.6532, lon: -79.3832 },
];

// --- MAP ---
const map = L.map("map").setView([43.6532, -79.3832], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// --- UI elements ---
const input = document.getElementById("locationInput");
const addBtn = document.getElementById("addBtn");
const savedList = document.getElementById("savedLocations");

// --- Local Storage helpers ---
function loadLocations() {
  const stored = localStorage.getItem("locations");
  return stored ? JSON.parse(stored) : DEFAULTS;
}
function saveLocations(locations) {
  localStorage.setItem("locations", JSON.stringify(locations));
}

// --- Weather marker creation ---
function addMarker(loc) {
  L.marker([loc.lat, loc.lon])
    .addTo(map)
    .bindPopup(`${loc.name}`);
}

// --- Render list ---
function renderLocations() {
  savedList.innerHTML = "";
  locations.forEach((loc, i) => {
    const li = document.createElement("li");
    li.textContent = loc.name;
    const btn = document.createElement("button");
    btn.textContent = "×";
    btn.onclick = () => {
      locations.splice(i, 1);
      saveLocations(locations);
      renderLocations();
    };
    li.appendChild(btn);
    savedList.appendChild(li);
  });
}

// --- Add location by name ---
async function addLocationByName(city) {
  if (!city) return;
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}&limit=1&appid=${API_KEY}`
  );
  const data = await res.json();
  if (!data[0]) return alert("City not found");
  const { name, lat, lon } = data[0];
  locations.push({ name, lat, lon });
  saveLocations(locations);
  renderLocations();
  addMarker({ name, lat, lon });
  map.setView([lat, lon], 8);
}

// --- Init ---
let locations = loadLocations();
locations.forEach(addMarker);
renderLocations();

// --- Events ---
addBtn.onclick = () => addLocationByName(input.value.trim());
