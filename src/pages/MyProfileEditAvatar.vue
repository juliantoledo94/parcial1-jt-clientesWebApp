<script setup>
import { ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';

const {avatar, updating, handleSubmit, handleFileChange} = useAvatarUploadForm();

function useAvatarUploadForm(){
    const avatar = ref({
        file: null,
        objectUrl: null,

    })
    const updating = ref(false);

    async function handleSubmit(){

    }

    async function handleFileChange(){

    }

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

    <form action="#" class="flex gap-4 mb-4">
        <div class="w-1/2">

            <div class="mb-4">

                <label for="avatar" class="block mb-2 text-white">Nueva imagen de perfil</label>
                <input type="file" id="avatar"
                    class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg">

            </div>

            <MainButton type="submit">

                <template v-if="!updating">subir imagen</template>
                <MainLoader v-else />
            </MainButton>
        </div>
        <!--  Columna del preview -->
        <div class="w-1/2">

            <img 
                v-if="avatar.objectUrl"
                :src="avatar.objectUrl" 
            
                alt="">
        </div>
    </form>

</template>