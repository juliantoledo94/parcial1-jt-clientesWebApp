<script setup>
import { ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { getPostsByUserId } from '../services/posts';
import { createNewPost } from '../services/posts';
import useAuthUserState from '../composables/useAuthUserState';

const { user, posts } = useAuthUserState();

const post = ref({
  title: '',
  content: '',
});

const submitting = ref(false);

const feedback = ref({
  type: 'success',
  message: null,
});

async function handleSubmit() {
  feedback.value.message = null;

  if (!user.value.id) {
    feedback.value = {
      type: 'error',
      message: 'Usuario no autenticado.',
    };
    return;
  }

  try {
    submitting.value = true;

    await createNewPost({
      user_id: user.value.id,
      title: post.value.title,
      content: post.value.content,
      created_at: new Date().toISOString(),
    });

    feedback.value = {
      type: 'success',
      message: 'El post se creó con éxito.',
    };

    // limpiar formulario y actualizar posts del perfil
    post.value.title = '';
    post.value.content = '';

    posts.value = await getPostsByUserId(user.value.id);
  } catch (error) {
    feedback.value = {
      type: 'error',
      message: 'Ocurrió un error al crear el post.',
    };
  }

  submitting.value = false;
}

/* let unsubAuth = () => {}

export default {
  name: 'NewPost',
  components: { MainH1, MainButton, MainLoader },
  data() {
    return {
      user: {
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
      },
      post: {
        title: '',
        content: '',
      },
      submitting: false,
      feedback: {
        type: 'success',
        message: null,
      }
    }
  },
  methods: {
    async handleSubmit() {
      this.feedback.message = null;

      if (!this.user.id) {
        this.feedback = {
          type: 'error',
          message: 'Usuario no autenticado.',
        };
        return;
      }

      try {
        this.submitting = true;
        await createNewPost({
          user_id: this.user.id,
          title: this.post.title,
          content: this.post.content,
          created_at: new Date().toISOString(),
        });
        this.submitting = false;

        this.feedback = {
          type: 'success',
          message: 'El post se creó con éxito.',
        };

        // Limpiar formulario
        this.post.title = '';
        this.post.content = '';
      } catch (error) {
        this.feedback = {
          type: 'error',
          message: 'Ocurrió un error al crear el post.',
        };
        this.submitting = false;
      }
    }
  },
  mounted() {
    unsubAuth = subscribeToUserState(newUser => {
      this.user = newUser;
    });
  },
  unmounted() {
    unsubAuth();
  }
} */
</script>

<template>
  <MainH1>Crear nuevo post</MainH1>

  <div v-if="feedback.message" class="p-4 mb-4 rounded" :class="{
    'bg-red-100 text-red-700': feedback.type === 'error',
    'bg-green-100 text-green-700': feedback.type === 'success',
  }">
    {{ feedback.message }}
  </div>

  <form @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label for="title" class="block mb-2">Título</label>
      <input type="text" id="title"
        class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg" v-model="post.title"
        required />
    </div>

    <div class="mb-4">
      <label for="content" class="block mb-2">Contenido</label>
      <textarea id="content" class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
        v-model="post.content" required></textarea>
    </div>

    <MainButton type="submit">
      <template v-if="!submitting">Publicar</template>
      <MainLoader v-else />
    </MainButton>
  </form>
</template>

<!-- <template>
  <MainH1>Crear nuevo post</MainH1>

  <div v-if="feedback.message" class="p-4 mb-4 rounded" :class="{
    'bg-red-100 text-red-700': feedback.type === 'error',
    'bg-green-100 text-green-700': feedback.type === 'success',
  }">
    {{ feedback.message }}
  </div>

  <form @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label for="title" class="block mb-2">Título</label>
      <input type="text" id="title"
        class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg" v-model="post.title"
        required>
    </div>

    <div class="mb-4">
      <label for="content" class="block mb-2">Contenido</label>
      <textarea id="content" class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
        v-model="post.content" required></textarea>
    </div>

    <MainButton type="submit">
      <template v-if="!submitting">Publicar</template>
      <MainLoader v-else />
    </MainButton>
  </form>
</template> -->
