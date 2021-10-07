<script>
    export let onclick;
</script>

<button on:click={onclick}>
    <slot>Botón</slot>
</button>

<style>
    button {
        cursor: pointer;
        color: var(--color, inherit);

        background: none;
        border: none;
        border-radius: 0%;

        width: fit-content;
        margin: 0 auto;
        
        position: relative;
        overflow: hidden;
        padding: 0.1em 0;
    }

    button::after {
        content: "";

        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;
        height: 0.1em;

        background-color: var(--color, inherit);
        opacity: 0;

        transform: translate3d(0, 0, 0);
        
        transition: opacity 300ms, transform 300ms;
    }

    @media (pointer: fine) { /** If mouse available, add animation, else keep the line constant */
        button::after {
            transform: translate3d(-100%, 0, 0);
        }

        button:hover::after, button:focus::after{
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
</style>