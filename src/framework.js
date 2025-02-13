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

