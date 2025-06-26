<script setup>

import MainH1 from '../components/MainH1.vue';
import useAuthUserState from '../composables/useAuthUserState';
import { deletePost } from '../services/posts';



const { user, posts } = useAuthUserState();


async function handleDelete(post) {
  if (!confirm('¿Seguro que querés eliminar este post?')) return;

  try {
    await deletePost(post.id);
    // Eliminarlo del array local de posts
    posts.value = posts.value.filter(p => p.id !== post.id);
  } catch (error) {
    alert('Error al eliminar el post.');
    console.error(error);
  }
}

/* function useAuthUserState() {
    let unsubAuth = () => { };

    const user = ref({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,

    });

    const posts = ref([]);

    onMounted(() => {
        unsubAuth = subscribeToUserState(async (newUserState) => {
            user.value = newUserState;

            if (user.value.id) {
                try {
                    posts.value = await getPostsByUserId(user.value.id);
                } catch (error) {
                    console.error("Error al obtener los posts del perfil:", error);
                }
            }
        });
    });
    onUnmounted(unsubAuth);

    return {
        user,
        posts,
    }

} */

/* export default {
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
} */
</script>

<template>



    <div class="flex gap-4 items-end">

        <MainH1>Mi perfil</MainH1>

    </div>

    <div class="p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg ">




        <div class=" italic text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.7)] flex items-center">
            <div class="overflow-hidden w-50 h-50 rounded-full border-2 border-white bg-[#1f3d2e] flex items-center justify-center  text-[#9ee37d] text-3xl font-bold me-5 mb-3"
                style="font-family: 'Press Start 2P', cursive;">
                <img v-if="user.photo" :src="user.photo" alt="Foto de perfil"
                    class="w-full h-full object-cover object-center" />

                <!-- Inicial si no hay foto -->
                <span v-else>
                    {{ user.email?.charAt(0).toUpperCase() }}
                </span>

                <!-- {{ user?.email?.charAt(0).toUpperCase() }} -->

            </div>
            {{ user.bio || 'Acá va mi biografía...' }}

        </div>

        <dl>
            <dt class="mb-0.5 font-bold">Email</dt>
            <dd class="mb-4">{{ user.email }}</dd>
            <dt class="mb-0.5 font-bold">Nombre de Usuario</dt>
            <dd class="mb-4">{{ user.display_name || 'Sin especificar' }}</dd>



        </dl>



        <div class="row flex flex-wrap gap-4">

            <div class="border border-white rounded-xl bg-[#1f3d2e] text-[#9ee37d] hover:text-white p-2">

                <RouterLink to="/mi-perfil/editar" class="mb-4 ">Editar perfil</RouterLink>
            </div>
            <div class="border border-white rounded-xl bg-[#1f3d2e] text-[#9ee37d] hover:text-white p-2">

                <RouterLink to="/mi-perfil/editar/avatar" class="mb-4 ">Editar imagen</RouterLink>
            </div>
            <div class="border border-white rounded-xl bg-[#1f3d2e]  text-[#9ee37d] hover:text-white p-2">

                <RouterLink to="/mi-perfil/new-post" class="mb-4 ">Crear post</RouterLink>
            </div>
        </div>

    </div>
    <section class="mt-12">
        <h2 class="text-xl font-semibold mb-4">Mis posteos</h2>

        <div v-if="posts.length === 0" class="italic text-gray-500">
            Todavía no tenés ningún post.
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="post in posts" :key="post.id"
                class="p-6 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:scale-100">

                <!-- Botón Eliminar -->
                <button @click="handleDelete(post)"
                    class="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm font-bold">
                    Eliminar
                </button>

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