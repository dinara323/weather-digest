import {getCityCoordinates, getWeatherForecast,} from '../api/openMeteo.js';
import {loadReport,saveReport,} from '../storage/reportStorage.js';

export async function getWeatherReport(city, days) {
  const today = new Date().toISOString().slice(0, 10);
  const savedReport = await loadReport(city, today);
  if (savedReport && savedReport.forecast.length >= days) {
    return {...savedReport, forecast: savedReport.forecast.slice(0, days),};
  }

  const coordinates = await getCityCoordinates(city);

  const forecast = await getWeatherForecast(
    coordinates.latitude,
    coordinates.longitude,
    days
  );

  const forecastDays = forecast.dates.map((date, index) => {
    return {
      date,
      temperatureMax: forecast.temperatureMax[index],
      temperatureMin: forecast.temperatureMin[index],
    };
  });

  const report = {
    city: coordinates.name,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    forecast: forecastDays,
  };

  await saveReport(city, today, report);

  return report;
}