<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
	import Subtitle from '$lib/components/Subtitle.svelte';
	import Button from '$lib/components/Button.svelte';
	export let data;
	let user = data.user;
</script>

<div>
	<div class="flex flex-col gap-5 ml-5">
		<Title>HumanMade</Title>
		{#if user !== null}
			<span class="text-secondary"><Subtitle>Welcome back {user.username}</Subtitle></span>
			<img src="" alt="">
			<Button size="md">Log out</Button>
		{:else}
			<Subtitle>Welcome</Subtitle>
			<form method="POST">
				<div class="flex-col flex">
					<Textfield name="email" placeholder="Email" />
					<Textfield name="password" placeholder="Password" />
					<Button size="md">Login or Sign up</Button>
				</div>
			</form>
		{/if}
	</div>

</div>
