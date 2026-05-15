<template>
	<view class="login">
		<view style="height: 20vh; width: 100%;"></view>
		<LoginBox></LoginBox>
	</view>
</template>

<script setup>
	import LoginBox from './LoginBox/LoginBox.vue';
</script>

<style scoped>
	.login{
		height: 100%;
		width: 100%;
		padding: 0.625rem 1.25rem;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
</style>
