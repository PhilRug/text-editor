import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', {
        keyPath: 'id',
        autoIncrement: true,
      });
      console.log('jate database created');
    },
  });

let jateDB;

const getDBInstance = async () => {
  if (!jateDB) {
    jateDB = await openDB('jate', 1);
  }
  return jateDB;
};

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  console.log('PUT from the database', content);
  const db = await getDBInstance();
  const tx = db.transaction(['jate'], 'readwrite');
  const store = tx.objectStore('jate');

  // Use the .add() method to store the content in the object store.
  await store.put({id:1, value:content});

  // Complete the transaction.
  await tx.complete;

  console.log('Data stored successfully.');
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log('GET from the database');
  const db = await getDBInstance();
  const tx = db.transaction(['jate'], 'readonly');
  const store = tx.objectStore('jate');
  const request = store.get(1);
  const result = await request;
  console.log('result.value', result);
  return result?.value;
};

initdb();
