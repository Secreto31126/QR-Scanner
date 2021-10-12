<script>
    import QRCode from './qrcode';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { QRContent } from "./stores";

    let text;
    let canvas;
    onMount(() => {
        text = get(QRContent);
        QRContent.subscribe(value => {
            if (canvas) {
                if (value) {
                    QRCode.toCanvas(canvas, value);
                } else {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        });
    });
</script>

<canvas bind:this={canvas}></canvas>
<textarea bind:value={text} on:input={e => QRContent.set(e.target.value)}></textarea>
