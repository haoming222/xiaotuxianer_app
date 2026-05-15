<template>
	<view>
		<CustomNavbar></CustomNavbar>
		<scroll-view scroll-y="true" class="home-content" refresher-enabled="true" @scrolltolower="scrollToLower">
			<CustomSwiper :bannerData="bannerData"></CustomSwiper>
			<CategoryBar :categoryData="categoryData"></CategoryBar>
			<HotBar :hotData="hotData"></HotBar>
			<view class=guess-like-title>猜你喜欢</view>
			<GoodBox :goodData="guessLikeData"></GoodBox>
			<view v-if="showLoadMore" class="load-more">加载更多...</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import CustomNavbar from './components/CustomNavbar.vue';
	import CustomSwiper from '@/components/swiper/CustomSwiper.vue';
	import CategoryBar from './components/category/CategoryBar.vue';
	import HotBar from './components/hot/HotBar.vue';
	import GoodBox from '../../components/goodbox/GoodBox.vue';
	import { onMounted, ref } from 'vue';
	import request from '@/utils/request';
	
	const bannerData = ref()
	const categoryData = ref()
	const hotData = ref()
	const guessLikeData = ref()
	const showLoadMore = ref(true)
	const pagesize = ref(10)
	
	const fetchBannerData = async () => {
		try{
			const data = await request({
				url:'/home/banner',
				method:'get',
				data:{
					distributionSite:1
				}
			})
			bannerData.value = data.data
		} catch (error) {
	      console.error('请求失败:', error);
	  }
	}
	const fetchCategoryData = async () => {
		try{
			const data = await request({
				url:'/home/category/multi'
			})
			categoryData.value = data.data
		}catch(error){
			console.error("请求失败:",error)
		}
	}
	const fecthHotData = async ()=>{
		try{
			const data = await request({
				url:"/home/hot/multi"
			})
			hotData.value = data.data
		}catch(error){
			console.error("请求失败:",error)
		}
	}
	const fetchGuessGoodData = async ()=>{
		try{
			const data = await request({
				url:"/home/goods/guessLike",
				data:{
					page:1,
					pageSize:pagesize.value
				}
			})
			guessLikeData.value = data.data.list
			showLoadMore.value = true
		}catch(error){
			console.log("请求失败:",error)
		}
	}
	const scrollToLower = ()=>{
		pagesize.value = pagesize.value + 10 
		fetchGuessGoodData()
		showLoadMore.value = false
	}
		
	onMounted(()=>{
		fetchBannerData()
		fetchCategoryData()
		fecthHotData()
		fetchGuessGoodData()
		}
	)
	
</script>

<style lang="scss" scoped>
.home-content{
	position: absolute;
	height: calc(100vh - 120px);
	width: 750rpx;
	top: 70px;
	bottom: 50px;
	overflow: hidden;
	background-color: #f7f7f7;
}
.guess-like-title{
	height: 40px;
	text-align: center;
	font-weight: bold;
	font-size: 18px;
	font-family: 'YouYuan';
}
.load-more{
	height:5rem;
	font-size: 1rem;
	width: 100%;
	text-align: center;
}

</style>
