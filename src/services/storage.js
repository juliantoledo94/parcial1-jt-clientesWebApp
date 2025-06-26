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

/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 * @returns {string} La url del recurso.
 */
export function getFileUrl(filename, bucket ="avatars"){

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename)

    return data.publicUrl;
}


// min 35:53 17/06
/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 */
export async function deleteFile(filename, bucket ="avatars"){
    const { error } = await supabase.storage.from(bucket).remove([filename]);

    if(error){
        console.error("[storage.js deleteFile] Error al eliminar el archivo: ",error);
        throw error;
    }
}