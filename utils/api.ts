import * as SQLite from 'expo-sqlite';

function openDatabase() {
  const db = SQLite.openDatabase('db.db');
  return db;
}

export const db = openDatabase();

// Create db
export const createIfExistsDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `create table if not exists attendance (
          id integer primary key not null, 
          id_hash text not null, 
          event_id text not null, 
          check_in_timestamp datetime default CURRENT_TIMESTAMP 
      );`
    );
  });
};

// Get all events
// SELECT COUNT(*), event_id FROM attendance GROUP BY event_id;
export const getAllEvents = async () => {
  const results = await executeSql(
    'SELECT COUNT(*) as total, event_id, id FROM attendance GROUP BY event_id;'
  );
  return results;
};

// Get all attendance from a single event
// SELECT * FROM attendance WHERE event_id = "XXX";
export const getAllAttendanceFromEvent = async (event_id: string) => {
  const results = await executeSql(
    'SELECT * FROM attendance WHERE event_id = ?;',
    [event_id]
  );
  return results;
};

// Add 1 row
// INSERT INTO attendance (id_hash, event_id) VALUES( "5566", "Coding");
export const insertToAttendance = async (id_hash: string, event_id: string) => {
  const results = await executeSql(
    'INSERT INTO attendance (id_hash, event_id) VALUES( ?, ?);',
    [id_hash, event_id]
  );
  return results;
};

// TODO: Check if event exists before

// Utilies

// Async is easier to work with rather than callback.
const executeSql = async (sql: string, params: any[] = []) => {
  return new Promise<any[]>((resolve, reject) =>
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        // @ts-ignore
        (_, { rows }) => resolve(rows._array),
        () => {
          reject();
          return false;
        }
      );
    })
  );
};
