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

// --- Función para crear elementos virtuales (JSX) ---
export function createElement(type, props, ...children) {
    return {
        type,
        props: { ...props, children: children.flat() }
    };
}

// --- Convertimos el nodo virtual en Nodo real en el DOM ---
export function createDom(vNode) {
    if (typeof vNode === "string" || typeof vNode === 'number') {
        return document.createTextNode(vNode);
    }

    const dom = document.createElement(vNode.type);

    // Asignar atributos
    for (const [key, value] of Object.entries(vNode.props || {})) {
        if (key !== "children") {
            if (key.startsWith("on")) {
                const eventName = key.slice(2).toLowerCase();
                dom.addEventListener(eventName, value);
            } else if (value == null || value === false) {
                continue; // Ignorar atributos nulos o falsos
            } else if (key === "className") {
                dom.setAttribute("class", value);
            } else if (key === "value") {
                dom.value = value; // Manejo especial para inputs
            } else {
                dom.setAttribute(key, value);
            }
        }
    }

    // Renderizar hijos
    (vNode.props.children || []).forEach(child => dom.appendChild(createDom(child)));

    return dom;
}


// --- Función de reconciliación (Actualización eficiente del DOM) ---
function updateDom(parent, newVNode, oldVNode, index = 0) {
    if (!oldVNode) {
        parent.appendChild(createDom(newVNode));
    } else if (!newVNode) {
        parent.removeChild(parent.childNodes[index]);
    } else if (typeof newVNode === "string" || typeof oldVNode === "string") {
        if (newVNode !== oldVNode) {
            parent.replaceChild(createDom(newVNode), parent.childNodes[index]);
        }
    } else if (newVNode.type !== oldVNode.type) {
        parent.replaceChild(createDom(newVNode), parent.childNodes[index]);
    } else {
        // Actualizar atributos
        const domElement = parent.childNodes[index];
        updateAttributes(domElement, newVNode.props, oldVNode.props);

        // Reconciliar hijos
        const newChildren = newVNode.props.children || [];
        const oldChildren = oldVNode.props.children || [];
        const max = Math.max(newChildren.length, oldChildren.length);

        for (let i = 0; i < max; i++) {
            updateDom(domElement, newChildren[i], oldChildren[i], i);
        }
    }
}