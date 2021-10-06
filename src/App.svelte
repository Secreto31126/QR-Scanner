<script>
    import QrScanner from "qr-scanner";
	import { Paste, Drop } from "./Handlers";

	// The blob url of the image
	let blob;

	// The text output
	let output;

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
</script>

<!-- Handlers -->
<svelte:window
	on:paste={e => blob = Paste(e)}
	on:drop|preventDefault={async e => blob = await Drop(e)}
	on:dragover|preventDefault
/>

<main>
	{#if blob}
		<!-- svelte-ignore a11y-missing-attribute -->
		<img src={blob} on:error={blob = false}/>
	{/if}
	<p>{output ?? "Para escanear un código QR, subí un archivo, pegá una foto (CTRL + V), o usá la cámara"}</p>
</main>

<style>
	main {
		text-align: center;
	}

	img {
		max-width: 60vw;
	}
</style>
