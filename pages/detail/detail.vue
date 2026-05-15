<template>
	<view class="detail-page">
		<scroll-view scroll-y class="detail" :show-scrollbar="false">
			<DetailSwiper :bannerData="mainPictures"></DetailSwiper>
			<GoodInfoBox :goodInfo="detailData"></GoodInfoBox>
			<SelectBox ref="selectBoxRef" :detail-data="detailData" :goods-id="id"></SelectBox>
			<GoodDetailPicBox :goodPic="detailData.details"></GoodDetailPicBox>
			<view class="recommend-title">同类推荐</view>
			<GoodBox :goodData="detailData.similarProducts"></GoodBox>
		</scroll-view>
		<DetailActionBar v-if="showDetailActionBar" @open-specs="openSpecSheet" />
	</view>
</template>

<script setup>
	import { onMounted, ref, computed } from 'vue';
	import request from '../../utils/request';
	import { useApiBaseUrlStore } from '../../stores/ApiBaseUrl';
	import { useDetailActionBarStore } from '../../stores/DetailActionBar';
	import DetailSwiper from './components/DetailSwiper/DetailSwiper.vue';
	import GoodInfoBox from './components/GoodInfoBox/GoodInfoBox.vue';
	import GoodDetailPicBox from './components/GoodDetailPicBox/GoodDetailPicBox.vue';
	import SelectBox from './components/SelectBox/SelectBox.vue';
	import DetailActionBar from './components/DetailActionBar/DetailActionBar.vue';
	import GoodBox from '../../components/goodbox/GoodBox.vue';

	const apiBaseUrlStore = useApiBaseUrlStore()
	const detailActionBarStore = useDetailActionBarStore()
	const showDetailActionBar = computed(() => detailActionBarStore.isShow)
	const baseurl = apiBaseUrlStore.baseurl
	const id = ref()
	const detailData = ref()
	let pages = getCurrentPages();
	id.value = pages[pages.length - 1].options.id
	const mainPictures = ref()
	const selectBoxRef = ref(null)

	/** 底部「加入购物车」与淘宝一致：先打开规格面板，再在面板内提交 */
	const openSpecSheet = () => {
		if (!detailData.value?.skus?.length) {
			uni.showToast({ title: '商品加载中，请稍后再试', icon: 'none' })
			return
		}
		selectBoxRef.value?.openSpecsPopup?.()
		detailActionBarStore.setIsShow(false)

	}
	

	const fetchDetailData = async()=>{
		try{
			const data = await request({
				url: '/goods/detail',
				data:{
					id: id.value
				}
			})
			detailData.value = data.data
			mainPictures.value = data.data.mainPictures
		}catch(error){
			console.log("请求失败:",error)
		}
	}
	
	onMounted(()=>{
		fetchDetailData()
	})
</script>

<style lang="scss" scoped>
	.detail-page {
		min-height: 100vh;
		position: relative;
		background-color: rgb(244 244 244);
	}

	.detail {
		height: auto;
		width: 100%;
		background-color: rgb(244 244 244);
		padding-bottom: calc(3.75rem + constant(safe-area-inset-bottom));
		padding-bottom: calc(3.75rem + env(safe-area-inset-bottom));
		box-sizing: border-box;
	}
	.swiper-box{
		width: 100%;
		height: 300px
	}
	.swiper-img{
		width: 100%; 
		object-fit: cover; 
	}
	.recommend-title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 2.8125rem;
		line-height: 1;
		padding: .9375rem 1.875rem .9375rem .1875rem;
		box-sizing: border-box;
		overflow: hidden;
		border-left: solid rgb(39 186 155) .5rem;
	}
</style>
