function Paste(e) {
    if (e.clipboardData) {
        let items = e.clipboardData.items;
        if (!items) return;
        
        for (let item of items) {
            if (item.type.startsWith("image")) {
                e.preventDefault();
                return createBlobUrl(item.getAsFile());
            }
        }
    }
}

async function Drop(e) {
    if (e.dataTransfer.items) {
        for (let item of e.dataTransfer.items) {
            if (item.type.startsWith("image")) {
                return createBlobUrl(item.getAsFile());
            }
            
            // If it's an url (cross-site image dragged)
            // Only works if CORS is enabled from the source
            else if (item.type == "text/uri-list") {
                let url = new Promise((resolve, reject) => {
                    item.getAsString(e => {
                        resolve(e);
                    });
                });

                return await url;
            }
        }
    }
}

function Upload(e) {
    if (e.target.files) {
        for (let item of e.target.files) {
            if (item.type.startsWith("image")) {
                return createBlobUrl(item);
            }
        }
    }
}

/**
 * Create a blob url from a file
 * 
 * @param {File} file The file to create a blob url from
 * @returns {String} The blob url
 */
function createBlobUrl(file) {
    return (window.URL ?? window.webkitURL).createObjectURL(file);
}

export { Paste, Drop, Upload };
