<script>
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { getUserProfileById } from '../services/user-profiles';

export default {
    name: 'UserProfile',
    components: { MainH1, MainLoader },
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
            loading: false,
        }
    },
    async mounted() {
        try {
            this.loading = true;
            // Recapitulando: Cuando usamos Vue Router con la Options API, se nos generan automáticamente 2 variables:
            // $router y $route.
            // Contienen la referencia al objeto del Router y al objeto de la ruta en la que estamos, respectivamente.
            this.user = await getUserProfileById(this.$route.params.id);
            this.loading = false;
        } catch (error) {
            // TODO...
        }
    },
}
</script>

<template>
    <template v-if="!loading">
        <MainH1>Perfil de {{ user.email }}</MainH1>

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
    <MainLoader v-else />
</template>