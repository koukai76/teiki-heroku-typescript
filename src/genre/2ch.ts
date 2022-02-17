import moment from 'moment';
import fetch from 'isomorphic-fetch';
import iconv from 'iconv-lite';
import { JSDOM } from 'jsdom';

import { update } from '../firebase';

const jsdom = new JSDOM();
const parser = new jsdom.window.DOMParser();

// 1桁の数字を0埋めで2桁にする
const toDoubleDigits = num => {
  num += '';
  if (num.length === 1) {
    num = '0' + num;
  }
  return num;
};

const request_shiftJis = async (params: { url: string; name: string }) => {
  const res = await fetch(params.url, {
    method: 'get',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    },
  });

  if (res.status !== 200) {
    throw new Error(`${params.name} リクエスト失敗`);
  }

  const html = iconv.decode(
    Buffer.from(await res.arrayBuffer()),
    'windows-31j'
  );

  return parser.parseFromString(html, 'text/html');
};

export const ch2 = async (params: { url: string; name: string }) => {
  const year = moment().year();
  const month = moment().month() + 1;
  const date = moment().date();
  const hour = moment().hour();

  const doc = await request_shiftJis({
    url: params.url,
    name: params.name,
  });

  const target = doc.querySelectorAll('.title a');

  const data = Array.from(target).reduce((accumulator, _, i) => {
    if (i >= 10) {
      return accumulator;
    }

    const url = new URL(target[i].getAttribute('href'));
    const params = url.searchParams;

    const thread = params.get('thread');
    const sp = thread.split('/');

    accumulator.push({
      title: target[i].textContent,
      res: doc.querySelectorAll('.res')[i].textContent,
      href:
        '/board?q=https://' + sp[0] + '/test/read.cgi/' + sp[1] + '/' + sp[2],
    });

    return accumulator;
  }, []);

  await update(
    `${params.name}_${year}_${toDoubleDigits(month)}_${toDoubleDigits(
      date
    )}_${toDoubleDigits(hour)}`,
    JSON.stringify(data)
  );
};
