const API_KEY = 'e1b292964b3c86ad361260f80c9496e0';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  async getCurrentWeather(city) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getForecast(city) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getWeatherByCoords(lat, lon) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Location not found');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getNearbyCities(lat, lon, excludeCityId, count = 4) {
    try {
      const response = await fetch(
        `${BASE_URL}/find?lat=${lat}&lon=${lon}&cnt=${count + 1}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error('Nearby cities not found');
      }
      const data = await response.json();
      // Filter out the current city by id
      return data.list.filter(city => city.id !== excludeCityId).slice(0, count);
    } catch (error) {
      throw error;
    }
  }

  getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })
    };
  }

  convertToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
  }

  convertToCelsius(fahrenheit) {
    return Math.round((fahrenheit - 32) * 5/9);
  }
}

export default new WeatherService(); 