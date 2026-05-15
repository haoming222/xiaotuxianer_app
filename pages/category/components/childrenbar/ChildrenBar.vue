<template>
	<view class="children-bar" v-for="item in childrenData">
		<view class="children-title">
			<view class="title-text">
				{{item.name}}
			</view>
			<view class="all-button">
				全部->
			</view>
		</view>
		<view class="card-container">
			<view class="card" v-for="item in item.goods" @click="clickGood(item.id)">
				<img class="card-img" :src="baseurl + item.picture" alt="" />
				<view class="card-name">
					{{item.name}}
				</view>
				<view class="price">
					<text class="price-icon">￥</text>
					<text class="price-value">{{item.price}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { defineProps,ref } from 'vue';
	import { useApiBaseUrlStore } from '@/stores/ApiBaseUrl';
	
	const apibaseurlStore = useApiBaseUrlStore();
	const baseurl = ref(apibaseurlStore.baseurl);
	const props = defineProps({
		childrenData:{
			type:Array
		}
	})
	
	const clickGood = (id)=>{
		
		uni.navigateTo({
			url:"/pages/detail/detail?id="+id
		})
	}
</script>

<style lang="scss">
	.children-bar{
		margin-top: 0.825rem;
		width: 100%;
		height: auto;
		// background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
	}
	.children-title{
		display: flex;
		justify-content: space-between;
		height: 2.4rem;
		box-sizing: border-box;
		border-bottom: solid 0.01rem #f8f8f8;
		// background-color: green;
		.title-text{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 1rem;
			width: auto;
		}
		.all-button{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: .6rem;
			color: #999;
		}
	}	
	.card-container{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		padding: 0.5rem 0;
		box-sizing: border-box;
	}
	.card{
		width: calc(100% / 3);
		padding: 0 .2rem;
		box-sizing: border-box;
		.card-img{
			width: 100%;
			height: auto;
		}
		.card-name{
			width: 100%;
			font-size: .8rem;
			line-height: 0.9rem;
			height: 1.8rem;
			word-wrap: break-word; 
			word-break: normal;
			overflow: hidden;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			text-overflow: ellipsis; 
		}
	}
	.price-icon{
		font-size: .6rem;
		color: #cf4444;
	}
	.price-value{
		font-size: .8rem;
		color: #cf4444;
	}
</style>


   