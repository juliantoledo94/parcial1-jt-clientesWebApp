<script setup>
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { getUserProfileById } from '../services/user-profiles';
import { getPostsByUserId } from '../services/posts';
import { RouterLink, useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import useUserProfile from '../composables/useUserProfile';
import useAuthUserState from '../composables/useAuthUserState';
import { deletePost } from '../services/posts';
const router = useRoute();

const { user, loading, posts } = useUserProfile(router.params.id)

const { user: authUser } = useAuthUserState();

async function handleDelete(post) {
    console.log(post)
    if (!post?.id) {
        alert('Post inválido, no se puede eliminar.');
        console.error("Post recibido no tiene ID:", post);
        return;
    }

    if (!confirm('¿Seguro que querés eliminar este post?')) return;

    try {
        await deletePost(post);
        posts.value = posts.value.filter(p => p.id !== post.id);
    } catch (error) {
        alert('Error al eliminar el post.');
        console.error('[handleDelete]', error);
    }
}


</script>

<template>
    <template v-if="!loading">
        <MainH1>Perfil de {{ user.email }}</MainH1>
        <div class="p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg">
            <div class=" italic text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.7)] flex items-center">
                <div class=" w-50 h-50 overflow-hidden rounded-full border-2 border-white bg-[#1f3d2e] flex items-center justify-center  text-[#9ee37d] text-3xl font-bold me-5 mb-3"
                    style="font-family: 'Press Start 2P', cursive;">

                    <img v-if="user.photo" :src="user.photo" alt="Foto de perfil"
                        class="w-full h-full object-cover object-center" />


                    <span v-else>
                        {{ user.email?.charAt(0).toUpperCase() }}
                    </span>



                </div>
                {{ user.bio || 'Acá va mi biografía...' }}

            </div>

            <dl>
                <dt class="mb-0.5 font-bold">Email</dt>
                <dd class="mb-4">{{ user.email }}</dd>
                <dt class="mb-0.5 font-bold">Nombre de Usuario</dt>
                <dd class="mb-4">{{ user.display_name || 'Sin especificar' }}</dd>

            </dl>

            <hr class="mb-4">
            <RouterLink :to="`/usuario/${user.id}/chat`" class="text-blue-700">Iniciar conversación privada con {{
                user.email }}</RouterLink>

        </div>



        <section class="mt-12">
            <h2 class="text-xl font-semibold mb-4">Publicaciones</h2>

            <div v-if="posts.length === 0" class="text-gray-500 italic">
                Este usuario no tiene publicaciones.
            </div>

            <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="post in posts" :key="post.id"
                    class="p-6 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:scale-100">
                    <div v-if="authUser?.id === post.user_id || authUser?.is_admin" class="flex justify-between mb-2">
                        <RouterLink :to="`/mi-perfil/editar-post/${post.id}`"
                            class="text-blue-600 hover:text-blue-800 text-sm font-bold">
                            Editar
                        </RouterLink>

                        <button @click="handleDelete(post)" class="text-red-600 hover:text-red-800 text-sm font-bold">
                            Eliminar
                        </button>
                    </div>

                    <h3 class="text-lg font-bold">
                        <RouterLink :to="`/post/${post.id}`" class="text-lg font-bold mb-1 hover:underline block">
                            {{ post.title }}
                        </RouterLink>
                    </h3>
                </div>
            </div>
        </section>

    </template>
    <MainLoader v-else />
</template>