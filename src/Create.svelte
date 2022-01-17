<script>
    import { get } from 'svelte/store';
    import QRCode from './scripts/qrcode';
    import { QRContent } from "./scripts/stores";

    let src;
    let error;
    let quality;
    let text = get(QRContent);
    let defaultColors = {
        dark: '#000000',
        light: '#ffffff',
    };
    let color = defaultColors;

    // If either the colors, quality or text changes, update the QR code
    $: if (!!text) {
        QRCode.toDataURL(text, { errorCorrectionLevel: quality, color, }, (err, url) => {
            if (err) {
                error = err;
                src = undefined;
                console.error(err);
            } else {
                src = url;
            }
        });
    } else {
        src = error = undefined;
    }

    $: QRContent.set(text); // Needed for App.svelte to prevent loosing changes on page change

    let name = "QR";
    function download() {
        let a = document.createElement("a");
        a.href = src; // The button won't show up if there's no src, no need to check that
        a.download = name ?? "QR";
        a.click();
    }
</script>

<div class="main">
    {#if src}
        <img {src} alt={text}>
    {:else if error}
        <p class="error">{error}</p>
    {:else}
        <p>Empezá a escribir para crear tu propio QR, o escaneá uno para editarlo</p>
    {/if}

    <textarea bind:value={text} placeholder="Escribí acá"></textarea>

    {#if src || error}
        <div class="buttons">
            {#if src}
                <div>
                    <label for="dark-color">Color</label>
                    <input name="dark-color" type="color" bind:value={color.dark}>
                </div>
                <div>
                    <label for="light-color">Fondo</label>
                    <input name="light-color" type="color" bind:value={color.light}>
                </div>
            {/if}
            <div>
                <label for="quality">Calidad</label>
                <select name="quality" bind:value={quality}>
                    <option value="L">Baja</option>
                    <option value="M">Media</option>
                    <option value="Q">Alta</option>
                    <option value="H">Máxima</option>
                </select>
            </div>
        </div>
        {#if error && !src}
            <p>Si tenés problemas de tamaño, probá reducir la calidad a cambio de mayor capacidad</p>
            <p>(La calidad de la imagen será la misma, lo que cambia es la calidad de la información dentro del QR en sí)</p>
        {/if}
        {#if src}
            <label for="name">Nombre del archivo</label>
            <input name="name" type="text" bind:value={name}>
            <div class="buttons">
                <button on:click={() => { text = undefined; color = defaultColors }}>Borrar</button>
                <button on:click={download}>Descargar</button>
            </div>
        {/if}
    {/if}
</div>

<style>
    div.main {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    img {
        width: auto;
        max-height: 50%;
    }

    .error {
        color: #ee0000;
    }

    textarea {
        width: 40%;
        max-width: 100%;
        height: 15%;
    }

    input {
        text-align: center;
    }

    div.buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        column-gap: 10%;
    }
</style>
