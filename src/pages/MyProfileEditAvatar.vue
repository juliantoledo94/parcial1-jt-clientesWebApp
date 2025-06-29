<script setup>
import { onMounted, ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { updateAuthUserAvatar } from '../services/auth';

const { avatar, updating, handleSubmit, handleFileChange } = useAvatarUploadForm();

function useAvatarUploadForm() {
    const avatar = ref({
        file: null,
        objectUrl: null,

    })
    const updating = ref(false);

    async function handleSubmit() {
        try {

            if (!avatar.value.file) return;

            if (updating.value) return;

            try {
                updating.value = true;
                await updateAuthUserAvatar(avatar.value.file);

            } catch (error) {
                console.error("Error: ", error)
                throw error;
            }
            updating.value = false;
        } catch (error) {

        }
    }

    async function handleFileChange(event) {

        const selectedFile = event.target.files[0];

        

        if (!selectedFile) return;

        avatar.value.file = selectedFile;

        

        if (avatar.value.objectUrl) {
            URL.revokeObjectURL(avatar.value.objectUrl);
        }

        avatar.value.objectUrl = URL.createObjectURL(avatar.value.file);
    }

    onMounted(() => avatar.value ? URL.revokeObjectURL(avatar.value) : "");


    return {
        avatar,
        updating,
        handleSubmit,
        handleFileChange,
    }
}

</script>


<template>
    <MainH1>Editar mi imagen de perfil</MainH1>

    <form action="#" class="flex gap-4 mb-4" @submit.prevent="handleSubmit">
        <div class="w-1/2">

            <div class="mb-4">

                <label for="avatar" class="block mb-2 text-white">Nueva imagen de perfil</label>

                <input type="file" id="avatar"
                    class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
                    @change="handleFileChange">

            </div>

            <MainButton type="submit">

                <template v-if="!updating">subir imagen</template>
                <MainLoader v-else />
            </MainButton>
        </div>
        
        <div class="w-1/2">

            <img v-if="avatar.objectUrl" :src="avatar.objectUrl" alt="">
        </div>
    </form>

</template>