<template>
  <uni-swipe-action>
    <uni-swipe-action-item
      :right-options="swipeOptions"
      @click="handleSwipeClick"
      @change="handleSwipeChange"
    >
      <view class="address-card">
        <view class="title-box">
          <text>{{addressInfo.receiver}} {{addressInfo.contact}}</text>
          <text class="default-title" v-if="addressInfo.isDefault == 1">默认</text>
					<text class="modify-button" @click="modifyButton">修改</text>
				</view>
        <view class="address">
          {{addressInfo.province}} {{addressInfo.city}} {{addressInfo.county}} {{addressInfo.address}}
        </view>
      </view>
    </uni-swipe-action-item>
  </uni-swipe-action>
</template>

<script setup>
	import { ref } from "vue";
	import { defineProps } from "vue";
	import request from "@/utils/request.js"

	const addressData = ref()
	const props = defineProps({
		addressInfo:Object
	})
	addressData.value = props.addressInfo
	const swipeOptions = ref([
		{
			text: "删除",
			style: {
				backgroundColor: "#FF0000",
				color: "#FFFFFF",
			},
		},
	]);

	const handleSwipeClick = (e) => {
		deleteAddress()
		setTimeout(() => {
			uni.navigateTo({
			url:"/pages/addressManagement/addressManagement"
			})
		},100)
	};
	const deleteAddress = async()=>{
		try{
			const data = await request({
				url:"/member/address/" + addressData.value.id,
				method:"DELETE",
			})
		}catch(e){
			console.log("请求错误：",e);
		}
	}
	const handleSwipeChange = (e) => {
	};
	const modifyButton = ()=>{
		uni.navigateTo({
			url:"/pages/addressManagement/modifyAddress?id="+ addressData.value.id
		})
	}
</script>

<style scoped lang="scss">
	.address-card{
		line-height: 1;
		padding: 1.25rem .3125rem 1.1875rem;
		border-bottom: .03125rem solid #ddd;
	}
	.title-box{
		position:relative;
		margin-bottom: .625rem;
		font-size: .875rem;;
		.modify-button{
			position:absolute;
			right: 0;
			padding: 0 .625rem;
			box-sizing: border-box;
			border-left: .03125rem solid #666;
			color: #666;
			line-height: 1;
		}
	}
	.address{
		font-size: .8125rem;
		color: #333;
		word-break: break-all;
	}
	.default-title{
		margin-left: .625rem;
		padding: 0 .625rem;
		box-sizing: border-box;
		color: #27ba9b;
		border: .03125rem solid #27ba9b;
		border-radius: .3rem;
	}
</style>