<template>
	<view class="hot-bar">
		<view class="hot-bar-box">
			<view class="hot-card" url="/pages/hot/hot" v-for="item in hotData" @click="navigateTo(item.hotType)">
				<view class="card-top">
					<view class="card-title">{{item.title}}</view>
					<view class="sub-title">{{item.alt}}</view>
				</view>
				<view class="card-buttom">
					<view class="card-img-box">
						<img class="card-img card-img-left" :src="baseurl+item.pictures[0]" alt="" />
						<img class="card-img" :src="baseurl+item.pictures[1]" alt="" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { defineProps, getCurrentInstance, ref } from 'vue';
	import { useApiBaseUrlStore } from '../../../../stores/ApiBaseUrl';
	import { useHotTypeStore } from '../../../../stores/HotType';
	
	const apibaseurlStore = useApiBaseUrlStore();
	const baseurl =ref(apibaseurlStore.baseurl);
	const props = defineProps({
		hotData:{
			type:Array
		}
	})
	const hottypeStore = useHotTypeStore();
	
	const navigateTo = (hotType) =>{
		uni.navigateTo({
			url: '/pages/hot/hot?hotType='+hotType,
		})
		hottypeStore.sethottype(hotType)
	}
</script>

<style lang="scss" scoped>
	.hot-bar{
		height: 260px;
		width: 100%;
		overflow: hidden;
		padding: 15px;
		box-sizing: border-box;
		.hot-bar-box{
			height: 100%;
			width: 100%;
			box-sizing: border-box;
			background-color: #ffffff;
			overflow: hidden;
			border-radius: 5px;
			display: flex;
			flex-wrap: wrap;
			padding: 5px;
			.hot-card{
				height: calc(100% / 2);
				width: calc(100% / 2);
				padding: 5px;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				.card-top{
					height:20px;
					width: 100%;
					position: relative;
					overflow: hidden;
					.card-title{
						height: 100%;
						position: absolute;
						display: flex;
						flex-direction: row;  
						align-items: center;
						float: left;
						width: 70px;
					}
					.sub-title{
						position: absolute;
						height: 100%;
						display: flex;
						flex-direction: row;  
						align-items: center;
						left: 75px;
						color: #9a9a9a;
						font-size: 11px;
					}
				}
				.card-buttom{
					flex: 1;
					width: 100%;
					box-sizing: border-box;
					.card-img-box{
						height: 100%;
						width: 100%;
						padding-top: 7px;
						.card-img{
							float: left;
							height: 70px;
							width: 70px;
						}
						.card-img-left{
							margin-right: 12px;
						}
					}
				}
			}
			
		}
	}
	
</style>