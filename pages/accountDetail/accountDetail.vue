<template>
	<view class="account-detail">
		<view class="avatar-box">
			<view @click="uploadAvatar" class="avatar">
				<img :src="baseurl + avatarImageRedirectPath" alt="" />
			</view>
			<view class="text">
				点击修改头像
			</view>
		</view>
		<view class="info-table">
			<view class="info-item">
				<text class="info-label">账号</text>
				<text class="info-value account-text">{{account}}</text>
			</view>
			<view class="info-item">
				<text class="info-label">昵称</text>
				<input class="info-value" v-model="nickname"></input>
			</view>
			<view class="info-item">
				<text class="info-label">性别</text>
				<picker class="info-value" @change="changeGender" :value="gender" :range="genderList">{{gender}}</picker>
			</view>
			<view class="info-item last-item">
				<text class="info-label">生日</text>
				<picker mode="date" @change="changeBirthday" :value="birthday" class="info-value">{{birthday}}</picker>
			</view>
		</view>
		
		<view class="save-button-box">
			<view class="save-button" @click="clickUpdata">
				保存
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { useApiBaseUrlStore } from '../../stores/ApiBaseUrl';
	import { onShow } from '@dcloudio/uni-app'
	import request from '../../utils/request';
	
	const accountInfo = ref(uni.getStorageSync("accountInfo"));
	const baseurl = ref(useApiBaseUrlStore().baseurl)
	const account = ref("")
	const avatarImageRedirectPath = ref(accountInfo.value.avatar)
	const nickname = ref("")
	const gender = ref("")
	const genderList = ref(["男","女","保密"])
	const birthday = ref("")
	
	const uploadAvatar = ()=>{
		uni.chooseImage({
			success: (chooseImageRes) => {
				const avatarImageUrl = chooseImageRes.tempFilePaths;
				uni.uploadFile({
					url:baseurl.value+'/register/uploadAvatar',
					filePath: avatarImageUrl[0],	
					success: (uploadFileRes) => {
						avatarImageRedirectPath.value = JSON.parse(uploadFileRes.data).data;
						console.log(avatarImageRedirectPath.value);
					}
				})
			}
		})
	}
	const changeGender = (e)=>{
		gender.value = genderList.value[e.detail.value] || "男"
	}
	const changeBirthday = (e)=>{
		birthday.value = e.detail.value
	}
	const clickUpdata = async()=>{
		try{
			const data = await request({
				url: '/updateInfo',
				method:'post',
				data:{
					avatar:avatarImageRedirectPath.value,
					account:account.value,
					nickname:nickname.value,
					gender:gender.value,
					birthday:birthday.value
				}
			})
			uni.showToast({
				title:"修改成功",
				duration:2000
			})
			uni.switchTab({
				url:"/pages/my/my"
			})
			uni.setStorageSync("accountInfo",data.data)
		}catch(e){
			console.log("请求失败：",e);
		}
	}
	
	onShow(()=>{
		account.value = accountInfo.value.account
		nickname.value = accountInfo.value.nickname
		gender.value = accountInfo.value.gender
		birthday.value = accountInfo.value.birthday
	})
</script>

<style scoped lang="scss">
	.account-detail{
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: #f7f7f7;
	}
	.avatar-box{
		text-align: center;
		width: 100%;
		height: 8.125rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #03aaa0;
		.avatar{
			height: 5rem;
			width: 5rem;
			border: #d9d9d9 0.1rem solid;
			border-radius: 5rem;
			overflow: hidden;
			img{
				height: 100%;
				width: 100%;
			}
		}
		.text{
			font-size: .8125rem;
			color: #fff;
		}
	}
	
	.info-table{
		margin: .625rem .625rem 0;
		padding: 0 .625rem;
		border-radius: .3125rem;
		background-color: #fff;
		box-sizing: border-box;
		.info-item{
			padding: .78125rem .3125rem;
			overflow: hidden;
			box-sizing: border-box;
			height: 3rem;
			border-bottom: .03125rem solid #ddd;
			display: flex;
			.info-label{
				 width: 5.625rem;
				 color: #333;
			}
			.info-value{
				height: 100%;
				flex: 1;
			}
		}
		.last-item{
			border-bottom: none;
		}
	}
	.account-text{
		color: gray;
	}
	
	.save-button-box{
		margin-top: .625rem;
		padding: 0 1.625rem;
		box-sizing: border-box;
		.save-button{
			height: 2.2rem;
			border-radius: 2.2rem;
			background-color: rgb(40 187 156);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: .875rem;
			color: #fff;
		}
	}
</style>
