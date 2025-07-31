<script>
import MainH1 from '../components/MainH1.vue';
import { getPostByIdWithUser, loadCommentsForPost, saveComment, subscribeToPostComments } from '../services/post-comments';
import { getPostsByUserId } from '../services/posts';
import { subscribeToUserState } from '../services/auth';
import supabase from '../services/supabase';
import MainLoader from '../components/MainLoader.vue';
import { deleteComment } from '../services/post-comments';
import { subscribeToDeletedComments } from '../services/post-comments';
import { updateComment, subscribeToUpdatedComments } from '../services/post-comments';



let unsubAuth = () => { };

export default {
    name: 'PostDetail',
    components: { MainH1, MainLoader },
    data() {
        return {
            post: null,
            comments: [],
            newComment: '',
            user: {
                id: null,
                email: null,
            },
            loading: true,
            editingCommentId: null,
            editedContent: '',

        };
    },
    async mounted() {
        const postId = this.$route.params.id;

        unsubAuth = subscribeToUserState(user => this.user = user);


        const postData = await getPostByIdWithUser(postId);

        this.post = postData;


        this.comments = await loadCommentsForPost(postId);



        subscribeToPostComments(postId, newComment => {
            this.comments.push(newComment);
        });

        subscribeToDeletedComments(deletedId => {
            this.comments = this.comments.filter(c => c.id !== deletedId);
        });

        subscribeToUpdatedComments(postId, updatedComment => {
            const index = this.comments.findIndex(c => c.id === updatedComment.id);
            if (index !== -1) {
                this.comments[index] = updatedComment;
            }
        });





        this.loading = false;
    },
    methods: {
        async submitComment() {
            if (!this.newComment.trim()) return;

            const commentData = {
                post_id: this.post.id,
                user_id: this.user.id,
                email: this.user.email,
                content: this.newComment.trim(),
                created_at: new Date().toISOString()
            };

            await saveComment(commentData);

            /* this.comments.push(commentData); */
            this.newComment = '';
        },
        async deleteComment(commentId) {
            if (!confirm("¿Seguro que querés eliminar este comentario?")) return;

            try {
                await deleteComment(commentId);
                this.comments = this.comments.filter(c => c.id !== commentId);
            } catch (error) {
                alert("Error al eliminar comentario");
                console.error("Error al eliminar comentario:", error);
            }
        },
        async saveEditedComment(commentId) {
            try {
                await updateComment(commentId, this.editedContent);
                this.editingCommentId = null;
                this.editedContent = '';
            } catch (error) {
                alert("Error al editar comentario");
                console.error("Error al editar comentario:", error);
            }
        }




    },
    unmounted() {
        unsubAuth();
    }
}
</script>

<template>
    <MainH1>{{ post?.title }}</MainH1>
    <MainLoader v-if="loading" class="mx-auto my-10" />
    <section class="p-6 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg ">
        <div class="">

            <p class="mb-6 ">Creador <span class="text-blue-700">
                    <RouterLink :to="`/usuario/${user?.id}`">
                        {{ post?.user?.display_name || post?.user?.email ||
                            'Desconocido' }}

                    </RouterLink>

                </span></p>
            <p class="mb-6">{{ post?.content }}</p>
        </div>
        <div class="">

            <img :src="post?.photo" alt="" class="w-full max-w-[300px] max-h-[300px] object-cover rounded-lg">
        </div>
    </section>


    <section class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Comentarios</h2>




        <ul class="space-y-3 mb-6">
            <li v-for="comment in comments" :key="comment.id"
                class=" p-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg ">
                <RouterLink :to="`/usuario/${comment.user_id}`" class="font-bold text-sm text-blue-700 hover:underline">
                    {{ comment.email || 'Usuario desconocido' }}
                </RouterLink>
                <div v-if="editingCommentId === comment.id">
                    <textarea v-model="editedContent" class="w-full p-2 rounded mt-2 border-black"></textarea>
                    <div class="flex gap-2 mt-1">
                        <button @click="saveEditedComment(comment.id)"
                            class="text-green-500 text-sm hover:underline">Guardar</button>
                        <button @click="editingCommentId = null"
                            class="text-gray-400 text-sm hover:underline">Cancelar</button>
                    </div>
                </div>
                <p v-else class="mt-1">{{ comment.content }}</p>

                <p class="text-xs text-black mt-1">{{ new Date(comment.created_at).toLocaleString() }}</p>

                <div v-if="user?.id === comment.user_id || user?.is_admin" class="mt-2">
                    <button @click="deleteComment(comment.id)"
                        class="text-red-500 text-sm hover:underline cursor-pointer">
                        Eliminar
                    </button>
                    <button @click="() => {
                        editingCommentId = comment.id;
                        editedContent = comment.content;
                    }" class="text-green-500 text-sm hover:underline cursor-pointer ps-3">
                        Editar
                    </button>
                </div>
            </li>
        </ul>


        <form @submit.prevent="submitComment" class="space-y-2 ">
            <label for="newComment" class="mb-3">Agregar comentario:</label>
            <textarea id="newComment" v-model="newComment"
                class="w-full p-2  rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
                rows="3"></textarea>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Comentar</button>
        </form>
    </section>
</template>
