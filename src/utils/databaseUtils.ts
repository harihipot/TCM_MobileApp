import * as SQLite from "expo-sqlite";
const database = SQLite.openDatabaseSync("places.db");

// create sqlite db if it doesn't exist
export const init = () => {
  return new Promise((resolve, reject) => {});
};
