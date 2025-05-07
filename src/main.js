/*
# Repaso de las rutas en los imports con Vite y npm
A la hora de poner las rutas de los imports (lo que viene después del from), tenemos 3 posibilidades.
## 1. Rutas absolutas
Las rutas absolutas son aquellas que no importa donde estemos siempre nos llevan al mismo lugar. Se escriben incluyendo
tanto el protocolo como el dominio del recurso. Ejemplo: 'https://sara.za/recurso'.

## 2. Rutas relativas
Las rutas relativas son las que basan la dirección en relación a la ubicación del recurso actual. En Vite y npm, para que
una ruta sea relativa DEBE empezar con "/", "./" o "../". Ejemplo: './recurso' o '../recurso'.

## 3. Paquetes de npm
Si ponemos una ruta sin empezar con "./", "../", "/" o un protocolo y dominio, entonces Vite y npm asumen que estamos
hablando de un paquete instalado de npm. Es decir, que corresponde a una carpeta dentro de [node_modules]. 
Ejemplo: 'vue' o '@vitejs/plugin-vue'.
*/

import './style.css';
// Para crear la aplicación de Vue, necesitamos utilizar la función createApp() de Vue.
// Esta función recibe como argumento un objeto del componente raíz. Nos retorna el objeto de la app.
import { createApp } from 'vue';
import router from './router/router.js';
import App from './App.vue';

const app = createApp(App);

// Registramos el router en nuestra aplicación usando el método use():
app.use(router);

// Finalmente, montamos el componente en algún elemento del DOM. El método mount() recibe un selector CSS.
app.mount('#app');