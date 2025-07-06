import React, { useState, useEffect } from "react";
// import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import CurrentWeather from "../CurrentWeather/CurrentWeather";
import WeeklyForecast from "../WeeklyForecast/WeeklyForecast";
import TodayHighlights from "../TodayHighlights/TodayHighlights";
import OtherCities from "../OtherCities/OtherCities";
import weatherService from "../../services/weatherService";
import "./WeatherDashboard.css";

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [currentCity, setCurrentCity] = useState("London");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C"); // C or F
  const [nearbyCities, setNearbyCities] = useState([]);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const [currentWeather, forecast] = await Promise.all([
        weatherService.getCurrentWeather(city),
        weatherService.getForecast(city)
      ]);
      setWeatherData(currentWeather);
      setForecastData(forecast);
      setCurrentCity(city);

      // Log city name and current weather to the console
      if (currentWeather && currentWeather.name && currentWeather.weather && currentWeather.weather[0]) {
        console.log(
          `City: ${currentWeather.name}, Weather: ${currentWeather.weather[0].main} (${currentWeather.weather[0].description})`
        );
      }

      // Fetch nearby cities if coordinates are available
      if (currentWeather && currentWeather.coord) {
        try {
          const nearby = await weatherService.getNearbyCities(
            currentWeather.coord.lat,
            currentWeather.coord.lon,
            currentWeather.id
          );
          setNearbyCities(nearby);
        } catch (e) {
          setNearbyCities([]);
        }
      } else {
        setNearbyCities([]);
      }
    } catch (err) {
      setError(err.message);
      if (!weatherData) {
        setWeatherData(null);
        setForecastData(null);
        setNearbyCities([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = (city) => {
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
  };

  // Get user's location on component mount
  useEffect(() => {
    const initializeWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const weather = await weatherService.getWeatherByCoords(latitude, longitude);
              setWeatherData(weather);
              setCurrentCity(weather.name);
              
              // Also fetch forecast for the current location
              const forecast = await weatherService.getForecast(weather.name);
              setForecastData(forecast);

              // Fetch nearby cities
              if (weather && weather.coord) {
                try {
                  const nearby = await weatherService.getNearbyCities(
                    weather.coord.lat,
                    weather.coord.lon,
                    weather.id
                  );
                  setNearbyCities(nearby);
                } catch (e) {
                  setNearbyCities([]);
                }
              } else {
                setNearbyCities([]);
              }
            } catch (err) {
              console.error("Geolocation weather fetch failed:", err);
              fetchWeatherData(currentCity);
            }
          },
          (error) => {
            console.error("Geolocation denied or failed:", error);
            fetchWeatherData(currentCity);
          }
        );
      } else {
        console.log("Geolocation not supported, using default city");
        fetchWeatherData(currentCity);
      }
    };

    initializeWeather();
  }, []);

  return (
    <div className="weather-dashboard">
      {/* <Sidebar /> */}
      <main className="main-content">
        <Header 
          onCitySearch={handleCitySearch}
          currentCity={currentCity}
          loading={loading}
          error={error}
        />
        <div className="content-grid">
          <div className="left-column">
            <CurrentWeather 
              weatherData={weatherData}
              unit={unit}
              onUnitChange={handleUnitChange}
              loading={loading}
            />
            <WeeklyForecast 
              forecastData={forecastData}
              unit={unit}
              loading={loading}
            />
            <footer className="dashboard-footer">
              Made By <span style={{color: '#a259ff', fontWeight: 'bold'}}>Codingwiz</span> With <span style={{color: 'red'}}>&#10084;</span>
            </footer>
          </div>
          <div className="right-column">
            <TodayHighlights 
              weatherData={weatherData}
              unit={unit}
              loading={loading}
            />
            <OtherCities 
              nearbyCities={nearbyCities}
              onCitySelect={handleCitySearch}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeatherDashboard;
