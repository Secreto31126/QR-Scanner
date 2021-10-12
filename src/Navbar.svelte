<script>
	import { Page } from "./scripts/stores";
	import Button from "./Nice_Button.svelte";

    let page;
    Page.subscribe(p => {
        page = p;
	});
</script>

<div>
    <Button onclick={() => Page.set("scanner")} --color="inherit" inactive={page === "scanner"}>Escanear</Button>
</div>
<div>
    <Button onclick={() => Page.set("create")} --color="inherit" inactive={page === "create"}>Crear</Button>
</div>

<style>
	div {
		margin: 0 1rem;
	}
</style>
