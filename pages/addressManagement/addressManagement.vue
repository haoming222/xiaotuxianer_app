<template>
	<view class="address-managemet">
		<view class="address-box">
			<addressCard :addressInfo="item" v-for="item in addressList"></addressCard>
		</view>
		<view class="non-content" v-if="addressList.length == 0">
			暂无地址信息
		</view>
		<view class="add-address-button" @click="addAddressButton">
			新建地址
		</view>
	</view>
</template>

<script setup>
	import addressCard from './components/addressCard.vue';
	import request from '../../utils/request';
	import { onShow } from "@dcloudio/uni-app";
	import { ref } from 'vue';

	const addressList = ref([])

	const addAddressButton = ()=>{
		uni.navigateTo({
			url:"/pages/addressManagement/addAddress"
		})
	}
	const fetchAddressList = async()=>{
		try{
			const data = await request({
				url:"/member/address",
				data:{
					account:uni.getStorageSync("accountInfo").account
				}
			})
			addressList.value = data.data;
		}catch(e){
			console.log("请求失败：",e);
		}
	}
	
	onShow(()=>{
		fetchAddressList()
	})
	
</script>

<style scoped lang="scss">
	.address-managemet{
		position: absolute;
		height: 100%;
		width: 100%;
		padding: .625rem;
		box-sizing: border-box;
		background-color: #f4f4f4;
	}
	.address-box{
		background-color: #fff;
		border-radius: .3rem;
		box-sizing: border-box;
		overflow: hidden;
		padding: 0 .3125rem;
	}
	.add-address-button{
		position: fixed;
		height: auto;
		width: auto;
		display: block;
		cursor: pointer;
		left: .625rem;
		right: .625rem;
		bottom: .625rem;
		z-index: 100;
		text-align: center;
		line-height: 2.5rem;
		border-radius: 2.5rem;
		font-size: .9375rem;
		background-color: #27ba9b;
	}
	.non-content{
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
