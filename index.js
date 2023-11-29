import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const apiKey = "dea495971ce568dfdcbec1d322ad2500";

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
    try {
      const cityname = req.body.city;
      const rawDate = new Date(req.body.date);
     const unixTimestamp = Math.floor(rawDate.getTime() / 1000);
      console.log(unixTimestamp);
  
      const limit = "5";
  
      const locationResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=${limit}&appid=${apiKey}`
      );
  
      const locationData = locationResponse.data[0];
  
      if (!locationData) {
        return res.status(404).send("Location not found");
      }
  
      const { lat, lon } = locationData;
  
      console.log(`${lat},${lon}`);
  
      const weatherresponse = await axios.get(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${unixTimestamp}&appid=${apiKey}`);
  
      const temperature = weatherresponse.data.data[0].temp - 273.15;
      console.log(temperature);
  
      if (!temperature) {
        return res.status(404).send("Temperature data not found");
      }
  
      const weather = weatherresponse.data.data[0].weather[0].description;
            
      res.render("index.ejs", {
        weather: weather,
        temp: temperature,
        place: cityname.toUpperCase(),
        time: rawDate,
      });
    } catch (error) {
      console.error("Error retrieving location data:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
