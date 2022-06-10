import moment from 'moment';
const { exec } = require('child_process');

import { yahoo } from './genre/yahoo';
import { setusoku } from './genre/setusoku';
import { drrr } from './genre/drrr';
import { ch2 } from './genre/2ch';
import { ch22 } from './genre/2ch2';
import { rakuten } from './genre/rakuten';
import { serversus } from './genre/serversus';

import { DOCUMENT_NYUSOKU_DAY, DOCUMENT_NYUSOKU_PLUS_DAY } from './constant';

if (process.env.NODE_ENV === undefined) {
  require('dotenv').config();
}

// サーバを立ち上げる
require('http')
  .createServer()
  .listen(process.env.PORT || 8080);

// コマンド実行
const do_exec = command => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });
};

// IPアドレス取得
const getIp = () => {
  return new Promise(re => {
    const exec = require('child_process').exec;
    exec('curl inet-ip.info', async (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }

      re(stdout);
    });
  });
};

// main
const main = async () => {
  try {
    const hour = moment().hour();
    const minute = moment().minute();

    console.log(`start: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);

    // IPアドレス
    console.log(await getIp().catch(() => ''));

    // await rakuten().catch(() => '');

    if (hour === 1 && minute < 10) {
      await serversus().catch(() => '');
    }

    await yahoo().catch(() => '');

    // if (hour >= 22 || hour <= 1) {
    //   await drrr({ TARGET: process.env.DRRR_TARGET }).catch(() => '');
    // }

    if (minute < 10) {
      await setusoku();
      // ニュー速＋ 時間別
      await ch2({
        url: 'http://2ch-ranking.net/index.html?board=newsplus',
        name: DOCUMENT_NYUSOKU_PLUS_DAY,
      }).catch(() => '');

      // ニュー速 時間別
      await ch2({
        url: 'http://2ch-ranking.net/index.html?board=news',
        name: DOCUMENT_NYUSOKU_DAY,
      }).catch(() => '');
    }

    if (minute >= 10 && minute < 20) {
      await setusoku();
      // ニュー速＋ 日別
      await ch22({
        url: 'http://2ch-ranking.net/index.html?board=newsplus',
        name: DOCUMENT_NYUSOKU_PLUS_DAY,
      }).catch(() => '');

      // ニュー速 日別
      await ch22({
        url: 'http://2ch-ranking.net/index.html?board=news',
        name: DOCUMENT_NYUSOKU_DAY,
      }).catch(() => '');
    }

    console.log(`fin: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);

    if (process.env.NODE_ENV != null) {
      await do_exec(`npx heroku ps:scale web=0 -a ${process.env.PROJECT_NAME}`);
    }
  } catch (error) {
    console.log(error);
    console.log(`fin: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
    await do_exec(`npx heroku ps:scale web=0 -a ${process.env.PROJECT_NAME}`);
  }
};

main();
