// --- Store (Gestión de estado) ---
export class Store {
    constructor(initialState, reducer) {
        this.state = initialState;
        this.reducer = reducer;
        this.listeners = [];
    }

    getState() {
        return this.state; // Devuelve copia del estado actual
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
    const children = vNode.props.children || [];
    children.forEach(child => {
        const childDom = createDom(child);
        dom.appendChild(childDom);
    });

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


// --- Función para actualizar solo los atributos modificados ---
function updateAttributes(domElement, newProps, oldProps) {
    // Eliminar atributos que ya no existen
    for (const key in oldProps) {
        if (key === "children") continue;

        if (!(key in newProps)) {
            if (key.startsWith("on")) {
                const eventName = key.slice(2).toLowerCase();
                domElement.removeEventListener(eventName, oldProps[key]);
            } else {
                domElement.removeAttribute(key);
            }
        }
    }

    // Agregar o actualizar atributos y eventos
    for (const key in newProps) {
        if (key === "children") continue;

        const newValue = newProps[key];
        const oldValue = oldProps[key];

        if (newValue !== oldValue) {
            if (key.startsWith("on")) {
                // Manejo de eventos
                const eventName = key.slice(2).toLowerCase();
                if (oldValue) {
                    domElement.removeEventListener(eventName, oldValue);
                }
                domElement.addEventListener(eventName, newValue);
            } else if (newValue == null || newValue === false) {
                // Remover atributos nulos o falsos
                domElement.removeAttribute(key);
            } else if (key === "className") {
                // Manejo especial para clases CSS
                domElement.setAttribute("class", newValue);
            } else if (key === "value") {
                // Manejo especial para inputs
                domElement.value = newValue;
            } else {
                // Atributos normales
                domElement.setAttribute(key, newValue);
            }
        }
    }
}


// --- Renderizado en el DOM con reconciliación ---
let currentVNode = null;
export function render(vNode, container) {
    updateDom(container, vNode, currentVNode);
    currentVNode = vNode;
}