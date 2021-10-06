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
			output = "No se pudo escanear el código QR";
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
	<p>{output ?? "Para escanear un código QR, sacale una foto y pegala acá"}</p>
</main>

<style>
	main {
		text-align: center;
	}

	img {
		max-width: 60vw;
	}
</style>
