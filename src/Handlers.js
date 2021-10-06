function Paste(e) {
    if (e.clipboardData) {
        let items = e.clipboardData.items;
        if (!items) return;
        
        for (let item of items) {
            //If it's an image
            if (item.type.startsWith("image")) {
                e.preventDefault();
                return createBlob(item);
            }
        }
    }
}

async function Drop(e) {
    if (e.dataTransfer.items) {
        for (let item of e.dataTransfer.items) {
            console.log(item);
            if (item.type.startsWith("image")) {
                return createBlob(item);
            } else if (item.type == "text/uri-list") {
                // If it's an url (cross-site image dragged)
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

function createBlob(item) {
    return (window.URL ?? window.webkitURL).createObjectURL(item.getAsFile());
}

export { Paste, Drop };
