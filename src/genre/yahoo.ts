import moment from 'moment';

import { request } from '../request';
import { method } from '../method';
import { day_method } from '../day_method';
import { DOCUMENT_YAHOO, DOCUMENT_YAHOO_DAY } from '../constant';

export const yahoo = async () => {
  const doc = await request({ url: 'https://www.yahoo.co.jp', name: 'yahoo' });
  const data = Array.from(
    doc.querySelectorAll('main article section ul')[0].querySelectorAll('li')
  ).map(m => {
    return {
      title: m.querySelector('span').textContent,
      href: m.querySelector('a').getAttribute('href'),
    };
  });

  const ret = await method({ name: 'yahoo', id: DOCUMENT_YAHOO, data: data });

  await day_method({
    key: `${DOCUMENT_YAHOO_DAY}_${moment().format('YYYY-MM-DD')}`,
    data: ret,
  });
};
