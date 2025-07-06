import React from "react";
import weatherService from "../../services/weatherService";
import { weatherIconMap } from "../../utils/weatherIconMap";
import "./WeeklyForecast.css";

const WeeklyForecast = ({ forecastData, unit, loading }) => {
  if (loading) {
    return (
      <section className="weekly-forecast">
        <div className="forecast-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading forecast...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!forecastData || !forecastData.list || !forecastData.city) {
    return (
      <section className="weekly-forecast">
        <div className="forecast-container">
          <div className="no-data-container">
            <p>No forecast data available</p>
          </div>
        </div>
      </section>
    );
  }

  // Get hourly forecast for today (next 24 hours)
  const hourlyForecast = forecastData.list.slice(0, 8).map(item => {
    const time = new Date(item.dt * 1000);
    const temp = unit === "F" 
      ? weatherService.convertToFahrenheit(item.main.temp)
      : Math.round(item.main.temp);
    
    return {
      time: time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        hour12: true 
      }).replace(':00', '').replace(' AM', 'AM').replace(' PM', 'PM'),
      temp: `${temp}°`,
      main: item.weather[0].main,
      description: item.weather[0].description
    };
  });

  // Get tomorrow's forecast
  const tomorrow = forecastData.list.find(item => {
    const date = new Date(item.dt * 1000);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  });

  const tomorrowTemp = tomorrow ? (unit === "F" 
    ? weatherService.convertToFahrenheit(tomorrow.main.temp)
    : Math.round(tomorrow.main.temp)) : 0;

  const tomorrowCondition = tomorrow ? tomorrow.weather[0].main : "Unknown";

  // Get sunrise/sunset times from current weather data with fallbacks
  const { sys } = forecastData.city;
  let sunriseTime = "6:00 AM";
  let sunsetTime = "6:00 PM";
  let dayLength = "12h 0m";

  if (sys && sys.sunrise && sys.sunset) {
    const sunrise = new Date(sys.sunrise * 1000);
    const sunset = new Date(sys.sunset * 1000);
    
    sunriseTime = sunrise.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    sunsetTime = sunset.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    // Calculate day length
    const dayLengthMs = sunset - sunrise;
    const dayLengthHours = Math.floor(dayLengthMs / (1000 * 60 * 60));
    const dayLengthMinutes = Math.floor((dayLengthMs % (1000 * 60 * 60)) / (1000 * 60));
    dayLength = `${dayLengthHours}h ${dayLengthMinutes}m`;
  }

  return (
    <section className="weekly-forecast">
      <div className="forecast-container">
        <div className="forecast-content">
          <h2 className="section-title">Today / Week</h2>

          <div className="hourly-forecast">
            <div className="hourly-scroll">
              {hourlyForecast.map((hour, index) => {
                const iconSrc = weatherIconMap[hour.main] || weatherIconMap['Clear'];
                return (
                  <div key={index} className="hour-card">
                    <div className="hour-time">{hour.time}</div>
                    <div className="hour-icon">
                      <img 
                        src={iconSrc}
                        alt={hour.main}
                        className="weather-icon-small"
                      />
                    </div>
                    <div className="hour-temp">{hour.temp}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tomorrow-preview">
            <div className="tomorrow-info">
              <div className="tomorrow-details">
                <h3 className="tomorrow-label">Tomorrow</h3>
                <p className="tomorrow-condition">{tomorrowCondition}</p>
              </div>
              <div className="tomorrow-temp">{tomorrowTemp}°</div>
            </div>
            <div className="storm-animation">
              {tomorrow && (
                <img 
                  src={weatherIconMap[tomorrow.weather[0].main] || weatherIconMap['Clear']}
                  alt={tomorrow.weather[0].description}
                  className="weather-icon-medium"
                />
              )}
            </div>
          </div>
        </div>

        <div className="sunrise-sunset">
          <div className="sun-times">
            <div className="sun-time-item">
              <h3 className="sun-label">Sunrise</h3>
              <div className="time-display">
                <span className="time-value">{sunriseTime.split(':')[0]}</span>
                <span className="time-period">{sunriseTime.includes('AM') ? 'AM' : 'PM'}</span>
              </div>
            </div>

            <div className="sun-time-item">
              <h3 className="sun-label">Sunset</h3>
              <div className="time-display">
                <span className="time-value">{sunsetTime.split(':')[0]}</span>
                <span className="time-period">{sunsetTime.includes('AM') ? 'AM' : 'PM'}</span>
              </div>
            </div>

            <div className="sun-time-item">
              <h3 className="sun-label">Length of day</h3>
              <div className="time-display">
                <span className="time-value day-length">{dayLength}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklyForecast;
