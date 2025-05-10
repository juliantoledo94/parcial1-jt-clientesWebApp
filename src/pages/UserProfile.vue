<script>
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { getUserProfileById } from '../services/user-profiles';
import { getPostsByUserId } from '../services/posts';


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
            posts: [],
        }
    },
    async mounted() {
        try {
            this.loading = true;
            // Recapitulando: Cuando usamos Vue Router con la Options API, se nos generan automáticamente 2 variables:
            // $router y $route.
            // Contienen la referencia al objeto del Router y al objeto de la ruta en la que estamos, respectivamente.
            const userId = this.$route.params.id;
        this.user = await getUserProfileById(userId);
        this.posts = await getPostsByUserId(userId);
        this.loading = false;
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

        <section class="mt-12">
            <h2 class="text-xl font-semibold mb-4">Publicaciones</h2>

            <div v-if="posts.length === 0" class="text-gray-500 italic">
                Este usuario no tiene publicaciones.
            </div>

            <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="post in posts" :key="post.id" class="p-4 border rounded shadow-sm">
                    <h3 class="text-lg font-bold">{{ post.title }}</h3>
                    <p class="text-gray-700 mt-2">{{ post.content }}</p>
                    <p class="text-xs text-gray-400 mt-2">{{ new Date(post.created_at).toLocaleString() }}</p>
                </div>
            </div>
        </section>

    </template>
    <MainLoader v-else />
</template>