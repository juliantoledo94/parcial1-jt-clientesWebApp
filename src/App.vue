<script>
// Acá va la lógica del componente.
// En los componentes que usan la Options API, debemos exportar como default un objeto con la configuración del componente.
// Si queremos usar otros componentes, es necesario importarlos.
// En la Options API, es necesario también declarar los componentes que vamos a usar.
// Una vez importado correctamente, podemos usarlo en el template con la sintaxis <Componente></Componente> o
// <Componente />.
// import Home from './pages/Home.vue';

import { logout, subscribeToUserState } from './services/auth';

export default {
    // El "name" define el nombre del componente. Es opcional.
    // Se supone que sea igual que el nombre del archivo.
    name: 'App',
    // "components" recibe un objeto donde define los componentes que se van a usar en el <template>.
    // components: { Home },
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
        }
    },
    methods: {
        handleLogout() {
            logout();

            // Redireccionamos al form de login.
            // Para redireccionar programáticamente, podemos usar el método push() del objeto Router.
            // Al objeto Router, por su parte, lo podemos acceder usando this.$router .
            this.$router.push('/ingresar');
        }
    },
    mounted() {
        // Nos suscribimos al estado de autenticación.
        subscribeToUserState(newUserState => this.user = newUserState);
    }
}
</script>

<template>
    <!-- 
    Tailwind sigue, en general, algunas convenciones para sus estilos.
    - Para algunos estilos que tienen una lista posible de valores ya pre-definidos (y que no colisionan con valores de
    otros estilos), Tailwind utiliza como nombre de la clase el valor del estilo. Por ejemplo, los display.
        Si queremos:
            display: flex;                  => flex
            display: inline-block;          => inline-block
            display: grid;                  => grid
    - Para la mayoría de los estilos, Tailwind utiliza el formato de: estilo-valor
    El valor puede ser una keyword, en el caso de estilos que así lo requieren (como "justify-contents"), o puede
    ser una medida (como en "font-size"), o podrá ser algún otro tipo de valor (como para colores).
    Por ejemplo, clases como "justify-contents", "gap", "margin", "background-color", etc.
        Si queremos:
            margin: 1rem;                   => m-4
            padding-top: .5rem;             => pt-2
            background-color: white;        => bg-white
    Lo que pueden ir notando, es que para la mayoría de los estilos que aceptan una dimensión (número más unidad de 
    medida), aceptan una serie de posibles valores, empezando por un número que es el múltiplo de 4 que queremos aplicar,
    o dicho de otra forma, el múltiplo de .25rem que queremos aplicar.
    -->
    <nav class="flex items-center gap-8 p-4 bg-slate-300">
        <!-- 
        Las clases para los estilos de tamaño de tipografía son un poco arbitrarios. No siguen la escala previamente
        mencionada.
        -->
        <RouterLink class="text-lg" to="/">DV Social</RouterLink>
        <ul class="flex gap-4">
            <li>
                <!-- <router-link to="/">Home</router-link> -->
                <RouterLink to="/">Home</RouterLink>
            </li>
            <template v-if="user.id !== null">
                <li>
                    <RouterLink to="/chat-global">Chat global</RouterLink>
                </li>
                <li>
                    <RouterLink to="/mi-perfil">Mi perfil</RouterLink>
                </li>
                <li>
                    <form 
                        action="#"
                        @submit.prevent="handleLogout"
                    >
                        <button type="submit">{{ user.email }} (cerrar sesión)</button>
                    </form>
                </li>
            </template>
            <template v-else>
                <li>
                    <RouterLink to="/ingresar">Iniciar sesión</RouterLink>
                </li>
                <li >
                    <RouterLink to="/registro">Registrarse</RouterLink>
                </li>
            </template>
        </ul>
    </nav>
    <div class="container mx-auto p-4">
        <!-- <router-view /> -->
        <RouterView />
        <!-- <RouterView
            @login="handleLogin"
        /> -->
    </div>
    <footer class="flex justify-center items-center h-25 bg-slate-900 text-white">
        <p>Da Vinci &copy; 2025</p>
    </footer>
</template>