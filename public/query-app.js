let mymap;

createMap();
getData();

async function getData() {
  const res = await fetch("/api");
  const data = await res.json();
  // console.log(data);

  for (item of data) {
    const marker = L.marker([item.lat, item.lng]).addTo(mymap);
    let text = `The weather here at ${item.lat}&deg north, ${item.lng}&deg east is ${item.weather.summary} with a temperature of ${item.weather.temperature}º.`;
    if (item.air.value < 0) {
      text += '  No air quality reading at this location';
    } else {
      text += `The concentration of particulate matter (${item.air.parameter}) is ${item.air.value}${item.air.unit} updated on ${item.air.lastUpdated}.`;
    }
    marker.bindPopup(text);
  }
}

function createMap() {
  mymap = L.map("mapid").setView([0, 0], 1);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      maxZoom: 18,
      id: "mapbox/streets-v11", // "mapbox/satellite-v9",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoieGFlbXVlIiwiYSI6ImNrNHY2dTd1eTFjNjkzbm4wM2QwbDRxNDUifQ.Xc0QcGbSInhevbjRRWKU8A"
    }
  ).addTo(mymap);
}