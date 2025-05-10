<script>
import MainH1 from '../components/MainH1.vue';
import { getPostByIdWithUser, loadCommentsForPost, saveComment, subscribeToPostComments } from '../services/post-comments';
import { getPostsByUserId } from '../services/posts';
import { subscribeToUserState } from '../services/auth';
import supabase from '../services/supabase';

let unsubAuth = () => { };

export default {
    name: 'PostDetail',
    components: { MainH1 },
    data() {
        return {
            post: null,
            comments: [],
            newComment: '',
            user: {
                id: null,
                email: null,
            },
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

            this.comments.push(commentData);
            this.newComment = '';
        }

    },
    unmounted() {
        unsubAuth();
    }
}
</script>

<template>
    <MainH1>{{ post?.title }}</MainH1>
    <p class="mb-6">Creador <span class="text-blue-600">{{ post?.user?.display_name || post?.user?.email ||
        'Desconocido' }}</span></p>
    <p class="mb-6">{{ post?.content }}</p>

    <section class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Comentarios</h2>

        <div v-if="comments.length === 0" class="italic text-gray-500">Sin comentarios aún.</div>

        <ul class="space-y-3 mb-6">
            <li v-for="comment in comments" :key="comment.id" class="border p-3 rounded">
                <p class="font-bold text-sm text-blue-700">
                    {{ comment.email || 'Usuario desconocido' }}
                </p>
                <p class="mt-1">{{ comment.content }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ new Date(comment.created_at).toLocaleString() }}</p>
            </li>
        </ul>


        <form @submit.prevent="submitComment" class="space-y-2">
            <label for="newComment">Agregar comentario:</label>
            <textarea id="newComment" v-model="newComment" class="w-full p-2 border rounded" rows="3"></textarea>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Comentar</button>
        </form>
    </section>
</template>
