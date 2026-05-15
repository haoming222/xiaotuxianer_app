<template>
	<view class="login-box">
		<view class="select-box">
			<view class="title" 
			      :style="{borderBottom: 'login' == selectModel ? 'rgb(40 187 156) .3rem solid' : ''}"
			      @click="transModel('login')">
			    <view class="label">登录</view>
			</view>
			<view class="title" 
			:style="{borderBottom: 'register' == selectModel ? 'rgb(40 187 156) .3rem solid' : ''}"
			@click="transModel('register')">
				<view class="label">注册</view>
			</view>
		</view>
		<view class="form-box" v-if="'login' == selectModel">
			<view class="input-box">
				<input v-model="loginAccount" type="text" style="height: 100%; padding: 0 1rem;" placeholder="请输入用户名/手机号码">
			</view>
			<view class="input-box">
				<input v-model="loginPassword" type="password" style="height: 100%; padding: 0 1rem;" placeholder="请输入密码">
			</view>
			<view class="login-button" @click="clickLogin">
				登录
			</view>
		</view>
		
		<view class="form-box" v-if="'register' == selectModel">
			<view class="avatar-box">
				<view class="avatar-img-box" @click="uploadAvatar">
					<img class="avatar-img" 
					:style="{height : avatarImageUrl === '/static/logoimg/加号.png' ? '50%' : '100%',
									 width: avatarImageUrl === '/static/logoimg/加号.png' ? '50%' : '100%'}"
					:src="avatarImageUrl" alt="" />
				</view>
			</view>
			<view class="input-box">
				<input type="text" v-model="registerAccount" style="height: 100%; padding: 0 1rem;" placeholder="请输入用户名">
			</view>
			<view class="input-box">
				<input type="text" v-model="registerNickname" style="height: 100%; padding: 0 1rem;" placeholder="请输入昵称">			
			</view>
			<view class="input-box">
				<input type="password" v-model="registerPassword" style="height: 100%; padding: 0 1rem;" placeholder="请输入密码">			
			</view>
			<view class="input-box">
				<input type="password" v-model="registerRePassword" style="height: 100%; padding: 0 1rem;" placeholder="请确认密码">			
			</view>
			<view class="input-box">
				<input type="text" v-model="registerTele" style="height: 100%; padding: 0 1rem;" placeholder="请输入电话号码">			
			</view>
			<view class="picker-box">
				<view class="picker-label">性别：</view>
				<picker class="picker" @change="genderChange" :value="genderIndex" :range="genderCategory">{{genderCategory[genderIndex]}}</picker>
			</view>
			<view class="picker-box">
				<view class="picker-label">出生日期：</view>
				<picker class="picker" mode="date" :value="birthday" @change="birthdayChange" >{{birthday}}</picker>
			</view>
			<view class="register-button" @click="clickRegister">
				注册
			</view>	
		</view>
	</view>

</template>

