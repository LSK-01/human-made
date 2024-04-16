<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
	import Subtitle from '$lib/components/Subtitle.svelte';
	import Button from '$lib/components/Button.svelte';
	export let data;
	let user = data.user;

	let clearUser = () => {
		user = null;
	};
</script>

<div>
	<div class="flex flex-col gap-2 ml-5 text-secondary">
		<Title>HumanMade</Title>
		{#if user !== null}
			<Subtitle>Welcome back {user.username}</Subtitle>
			<form method="POST" action="?/logout">
				<Button size="md">Log out</Button>

			</form>
		{:else}
			<Subtitle>Welcome</Subtitle>
			<form method="POST" action="?/login">
				<div class="flex-col flex gap-2">
					<Textfield name="email" placeholder="Email" />
					<Textfield name="password" placeholder="Password" type="password" />
					<Button size="lg">Login or Sign up</Button>
				</div>
			</form>
		{/if}
	</div>
</div>
