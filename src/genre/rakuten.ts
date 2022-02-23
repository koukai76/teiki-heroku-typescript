import puppeteer from 'puppeteer';
import { notification } from '../notification';

export const rakuten = async () => {
  try {
    const LAUNCH_OPTION = process.env.DYNO
      ? { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
      : { headless: true };

    const browser = await puppeteer.launch(LAUNCH_OPTION);
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'
    );

    const res = await page.goto(
      'https://item.rakuten.co.jp/rakutenmobile-store/iphone-se-2nd_64gb_bundle_shop/',
      { waitUntil: 'networkidle0' }
    );

    page.on('console', consoleObj =>
      console.log(JSON.parse(consoleObj.text()))
    );

    const ret = await page
      .evaluate(() => {
        return document.querySelector('.soldout_msg').textContent.trim();
      })
      .catch(() => {});

    if (ret != '売り切れました') {
      await notification('rakuten', String(res.status), [process.env.EXPO_ID2]);
    }

    await browser.close();

    console.log(res.status);
    console.log(ret);
  } catch (error) {
    console.log(error);
  }
};
