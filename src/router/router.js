import { createRouter, createWebHistory } from "vue-router";
import { subscribeToUserState } from "../services/auth";
// import Home from '../pages/Home.vue';

// Definimos la lista de rutas de nuestra aplicación.
const routes = [
    { path: '/',                    component: () => import('../pages/Home.vue'), },
    { path: '/ingresar',            component: () => import('../pages/Login.vue'), },
    { path: '/registro',            component: () => import('../pages/Register.vue'), },
    { path: '/chat-global',         component: () => import('../pages/GlobalChat.vue'),         meta: { requiresAuth: true, }, },
    { path: '/mi-perfil',           component: () => import('../pages/MyProfile.vue'),          meta: { requiresAuth: true, }, },
    { path: '/mi-perfil/new-post',  component: () => import('../pages/NewPost.vue'),            meta: { requiresAuth: true, }, },
    { path: '/mi-perfil/editar',    component: () => import('../pages/MyProfileEdit.vue'),      meta: { requiresAuth: true, }, },
    { path: '/usuario/:id',         component: () => import('../pages/UserProfile.vue'),        meta: { requiresAuth: true, }, },
    { path: '/post/:id', component: () => import('../pages/PostDetail.vue'), meta: { requiresAuth: true } },

    
];

// Creamos el router con createRouter.
// Esta función recibe un objeto de configuración que necesita tener 2 parámetros:
// 1. routes: la lista de rutas de nuestra aplicación.
// 2. history: el tipo de historial que queremos utilizar. Puede ser createWebHistory() o createWebHashHistory().
// createWebHistory() trabaja con URLs "comunes", donde el path se agrega al dominio. Requiere tener un servidor en Node.js
//  propiamente configurado para funcionar correctamente al refrescar la página.
//  Por ejemplo: http:///localhost:5173/chat-global
// createWebHashHistory() trabaja con URLs agregando un hash (#) para el path. Este modo funciona bien con el refresco
//  de la página, incluso sin un servidor en Node.js configurado.
//  Por ejemplo: http:///localhost:5173/#/chat-global
const router = createRouter({
    routes, // routes: routes
    history: createWebHistory(),
});

let user = {
    id: null,
    email: null,
}
subscribeToUserState(newUserData => user = newUserData);

// Configuramos el "navigation guard", que se ejecuta en cada acceso a una ruta.
// Pasamos un callback que va a recibir dos parámetros:
// 1. Un objeto NormalizedRoute de la ruta a la que se está tratando de acceder.
// 2. Un objeto NormalizedRoute de la ruta de la que venimos, si aplica.
router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && user.id === null) {
        // Redireccionamos al login, retornando el path de su ruta.
        return '/ingresar';
    }
});

// Para terminar, exportamos el router.
export default router;