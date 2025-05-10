<script>
import { RouterLink } from 'vue-router';
import MainH1 from '../components/MainH1.vue';
import { getAllPosts } from '../services/posts';

export default {
    name: 'Home',
    components: { MainH1 },
    data() {
        return {
            posts: [],
        };
    },
    async mounted() {
        try {
            this.posts = await getAllPosts();
        } catch (error) {
            console.error("Error al cargar los posts en Home: ", error)
        }
    }
}
</script>

<template>
    <MainH1>¡Les damos la bienvenida a DV Social!</MainH1>

    <section class="mt-12">
        <h2 class="text-xl font-semibold mb-4">Últimas publicaciones</h2>

        <div v-if="posts.length === 0" class="italic text-gray-500">
            No hay publicaciones todavía.
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="post in posts" :key="post.id" class="p-4 border rounded shadow-sm">
                <h3 class="text-lg font-bold mb-1">{{ post.title }}</h3>
                
                <p class="text-sm text-gray-500 mb-2">
                    Por 
                    <RouterLink
                    :to="`/usuario/${post.user?.id}`"
                    class="text-blue-600 hover:underline"
                    >
                    {{ post.user?.display_name || post.user?.email || 'Usuario desconocido' }}
                    </RouterLink>
                </p>
                <p class="text-gray-700 line-clamp-3">{{ post.content }}</p>
                <p class="text-xs text-gray-400 mt-2">{{ new Date(post.created_at).toLocaleString() }}</p>
            </div>
        </div>

    </section>
</template>