import puppeteer from 'puppeteer';
import { notification } from '../notification';

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  ssl: {
    rejectUnauthorized: true,
  },
});

const query = (
  sql: string,
  params: any
): Promise<{ results: any; fields: any }> => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results, fields) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ results: results, fields: fields });
    });
  });
};

export const serversus = async () => {
  try {
    const LAUNCH_OPTION = process.env.DYNO
      ? { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
      : { headless: true };

    const browser = await puppeteer.launch(LAUNCH_OPTION);
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'
    );

    const res = await page.goto('https://www.serversus.work/', {
      waitUntil: 'networkidle0',
    });

    if (res.status() !== 200) {
      await notification('serversus', String(res.status()), [
        process.env.EXPO_ID2,
      ]);
      return;
    }

    const ret = await page.evaluate(() => {
      return document.querySelectorAll('.article-list li')[0].textContent;
    });

    const ret2 = await query('SELECT * FROM users WHERE id = 1', '');

    if (ret2.results[0].first_name !== ret) {
      await notification('serversus', ret, [process.env.EXPO_ID2]);
    }

    await query('UPDATE users SET first_name = ? WHERE id = ?', [ret, 1]);

    console.log(ret);
    console.log(ret2.results[0].first_name);
    connection.end();
  } catch (error) {
    console.log(error);
  }
};
