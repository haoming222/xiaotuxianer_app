
<template>
	<view class="detail-swiper">
		<swiper class="custom-swiper" 
	        :style="{ height: swiperHeight }"
					@change="currentIndexChange"
					circular="true">
			<swiper-item class="swiper-item" v-for="item in bannerData" :key="item.id">		
					<img class="swiper-img" :src="baseurl + item" @load="updateHeight" />
			</swiper-item>
		</swiper>
		<view class="indicator">
			<text class="current-num">{{currentSwiperIndex}}</text>
			<text>/{{ bannerData.length }}</text>
		</view>
	</view>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { useApiBaseUrlStore } from '@/stores/ApiBaseUrl';

const apibaseurlStore = useApiBaseUrlStore();
const baseurl = ref(apibaseurlStore.baseurl);
const swiperHeight = ref('auto'); // 动态轮播图高度
const currentSwiperIndex = ref(1)
const props = defineProps({
	bannerData: {
		type: Array
	}
});

const currentIndexChange = (event)=>{
	currentSwiperIndex.value = event.detail.current + 1
}
// 更新轮播图高度
function updateHeight(event) {
	const img = event.target;
	const imgRatio = img.naturalHeight / img.naturalWidth;
	const swiperWidth = img.offsetWidth;
	swiperHeight.value = `${swiperWidth * imgRatio}px`; // 按比例计算高度
}
</script>

<style scoped>
	.detail-swiper{
		position: relative;
	}
	.custom-swiper {
		width: 100%; /* 设置宽度为父元素的宽度 */
		overflow: hidden;
	}

	.swiper-img {
		width: 100%; /* 图片宽度自适应 */
		object-fit: cover; /* 保持图片比例 */
	}
	.indicator{
		height: 1.25rem;
		padding: 0 .75rem;
		line-height: 1.25rem;
		border-radius: .9375rem;
		color: #fff;
		font-family: Arial, Helvetica, sans-serif;
		background-color: rgba(0, 0, 0, .3);
		position: absolute;
		bottom: .9375rem;
		right: .9375rem;
		font-size: .8rem;
	}
	.current-num{
		font-size: 1rem;
	}
</style>
