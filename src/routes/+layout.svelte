<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-hamlindigo.css';
	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch, autoModeWatcher } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	$: classesActive = (href: string) => (href === $page.url.pathname ? '!bg-primary-700' : '');
</script>

<svelte:head>
	{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<svelte:fragment slot="header">
		<AppBar>
			Skeleton

			<svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<nav class="list-nav">
			<!-- (optionally you can provide a label here) -->
			<ul>
				<li>
					<a href="/" class={classesActive('/')}>
						<!-- <span class="badge bg-primary-500">💀</span> -->
						<span class="flex-auto">Home</span>
					</a>
					<a href="/create" class={classesActive('/create')}>
						<!-- <span class="badge bg-primary-500">💀</span> -->
						<span class="flex-auto">Create</span>
					</a>
				</li>
				<!-- ... -->
			</ul>
		</nav>
	</svelte:fragment>
	<svelte:fragment slot="sidebarRight">Sidebar Right</svelte:fragment>
	<svelte:fragment slot="pageHeader">Page Header</svelte:fragment>
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
	<svelte:fragment slot="footer">Footer</svelte:fragment>
</AppShell>
