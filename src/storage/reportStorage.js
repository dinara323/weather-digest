import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const reportsDir = process.env.REPORTS_DIR || 'reports';

function createFileName(city, date) {
  return `${city}-${date}.json`;
}

export async function loadReport(city, date) {
  const fileName = createFileName(city, date);
  const filePath = path.join(reportsDir, fileName);

  try {
    const content = await readFile(filePath, 'utf-8');

    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

export async function saveReport(city, date, report) {
  await mkdir(reportsDir, { recursive: true });

  const fileName = createFileName(city, date);
  const filePath = path.join(reportsDir, fileName);
  const content = JSON.stringify(report, null, 2);

  await writeFile(filePath, content, 'utf-8');
  return filePath;
}