import moment from 'moment';

import { request } from '../request';
import { method } from '../method';
import { day_method } from '../day_method';
import { DOCUMENT_SETUSOKU, DOCUMENT_SETUSOKU_DAY } from '../constant';

export const setusoku = async () => {
  const url = 'http://setusoku.com/';
  const data = [];

  for (let j = 1; j <= 3; j++) {
    const doc = await request({
      url: url + (j > 1 ? `/page/${j}/` : ''),
      name: 'setusoku',
    });

    const tmp = Array.from(doc.querySelectorAll('.entry-content')).map(m => {
      return {
        title: m.querySelector('h3').textContent.trim(),
        href: m.querySelector('h3 a').getAttribute('href'),
        date: m.querySelector('p').textContent.trim().substring(0, 10),
      };
    });

    tmp.map(m => {
      // 年 月 日
      const s = m.date.split('/');
      if (
        moment().isBetween(
          `${s[0]}-${s[1]}-${s[2]} 00:00`,
          `${s[0]}-${s[1]}-${s[2]} 23:59`
        )
      ) {
        data.push(m);
      }
    });

    const s = tmp[tmp.length - 1].date.split('/');
    if (
      !moment().isBetween(
        `${s[0]}-${s[1]}-${s[2]} 00:00`,
        `${s[0]}-${s[1]}-${s[2]} 23:59`
      )
    ) {
      break;
    }
  }

  const ret = await method({
    name: 'setusoku',
    id: DOCUMENT_SETUSOKU,
    data: data,
  });

  await day_method({
    key: `${DOCUMENT_SETUSOKU_DAY}_${moment().format('YYYY-MM-DD')}`,
    data: ret,
  });
};
