<template>
	<view class="hot-content">
		<view class="hot-banner">
			<img class="banner-img" :src=baseurl+hotData.bannerPicture alt="" />
			<view class="hot-title-box">
				<view class="hot-title">
					<view class="title-text" :style="{color:isActionIndex == index ? '#27ba9b' : 'black'}" v-for="item,index in hotData.subtypes" :key="index"  @click="clickTitle(index)">
						{{item.title}}
					</view>
				</view>
			</view>
		</view>
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-box" @scrolltolower="scrollToLower">
			<GoodBox :goodData="goodData"></GoodBox>
			<view v-if="showLoadMore" class="load-more">加载更多...</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import { useApiBaseUrlStore } from '../../stores/ApiBaseUrl';
	import { useHotTypeStore } from '../../stores/HotType';
	import { onMounted, ref, nextTick } from 'vue';
	import GoodBox from '../../components/goodbox/GoodBox.vue';
	import request from '../../utils/request';
	
	const apiBaseUrlStore = useApiBaseUrlStore()
	const baseurl = ref(apiBaseUrlStore.baseurl)
	const hottypeStore = useHotTypeStore()
	const hottype = ref(hottypeStore.hottype)
	const hotData = ref()
	const isActionIndex = ref(0)
	const goodData = ref()
	const showLoadMore = ref(true)
	const pagesize = ref(10)
	const scrollTop = ref(0)
	const currentParams = ref(getCurrentPages()[0].options.hotType);
	
	const fetchHotData = async (currentParams)=>{
		try{
			const data = await request({
				url:"/hot/"+hottype.value,
				data:{
					page:1,
					pageSize:pagesize.value
				}
			})
			hotData.value = data.data
			goodData.value = data.data.subtypes[0].goodsItems.list
			showLoadMore.value = true
		}catch(error){
			console.log("请求失败:",error)
		}
	}
	const clickTitle = (index)=>{
		isActionIndex.value = index
		goodData.value = hotData.value.subtypes[index].goodsItems.list
		scrollTop.value = 0  // 确保 DOM 更新后再滚动到顶部
		
	}
	const scrollToLower = ()=>{
		pagesize.value = pagesize.value + 10 
		fetchHotData(currentParams.value)
		showLoadMore.value = false
	}
	
	
	onMounted(()=>{
		fetchHotData(currentParams);
	})
</script>

<style lang="scss" scoped>
	.hot-content{
		position: relative;
		background-color: #f7f7f7;
		height: 100vh;
		width: 100%;
		flex-direction: column;
	}
	.hot-banner{
		position: fixed;
		width: 100%;
		z-index: 100;
		.banner-img{
			width: 100%;
			height: auto;
			border-bottom-right-radius: 20px;
			border-bottom-left-radius: 20px;
		}
		.hot-title-box{
			bottom: 0;
			height: 50px;
			width: 100%;
			padding:0 10px;
			box-sizing: border-box;
			.hot-title{
				display: flex;
				height: 100%;
				width: 100%;
				padding: 10px;
				box-sizing: border-box;
				background-color: #ffffff;
				border-radius: 5px;
				.title-text{
					flex:1;
					text-align: center;
				}
				
			}
		}
	}
	.scroll-box{
		position: absolute;
		top: 180px;	
		height: calc(100vh - 180px);
		background-color: #f7f7f7;
		overflow: hidden;
		width: 100%;
	}
	.load-more{
		height:100px;
		width: 100%;
		text-align: center;
	}
</style>
