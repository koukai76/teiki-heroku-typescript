import firebase from 'firebase/app';
import 'firebase/firestore';

import { DB_NAME } from './constant';

const firebaseConfig = {
  apiKey: 'AIzaSyBoGqRhuqBoac2lmttfc4B3g1HvlV-RyxQ',
  authDomain: 'coconara-73bd9.firebaseapp.com',
  projectId: 'coconara-73bd9',
  storageBucket: 'coconara-73bd9.appspot.com',
  messagingSenderId: '579942043879',
  appId: '1:579942043879:web:02357e9a881dd449e59242',
  measurementId: 'G-4FF1T1CSL7',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export const read = async (id: string): Promise<{ href: string }[]> => {
  return new Promise((resolve, reject) => {
    db.collection(DB_NAME)
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          resolve(JSON.parse(doc.data().data));
        } else {
          resolve([]);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const update = async (id: string, data: any) => {
  return new Promise((resolve, reject) => {
    db.collection(DB_NAME)
      .doc(id)
      .set({
        data: JSON.stringify(data),
      })
      .then(() => {
        resolve(true);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const del = async (id: string) => {
  return new Promise((resolve, reject) => {
    db.collection(DB_NAME)
      .doc(id)
      .delete()
      .then(() => {
        resolve(true);
      })
      .catch(error => {
        reject(error);
      });
  });
};
