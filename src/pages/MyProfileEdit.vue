<script setup>
import { onMounted, ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import useAuthUserState from '../composables/useAuthUserState';
import {  updateAuthUserProfile } from '../services/auth';

const { user } = useAuthUserState();

const { profile, updating, feedback, handleSubmit } = useProfileEditForm(user)

function useProfileEditForm(user) {
    const profile = ref({
        display_name: null,
        bio: null,
        career: null,

    });

    const updating = ref(false);
    const feedback = ref({
        type: 'success',
        message: null,
    });

    async function handleSubmit() {
        feedback.message = null;

        try {
            if (updating.value) return;

            updating.value = true;
            await updateAuthUserProfile({
                ...profile.value,
            });

            feedback.value = {
                type: 'success',
                message: 'Tu perfil se actualizó con éxito.',

            }

        } catch (error) {
            feedback.value = {
                type: 'error',
                message: 'Ocurrió un error al actualizar el perfil.',
            }
        }
        updating.value = false;
    }

    onMounted(() =>{
        profile.value = {
            bio: user.value.bio,
            display_name: user.value.display_name,
            career: user.value.career, 
        }
    })

    return {
        profile,
        updating,
        feedback,
        handleSubmit,

    }

}


</script>

<template>
    <MainH1>Editar mi perfil</MainH1>

    <div v-if="feedback.message != null" class="p-4 mb-4 rounded" :class="{
        'bg-red-100 text-red-700': feedback.type === 'error',
        'bg-green-100 text-green-700': feedback.type === 'success',
    }">
        {{ feedback.message }}
    </div>

    <form action="#" @submit.prevent="handleSubmit">
        <div class="mb-4">
            <label for="bio" class="block mb-2 text-white">Biografía</label>
            <textarea id="bio"
                class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg "
                v-model="profile.bio"></textarea>
        </div>
        <div class="mb-4">
            <label for="display_name" class="block mb-2 text-white">Nombre de usuario</label>
            <input type="text" id="display_name"
                class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
                v-model="profile.display_name">
        </div>
     
        <MainButton type="submit">
            
            <template v-if="!updating">Actualizar</template>
            <MainLoader v-else />
        </MainButton>
    </form>
</template>