import * as SQLite from "expo-sqlite";

const DB_NAME = "tcm_meals.db";
const TABLE_NAME = "meal_entry";
let db: SQLite.SQLiteDatabase | null = null;

export async function initDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
  }
  createMealTable(db).catch((error) => {
    console.error("Error creating meal_entry table:", error);
  });
  return db;
}

// Initialize DB and create meal_entry table
export const createMealTable = async (database: SQLite.SQLiteDatabase): Promise<boolean> => {
  try {
    database.execAsync(
      `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userID TEXT NOT NULL,
        mealID TEXT NOT NULL
      )`
    );
    return true;
  } catch (error) {
    return Promise.reject(error);
  }
};

// Insert meal entry, check for duplicate (same userID and mealID)
export const insertMealEntry = async (userID: string, mealID: string): Promise<boolean> => {
  try {
    const database = await initDB();
    const existing = database.getAllSync<any>(
      `SELECT 1 FROM ${TABLE_NAME} WHERE userID = ? AND mealID = ?;`,
      [userID, mealID]
    );
    if (existing.length > 0) {
      return Promise.reject(
        new Error("Duplicate entry for this user and mealID")
      );
    }
    database.runSync(
      `INSERT INTO ${TABLE_NAME} (userID, mealID) VALUES (?, ?);`,
      [userID, mealID]
    );
    return true;
  } catch (error) {
    return Promise.reject(error);
  }
};

// Update meal entry by id
export const updateMealEntry = async (id: number, userID: string, mealID: string): Promise<boolean> => {
  try {
    const database = await initDB();
    database.runSync(
      `UPDATE ${TABLE_NAME} SET userID = ?, mealID = ? WHERE id = ?;`,
      [userID, mealID, id]
    );
    return true;
  } catch (error) {
    return Promise.reject(error);
  }
};

// Delete meal entry by id
export const deleteMealEntry = async (id: number): Promise<boolean> => {
  try {
    const database = await initDB();
    database.runSync(`DELETE FROM ${TABLE_NAME} WHERE id = ?;`, [id]);
    return true;
  } catch (error) {
    return Promise.reject(error);
  }
};

// Get all meal entries
export const getAllMealEntries = async (): Promise<any[]> => {
  try {
    const database = await initDB();
    const items = database.getAllSync<any>(`SELECT * FROM ${TABLE_NAME};`, []);
    return items;
  } catch (error) {
    return Promise.reject(error);
  }
};

// Clear all data in meal_entry table
export const clearAllMealEntries = async (): Promise<boolean> => {
  try {
    const database = await initDB();
    database.runSync(`DELETE FROM ${TABLE_NAME};`, []);
    return true;
  } catch (error) {
    return Promise.reject(error);
  }
};
