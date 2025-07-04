import { getExtensionFromFile } from "../libraries/helpers";
import { deleteFile, getFileUrl, uploadFile } from "./storage";
import supabase from "./supabase";
import { createUserProfile, getUserProfileById, updateUserProfile } from "./user-profiles";


let user = {
    id: null,
    email: null,
    display_name: null,
    bio: null,
    career: null,
    photo: null,
}


let observers = [];


loadInitialUserState();



if (localStorage.getItem("user")) {
    user = JSON.parse(localStorage.getItem("user"));
}


/**
 * Carga la información del usuario autenticado, si es que existe alguno.
 */
async function loadInitialUserState() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) return;

    updateUser({
        id: data.user.id,
        email: data.user.email,
    });

   
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
            photo: profileData.photo,
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
    
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
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

    
    updateUser({
        id: data.user.id,
        email: data.user.email,
    });
}

export async function login(email, password) {
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('[auth.js login] Error al iniciar sesión: ', error);
        throw error;
    }

    
    updateUser({
        id: data.user.id,
        email: data.user.email,
    });

    loadUserExtendedProfile();

    return data.user;
}

export async function logout() {
    supabase.auth.signOut();

    
    updateUser({
        id: null,
        email: null,
        bio: null,
        display_name: null,
        career: null,
        photo: null,
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

export async function updateAuthUserPassword(password) {

    try {
        await supabase.auth.updateUser({ password });
    } catch (error) {
        console.error('[auth.js updateAuthUserPassword] Error al actualizar el password del usuario autenticado: ', error);
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

    observers.push(callback);



    notify(callback);

    // Retornamos una nueva función que elimina el callback de la lista de observers.
    return () => {
        observers = observers.filter(obs => obs !== callback);

    };
}

/**
 * Invoca un observer y le pasa los datos del usuario.
 * 
 * @param {({id: string|null, email: string|null}) => void} callback 
 */
function notify(callback) {
    callback({ ...user });
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

    if (user.id !== null) {

        localStorage.setItem("user", JSON.stringify(user))
    } else {
        localStorage.removeItem("user");
    }

    notifyAll();
}

/**
 * 
 * @param {File} file 
 */
export async function updateAuthUserAvatar(file) {
    try {

       const oldProfilePhoto = user.photo;


        const filename = `${user.id}/${crypto.randomUUID()}.${getExtensionFromFile(file)}`
        await uploadFile(filename, file);

        await updateAuthUserProfile({
            photo: getFileUrl(filename),

        });

        if(oldProfilePhoto){
            const photoToDelete = oldProfilePhoto.slice(oldProfilePhoto.indexOf("/avatars/")+ 9);
            deleteFile(photoToDelete);
        }
    } catch (error) {
        throw error;
    }
}