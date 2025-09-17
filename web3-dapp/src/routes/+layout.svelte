<script lang="ts">
	import '../app.postcss';
	import { onMount } from 'svelte';
	import { authService, authState } from '$lib/stores/auth';
	import { web3Service } from '$lib/stores/web3';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	let mounted = false;

	onMount(() => {
		mounted = true;
		
		// Initialize auth service
		// This will automatically load saved auth state from localStorage
		
		// Set up global error handlers
		window.addEventListener('unhandledrejection', (event) => {
			console.error('Unhandled promise rejection:', event.reason);
		});

		return () => {
			window.removeEventListener('unhandledrejection', () => {});
		};
	});
</script>

<svelte:head>
	<title>FinTech Bank - Advanced DeFi Banking Platform</title>
	<meta name="description" content="Professional fintech banking platform with Web3 integration" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="app min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
	<!-- Animated background -->
	<div class="fixed inset-0 opacity-30 pointer-events-none">
		<div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
		<div class="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
	</div>

	<!-- Main content -->
	<div class="relative z-10">
		{#if !mounted || $authState.isLoading}
			<div class="flex items-center justify-center min-h-screen">
				<LoadingSpinner size="lg" />
			</div>
		{:else}
			<slot />
		{/if}
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(.app) {
		min-height: 100vh;
		position: relative;
	}

	/* Custom scrollbar */
	:global(::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: rgba(15, 23, 42, 0.5);
		border-radius: 4px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: rgba(100, 116, 139, 0.5);
		border-radius: 4px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: rgba(100, 116, 139, 0.8);
	}

	/* Animations */
	:global(.animate-pulse-slow) {
		animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	:global(.animate-fade-in) {
		animation: fadeIn 0.5s ease-out;
	}

	:global(.animate-slide-up) {
		animation: slideUp 0.5s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>