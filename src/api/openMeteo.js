const geocodingUrl = process.env.GEOCODING_BASE_URL;
const weatherUrl = process.env.WEATHER_BASE_URL;

const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS);

async function request(url) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (response.status >= 400 && response.status < 500) {
      throw new Error(`Ошибка клиента: HTTP ${response.status}`);
    }

    if (response.status >= 500) {
      throw new Error(`Ошибка сервера: HTTP ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Превышено время ожидания запроса (${timeoutMs} мс).`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getCityCoordinates(city) {
  const url = new URL(geocodingUrl);

  url.searchParams.set('name', city);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'ru');
  url.searchParams.set('format', 'json');

  const data = await request(url);

  if (!data.results || data.results.length === 0) {
    throw new Error(`Город "${city}" не найден.`);
  }

  const result = data.results[0];

  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
  };
}
export async function getWeatherForecast(latitude, longitude, days) {
  const url = new URL(weatherUrl);

  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('forecast_days', days);
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min');
  url.searchParams.set('timezone', 'auto');

  const data = await request(url);

  return {
    dates: data.daily.time,
    temperatureMax: data.daily.temperature_2m_max,
    temperatureMin: data.daily.temperature_2m_min,
  };
}