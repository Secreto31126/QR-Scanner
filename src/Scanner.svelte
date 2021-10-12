<script>
    import { onMount } from "svelte";
    import QrScanner from "qr-scanner";
    import { QRContent } from "./stores";
	import Button from "./Nice_Button.svelte";
	import { Paste, Drop, Upload } from "./Handlers";

	let blob;	// The blob url of the image
	let output; // The text output
    let error;  // The error message

    $: QRContent.set(output);

	// If the blob changes, update the output
	$: if (!!blob) {
		QrScanner.scanImage(blob)
		.then(e => {
            output = e;
        })
		.catch(e => {
			switch (e.name) {
				case "SecurityError":
					error = "Perdón, no se pueden escanear imágenes arrastradas desde otros sitios. Probá copiar y pegar la foto acá.";
					break;
					
				default:
					error = "No se pudo escanear el código QR";
					break;
			}
            
			console.error(e);
		});
	} else {
        // If there is no blob, no output nor error should be displayed
        output = undefined;
        error = undefined;
	}

    $: if (error) {
        output = undefined;
    }

	// Camera support
	let video;
	let scanner;
	onMount(() => {
		// Wait 'till the video element is ready
		scanner = new QrScanner(video, result => output = result);
	});

	let camera = false; // Whether the camera is on (true) or off (false)
	$: if (camera) {
        scanner.start().catch(e => {
            camera = false;
            error = "No se pudo iniciar la cámara";
            console.error(e);
        });
	} else if (!!scanner) { // Only run if the scanner is defined, Edge compatible solution
		scanner.stop();
	}

	// Other variables
	let dragging = false;
	let input;
</script>

<!-- Handlers -->
<svelte:window
	on:paste={e => blob = Paste(e)}
	on:dragenter={() => dragging = true}
	on:dragleave={e => { if (!e.fromElement) dragging = false }}
	on:dragover|preventDefault
	on:drop|preventDefault={async e => { blob = await Drop(e); dragging = false; }}
/>

<div>
    {#if blob}
        <img src={blob} on:error={blob = false} alt="QR Code"/>
    {/if}

    <!-- svelte-ignore a11y-media-has-caption -->
    <video bind:this={video} style={camera ? "" : "display: none;"}></video> <!-- Just hide the video so QrScanner can mount it -->
    {#if camera}
        <button on:click={() => camera = false}>Cerrar cámara</button>
    {/if}

    {#if dragging}
        <p>Sí, arrastrar la imagen también funciona</p>
    {/if}

    {#if output}
        <p class="output">{output}</p>
        <button on:click={() => { blob = undefined; output = undefined; }}>Borrar</button>
    {:else if error}
        <p class="error">{error}</p>
        <button on:click={() => { blob = undefined; error = undefined; }}>Cerrar</button>
    {:else}
        <p>
            Para escanear un código QR,
            <Button onclick={() => input.click()} --color="blue">subí un archivo</Button>,
            pegá una foto (<kbd>CTRL</kbd>+<kbd>V</kbd>),
            o <Button onclick={() => camera = true} --color="blue">usá la cámara</Button>
        </p>
        <input bind:this={input} on:change={e => blob = Upload(e)} type="file" accept="image/*" style="display:none;"/>
    {/if}
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }

    img, video {
        width: auto;
        height: 60%;
    }

    .error {
        color: #ee0000;
    }
</style>
