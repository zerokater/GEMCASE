<script>
    import Case from '$lib/components/Case.svelte';
</script>

<main>
    <header>

    </header>
    <section>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
        <Case/>
    </section>
</main>



<style>
    main{
        margin: 0 auto;
        width: 1200px;
        display: flex;
        flex-direction: column;
        gap: 24px;
    }


    header{
        width: 100%;
        height: 400px;
        background-color: var(--darkgrey);
        border-radius: 8px;
    }

    section{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(3, auto);
        gap: 24px;
    }
</style>