import supabase from "./supabase"

/**
 * 
 * @param {string} name 
 * @param {File} file 
 * @param {string} bucket 
 */
export async function uploadFile(name, file, bucket = "avatars"){
    const { data, error } = await supabase.storage.from(bucket).upload(name, file);

    if(error){
        console.error("[storage.js uploadFile] Error al subir el archivo: ",error);
        throw error;
    }
}