<template>
	<view class="category-container">
		<scroll-view scroll="true" class="category-item-box">
			<view class="category-item-title" 
			:style="{background: index==isActiveCategory ?'#fff':'',
			borderRadius: index==(isActiveCategory-1) ? '0 0 .5rem 0'
			:index==(isActiveCategory+1) ? '0 .5rem 0 0':'',
			}" 
			v-for="item,index in categoryData" 
			:key="index" @click="clickCategoryTitle(index)">
							{{ item.name }}
			</view>
			
		</scroll-view>
		<scroll-view scroll-y="true" class="category-content-box">
			<CustomSwiper :bannerData="bannerData"></CustomSwiper>
			<ChildrenBar :childrenData='childrenData'></ChildrenBar>
		</scroll-view>
	</view>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import CustomSwiper from '../../components/swiper/CustomSwiper.vue';
	import ChildrenBar from './components/childrenbar/ChildrenBar.vue';
	import request from '../../utils/request';
	
	const bannerData = ref()
	const categoryData = ref()
	const isActiveCategory = ref(0)
	const activeIndexUpper = ref(-1)
	const activeIndexLower = ref(1)
	const childrenData = ref()
	
	const fetchSwiperData = async ()=>{
		try{
			const data = await request({
				url:'/home/banner',
				data:{
					distributionSite:1
				}
			})
			bannerData.value = data.data
		}catch(error){
			console.log("请求失败:",error)
		}
	}
	const fetchCategoryData = async ()=>{
		try{
			const data = await request({
				url:'/category/top'
			})
			categoryData.value = data.data
			childrenData.value = data.data[0].children
		}catch(error){
			console.log("请求失败:",error)
		}
	}
	const clickCategoryTitle = (index)=>{
		isActiveCategory.value = index
		activeIndexUpper.value = index-1
		activeIndexLower.value = index+1
		childrenData.value = categoryData.value[index].children
	}
	
	onMounted(()=>{
		fetchSwiperData()
		fetchCategoryData()
	})
</script>

<style lang="scss">
	.category-container{
		width: 100vw;
		height: calc(100vh - 50px);
		display: flex;
		background: #fff;
		.category-item-box{
			display: flex;
			flex-direction: column;
			width: 5.625rem;
			height: 100%;
			background: #fff;
			.category-item-title{
				background-color: #f6f6f6;
				width: 100%;
				height: 3rem;
				line-height: 3rem;
				text-align: center;
				overflow: hidden;
				font-size: .8125rem;
			}
		}
		.category-content-box{
			flex: 1;
			height: 100%;
			padding: .5rem .5rem 0;
			box-sizing: border-box;
		}
	}

	
</style>
