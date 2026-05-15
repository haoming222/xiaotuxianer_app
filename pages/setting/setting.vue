<template>
	<view class="setting">
		<view class="my-address-box select-item" @click="addressButton">我的收货地址</view>
		<view class="about-box select-item">关于</view>
		<view class="log-out" @click="logoutButton">退出登录</view>
	</view>
</template>

<script setup>
	
	const addressButton = ()=>{
		uni.navigateTo({
			url:"/pages/addressManagement/addressManagement"
		})
	}
	const logoutButton = ()=>{
		uni.setStorageSync("token","")
		uni.setStorageSync("accountInfo",null)
		setTimeout(()=>{
			uni.reLaunch({
				url:"/pages/my/my"
			})
		},100)
	}
</script>

<style scoped lang="scss">
	.setting{
		position: absolute;
		height: 100%;
		width: 100%;
		padding: .625rem;
		box-sizing: border-box;
		background-color: #f4f4f4;
	}
	.select-item{
		background-color: #fff;
		padding: .625rem;
		border-radius: .3125rem;
		margin-bottom: .625rem;
		overflow: hidden;
		display: flex;
		align-items: center;
	}
	.log-out{
		margin-top: .8rem;
		background-color: #fff;
		padding: .625rem;
		border-radius: .3125rem;
		margin-bottom: .625rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
