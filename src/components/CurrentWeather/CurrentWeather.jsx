import React from "react";
import weatherService from "../../services/weatherService";
import { weatherIconMap } from "../../utils/weatherIconMap";
import "./CurrentWeather.css";

const CurrentWeather = ({ weatherData, unit, onUnitChange, loading }) => {
  if (loading) {
    return (
      <section className="current-weather">
        <div className="weather-background">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!weatherData) {
    return (
      <section className="current-weather">
        <div className="weather-background">
          <div className="no-data-container">
            <p>No weather data available</p>
          </div>
        </div>
      </section>
    );
  }

  const { main, weather, sys, name, dt } = weatherData;
  const weatherInfo = weather[0];
  const dateInfo = weatherService.formatDate(dt);
  
  const displayTemp = unit === "F" 
    ? weatherService.convertToFahrenheit(main.temp)
    : Math.round(main.temp);
    
  const feelsLike = unit === "F"
    ? weatherService.convertToFahrenheit(main.feels_like)
    : Math.round(main.feels_like);

  const tempRange = {
    high: unit === "F" 
      ? weatherService.convertToFahrenheit(main.temp_max)
      : Math.round(main.temp_max),
    low: unit === "F"
      ? weatherService.convertToFahrenheit(main.temp_min)
      : Math.round(main.temp_min)
  };

  const iconSrc = weatherIconMap[weatherInfo.main] || weatherIconMap['Clear'];

  return (
    <section className="current-weather">
      <div className="weather-background">
        <div className="cloud-decorations">
          <svg
            className="cloud-large"
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
          >
            <path
              d="M35.9525 22.5685C37.4417 22.0482 39.0445 21.7651 40.7142 21.7651C42.351 21.7651 43.9232 22.0371 45.3877 22.5379C50.9825 24.451 55 29.7033 55 35.8828C55 43.6798 48.604 50.0005 40.7142 50.0005H15.7143C9.79695 50.0005 5 45.26 5 39.4123C5 33.5645 9.79695 28.824 15.7143 28.824C16.4246 28.824 17.1187 28.8923 17.7904 29.0225C19.2015 29.2965 20.5132 29.844 21.6667 30.607"
              stroke="#E8E8E9"
              strokeWidth="3.75"
              strokeLinecap="round"
            />
            <path
              opacity="0.5"
              d="M17.7906 29.0223C17.2178 27.4945 16.9049 25.8423 16.9049 24.1177C16.9049 16.3207 23.3009 10 31.1905 10C38.5398 10 44.593 15.4843 45.3878 22.5375"
              stroke="#C0C0C0"
              strokeWidth="3.75"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="cloud-small"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M19.1747 12.0365C19.969 11.759 20.8238 11.6081 21.7143 11.6081C22.5872 11.6081 23.4258 11.7531 24.2068 12.0202C27.1907 13.0405 29.3334 15.8417 29.3334 19.1375C29.3334 23.2959 25.9222 26.6669 21.7143 26.6669H8.38097C5.22506 26.6669 2.66669 24.1387 2.66669 21.0199C2.66669 17.9011 5.22506 15.3728 8.38097 15.3728C8.75979 15.3728 9.13002 15.4092 9.48823 15.4787C10.2408 15.6248 10.9404 15.9168 11.5556 16.3237"
              stroke="#E8E8E9"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              opacity="0.5"
              d="M9.48828 15.4785C9.18281 14.6637 9.01593 13.7825 9.01593 12.8628C9.01593 8.70437 12.4271 5.33334 16.6349 5.33334C20.5545 5.33334 23.7829 8.25829 24.2068 12.02"
              stroke="#C0C0C0"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="weather-content">
          <div className="location-info">
            <div className="location-badge">
              <svg width="15" height="20" viewBox="0 0 15 20" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.5 5.625C6.46437 5.625 5.625 6.46437 5.625 7.5C5.625 8.53562 6.46437 9.375 7.5 9.375C8.53562 9.375 9.375 8.53562 9.375 7.5C9.375 6.46437 8.53562 5.625 7.5 5.625ZM7.5 10.625C5.77437 10.625 4.375 9.22625 4.375 7.5C4.375 5.77375 5.77437 4.375 7.5 4.375C9.22562 4.375 10.625 5.77375 10.625 7.5C10.625 9.22625 9.22562 10.625 7.5 10.625ZM7.5 0C3.35812 0 0 3.35812 0 7.5C0 10.6362 6.25312 20.0069 7.5 20C8.7275 20.0069 15 10.5937 15 7.5C15 3.35812 11.6419 0 7.5 0Z"
                  fill="white"
                />
              </svg>
              <span>{name}, {sys.country}</span>
            </div>

            <div className="date-info">
              <h1 className="day">{dateInfo.day}</h1>
              <p className="date">{dateInfo.date}</p>
            </div>

            <div className="temperature-display">
              <div className="temperature">
                <span className="temp-value">{displayTemp}</span>
                <span className="temp-unit">°{unit}</span>
              </div>
              <p className="temp-range">High: {tempRange.high}°{unit} Low: {tempRange.low}°{unit}</p>
            </div>
          </div>

          <div className="weather-visual">
            <div className="temperature-unit-toggle">
              <button 
                className={`unit-btn ${unit === "F" ? "active" : ""}`}
                onClick={() => onUnitChange("F")}
              >
                F
              </button>
              <button 
                className={`unit-btn ${unit === "C" ? "active" : ""}`}
                onClick={() => onUnitChange("C")}
              >
                C
              </button>
            </div>

            <div className="weather-animation">
              <img 
                src={iconSrc}
                alt={weatherInfo.main}
                className="weather-icon"
              />
            </div>

            <div className="weather-description">
              <h2 className="condition">{weatherInfo.main}</h2>
              <p className="feels-like">Feels Like {feelsLike}°{unit}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentWeather;
