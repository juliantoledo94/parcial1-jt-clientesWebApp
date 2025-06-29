<script setup>
import { useRoute } from 'vue-router';
import { logout } from './services/auth';
import useAuthUserState from './composables/useAuthUserState';

const router = useRoute();
const { user } = useAuthUserState();
const {handleLogout} = useLogout(router);


useLogout(router)



function useLogout(router) {

  function handleLogout() {

    logout();
    router.push("/ingresar");
  }

  return {
    handleLogout,
  }
}


</script>

<template>
  <div class="flex flex-col min-h-screen  "><!-- bg-[url('src/assets/woods.png')] bg-cover bg-bottom  bg-fixed -->
    <nav class="flex items-center gap-8 p-4 text-white shadow-md bg-[#1b4332]">
      <RouterLink class="text-lg" to="/" style="font-family: 'Press Start 2P', cursive;">Comunidad G</RouterLink>
      <ul class="flex gap-4">
        <li>
          <RouterLink to="/" class="text-white hover:text-[#bb8a62]">Home</RouterLink>
        </li>
        <template v-if="user.id !== null">
          <li>
            <RouterLink to="/mi-perfil" class="text-white hover:text-[#bb8a62]">Mi perfil</RouterLink>
          </li>
          <li>
            <form action="#" @submit.prevent="handleLogout">
              <button type="submit" class="text-white hover:text-[#bb8a62]">{{ user.email }} (cerrar sesión)</button>
            </form>
          </li>
        </template>
        <template v-else>
          <li>
            <RouterLink to="/ingresar" class="text-white hover:text-[#bb8a62]">Iniciar sesión</RouterLink>
          </li>
          <li>
            <RouterLink to="/registro" class="text-white hover:text-[#bb8a62]">Registrarse</RouterLink>
          </li>
        </template>
      </ul>
    </nav>

    <main class="flex-grow">
      <div class="container mx-auto p-4">
        <RouterView />
      </div>
    </main>

    <footer class="flex justify-center items-center h-25 bg-slate-900 text-white p-4">
      <p>Da Vinci &copy; 2025</p>
    </footer>
  </div>
</template>
