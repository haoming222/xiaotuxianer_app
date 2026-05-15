<template>
	<view class="profile">
		<view class="avatar-img" @click="to">
			<img :src="accountAvatar" 
					 :style="{height : accoutAvatar == 'static/logoimg/用户.png' ? '60%' : '100%',
										width : accoutAvatar == 'static/logoimg/用户.png' ? '60%' : '100%'}"
			alt="" />
		</view>
		<view class="profile-info-box" @click="to">
			<view class="username">{{accountNickname}}</view>
			<view class="tip">{{accountInfoButton}}</view>
		</view>
		<view class="setting-button" @click="settingButton">设置</view>
	</view>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useAccountInfo } from '../../../../stores/AccounterInfo';
	import { useApiBaseUrlStore } from '../../../../stores/ApiBaseUrl';
	import { onShow } from '@dcloudio/uni-app';

	const accountAvatar = ref("static/logoimg/用户.png")
	const accountNickname = ref("请登录")
	const accountInfoButton = ref("点击登录账号")
	const baseurl = useApiBaseUrlStore().baseurl
	
	const to = ()=>{
		if (!uni.getStorageSync("accountInfo")){
			uni.navigateTo({
			url:"/pages/login/login"
			})
		}else{
			uni.navigateTo({
				url:"/pages/accountDetail/accountDetail"
			})
		}
	}
	const settingButton = ()=>{
		uni.navigateTo({
			url:"/pages/setting/setting"
		})
	}
	
	onShow(() => {
			const accountInfo = uni.getStorageSync("accountInfo");
	    if (accountInfo) {
	      accountAvatar.value = baseurl + accountInfo.avatar;
				accountNickname.value = accountInfo.nickname;
				accountInfoButton.value = "更改个人信息"
	    }
	});
</script>

<style scoped lang="scss">
	.profile{
		display: flex;
		position: relative;
		background-color: #03aaa0;
		height: 5.2rem;
		padding: .6rem;
		box-sizing: border-box;
	}
	.avatar-img{
		height: 4rem;
		width: 4rem;
		border: #d9d9d9 0.1rem solid;
		border-radius: 4rem;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		img{
			height: 4rem;
			width: 4rem;
		}
	}
	.profile-info-box{
		margin-left: 1rem;
		display: flex;
		flex-direction: column;
		color: #fff;
		.username{
			flex:1;
			padding-bottom: .1rem;
			box-sizing: border-box;
			display: flex;
			align-items: flex-end;
			font-size: .9375rem;
		}
		.tip{
			flex: 1;
			font-size: .6875rem;
		}
	}
	.setting-button{
		position: absolute;
		color: #fff;
		font-size: .9375rem;;
		bottom: 1.25rem;
		right: 1.25rem;
	}
</style>