<script setup>
	import { ref } from 'vue';
	import request from '../../../utils/request';
	import { useTokenStore } from '../../../stores/Token';
	import { useApiBaseUrlStore } from '../../../stores/ApiBaseUrl';
	import { useAccountInfo } from '../../../stores/AccounterInfo';

	const AccountInfoStore = useAccountInfo()
	const TokenStore = useTokenStore()
	const baseurl = useApiBaseUrlStore().baseurl
	const selectModel = ref("login")
	const loginAccount = ref("")
	const loginPassword = ref("")
	const accountInfo = ref()
	const avatarImageUrl = ref('/static/logoimg/加号.png')
	const avatorImageRedirectUrl = ref("")
	const genderCategory = ref(['男','女','保密'])
	const genderIndex = ref(0)
	const birthday = ref(new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate())
	const registerAccount = ref("")
	const registerNickname = ref("")
	const registerPassword = ref("")
	const registerRePassword = ref("")
	const registerTele = ref("")
	
	const birthdayChange = (e)=>{
		birthday.value = e.detail.value
	}
	const genderChange = (e)=>{
		genderIndex.value = e.detail.value
	}
	const transModel = (modelName)=>{
		selectModel.value = modelName
	}
	const clickLogin = async()=>{
		try{
			uni.showLoading({
				title: '加载中'
			});
			const data = await request({
				url:"/login",
				method:'post',
				data:{
					account:loginAccount.value,
					password:loginPassword.value
				}
			})
			uni.hideLoading()
			if(data.data == null){
				uni.hideLoading()
				uni.showToast({
					title:'账号或密码错误',
					icon:'error',
					duration:2000
				})
				loginAccount.value = ""
				loginPassword.value = ""
			}else{
				accountInfo.value = data.data
				uni.setStorageSync('token',data.data.token)
				uni.setStorageSync('accountInfo',data.data)
				// TokenStore.setToken(accountInfo.value.token)
				uni.showToast({
					title:"登录成功",
					duration:2000
				})
				AccountInfoStore.setAccountInfo(data.data)
				uni.switchTab({
					url:'/pages/my/my'
				})
				// uni.navigateBack({
				// 	delta: 1
				// });
			}
		}catch(error){
			console.log("请求失败：",error)
		}
	}
	const uploadAvatar = ()=>{
		uni.chooseImage({
			success: (chooseImageRes) => {
				avatarImageUrl.value = chooseImageRes.tempFilePaths;
				uni.uploadFile({
					url:baseurl+'/register/uploadAvatar',
					filePath: avatarImageUrl.value[0],	
					success: (uploadFileRes) => {
						avatarImageUrl.value = baseurl + JSON.parse(uploadFileRes.data).data;
						avatorImageRedirectUrl.value = JSON.parse(uploadFileRes.data).data;
					}
				})
			}
		})
	}
	const clickRegister = async ()=>{
		try{
			const data = await request({
				url:'/register',
				method:"post",
				data:{
					account:registerAccount.value,
					password:registerPassword.value,
					mobile: registerTele.value,
					avatar: avatorImageRedirectUrl.value,
					gender:genderCategory.value[genderIndex.value],
					birthday:birthday.value,
					nickname:registerNickname.value
				}
			})
		}catch(error){
			console.log("请求失败：",error);
		}
	}
</script>

<style lang="scss" scoped>
	.login-box{
		flex: 1;
		width: 100%;
	}
	.select-box{
		display: flex;
		justify-content: space-around;
		height: 2.375rem;
		padding: 0 1rem;
		box-sizing: border-box;
		margin-bottom: 1rem;
		.title{
			padding-bottom: 1rem;
			.label{
				padding: .3rem 1rem;
				width: rem;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
			}
		}
	}
	.form-box{
		display: flex;
		flex-direction: column;
		padding: 0 1.2rem;
		box-sizing: border-box;
		.input-box{
			height: 2rem;
			border-radius: 2rem;
			width: 100%;
			border: #d9d9d9 .1rem solid;
			margin-bottom: .5rem;
		}		
		.login-button{
			height: 2.2rem;
			border-radius: 2.2rem;
			background-color: rgb(40 187 156);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: .875rem;
			color: #fff;
		}
		.register-button{
			height: 2.2rem;
			border-radius: 2.2rem;
			background-color: #007aff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: .875rem;
			color: #fff;
		}
	}
	.avatar-box{
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
		.avatar-img-box{
			border: #d9d9d9 .1rem solid;
			overflow: hidden;
			border-radius: 4rem;
			height: 100%;
			width: 4rem;
			display: flex;
			align-items: center;
			justify-content: center;
			.avatar-img{
				height: 100%;
				width: 100%;
			}
			.default-avart-img{
				height: 50%;
				width: 50%;
			}
		}
	}
	
	.picker-box{
		margin-bottom: .5rem;
		height: 2rem;
		width: 100%;
		display: flex;
		border-bottom: #d9d9d9 .1rem solid;
		.picker-label{
			max-width: 8rem;
			min-width: 5rem;
			height: 100%;
			display: flex;
			align-items: center;
		}
		.picker{
			width: 100%;
			display: flex;
			align-items: center;
		}
	}
	
</style>
