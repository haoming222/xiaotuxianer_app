<template>
	<view class="add-address">
		<AddressInfoBox></AddressInfoBox>
	</view>
</template>

<script setup>
	import AddressInfoBox from '../../components/addressinfo/AddressInfoBox.vue';
	
	
</script>

<style scoped lang="scss">
	.add-address{
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: #f4f4f4;
		padding: .625rem;
		box-sizing: border-box;
	}
	
</style>
