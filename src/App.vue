<script>


import { logout, subscribeToUserState } from './services/auth';

export default {
    
    name: 'App',
   
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
   
    <nav class="flex items-center gap-8 p-4 bg-slate-300">
     
        <RouterLink class="text-lg " to="/">Comunidad G</RouterLink>
        <ul class="flex gap-4">
            <li>
                <!-- <router-link to="/">Home</router-link> -->
                <RouterLink to="/">Home</RouterLink>
            </li>
            <template v-if="user.id !== null">
                <!-- <li>
                    <RouterLink to="/chat-global">Chat global</RouterLink>
                </li> -->
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
    <div class="min-h-screen bg-no-repeat bg-cover bg-bottom bg-fixed bg-[url('src/assets/woods.png')]">
       <div class="container mx-auto p-4 ">

           <RouterView />
       </div> 
       
    </div>
    <footer class="flex justify-center items-center h-25 bg-slate-900 text-white">
        <p>Da Vinci &copy; 2025</p>
    </footer>
</template>