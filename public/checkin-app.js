geolocation();
function geolocation() {
  if ("geolocation" in navigator) {
    console.log("geolocation available");
    document.getElementById("message").textContent = "waiting...";
    navigator.geolocation.getCurrentPosition(async position => {
      let lat, lng, weather, air;
      try {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        document.getElementById("latitude").textContent = lat.toFixed(5);
        document.getElementById("longitude").textContent = lng.toFixed(5);
        const api_url = `weather/${lat},${lng}`;
        const res = await fetch(api_url);
        const json = await res.json();
        weather = json.weather.currently;
        document.getElementById("summary").textContent = weather.summary;
        const temp = (weather.temperature - 32) / 1.8;
        document.getElementById("temperature").textContent = temp.toFixed(
          1
        );
        air = json.airquality.results[0].measurements[0];
        document.getElementById("airparameter").textContent =
          air.parameter;
        document.getElementById("airvalue").textContent = air.value;
        document.getElementById("airunit").textContent = air.unit;
        document.getElementById("airtime").textContent = air.lastUpdated;
        document.getElementById("message").textContent = "done.";
      } catch (err) {
        console.log("There is no air quality measurement at this location");
        air = { value: -1 };
      }
      submit({ lat, lng, weather, air });
    });
  } else {
    console.log("geolocation is not available");
  }
}

async function submit(data) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  try {
    const res = await fetch("/api", options);
    const resdata = await res.json();
    console.log(resdata);
  } catch {
    console.log(error);
    document.getElementById('airvalue').textContent = 'NO READING';
  }
}

