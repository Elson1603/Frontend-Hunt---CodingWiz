import React from "react";
import "./TodayHighlights.css";

const TodayHighlights = ({ weatherData, unit, loading }) => {
  if (loading) {
    return (
      <section className="today-highlights">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading highlights...</p>
        </div>
      </section>
    );
  }

  if (!weatherData) {
    return (
      <section className="today-highlights">
        <div className="no-data-container">
          <p>No weather data available</p>
        </div>
      </section>
    );
  }

  const { main, wind, visibility, weather } = weatherData;
  const humidity = main.humidity;
  const windSpeed = unit === "F" ? Math.round(wind.speed * 2.237) : Math.round(wind.speed * 3.6); // Convert to mph or km/h
  const windUnit = unit === "F" ? "mph" : "km/h";
  const visibilityKm = visibility / 1000;
  const visibilityMiles = unit === "F" ? Math.round(visibilityKm * 0.621371) : Math.round(visibilityKm);
  const visibilityUnit = unit === "F" ? "mi" : "km";

  // Calculate UV index (simplified - in real app you'd get this from a separate API)
  const uvIndex = Math.floor(Math.random() * 10) + 1; // Placeholder
  const getUVLevel = (uv) => {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
  };

  // Calculate chance of rain based on humidity and weather condition
  const getRainChance = () => {
    const condition = weather[0].main.toLowerCase();
    if (condition.includes('rain') || condition.includes('drizzle')) return 80;
    if (condition.includes('cloud')) return 40;
    if (condition.includes('clear')) return 10;
    return Math.min(humidity / 2, 60);
  };

  const rainChance = getRainChance();

  // Get wind direction
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const windDirection = getWindDirection(wind.deg);

  return (
    <section className="today-highlights">
      <h2 className="highlights-title">Today Highlight</h2>

      <div className="highlights-grid">
        <div className="highlight-card">
          <h3 className="card-title">Chance of Rain</h3>
          <div className="rain-chart">
            <svg width="149" height="124" viewBox="0 0 149 124" fill="none">
              <path
                d="M10 100C30 80 50 90 70 70C90 50 110 60 130 40"
                stroke="#4A90E2"
                strokeWidth="3"
                fill="none"
              />
              <circle cx="74" cy="60" r="40" fill="rgba(74, 144, 226, 0.2)" />
              <text
                x="74"
                y="65"
                textAnchor="middle"
                fill="currentColor"
                fontSize="16"
              >
                {rainChance}%
              </text>
            </svg>
          </div>
        </div>

        <div className="highlight-card">
          <h3 className="card-title">UV Index</h3>
          <div className="uv-display">
            <div className="uv-circle">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#333"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#FFD700"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (uvIndex / 10) * 251.2}
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="45"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="12"
                >
                  UV
                </text>
                <text
                  x="50"
                  y="60"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="16"
                >
                  {uvIndex}
                </text>
              </svg>
            </div>
            <p className="uv-level">{getUVLevel(uvIndex)}</p>
          </div>
        </div>

        <div className="highlight-card">
          <h3 className="card-title">Wind Status</h3>
          <div className="wind-display">
            <div className="wind-speed">
              <span className="wind-value">{windSpeed}</span>
              <span className="wind-unit">{windUnit}</span>
            </div>
            <div className="wind-direction">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  stroke="#333"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M30 10L35 20L25 20Z"
                  fill="#4A90E2"
                  transform={`rotate(${wind.deg} 30 30)`}
                />
                <text
                  x="30"
                  y="35"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="10"
                >
                  {windDirection}
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="highlight-card">
          <h3 className="card-title">Humidity</h3>
          <div className="humidity-display">
            <div className="humidity-circle">
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#333"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#4A90E2"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (humidity / 100) * 251.2}
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="55"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="16"
                >
                  {humidity}%
                </text>
              </svg>
            </div>
            <div className="humidity-icon">
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                <path
                  d="M20 5C15 15 10 20 10 25C10 30.5228 14.4772 35 20 35C25.5228 35 30 30.5228 30 25C30 20 25 15 20 5Z"
                  fill="#4A90E2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="highlight-card">
          <h3 className="card-title">Visibility</h3>
          <div className="visibility-display">
            <div className="visibility-value">
              <span className="visibility-number">{visibilityMiles}</span>
              <span className="visibility-unit">{visibilityUnit}</span>
            </div>
            <div className="visibility-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path
                  d="M20 10C12 10 6 16 6 24C6 32 20 40 20 40C20 40 34 32 34 24C34 16 28 10 20 10Z"
                  stroke="#4A90E2"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="20" cy="24" r="4" fill="#4A90E2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="highlight-card">
          <h3 className="card-title">Pressure</h3>
          <div className="pressure-display">
            <div className="pressure-value">
              <span className="pressure-number">{main.pressure}</span>
              <span className="pressure-unit">hPa</span>
            </div>
            <div className="pressure-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="15" stroke="#4A90E2" strokeWidth="2" fill="none" />
                <path d="M20 5L20 15M20 25L20 35M5 20L15 20M25 20L35 20" stroke="#4A90E2" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodayHighlights;
