<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authState, isAuthenticated } from '$lib/stores/auth';
	import { web3State } from '$lib/stores/web3';
	import WalletConnect from '$lib/components/WalletConnect.svelte';

	onMount(() => {
		// Redirect to dashboard if already authenticated
		if ($isAuthenticated) {
			goto('/dashboard');
		}
	});

	const features = [
		{
			icon: '🏦',
			title: 'Traditional Banking',
			description: 'Full-featured banking with accounts, transfers, and payments'
		},
		{
			icon: '🌐',
			title: 'Web3 Integration',
			description: 'Connect your crypto wallet and manage digital assets'
		},
		{
			icon: '📊',
			title: 'Advanced Analytics',
			description: 'Real-time insights and comprehensive financial reporting'
		},
		{
			icon: '🔒',
			title: 'Enterprise Security',
			description: 'Bank-grade security with multi-factor authentication'
		},
		{
			icon: '💳',
			title: 'Digital Cards',
			description: 'Virtual and physical debit cards with spending controls'
		},
		{
			icon: '🤖',
			title: 'AI-Powered',
			description: 'Smart fraud detection and personalized recommendations'
		}
	];

	function scrollToFeatures() {
		document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>FinTech Bank - The Future of Banking</title>
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-screen flex items-center justify-center px-4">
	<!-- Background Effects -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-cyan-500/20 to-transparent opacity-70 animate-pulse-slow"></div>
		<div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-blue-600/20 to-transparent opacity-70 animate-pulse-slow delay-1000"></div>
	</div>

	<div class="relative z-10 max-w-6xl mx-auto text-center">
		<!-- Logo/Brand -->
		<div class="mb-8">
			<div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-2xl mb-6 shadow-2xl">
				<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
				</svg>
			</div>
			<h1 class="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent animate-fade-in">
				FinTech Bank
			</h1>
		</div>

		<p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
			The future of banking is here. Seamlessly blend traditional finance with Web3 technology 
			for a complete digital banking experience.
		</p>

		<div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 animate-slide-up">
			<a
				href="/auth/register"
				class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
			>
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
				Get Started
			</a>

			<WalletConnect />

			<button
				on:click={scrollToFeatures}
				class="inline-flex items-center px-6 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
			>
				Learn More
				<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
				</svg>
			</button>
		</div>

		<!-- Connection Status -->
		{#if $web3State.isConnected}
			<div class="inline-flex items-center px-6 py-3 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg backdrop-blur-sm">
				<div class="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
				<span class="font-medium">Wallet Connected</span>
				<span class="ml-2 font-mono text-sm opacity-75">
					{$web3State.account?.slice(0, 6)}...{$web3State.account?.slice(-4)}
				</span>
			</div>
		{/if}

		<!-- Stats -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
			<div class="text-center">
				<div class="text-3xl font-bold text-cyan-400 mb-2">$2.4B+</div>
				<div class="text-gray-400">Assets Under Management</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-blue-400 mb-2">150K+</div>
				<div class="text-gray-400">Active Users</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
				<div class="text-gray-400">Uptime</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-green-400 mb-2">24/7</div>
				<div class="text-gray-400">Support</div>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator -->
	<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
		<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
		</svg>
	</div>
</section>

<!-- Features Section -->
<section id="features" class="py-20 px-4">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16">
			<h2 class="text-4xl font-bold text-white mb-4">
				Everything You Need for Modern Banking
			</h2>
			<p class="text-xl text-gray-400 max-w-3xl mx-auto">
				Experience the perfect fusion of traditional banking and cutting-edge Web3 technology
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each features as feature}
				<div class="group relative">
					<div class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
					<div class="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
						<div class="text-4xl mb-4">{feature.icon}</div>
						<h3 class="text-xl font-semibold text-white mb-3">{feature.title}</h3>
						<p class="text-gray-400 leading-relaxed">{feature.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 px-4">
	<div class="max-w-4xl mx-auto text-center">
		<div class="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600 rounded-3xl p-12">
			<h2 class="text-3xl font-bold text-white mb-4">
				Ready to Transform Your Banking?
			</h2>
			<p class="text-gray-300 text-lg mb-8">
				Join thousands of users who have already made the switch to next-generation banking
			</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				<a
					href="/auth/register"
					class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
				>
					Create Free Account
				</a>
				<a
					href="/auth/login"
					class="inline-flex items-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
				>
					Sign In
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.bg-gradient-radial {
		background: radial-gradient(circle, var(--tw-gradient-stops));
	}
</style>