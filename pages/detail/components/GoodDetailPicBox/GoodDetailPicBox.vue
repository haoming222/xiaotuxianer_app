<template>
	<view class="good-detail-pic-box">
		<view class="title">
			<text class="title-text">详情</text>
		</view>
		<view class="good-properties">
			<view class="property-box" v-for="item in goodPic.properties">
				<view class="property-key">
					{{item.name}}
				</view>
				<view class="property-value">
					{{item.value}}
				</view>
			</view>
		</view>
		<view class="picture-box" v-for="item in goodPic.pictures">
			<img class="good-pic" :src="baseurl+item" alt="" />
		</view>
	</view>
</template>

<script setup>
	import { defineProps } from 'vue';
	import { useApiBaseUrlStore } from '../../../../stores/ApiBaseUrl';
	
	const apiBaseUrlStore = useApiBaseUrlStore()
	const baseurl = apiBaseUrlStore.baseurl
	const props = defineProps({
		goodPic:{
			type:Object
		}
	})
</script>

<style lang="scss" scoped>
	.good-detail-pic-box{
		height: auto;
		width: 100%;
	}
	.title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 1.2125rem;
		line-height: 1;
		padding: .9375rem 1.875rem .9375rem .1875rem;
		position: relative;
		.title-text{
			padding-left: .3125rem;
			font-size: .875rem;
			color: #333;
			font-weight: 600;
			border-left: .125rem solid #27ba9b;
		}
	}
	
	.good-properties{
		height: auto;
		width: 100%;
		.property-box{
			display: flex;
			line-height: 2;
			padding: .3125rem;
			font-size: .8125rem;
			color: #333;
			border-bottom: .03125rem dashed #ccc;
			.property-key{
				width: 6.25rem;
			}
			.property-value{
				flex: 1;
			}
		}
	}
	.picture-box{
		display: flex;
		.good-pic{
			width: 100%;
			box-sizing: border-box;
		}	
	}
</style>
