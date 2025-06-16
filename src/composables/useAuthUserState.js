import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToUserState } from "../services/auth";
import { getPostsByUserId } from "../services/posts";


/**
 * Obtiene los datos del usuario autenticado o no autenticado y si tiene post o no tiene post
 * 
 * @returns {id:null|string, email: null|string, display_name: null|string, bio: null|string, career:  null|string, posts: array}
 */
export default function useAuthUserState() {
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

}