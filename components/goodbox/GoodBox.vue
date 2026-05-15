<template>
	<view class="guess-like-bar">
		<view class="like-good-card" v-for="item in goodData" @click="click_good(item.id)">
			<view class="good-card">
				<view class="img-box">
					<img class="img" :src=baseurl+item.picture alt="" />
				</view>
				<view class="good-title">
					{{ item.name }}
				</view>
				<view class="price-text">
					<text class="money-logo">￥</text>
					<text class="price-value">{{ item.price }}</text>
				</view>
			</view>
		</view>	
	</view>
</template>

<script setup>
	import { defineProps,ref } from 'vue';
	import { useApiBaseUrlStore } from '@/stores/ApiBaseUrl';
	
	const apibaseurlStore = useApiBaseUrlStore();
	const baseurl =ref(apibaseurlStore.baseurl);
	const props = defineProps({
		goodData:{
			type:Array
		}
	})
	
	const click_good = (id)=>{
		uni.navigateTo({
			url:"/pages/detail/detail?id="+id
		})
	}
</script>

<style lang="scss">
	.guess-like-bar{
		display: flex;
		flex-wrap: wrap;
		height: auto;
		width: 100%;
		padding: 0 5px;
		box-sizing: border-box;
		.like-good-card{
			width: calc(100% / 2);
			height: auto;
			padding: 7px;
			box-sizing: inherit;
			overflow: hidden;
			.good-card{
				height: 100%;
				width: 100%;
				padding:10px;
				box-sizing: border-box;
				border-radius: 5px;
				background-color: #ffffff;
				.img-box{
					width: 100%;
					height: auto;
					.img{
						width: 100%;
						height: auto;
					}
				}
				.good-title{
					height: 48px;
					font-size: 15px;
					line-height: 24px;
					overflow: hidden;
				}
				.price-text{
					margin-top: 10px;
					color: #cf4444;
					.money-logo{
						font-size: 12px;
					}
				}
			}
		}
	}
</style>