// npm install --save dotenv
// for environment variable
require('dotenv').config();
// npm install --save node-fetch
// for fetch function like in client-side javascript
const fetch = require('node-fetch');
// npm install --save nedb
// database similar to mongodb, simpler
const Datastore = require('nedb');
const express = require('express');
const app = express();

app.listen(3000, () => console.log('listening at port 3000...'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      console.log(err);
      return;
    }
    res.json(data);
  });
});

app.post('/api', (req, res) => {
  const data = req.body;
  data.timestamp = Date.now();
  database.insert(data);
  res.json(data);
});

app.get('/weather/:latlng', async (req, res) => {
  const latlng = req.params.latlng.split(',');
  const lat = latlng[0];
  const lng = latlng[1];
  const api_key = process.env.API_KEY;
  const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lng}`;
  const weatherres = await fetch(weather_url);
  const weatherdata = await weatherres.json();
  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lng}`;
  const aqres = await fetch(aq_url);
  const aqdata = await aqres.json();
  const data = {
    weather: weatherdata,
    airquality: aqdata
  }
  res.json(data);
});