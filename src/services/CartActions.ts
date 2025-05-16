import type { Product } from "../types";


export class CartService {
    private db: IDBDatabase | null = null;
    private readonly dbName = "cartDB";
    private readonly storeName = "cartStore";

    constructor() {
        this.initDataBase();
    }

public initDataBase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

        request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    store.createIndex('name', 'name', { unique: false });
                }
    };
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }


  // Crud operations
async addToCart(product: Product): Promise<void> {
  if (!this.db) {
    await this.initDataBase();
  }

  const transaction = this.db!.transaction(this.storeName, "readwrite");
  const store = transaction.objectStore(this.storeName);
  const getRequest = store.get(product.id);

  return new Promise((resolve, reject) => {
    getRequest.onsuccess = (event) => {
      const existing = (event.target as IDBRequest).result;
      if (existing) {
        existing.quantity += product.quantity;
        const updateRequest = store.put(existing);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = (event) =>
          reject((event.target as IDBRequest).error);
      } else {
        const addRequest = store.add(product);
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = (event) =>
          reject((event.target as IDBRequest).error);
      }
    };
    getRequest.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
}


    async getCart(): Promise<Product[]> {
        if (!this.db) {
        await this.initDataBase();
        }
        const transaction = this.db!.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
    
        return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            resolve((event.target as IDBRequest).result);
        };
        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
        });
    }

    //get cart items
    async getItems(): Promise<{ product: Product; quantity: number }[]> {
        const cart = await this.getCart();
        const items: { product: Product; quantity: number }[] = [];
    
        cart.forEach((item) => {
            const existingItem = items.find((i) => i.product.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                items.push({ product: item, quantity: item.quantity });
            }
        });
    
        return items;
    }

    // update quantity
    async updateQuantity(id: number, quantity: number): Promise<void> {
        if (!this.db) {
        await this.initDataBase();
        }
        const transaction = this.db!.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);
    
        return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            const item = (event.target as IDBRequest).result;
            if (item) {
            item.quantity = quantity;
            const updateRequest = store.put(item);
            updateRequest.onsuccess = () => {
                resolve();
            };
            updateRequest.onerror = (event) => {
                reject((event.target as IDBOpenDBRequest).error);
            };
            } else {
            reject(new Error("Item not found"));
            }
        };
        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
        });
    }

    async removeFromCart(id: number): Promise<void> {
        if (!this.db) {
        await this.initDataBase();
        }
        const transaction = this.db!.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);
    
        return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
        });
    }

    async clearCart(): Promise<void> {
        if (!this.db) {
        await this.initDataBase();
        }
        const transaction = this.db!.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();
    
        return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
        });
    }

    // get total items
    async getTotalItems(): Promise<number> {
        const cart = await this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }
    // get total price
    async getTotalPrice(): Promise<number> {
        const cart = await this.getCart();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

}

export function formatCartItem(item: Product): string {
  return `${item.name} (${item.quantity}) - $${(item.quantity * item.price).toFixed(2)}`;
}


