<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPostByIdWithUser } from '../services/post-comments';
import { updatePost } from '../services/posts';

import MainH1 from '../components/MainH1.vue';
import MainButton from '../components/MainButton.vue';
import MainLoader from '../components/MainLoader.vue';

import useAuthUserState from '../composables/useAuthUserState';

const { user } = useAuthUserState();

const route = useRoute();
const router = useRouter();

const post = ref(null);
const form = ref({
  title: '',
  content: '',
});
const submitting = ref(false);
const feedback = ref({
  type: '',
  message: null,
});

onMounted(async () => {
  const postId = route.params.id;

  try {
    const data = await getPostByIdWithUser(postId);

    // Validar que el post sea del usuario actual
    if (data.user_id !== user.value.id) {
      feedback.value = {
        type: 'error',
        message: 'No tenés permisos para editar este post.',
      };
      return;
    }

    post.value = data;
    form.value.title = data.title;
    form.value.content = data.content;

  } catch (error) {
    console.error('Error al cargar el post:', error);
    feedback.value = {
      type: 'error',
      message: 'No se pudo cargar el post.',
    };
  }
});

async function handleSubmit() {
  feedback.value.message = null;

  try {
    submitting.value = true;

    await updatePost(post.value.id, {
      title: form.value.title,
      content: form.value.content,
    });

    feedback.value = {
      type: 'success',
      message: 'Publicación actualizada con éxito.',
    };

   /*  setTimeout(() => {
      router.push('/mi-perfil');
    }, 1000); */

  } catch (error) {
    feedback.value = {
      type: 'error',
      message: 'Error al guardar los cambios.',
    };
    console.error(error);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <MainH1>Editar publicación</MainH1>

  <div
    v-if="feedback.message"
    class="p-4 mb-4 rounded"
    :class="{
      'bg-red-100 text-red-700': feedback.type === 'error',
      'bg-green-100 text-green-700': feedback.type === 'success',
    }"
  >
    {{ feedback.message }}
  </div>

  <form v-if="post" @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label for="title" class="block mb-2">Título</label>
      <input
        type="text"
        id="title"
        class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
        v-model="form.title"
        required
      />
    </div>

    <div class="mb-4">
      <label for="content" class="block mb-2">Contenido</label>
      <textarea
        id="content"
        class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
        rows="5"
        v-model="form.content"
        required
      ></textarea>
    </div>

    <MainButton type="submit">
      <template v-if="!submitting">Guardar cambios</template>
      <MainLoader v-else />
    </MainButton>
  </form>
</template>