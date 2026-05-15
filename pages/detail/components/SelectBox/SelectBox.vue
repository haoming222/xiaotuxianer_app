<template>
	<view class="select-box">
		<view class="select-item" @click="selectSpecs">
			<view class="select-key">选择</view>
			<view class="select-value">请选择商品规格</view>
		</view>
		<uni-popup ref="specsPopup" class="popup-content" type="bottom" background-color="#fff" @change="handlePopupChangeSelectSpces">
			<SelectSpces :detailData="detailData" :goodsId="props.goodsId"></SelectSpces>
		</uni-popup>
		
		<view class="select-item">
			<view class="select-key">送至</view>
			<view class="select-value">请选择收获地址</view>
		</view>
		
		<view class="select-item" @click="showService">
			<view class="select-key">服务</view>
			<view class="select-value"> 无忧退 快速退款 免费包邮 </view>
		</view>
		<uni-popup ref="servicePopup" type="bottom" background-color="#fff">
			<ServiceContent></ServiceContent>
		</uni-popup>
	</view>
</template>

<script setup>
	import { ref, onMounted, onUnmounted, defineProps } from 'vue';
	import { useDetailActionBarStore } from '../../../../stores/DetailActionBar';
	import SelectSpces from './SelectSpces.vue';
	import ServiceContent from './ServiceContent.vue';
	
	const specsPopup = ref(null)
	const servicePopup = ref(null)
  const detailActionBarStore = useDetailActionBarStore()
	const props = defineProps({
		detailData: {
			type: Object
		},
		goodsId: {
			type: [String, Number],
			default: ''
		}
	})
	
	const selectSpecs = ()=>{
		specsPopup.value.open()
	}
	
	const showService =()=>{
		servicePopup.value.open()
	}
	
	// 定义打开规格弹窗的方法
	const openSpecsPopup = () => {
		specsPopup.value.open()
	}
	
	// 监听关闭规格弹窗事件
	const handleCloseEvent = () => {
		specsPopup.value.close()
	}
	
	const handlePopupChangeSelectSpces = (e) => {
	  if (e.show) {
	    detailActionBarStore.setIsShow(false)
	  }
		else{
			detailActionBarStore.setIsShow(true)
		}
	}
	
	onMounted(() => {
		uni.$on('close-specs-popup', handleCloseEvent)
	})
	
	onUnmounted(() => {
		uni.$off('close-specs-popup', handleCloseEvent)
	})
	
	defineExpose({
		openSpecsPopup
	})
</script>
<style lang="scss" scoped>
	.select-box{
		width: 100%;
		flex-direction: column;
	}
	.select-item{
		height: 2.8125rem;
		padding-right: 1.875rem;
		border-bottom: .03125rem solid #eaeaea;
		font-size: .8125rem;
		color: #333;
		position: relative;
		display: flex;
		
		align-items: center;
		.select-key{
			width: 1.875rem;
			color: #898b94;
			margin: 0 .5rem 0 .3125rem;
		}
		.select-value{
			padding-left: 1rem;
		}
	}
	.popup-content{
		position: relative;
	}

</style>
