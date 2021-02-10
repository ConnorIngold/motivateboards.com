<template>
	<div id="nav">
		<Navbar v-if="!hide" />
		<router-view />
		<Footer v-if="!hide" />
	</div>
</template>

<script>
	import Navbar from './components/layout/Nav'
	import Footer from './components/layout/Footer'
	import { ref, onMounted } from 'vue'
	import { useRoute } from 'vue-router'
	// const url = window.location.href

	export default {
		setup() {
			const hide = ref(false)
			const router = useRoute()
			onMounted(() => {
				console.log('1', router)
				const url = window.location.href
				if (url.split('0/')[1] === 'register') {
					hide.value = true
				}
			})
			return { Navbar, Footer, hide }
		},
	}
</script>

<style lang="scss">
	body {
		background: #090808;
		#app {
			font-family: Avenir, Helvetica, Arial, sans-serif;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			text-align: center;
			color: #2c3e50;
		}

		#nav {
			padding: 30px;

			a {
				font-weight: bold;
				color: #2c3e50;

				&.router-link-exact-active {
					color: #42b983;
				}
			}
		}
	}
</style>
