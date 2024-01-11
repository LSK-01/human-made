<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
	import Subtitle from '$lib/components/Subtitle.svelte';
	import Button from '$lib/components/Button.svelte';
	export let data;
	let user = data.user;
</script>

<div>
	<Title>HumanMade</Title>
	{#if user !== null}
		<Subtitle>Welcome back {user.username}</Subtitle>
	{:else}
		<Subtitle>Welcome</Subtitle>
		<form method="POST">
			<div class="ml-5 mt-5 flex-col flex">
				<Textfield name="email" placeholder="Email" />
				<Textfield name="password" placeholder="Password" type="password" />
				<Button size="md">Login or Sign up</Button>
			</div>
		</form>
	{/if}
</div>
