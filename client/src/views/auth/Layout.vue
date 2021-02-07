<template>
	<div>
		<Login v-if="data === 0" />
		<Register v-if="data === 1" />
		<ResetPassword v-if="data === 2" />
	</div>
</template>

<script>
	import { ref, onMounted } from 'vue'
	import { useRoute } from 'vue-router'
	import Login from '../../components/auth/Login'
	import Register from '../../components/auth/Register'
	import ResetPassword from '../../components/auth/ResetPassword'

	export default {
		setup() {
			const data = ref(0)
			const route = useRoute()
			const pageCheck = () => {
				if (route.name === 'Register') {
					data.value = 1
				} else if (route.name === 'ResetPassword') {
					data.value = 2
				}
			}
			onMounted(() => {
				pageCheck()
			})
			return { Login, Register, ResetPassword, data }
		},
	}
</script>
