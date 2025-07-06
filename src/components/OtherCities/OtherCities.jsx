import React from "react";
import weatherService from "../../services/weatherService";
import { weatherIconMap } from "../../utils/weatherIconMap";
import "./OtherCities.css";

function getWeatherIconKey(main, description) {
  const desc = description.toLowerCase();
  if (desc.includes('cloud')) return 'Clouds';
  if (desc.includes('rain')) return 'Rain';
  if (desc.includes('thunder')) return 'Thunderstorm';
  if (desc.includes('snow')) return 'Snow';
  if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) return 'Mist';
  if (desc.includes('drizzle')) return 'Drizzle';
  if (desc.includes('clear')) return 'Clear';
  return main;
}

const OtherCities = ({ nearbyCities, onCitySelect }) => {
  if (!nearbyCities || nearbyCities.length === 0) {
    return (
      <section className="other-cities">
        <div className="cities-header">
          <h2 className="cities-title">Other Cities</h2>
        </div>
        <div className="loading-container">
          <p>No nearby cities found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="other-cities">
      <div className="cities-header">
        <h2 className="cities-title">Other Cities</h2>
        {/* <button className="show-all-btn">Show All</button> */}
      </div>

      <div className="cities-grid">
        {nearbyCities.map((city, index) => {
          const main = city.weather[0].main;
          const description = city.weather[0].description;
          const iconKey = getWeatherIconKey(main, description);
          const iconSrc = weatherIconMap[iconKey] || weatherIconMap['Clear'];
          return (
            <div 
              key={city.id || index} 
              className="city-card"
              onClick={() => onCitySelect(city.name)}
              style={{ cursor: 'pointer' }}
            >
              <div className="city-info">
                <div className="temperature-info">
                  <span className="city-temp">{Math.round(city.main.temp)}°</span>
                  <span className="temp-range">
                    H{Math.round(city.main.temp_max)}° L{Math.round(city.main.temp_min)}°
                  </span>
                </div>
                <h3 className="city-name">{city.name}, {city.sys.country}</h3>
              </div>
              <div className="city-weather-icon">
                <img 
                  src={iconSrc}
                  alt={main}
                  className="weather-icon-small"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OtherCities;
