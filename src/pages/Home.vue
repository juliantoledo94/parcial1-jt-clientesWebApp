<script setup>
import { RouterLink } from 'vue-router';
import MainH1 from '../components/MainH1.vue';
import { getAllPosts } from '../services/posts';
import { onMounted, ref } from 'vue';

const posts = ref([]);

onMounted(async () => {
    try {
        posts.value = await getAllPosts();
    } catch (error) {
        console.error("Error al cargar los posts en Home: ", error);
    }
});

/* export default {
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
} */
</script>

<template>
    <MainH1>¡Les damos la bienvenida a Comunidad G!</MainH1>

    <section class="mt-12">
        <h2 class="text-xl font-semibold mb-4 text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.7)]">Últimas
            publicaciones</h2>

        <div v-if="posts.length === 0" class="italic text-gray-500">
            No hay publicaciones todavía.
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="post in posts" :key="post.id"
                class="p-6 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-1 hover:scale-100">

               

                <div
                    class=" mb-4 w-24 h-24 rounded-full border-2 border-white bg-[#1f3d2e] mx-auto flex items-center justify-center  text-[#9ee37d] text-3xl font-bold " style="font-family: 'Press Start 2P', cursive;">
                    
                     <RouterLink :to="`/usuario/${post.user?.id}`" >
                        {{ post.user?.email.charAt(0).toUpperCase() }}
                    </RouterLink>
                </div>
                <div class="bg-white/90 rounded-lg p-4 shadow-inner">

                    <h3 class="text-lg font-bold mb-1">
                        <RouterLink :to="`/post/${post.id}`" class="text-lg font-bold mb-1 hover:underline block">
                            {{ post.title }}
                        </RouterLink>
                    </h3>
    
                    <p class="text-sm text-gray-500 mb-2">
                        Por
                        <RouterLink :to="`/usuario/${post.user?.id}`" class="text-blue-600 hover:underline">
                            {{ post.user?.display_name || post.user?.email || 'Usuario desconocido' }}
                        </RouterLink>
                    </p>
    
                    <p class="text-gray-700 line-clamp-3">{{ post.content }}</p>
                    <p class="text-xs text-gray-400 mt-2">{{ new Date(post.created_at).toLocaleString() }}</p>
                </div>
            </div>
        </div>

    </section>
</template>