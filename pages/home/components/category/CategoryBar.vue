<template>
	<view class="category-bar">
		<view class="category-box" v-for="item in categoryData">
			<view class="category-icon">
				<img class="icon-img" :src="baseurl+item.icon" alt="" />
			</view>
			<view class="category-title">
				{{ item.name }}
			</view>
		</view>
		
	</view>
</template>

<script setup>
	import { defineProps,ref} from 'vue'
	import { useApiBaseUrlStore } from '@/stores/ApiBaseUrl';
	
	const apibaseurlStore = useApiBaseUrlStore();
	const baseurl =ref(apibaseurlStore.baseurl);
	const props = defineProps({
		categoryData:{
			type:Array
		}
	})
</script>

<style lang="scss" scoped>
	.category-bar{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		.category-box{
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			// height: calc((170px - 20px) / 2);
			width: calc(100% / 5);
			.category-icon{
				// height: 50px;
				width: 100%;
				padding-left: 10px;
				padding-right: 10px;
				box-sizing: border-box;
				.icon-img{
					height: 100%;
					width: 100%;
				}
			}
			.category-title{
				flex: 1;
				width: 100%;
				align-items: center;
				text-align: center;
				font-size: 12px;
				color: #9a9a9a;
			}
		}
	}
</style>