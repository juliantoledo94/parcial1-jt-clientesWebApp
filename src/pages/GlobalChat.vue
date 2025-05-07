<script>
import { nextTick } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { loadLastGlobalChatMessages, saveGlobalChatMessage, subscribeToGlobalChatNewMessages } from '../services/global-chat';
import { subscribeToUserState } from '../services/auth';
import MainLoader from '../components/MainLoader.vue';

let unsubAuth = () => {};

export default {
    name: 'GlobalChat',
    components: { MainH1, MainLoader },
    // La propiedad "data" nos permite definir cuáles son los valores del "state" del componente.
    // Entiéndase por "state" los datos propios del componente que pueden variar duranta la vida del mismo.
    // Esta propiedad debe tener una función que retorne un objeto con los datos.
    // data: function() {
    //     return {}
    // },
    // data: () => {
    //     return {}
    // },
    data() {
        return {
            messages: [],
            loadingMessages: true,

            newMessage: {
                body: '',
            },

            user:{
                id: null,
                email: null,
                bio: null,
                career: null,
                display_name: null,
            }
        }
    },
    // La propiedad "methods" permite definir las funciones que queremos que el componente tenga.
    methods: {
        async sendMessage() {
            await saveGlobalChatMessage({
                body: this.newMessage.body,
                user_id: this.user.id,
                email: this.user.email,
            });
            
            this.newMessage.body = "";
        }
    },
    async mounted() {
        unsubAuth = subscribeToUserState(newUserData => this.user = newUserData);

        subscribeToGlobalChatNewMessages(async newMessageReceived => {
            this.messages.push(newMessageReceived);
            await nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        });
        // subscribeToGlobalChatNewMessages(function (newMessageReceived) { this.messages.push(newMessageReceived) });

        // Traemos los mensajes iniciales.
        try {
            this.messages = await loadLastGlobalChatMessages();
            this.loadingMessages = false;

            // En this.$refs podemos acceder a todas las referencias de los elementos del DOM de nuestro template.
            // console.log("Contenedor del chat: ", this.$refs.chatContainer);
            // Agregamos el nextTick() para pedirle a Vue que espere al próximo frame de "redraw" (redibujado en el
            // browser) antes de ejecutar la actualización del scroll.
            // ¿Por qué lo necesito?
            // Nosotros queremos que se carguen los mensajes de chat, y el scroll vertical del contenedor de los
            // mensajes se vaya al final.
            // Para esto, es necesario que los mensajes estén renderizados en el DOM. Recién ahí va a existir el 
            // scroll que podemos mover, y el alto final del mismo.
            // Si bien ya le indicamos en la instrucción anterior que reciba los mensajes, que son los que luego
            // recorremos con un v-for, Vue no actualiza el DOM automáticamente cada vez que hacemos algún cambio
            // del state de algún componente.
            // Sino que Vue "agrupa" (batch) múltiples modificaciones y las ejecuta todas juntas.
            // Esto es importante. Porque la tarea más intensiva (o una de ellas) que un browser puede tener que 
            // realizar, es precisamente, hacer un "redraw".
            // En la mayoría de los casos, esto es ideal.
            // Pero hay casos donde necesitamos esperar a que algo en el DOM se actualice antes de realizar la
            // siguiente instrucción. Como es este caso.
            // En estos escenarios, Vue nos permite usar el nextTick() que espera al siguiente "batch" de las
            // instrucciones a actualizar.
            await nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        } catch (error) {
            // TODO: Manejar el error...
        }
    },
    unmounted() {
        unsubAuth();
    }
}
</script>

<template>
    <MainH1>Chat global</MainH1>
    
    <div class="flex gap-4">
        <section 
            ref="chatContainer"
            class="overflow-y-auto w-9/12 h-100 p-4 border border-gray-400 rounded"
        >
            <h2 class="sr-only">Lista de mensajes</h2>

            <ul 
                v-if="!loadingMessages"
                class="flex flex-col gap-4"
            >
                <!-- El prefijo "v-" indica que es una directiva. Una directa es una funcionalidad de Vue que extiende
                el HTML.
                El v-for repite la estructura de HTML por cada elemento del array que le pasamos.
                Siempre deberíamos agregar la propiedad "key" en conjunto con el v-for, asignándole un valor único de 
                los datos que recibimos.

                Otra directiva importante en Vue es "v-bind:" que se debe prefijar a cualquier otro atributo del elemento.
                Es de las más comunes de tener que utilizar, y es por eso que Vue tiene la abreviatura de solo el ":" como
                prefijo.
                Lo que hace es permitirnos usar como valor para el atributo un valor de JS (ya sea una expresión, 
                llamada a una función, acceso a un valor del componente, etc).
                -->
                <li
                    v-for="message in messages"
                    :key="message.id"
                    class="flex flex-col gap-0.5"
                >
                    <div>
                        <RouterLink 
                            :to="`/usuario/${message.user_id}`"
                            class="font-bold text-blue-700 underline"
                        >
                            {{ message.email }}
                        </RouterLink> 
                        dijo:
                    </div>
                    <div>{{ message.body }}</div>
                    <div class="text-sm text-gray-600">{{ message.created_at }}</div>
                </li>
            </ul>
            <div v-else class="flex justify-center items-center h-full">
                <MainLoader />
            </div>
        </section>
        <section class="w-3/12">
            <h2 class="text-2xl mb-4">Enviar un mensaje</h2>

            <!-- 
            Para asociar un evento a un elemento del form podemos utilizar la directiva "v-on:" seguida del evento, o
            el shortcut "@evento".
            Como valor, se espera recibir una función con lo que queremos que se ejecute.
            Adicionalmente, nos permite agregar modificadores a los eventos, escribiendo ".modificador" a continuación
            del mismo.
            Los modificadores alteran o agregan alguna funcionalidad propia del evento.
            El más común es probablemente ".prevent" (que hace un preventDefault()).
            -->
            <form
                action="#"
                @submit.prevent="() => sendMessage()"
            >
                <div class="mb-4">
                    <div class="block mb-2">Email</div>
                    <div class="font-bold">{{ user.email }}</div>
                </div>
                <div class="mb-4">
                    <label for="body" class="block mb-2">Mensaje</label>
                    <!-- 
                    v-model es un shortcut que permite crear un "two-way data binding" entre un valor del state y un
                    control de formulario.
                    "Two-way data binding" es una práctica donde el framework se asegura de que la data del state y
                    del control del form estén sincronizados.
                    Dicho de otra forma, si cambio el valor del state, se actualiza el campo, y si cambio el valor del
                    campo, se actualiza el state.
                    -->
                    <textarea
                        id="body"
                        class="w-full p-2 border border-gray-400 rounded"
                        v-model="newMessage.body"
                    ></textarea>
                </div>
                <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Enviar</button>
            </form>
        </section>
    </div>
</template>