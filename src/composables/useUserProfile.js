import { onMounted, ref } from "vue";
import { getUserProfileById } from "../services/user-profiles";
import { getPostsByUserId } from "../services/posts";

/**
 * 
 * @param {*} id string
 * @returns 
 */
export default function useUserProfile(id) {

    const user = ref({
        id,
        email: null,
        bio: null,
        display_name: null,
        career: null,
    });

    const loading = ref(false); // ← corregido el typo
    const posts = ref([]);

    onMounted(async () => {
        try {
            loading.value = true;

            user.value = await getUserProfileById(id);
            posts.value = await getPostsByUserId(id);
            loading.value = false;
        } catch (error) {
            console.error("Error: ", error)
            throw error;
        }
    });

    return {
        user,
        loading,
        posts,
    }

}