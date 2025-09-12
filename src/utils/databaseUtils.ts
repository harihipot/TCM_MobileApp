import * as SQLite from "expo-sqlite";

const DB_NAME = "tcm_meals.db";
const TABLE_NAME = "meal_entry";
const database = SQLite.openDatabaseSync(DB_NAME);

// Initialize DB and create meal_entry table
export const init = () => {
  try {
    database.runSync(
      `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userID TEXT NOT NULL,
        mealD TEXT NOT NULL
      );`,
      []
    );
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Insert meal entry, check for duplicate (same userID and mealD)
export const insertMealEntry = (userID: string, mealD: string) => {
  try {
    const existing = database.getAllSync<any>(
      `SELECT 1 FROM ${TABLE_NAME} WHERE userID = ? AND mealD = ?;`,
      [userID, mealD]
    );
    if (existing.length > 0) {
      return Promise.reject(
        new Error("Duplicate entry for this user and mealD")
      );
    }
    database.runSync(
      `INSERT INTO ${TABLE_NAME} (userID, mealD) VALUES (?, ?);`,
      [userID, mealD]
    );
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Update meal entry by id
export const updateMealEntry = (id: number, userID: string, mealD: string) => {
  try {
    database.runSync(
      `UPDATE ${TABLE_NAME} SET userID = ?, mealD = ? WHERE id = ?;`,
      [userID, mealD, id]
    );
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Delete meal entry by id
export const deleteMealEntry = (id: number) => {
  try {
    database.runSync(`DELETE FROM ${TABLE_NAME} WHERE id = ?;`, [id]);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Get all meal entries
export const getAllMealEntries = () => {
  try {
    const items = database.getAllSync<any>(`SELECT * FROM ${TABLE_NAME};`, []);
    return Promise.resolve(items);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Clear all data in meal_entry table
export const clearAllMealEntries = () => {
  try {
    database.runSync(`DELETE FROM ${TABLE_NAME};`, []);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};
