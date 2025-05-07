<script>
import MainH1 from '../components/MainH1.vue';
import { subscribeToUserState } from '../services/auth';

let unsubAuth = () => {};

export default {
    name: 'MyProfile',
    components: { MainH1, },
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
        }
    },
    mounted() {
        unsubAuth = subscribeToUserState(newUserState => this.user = newUserState);
    },
    unmounted() {
        unsubAuth();
    }
}
</script>

<template>
    <div class="flex gap-4 items-end">
        <MainH1>Mi perfil</MainH1>
        <RouterLink to="/mi-perfil/editar" class="mb-4 text-blue-700">Editar</RouterLink>
        <RouterLink to="/mi-perfil/new-post" class="mb-4 text-blue-700">Crear Post</RouterLink>
    </div>

    <div class="ms-4 my-8 italic">{{ user.bio || 'Acá va mi biografía...' }}</div>

    <dl>
        <dt class="mb-0.5 font-bold">Email</dt>
        <dd class="mb-4">{{ user.email }}</dd>
        <dt class="mb-0.5 font-bold">Nombre de Usuario</dt>
        <dd class="mb-4">{{ user.display_name || 'Sin especificar' }}</dd>
        <dt class="mb-0.5 font-bold">Carrera</dt>
        <dd class="mb-4">{{ user.career || 'Sin especificar' }}</dd>
    </dl>
</template>