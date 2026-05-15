<template>
	<view class="good-info-box">
		<view class="price-title">
			<text class="price-logo">¥</text>
			<text>{{goodInfo.price}}</text>
		</view>
		<view class="good-info">
			<view class="good-name">
				{{goodInfo.name}}
			</view>
			<view class="good-description">
				{{goodInfo.description}}
			</view>
		</view>
	</view>
</template>

<script setup>
	import { defineProps } from 'vue';
	
	const props = defineProps({
		goodInfo:{
			type:Object
		}
	})
</script>

<style lang="scss" scoped>
	.good-info-box{
		height: 8.4375rem;
		width: 100%;
		border-bottom: .03125rem solid #eaeaea;
		.price-title{
			height: 4rem;
			background-color: #35c8a9;
			padding: 0.8rem;
			box-sizing: border-box;
			color: #fff;
			font-size: 1.75rem;
			.price-logo{
				font-size: 1rem;
			}
		}
		.good-info{
			height: calc(100% - 4rem);
			.good-name{
				max-height: 2.75rem;
				line-height: 1.4;
				margin: .625rem;
				font-size: 1rem;
				color: #333;
			}
		}
		.good-description{
			line-height: 1;
			padding: 0 .625rem .9375rem;
			font-size: .75rem;
			color: #cf4444;
		}
	}
	

</style>
