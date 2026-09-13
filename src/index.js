import { getWeatherReport } from './services/weatherService.js';
const args = process.argv.slice(2);

let city;
let days = 3;
let noCache = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--city') {
    city = args[i + 1];
  }

  if (args[i] === '--days') {
    days = Number(args[i + 1]);
  }

  if (days > 8 || days < 1 || !Number.isInteger(days)) {
    console.error('Ошибка: параметр --days целое число от 1 до 7.');
    process.exit(1);
    }

  if (args[i] === '--no-cache') {
    noCache = true;
  }
}

  if (!city) {
    console.error('Ошибка: параметр --city обязателен.');
    process.exit(1);
    }

console.log({
  city,
  days,
  noCache,
});

const report = await getWeatherReport(city, days);
console.log(report);