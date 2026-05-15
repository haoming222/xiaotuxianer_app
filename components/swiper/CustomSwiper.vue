<!-- <template>
	<swiper class="custom-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
		<swiper-item class="swiper-item" v-for="item in bannerData" :key="item.id">
			<navigator :url="item.hrefUrl">
				<img class="swiper-img" :src="baseurl+item.imgUrl" />		
			</navigator>
		</swiper-item>
	</swiper>
</template>

<script setup>
	import { defineProps, ref } from 'vue';
	import { useApiBaseUrlStore } from '@/stores/ApiBaseUrl';
	
	const apibaseurlStore = useApiBaseUrlStore();
	const baseurl =ref(apibaseurlStore.baseurl);
	const props = defineProps({
		bannerData:{
			 type: Array
		}
	})
	
</script>

<style lang="scss">
	.custom-swiper {
	  width: 100%;
	  position: relative;
		.swiper-item{
			height: auto;
		}
	  .swiper-indicator {
	    position: absolute;
	    bottom: 10px;
	    left: 50%;
	    transform: translateX(-50%);
	    z-index: 10;
	
	    .swiper-dot {
	      width: 10px;
	      height: 10px;
	      background-color: rgba(255, 255, 255, 0.8);
	      border-radius: 50%;
	      margin: 0 5px;
	    }
	  }
	}


	.swiper-img{
		height: auto;
		width: 100%;
	}
</style> -->


<template>
	<swiper class="custom-swiper" 
	        :indicator-dots="true" 
	        :autoplay="true" 
	        :interval="3000" 
	        :duration="1000" 
	        :style="{ height: swiperHeight }">
		<swiper-item class="swiper-item" v-for="item in bannerData" :key="item.id">
			<navigator :url="item.hrefUrl">
				<img class="swiper-img" :src="baseurl + item.imgUrl" @load="updateHeight" />
			</navigator>
		</swiper-item>
	</swiper>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import { useApiBaseUrlStore } from '@/stores/ApiBaseUrl';

const apibaseurlStore = useApiBaseUrlStore();
const baseurl = ref(apibaseurlStore.baseurl);
const swiperHeight = ref('auto'); // 动态轮播图高度

const props = defineProps({
	bannerData: {
		type: Array
	}
});


// 更新轮播图高度
function updateHeight(event) {
	const img = event.target;
	const imgRatio = img.naturalHeight / img.naturalWidth;
	const swiperWidth = img.offsetWidth;
	swiperHeight.value = `${swiperWidth * imgRatio}px`; // 按比例计算高度
}
</script>

<style scoped>
.custom-swiper {
	width: 100%; /* 设置宽度为父元素的宽度 */
	overflow: hidden;
}

.swiper-img {
	width: 100%; /* 图片宽度自适应 */
	object-fit: cover; /* 保持图片比例 */
}
</style>
