# Mini Framework para Aplicaciones Web

Este es un mini framework que implementa los principios de arquitectura FLUX y un Virtual DOM para renderizar aplicaciones web de manera eficiente. Aquí encontrarás una guía rápida para usar este framework y una explicación detallada de cómo funciona cada parte.

## Guía Rápida: Cómo Hacerlo

### 1. Crear un Store

Un `Store` es un contenedor que mantiene el estado de la aplicación y permite gestionar la lógica de actualización a través de un reducer. Aquí es donde defines el estado y cómo se modifica a partir de las acciones enviadas por el `Dispatcher`.

**Ejemplo:**

```javascript
import { Store, Dispatcher, createElement, render } from "./framework.js";

// Estado inicial
const initialState = {
    items: []
};

// Reducer
const todoReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM":
            return { ...state, items: [...state.items, action.payload] };
        default:
            return state;
    }
};

// Crear el store
const todoStore = new Store(initialState, todoReducer);
```
### 2. Registrar el Store en el Dispatcher
El Dispatcher se encarga de distribuir las acciones a todos los Stores registrados. Debes registrar tu Store para que pueda recibir las acciones.

```javascript
Dispatcher.register(todoStore);
```

### 3. Crear Componentes con miniFramework
Para crear los componentes, utilizamos createElement, que es similar a JSX, pero en lugar de escribir etiquetas HTML, creas objetos que describen los elementos de la interfaz.

Ejemplo de Componente:

```javascript
const SimpleComponent = () => {
    return createElement("h1", null, "¡Hola Mundo!");
};
```

### 4. Renderizar el Componente
Una vez que el Store y los componentes estén configurados, puedes renderizar la aplicación utilizando la función render.

```javascript
const renderApp = () => {
    const container = document.getElementById("root");
    render(SimpleComponent(), container);
};

todoStore.subscribe(renderApp);
renderApp();

```

## Documentación Técnica

1. Store
La clase Store es responsable de manejar el estado de la aplicación.

* Métodos:
- constructor(initialState, reducer): Inicializa el estado y el reducer del Store.
- getState(): Devuelve el estado actual del Store.
- subscribe(listener): Agrega un listener que se ejecutará cada vez que el estado cambie.
- handleAction(action): Envía una acción al reducer para actualizar el estado.

2. Dispatcher
El Dispatcher es responsable de recibir acciones y enviarlas a los Stores registrados.

*Métodos:

- register(store): Registra un Store.
- dispatch(action): Envía una acción a todos los Stores registrados.


3. MiniFramework (UI Rendering)
El MiniFramework permite crear y manipular la interfaz de usuario utilizando un sistema similar a JSX.

Métodos:

- createElement(type, props, ...children): Crea un objeto de nodo que describe un elemento DOM.
- render(vNode, container): Renderiza el árbol de elementos creado en un contenedor del DOM.


4. Virtual DOM (Reconciliación)
El sistema de Virtual DOM compara el estado actual de los elementos con el nuevo estado y realiza cambios en el DOM real solo cuando es necesario, lo que mejora el rendimiento.
Funciones:

- createDom(vNode): Convierte un objeto de nodo en un nodo DOM real.
- updateDom(parent, newVNode, oldVNode): Compara el nodo antiguo con el nuevo y actualiza el DOM de manera eficiente.
- updateAttributes(domElement, newProps, oldProps): Actualiza solo los atributos modificados.


### Próximos Pasos
- Añadir soporte para JSX y Babel para facilitar la creación de componentes.
- Mejorar el sistema de Virtual DOM para hacer actualizaciones más eficientes.

