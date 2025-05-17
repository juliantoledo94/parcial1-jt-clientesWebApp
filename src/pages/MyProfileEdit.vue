<script>
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { subscribeToUserState, updateAuthUserProfile } from '../services/auth';

// Variable para guardar la función de cancelar la suscripción a la autenticación.
let unsubAuth = () => {}

export default {
    name: 'MyProfileEdit',
    components: { MainH1, MainLoader, MainButton },
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
            profile: {
                display_name: null,
                bio: null,
                career: null,
            },
            updating: false,

            feedback: {
                type: 'success',
                message: null,
            }
        }
    },
    methods: {
        async handleSubmit() {
            // Limpiamos el mensaje de feedback.
            this.feedback.message = null;

            try {
                this.updating = true;
                await updateAuthUserProfile({
                    ...this.profile
                });
                this.updating = false;

                this.feedback = {
                    type: 'success',
                    message: 'Tu perfil se actualizó con éxito.',
                }
            } catch (error) {
                this.feedback = {
                    type: 'error',
                    message: 'Ocurrió un error al actualizar el perfil.',
                }
            }
        }
    },
    mounted() {
        unsubAuth = subscribeToUserState(newUserState => {
            this.user = newUserState;

            // Cargamos los datos iniciales del form.
            this.profile = {
                bio: this.user.bio,
                display_name: this.user.display_name,
                career: this.user.career,
            }
        });
    },
    unmounted() {
        // Cancelamos la suscripción.
        unsubAuth();
    }
}
</script>

<template>
    <MainH1>Editar mi perfil</MainH1>

    <div
        v-if="feedback.message != null"
        class="p-4 mb-4 rounded"
        :class="{
            'bg-red-100 text-red-700': feedback.type === 'error',
            'bg-green-100 text-green-700': feedback.type === 'success',
        }"
    >
        {{ feedback.message }}
    </div>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="bio" class="block mb-2 text-white">Biografía</label>
            <textarea
                id="bio"
                class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg "
                v-model="profile.bio"
            ></textarea>
        </div>
        <div class="mb-4">
            <label for="display_name" class="block mb-2 text-white">Nombre de usuario</label>
            <input
                type="text"
                id="display_name"
                class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
                v-model="profile.display_name"
            >
        </div>
        <!-- <div class="mb-4">
            <label for="career" class="block mb-2">Carrera</label>
            <input
                type="text"
                id="career"
                class="w-full p-2 border border-gray-400 rounded"
                v-model="profile.career"
            >
        </div> -->
        <MainButton type="submit">
            <!-- {{ !updating ? 'Actualizar' : 'Cargando...' }} -->
            <template v-if="!updating">Actualizar</template>
            <MainLoader v-else /> 
        </MainButton>
    </form>
</template>