import { SemanticTag } from "../types";
import { SEMANTIC_TAGS } from "../data";

const DB_NAME = "SemanticHTML5DB";
const DB_VERSION = 1;
const STORE_NAME = "dictionary_tags";

/**
 * Initializes the IndexedDB database and returns a Promise resolving to the IDBDatabase instance.
 */
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", request.error);
      reject(request.error || new Error("Failed to open IndexedDB"));
    };

    request.onsuccess = (event) => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "name" });
      }
    };
  });
}

/**
 * Seeds the database with default tags if it's currently empty.
 */
export async function seedDBIfEmpty(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const countRequest = store.count();

    countRequest.onsuccess = () => {
      if (countRequest.result === 0) {
        console.log("Seeding IndexedDB with default semantic tags...");
        for (const tag of SEMANTIC_TAGS) {
          store.put(tag);
        }
      }
      resolve();
    };

    countRequest.onerror = () => {
      reject(countRequest.error || new Error("Failed to check store count"));
    };
  });
}

/**
 * Fetches all semantic tags from the IndexedDB database.
 */
export async function getAllTags(): Promise<SemanticTag[]> {
  try {
    const db = await initDB();
    await seedDBIfEmpty(db);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as SemanticTag[]);
      };

      request.onerror = () => {
        reject(request.error || new Error("Failed to fetch tags from IndexedDB"));
      };
    });
  } catch (error) {
    console.warn("Falling back to in-memory tags due to IndexedDB error:", error);
    // Fallback to static tags if IndexedDB fails (e.g., in extremely restrictive iframe or private mode)
    return SEMANTIC_TAGS;
  }
}

/**
 * Saves or updates a semantic tag in IndexedDB.
 */
export async function saveTag(tag: SemanticTag): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(tag);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error || new Error("Failed to save tag to IndexedDB"));
      };
    });
  } catch (error) {
    console.error("Failed to save tag to IndexedDB:", error);
  }
}

/**
 * Deletes a semantic tag from IndexedDB.
 */
export async function deleteTag(name: string): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(name);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error || new Error("Failed to delete tag from IndexedDB"));
      };
    });
  } catch (error) {
    console.error("Failed to delete tag from IndexedDB:", error);
  }
}
