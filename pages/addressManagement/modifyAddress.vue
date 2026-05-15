<template>
	<view class="add-address">
		<AddressInfoBox :addressInfo="addressInfo"></AddressInfoBox>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import AddressInfoBox from '../../components/addressinfo/AddressInfoBox.vue';
	import {onShow} from "@dcloudio/uni-app"
	import request from '../../utils/request';
	
	const addressInfo = ref()
	
	const fetchAddressInfo = async(id)=>{
		try{
			const data = await request({
				url:"/member/address/"+id
			})
			addressInfo.value = data.data
		}catch(e){
			console.log(e);
		}
	}
	
	onShow(()=>{
		const pages = getCurrentPages();
		const id = pages[pages.length-1].options.id;
		fetchAddressInfo(id)
	})
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