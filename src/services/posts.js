import { getExtensionFromFile } from "../libraries/helpers";
import { deleteFile, getFileUrl, uploadFile } from "./storage";
import supabase from "./supabase";
import { getPostByIdWithUser } from './post-comments'

/**
 * Crea un nuevo post en la base de datos y lo asocia al usuario que lo creó.
 * 
 * @param {{user_id: string, title: string, content: string, created_at: string}} postData - Datos del post a insertar.
 * @throws {Error} - Lanza un error si ocurre algún problema durante la inserción.
 */
export async function createNewPost(postData) {
  const { error } = await supabase
    .from('posts') // Asegurate que el nombre de la tabla es exactamente este
    .insert(postData);

  if (error) {
    console.error('[posts.js createNewPost] Error al crear el post: ', error);
    throw error;
  }
}


/**
 * Obtiene todos los posts creados por un usuario específico.
 * 
 * @param {string} userId - ID del usuario.
 * @returns {Promise<object[]>} - Lista de posts del usuario.
 * @throws {Error} - Lanza un error si falla la consulta.
 */
export async function getPostsByUserId(userId) {
  const { data, error } = await supabase
    .from('posts')
    .select('*') // o especificá columnas si querés optimizar
    .eq('user_id', userId)
    .order('created_at', { ascending: false }); // opcional, para que salgan los más recientes primero

  if (error) {
    console.error('[posts.js getPostsByUserId] Error al traer los posts del usuario: ', error);
    throw error;
  }

  return data;
}


/**
 * Trae todas las publicaciones de todos los usuarios, ordenadas de la más reciente a la más antigua.
 * 
 * @returns {Promise<object[]>} - Lista de todos los posts con información del usuario que los creó.
 * @throws {Error} - Lanza un error si falla la consulta.
 */
export async function getAllPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*, user: user_profiles(display_name, email, id, photo)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[posts.js getAllPosts] Error al traer todos los posts", error);
    throw error;
  }

  return data;
}


/**
 * Elimina un post por ID
 * @param {object} post
 */
export async function deletePost(post) {

  if (post.photo) {
    const path = post.photo.slice(post.photo.indexOf('/post-images/') + 13);
    await deleteFile(path, 'post-images');
  }


  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', post.id);

  if (error) {
    console.error('[posts.js deletePost] Error al eliminar el post:', error);
    throw error;
  }
}

/**
 * Editar un  post por id
 * @param {*} postId 
 * @param {*} data 
 */
export async function updatePost(postId, data) {
  const { error } = await supabase
    .from('posts')
    .update(data)
    .eq('id', postId);

  if (error) {
    console.error('[posts.js updatePost] Error al editar post:', error);
    throw error;
  }
}


/**
 * Sube una imagen nueva para un post, y borra la anterior si hay.
 *
 * @param {File} file - Archivo de imagen nuevo.
 * @param {string} userId - ID del usuario autenticado.
 * @param {string|null} oldPhotoUrl - URL de la imagen anterior (si existe).
 * @returns {Promise<string>} - URL pública de la nueva imagen.
 */
export async function updatePostImage(file, userId, oldPhotoUrl = null) {
  try {
    const filename = `${userId}/${crypto.randomUUID()}.${getExtensionFromFile(file)}`;
    await uploadFile(filename, file, "post-images");

    const newPhotoUrl = getFileUrl(filename, "post-images");

    if (oldPhotoUrl) {
      const photoToDelete = oldPhotoUrl.slice(oldPhotoUrl.indexOf("/post-images/") + 13);
      await deleteFile(photoToDelete, "post-images");
    }

    return newPhotoUrl;
  } catch (error) {
    console.error("[posts.js updatePostImage] Error al actualizar imagen del post:", error);
    throw error;
  }
}


                                                                                /* A PARTIR DE ACA SE AGREGAN LAS CONTROLLERS PARA CREAR EDITAR Y ELIMINAR EN TIEMPO REAL */


/**
 * Escucha en tiempo real los nuevos posts creados y ejecuta el callback cuando se agregan.
 * 
 * @param {(post: object) => void} callback - Función que se ejecuta cuando hay un nuevo post.
 */
export function subscribeToNewPosts(callback) {
  const channel = supabase.channel('posts-realtime', {
    config: { broadcast: { self: true } },
  });

  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'posts',
    },
    payload => callback(payload.new)
  );

  channel.subscribe();
}


/**
 * Escucha en tiempo real nuevos posts agregados a la tabla 'posts'.
 * Llama al callback cada vez que se inserta un nuevo post.
 * 
 * @param {(newPost: object) => void} callback - Función que recibe el nuevo post.
 */
export function subscribeToAllPosts(callback) {
  const channel = supabase.channel('realtime-posts', {
    config: { broadcast: { self: true } },
  });

  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'posts',
    },
    async (payload) => {
      const enrichedPost = await getPostByIdWithUser(payload.new.id);
      callback(enrichedPost);
    }
  );

  channel.subscribe();
}


/**
 * Escucha en tiempo real cuando un post es editado.
 * Llama al callback con el post actualizado (enriquecido con datos del usuario).
 * 
 * @param {(updatedPost: object) => void} callback - Función que recibe el post actualizado.
 */
export function subscribeToUpdatedPosts(callback) {
  const channel = supabase.channel('updated-posts', {
    config: { broadcast: { self: true } },
  });

  channel.on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'posts',
    },
    async (payload) => {
      const updatedPost = await getPostByIdWithUser(payload.new.id);
      callback(updatedPost);
    }
  );

  channel.subscribe();
}