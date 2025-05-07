import supabase from "./supabase";
import { createUserProfile, getUserProfileById, updateUserProfile } from "./user-profiles";

/*
    Para manejar la comunicación del estado de autenticación entre todos los elementos del sistema (componentes, módulos,
    funciones, etc), vamos a usar el maravilloso patrón Observer.

    # Patrón de diseño Observer
    El patrón Observer define una relación de uno a muchos entre un Subject (sujeto) y múltiples Observers (observadores).
    Los observadores son elementos del sistema (clases, componentes, módulos, funciones, etc) que están interesados en
    los cambios ocurridos en el sujeto, que es otro elemento del sistema (clases, componentes, variables, etc).

    En la práctica, se necesita que el sujeto lleve una lista de los "observers". Dicho de otra forma, el observer tiene
    que pedirle al sujeto que se le notifique de los cambios que ocurre.
    Este proceso de pedir ser notificado se suele llamar "subscription" (suscripción), aunque también lo pueden ver 
    con el nombre de "listening" (escuchar) o "watch" (observar).
*/
// Definimos una variable que contenga los datos del usuario (esta sería el "subject").
let user = {
    id: null,
    email: null,
    display_name: null,
    bio: null,
    career: null,
}

// Definimos un array para guardar la lista de observers que quieren ser notificados de los cambios en "user".
let observers = [];

// Pedimos cargar la data actual del usuario.
loadInitialUserState();

/**
 * Carga la información del usuario autenticado, si es que existe alguno.
 */
async function loadInitialUserState() {
    const { data } = await supabase.auth.getUser();

    if(!data.user) return;

    updateUser({
        id: data.user.id,
        email: data.user.email,
    });

    // Hay un usuario autenticado, así que dejamos pidiendo que se traigan los datos faltantes.
    // Importante: Noten que NO pusimos el await. Dejamos que corra en paralelo.
    // TODO: Hacer el editar perfil.
    loadUserExtendedProfile();
}

/**
 * Carga el perfil extendido del usuario.
 */
async function loadUserExtendedProfile() {
    try {
        const profileData = await getUserProfileById(user.id);
        
        updateUser({
            display_name: profileData.display_name,
            bio: profileData.bio,
            career: profileData.career,
        });   
    } catch (error) {
        console.error('[auth.js loadUserExtendedProfile] Error al traer el perfil extendido del usuario: ', error);
        throw error;
    }
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 */
export async function register(email, password) {
    // Creamos una cuenta usamos el método signUp() de auth de supabase.
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if(error) {
        console.error('[auth.js register] Error al crear una cuenta: ', error);
        throw error;
    }

    try {
        await createUserProfile({
            id: data.user.id,
            email,
        });
    } catch (errorProfile) {
        throw errorProfile;
    }

    // Guardamos los datos del usuario autenticado y notificamos a los observers del cambio.
    updateUser({
        id: data.user.id,
        email: data.user.email,
    });
}

export async function login(email, password) {
    // Creamos una cuenta usamos el método signUp() de auth de supabase.
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if(error) {
        console.error('[auth.js login] Error al iniciar sesión: ', error);
        throw error;
    }

    // Guardamos los datos del usuario autenticado y notificamos a los observers del cambio.
    updateUser({
        id: data.user.id,
        email: data.user.email,
    });
    
    loadUserExtendedProfile();

    return data.user;
}

export async function logout() {
    supabase.auth.signOut();

    // Vaciamos los datos del usuario y notificamos a los observers del cambio.
    updateUser({
        id: null, 
        email: null,
    });
}

/**
 * 
 * @param {{bio: string|null, career: string|null, display_name: string|null}} data 
 */
export async function updateAuthUserProfile(data) {
    try {
        await updateUserProfile(user.id, data);

        updateUser(data);
    } catch (error) {
        console.error('[auth.js updateAuthUserProfile] Error al actualizar el perfil del usuario autenticado: ', error);
        throw error;
    }
}

/*----------------------------------------------------------------------
| Métodos para el observer
+-----------------------------------------------------------------------*/
/**
 * Suscribe un observer que se va a ejecutar cada vez que los datos del usuario autenticado cambien.
 * El observer debe ser una función ("callback") que va a recibir como argumento el objeto con los datos del usuario.
 * Retorna una nueva función que permite cancelar la suscripción.
 * 
 * @param {({id: string|null, email: string|null}) => void} callback 
 */
export function subscribeToUserState(callback) {
    // Agregamos el callback al stack de observers.
    observers.push(callback);

    // console.log("[Observer auth] Se agregó un nuevo observer. El stack actualizado es: ", observers);

    // Ejecutamos el callback para pasarle los datos actuales.
    notify(callback);

    // Retornamos una nueva función que elimina el callback de la lista de observers.
    return () => {
        observers = observers.filter(obs => obs !== callback);
        // console.log("[Observer auth] Se removió un observer. El stack actualizado es: ", observers);
    };
}

/**
 * Invoca un observer y le pasa los datos del usuario.
 * 
 * @param {({id: string|null, email: string|null}) => void} callback 
 */
function notify(callback) {
    callback({...user});
}

/**
 * Notifica a todos los observers.
 * Esta función debería ejecutarse cada vez que el valor de la variable "user" (nuestro subject) cambie.
 */
function notifyAll() {
    observers.forEach(callback => notify(callback));
    // observers.forEach(notify);
}

/**
 * 
 * @param {{id?: string|null, email?: string|null, bio?: string|null, career?: string|null, display_name?: string|null}} data 
 */
function updateUser(data) {
    user = {
        ...user,
        ...data,
    }
    notifyAll();
}