import supabase from "./supabase";

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
  .order("created_at",{ascending:false});

  if(error){
    console.error("[posts.js getAllPosts] Error al traer todos los posts", error);
    throw error;
  }

  return data;
}


/**
 * Elimina un post por ID
 * @param {string} postId
 */
export async function deletePost(postId) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error('[posts.js deletePost] Error al eliminar el post:', error);
    throw error;
  }
}