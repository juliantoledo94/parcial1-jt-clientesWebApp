<script setup>
import { ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import useAuthUserState from '../composables/useAuthUserState';
import { onMounted } from 'vue';
import { getPostsByUserId, createNewPost, updatePostImage } from '../services/posts';

import { getExtensionFromFile } from '../libraries/helpers';


const { user, posts } = useAuthUserState();

const {
  post,
  image,
  submitting,
  feedback,
  handleSubmit,
  handleFileChange,
} = usePostUploadForm();

function usePostUploadForm() {
  const post = ref({
    title: '',
    content: '',
  });

  const image = ref({
    file: null,
    objectUrl: null,
  });

  const submitting = ref(false);
  const feedback = ref({
    type: 'success',
    message: null,
  });

  async function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (image.value.objectUrl) {
      URL.revokeObjectURL(image.value.objectUrl);
    }

    image.value.file = selectedFile;
    image.value.objectUrl = URL.createObjectURL(selectedFile);
  }

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

      let photoUrl = null;
      if (image.value.file) {
        photoUrl = await updatePostImage(image.value.file, user.value.id);
      }

      await createNewPost({
        user_id: user.value.id,
        title: post.value.title,
        content: post.value.content,
        photo: photoUrl,
        created_at: new Date().toISOString(),
      });

      feedback.value = {
        type: 'success',
        message: 'El post se creó con éxito.',
      };

      post.value.title = '';
      post.value.content = '';
      image.value.file = null;
      image.value.objectUrl = null;

      posts.value = await getPostsByUserId(user.value.id);
    } catch (error) {
      console.error('Error al crear post con imagen:', error);
      feedback.value = {
        type: 'error',
        message: 'Ocurrió un error al crear el post.',
      };
    } finally {
      submitting.value = false;
    }
  }

  onMounted(() => {
    if (image.value?.objectUrl) {
      URL.revokeObjectURL(image.value.objectUrl);
    }
  });

  return {
    post,
    image,
    submitting,
    feedback,
    handleSubmit,
    handleFileChange,
  };
}

/* const { user, posts } = useAuthUserState();

const post = ref({
  title: '',
  content: '',
});

const submitting = ref(false);

const feedback = ref({
  type: 'success',
  message: null,
});

const image = ref({
  file: null,
  objectUrl: null,
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
} */

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

    <div class="w-1/2">

      <div class="mb-4">

        <label for="image" class="block mb-2 text-white">Nueva imagen de perfil</label>

        <input type="file" id="image"
          class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
          @change="handleFileChange">

      </div>


    </div>

    <div class="w-1/2">

      <img v-if="image.objectUrl" :src="image.objectUrl" alt="" class="w-full max-w-[200px] max-h-[200px] object-cover rounded-lg mb-4">
    </div>

    <MainButton type="submit">
      <template class="mt-4" v-if="!submitting">Publicar</template>
      <MainLoader v-else />
    </MainButton>

  </form>
</template>
