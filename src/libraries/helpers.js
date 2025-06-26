const FILE_EXTENSION_BY_MIME_MAP = {
    "image/jpeg": "jpg",
    "image/pjpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/avif": "avif",
}




/**
 * 
 * @param {File} file 
 * @returns {string}
 */
export function getExtensionFromFile(file) {


    return FILE_EXTENSION_BY_MIME_MAP[file.type] || "";

  
}