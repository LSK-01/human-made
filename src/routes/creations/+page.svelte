<script>
    import {Title, Button} from '$lib'
    export let projects;
</script>

<svelte:head>
    <title>Creations</title>
</svelte:head>




<div>
    <Title>Creations</Title>
    <form method="POST">
        <div class="mt-5 ml-5">
            <Button size="lg">
                <i class="fas fa-plus text-xl mb-2"></i> 
                Start something new
            </Button>
        </div>

    </form>

</div>


