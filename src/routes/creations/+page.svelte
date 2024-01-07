<script>
	import { Title, Button, Subtitle, Textfield } from '$lib';
	export let projects;
	let startNew = false;

	let startNewClick = () => {
		startNew = !startNew;
	};
</script>

<svelte:head>
	<title>Creations</title>
</svelte:head>

<div>
	<Title>Creations</Title>

		<div class="mt-5 ml-5">
			{#if startNew}
            <form method="POST">
				<div class="flex flex-row">
					<Subtitle>This creation is called</Subtitle>
                    <input type="text" class="ml-5 mr-5 focus:outline-none border-b-4 border-secondary focus:ring focus:ring-secondary text-2xl text-primary"/>
                    <Subtitle>and is</Subtitle>
					<select name="creationType" class="ml-5 w-52 h-11 border-secondary border-4 text-primary text-2xl focus:ring focus:ring-secondary focus:outline-none rounded-xl">
						<option value="option1">Visual</option>
						<option value="option2">Auditory</option>
						<option value="option3">Written</option>
					</select>
					
                </div>
                <div class="mt-5">
                    <Textfield placeholder="Enter a short description about your new creation" name="creationDescription" size="lg"/>
                </div>
                <div class=" mt-1">
                    <Button size="md">Create</Button>
                    <Button size="md" type="button" click={startNewClick}>Cancel</Button>
                </div>
            </form>
			{:else}
				<Button click={startNewClick} size="lg">
					<i class="fas fa-plus text-xl mb-2"></i>
					Start something new
				</Button>
			{/if}
		</div>


	<div class="bg-slate-100 ml-5 mt-5">current creations</div>
</div>
