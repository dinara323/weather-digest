export function printReport(report) {
  console.log(`Город: ${report.city}`);
  console.log(`Страна: ${report.country}`);
  console.log(`Координаты: ${report.latitude}, ${report.longitude}`);
  console.log('Прогноз:');

  for (const day of report.forecast) {
    console.log(
      `${day.date}: от ${day.temperatureMin}°C до ${day.temperatureMax}°C, осадки: ${day.precipitation} мм°C`
    );
  }
}