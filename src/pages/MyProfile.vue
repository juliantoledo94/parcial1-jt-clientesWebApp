<script>
import MainH1 from '../components/MainH1.vue';
import { subscribeToUserState } from '../services/auth';
import { getPostsByUserId } from '../services/posts';

let unsubAuth = () => { };

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
            posts: []
        }
    },
    mounted() {
        unsubAuth = subscribeToUserState(async newUserState => {
            this.user = newUserState

            if (this.user.id) {
                try {
                    this.posts = await getPostsByUserId(this.user.id)
                } catch (error) {
                    console.error("Error al obtener los datos del perfil: ", error);
                }
            }

        });
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

    <div class="ms-4 my-8 italic text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.7)]">{{ user.bio || 'Acá va mi biografía...' }}</div>

    <dl>
        <dt class="mb-0.5 font-bold">Email</dt>
        <dd class="mb-4">{{ user.email }}</dd>
        <dt class="mb-0.5 font-bold">Nombre de Usuario</dt>
        <dd class="mb-4">{{ user.display_name || 'Sin especificar' }}</dd>
        <!-- <dt class="mb-0.5 font-bold">Carrera</dt>
        <dd class="mb-4">{{ user.career || 'Sin especificar' }}</dd> -->
    </dl>

    <section class="mt-12">
        <h2 class="text-xl font-semibold mb-4">Mis posteos</h2>

        <div v-if="posts.length === 0" class="italic text-gray-500">
            Todavía no tenés ningún post.
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="post in posts" :key="post.id" class="p-6 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:scale-100">
                <h3 class="text-lg font-bold">
                    <RouterLink :to="`/post/${post.id}`" class="text-lg font-bold mb-1 hover:underline block">
                        {{ post.title }}
                    </RouterLink>
                    <!-- {{ post.title }} -->

                </h3>
                <p class="text-gray-700 mt-2 line-clamp-3">{{ post.content }}</p>
                <p class="text-sm text-gray-400 mt-2">{{ new Date(post.created_at).toLocaleString() }}</p>
            </div>
        </div>

    </section>
</template>