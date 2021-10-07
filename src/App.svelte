<script>
	import { onMount } from "svelte";
    import QrScanner from "qr-scanner";
	import { Paste, Drop, Upload } from "./Handlers";
	import Button from "./Nice_Button.svelte";

	let blob;	// The blob url of the image
	let output; // The text output

	// If the blob changes, update the output
	$: if (!!blob) {
		QrScanner.scanImage(blob)
		.then(e => output = e)
		.catch(e => {
			switch (e.name) {
				case "SecurityError":
					output = "Perdón, no se pueden escanear imágenes arrastradas desde otros sitios. Probá copiar y pegar la foto acá.";
					break;
					
				default:
					output = "No se pudo escanear el código QR";
					break;
			}
			console.error(e);
		});
	} else {
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
		scanner.start();
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
	on:dragleave={(e) => { if (!e.fromElement) dragging = false}}
	on:dragover|preventDefault
	on:drop|preventDefault={async e => { blob = await Drop(e); dragging = false; }}
/>

<main>
	{#if blob}
		<img src={blob} on:error={blob = false} alt="QR Code"/>
	{/if}

	<!-- svelte-ignore a11y-media-has-caption -->
	<video bind:this={video} style={camera ? "" : "display: none;"}></video>
	{#if camera}
		<button on:click={() => camera = false}>Cerrar cámara</button>
	{/if}

	{#if dragging}
		<p>Sí, arrastrar la imagen también funciona</p>
	{/if}

	{#if output}
		<p>{output}</p>
		<button on:click={() => { blob = undefined; output = undefined; }}>Borrar</button>
	{:else}
		<p>
			Para escanear un código QR,
			<Button onclick={() => input.click()} --color="blue">subí un archivo</Button>,
			pegá una foto (<kbd>CTRL</kbd>+<kbd>V</kbd>),
			o <Button onclick={() => camera = true} --color="blue">usá la cámara</Button>
		</p>
		<input bind:this={input} on:change={e => blob = Upload(e)} type="file" accept="image/*" style="display:none;"/>
	{/if}
</main>

<style>
	main {
		text-align: center;
	}

	img, video {
		max-height: 60vh;
		max-width: 90vw;
	}
</style>
