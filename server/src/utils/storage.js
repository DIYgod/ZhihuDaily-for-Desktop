/**
 * a singleton to manage shared data
 *
 * example:
 *
 *   const storage = MemoryStorage.instance();
 *   storage.put('name', 'abc');
 *   storage.get('name'); // 'abc'
 *
 */
export class MemoryStorage {

    constructor() {
        this._instance = undefined;
        this._data = {};
    }

    static instance() {
        if (!this._instance) {
            this._instance = new MemoryStorage();
        }
        return this._instance;
    }

    put(key, value) {
        this._data[key] = value;
    }

    get(key) {
        return this._data[key] || null;
    }

    remove(key) {
        delete this._data[key];
    }

    clear() {
        this._data = null;
    }

}
