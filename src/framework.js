// --- Store (Gestión de estado) ---
export class Store {
    constructor(initialState, reducer) {
        this.state = initialState;
        this.reducer = reducer;
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    handleAction(action) {
        this.state = this.reducer(this.state, action);
        this.listeners.forEach(listener => listener());
    }
}

// --- Dispatcher ---
export const Dispatcher = {
    stores: [],

    register(store) {
        this.stores.push(store);
    },

    dispatch(action) {
        this.stores.forEach(store => store.handleAction(action));
    }
};