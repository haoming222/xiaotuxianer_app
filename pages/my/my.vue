<template>
	<view class="my-bbox">
		<scroll-view class="my" @scrolltolower="scrollToLower" scroll-y="true">
			<Profile></Profile>
			<OrderBox></OrderBox>
			<GoodBox :goodData="guessLikeData"></GoodBox>
			<view v-if="showLoadMore" class="load-more">加载更多...</view>
		</scroll-view>
		<!-- AI 购物助手入口 ─ 点击跳转独立页面 -->
		<view class="ai-helper-box" @click="clickAiAssistant">
			<view style="font-size: 24px;">🤖</view>
		</view>
		<!-- <view class="helper-box" @click="clickHelper" v-if="isShowHelper">
			<img class="helper-avatar-bbox" :src="helperAvatar" alt="">
		</view> -->
		<!-- 页面底部收缩条 -->
		<!-- <view class="helper-content-bbox" :class="{ active: showHelperContentBox }">
			<HelperChat></HelperChat>
		</view> -->
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	import Profile from './components/Profile/Profile.vue';
	import OrderBox from './components/OrderBox/OrderBox.vue';
	import GoodBox from '@/components/goodbox/GoodBox.vue'
	import HelperChat from '../../components/helperchat/HelperChat/HelperChat.vue';
	import {
		onShow
	} from "@dcloudio/uni-app"
	import request from '../../utils/request';
	import {
		useHelperChat
	} from '../../stores/HelperChat';

	const guessLikeData = ref()
	const showLoadMore = ref(true)
	const pagesize = ref(10)
	const helperAvatar = ref("static/logoimg/客服助手.png")
	const isShowHelper = ref(true)
	const helperChatStore = useHelperChat()
	
	const showHelperContentBox = computed({
	  get: () => helperChatStore.showHelperContentBox,
	  set: (val) => {
	    helperChatStore.showHelperContentBox = val
	  }
	})

	const fetchGuessGoodData = async () => {
		try {
			const data = await request({
				url: "/home/goods/guessLike",
				data: {
					page: 1,
					pageSize: pagesize.value
				}
			})
			guessLikeData.value = data.data.list
			showLoadMore.value = true
		} catch (error) {
			console.log("请求失败:", error)
		}
	}
	const scrollToLower = () => {
		pagesize.value = pagesize.value + 10
		fetchGuessGoodData()
		showLoadMore.value = false
		console.log("nihao");
	}
	const clickHelper = () => {
		showHelperContentBox.value = !showHelperContentBox.value
	}
	const clickAiAssistant = () => {
		uni.navigateTo({ url: '/pages/aiAssistant/aiAssistant' })
	}
	onShow(() => {
		fetchGuessGoodData();
	});
</script>

<style scoped lang="scss">
	.my-bbox {
		position: relative;
		width: 100%;
		height: 100%;

		.my {
			background-color: #f7f7f7;
			height: 100%;
			width: 100%;
			z-index: 1;
		}

		.load-more {
			height: 2rem;
			width: 100%;
			text-align: center;
		}

		.ai-helper-box {
			position: fixed;
			right: 20px;
			bottom: 50px;
			height: 60px;
			width: 60px;
			z-index: 99;
			background: #1296db;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 2px 8px rgba(18,150,219,0.4);
			.ai-helper-avatar {
				width: 32px;
				height: 32px;
			}
		}
		.helper-box {
			position: fixed;
			right: 20px;
			bottom: 70px;
			height: 70px;
			width: 70px;
			z-index: 99;

			.helper-avatar-bbox {
				width: 100%;
				height: auto;
			}
		}

		.helper-content-bbox {
			position: fixed;
			bottom: 48px;
			// bottom: calc(85vh + 48px);
			height: 0;
			width: 100%;
			background-color: #fff;
			transition: height 0.3s ease;
			opacity: 0.9;
			z-index: 100;
		}

		.helper-content-bbox.active {
			height: 70vh;
		}
	}
</style>