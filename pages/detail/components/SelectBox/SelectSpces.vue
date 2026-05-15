<template>
	<scroll-view scroll-y="true" class="specs-scroll">
		<view class="good-info-box">
			<view class="good-img-box">
				<img class="good-img" :src="selectPicUrl" alt="" />
			</view>
			<view class="good-info">
				<view class="price-box">
					<text class="price-logo">￥</text>
					<text class="price-value">{{ selectSpecsPrice }}</text>
				</view>
				<view class="inventory-box">
					<text class="inventory-label">库存：</text>
					<text class="inventory-value">{{ selectSpecsInventory }}</text>
				</view>
				<view class="selected-content">
					<view class="selected-label">已选：{{ selectSpecsTitle }}</view>
				</view>
			</view>
		</view>
		<view class="spces-box">
			<view class="specs-title">规格</view>
			<view
				class="specs-elemet"
				@click="onPickSpec(index)"
				:class="index == selectSpecsIndex ? 'selected-specs-element' : ''"
				v-for="(item, index) in detailData.skus"
				:key="index"
			>
				{{ item.specs[0].valueName }}
			</view>
		</view>
		<view class="counter-box">
			<view class="counter-label" style="font-size: 1rem">数量</view>
			<view class="counter">
				<view class="counter-sub" @click="subNum()" :class="counterNum == 1 ? 'button-disable' : ''">-</view>
				<view class="count-num">{{ counterNum }}</view>
				<view class="counter-add" @click="addNum()" :class="counterNum == selectSpecsInventory ? 'button-disable' : ''">+</view>
			</view>
		</view>
		<view style="height: 1rem"></view>
	</scroll-view>
	<view class="pay-box">
		<!-- @tap.stop：弹层内避免事件冒泡丢失，各端更易触发；点选后立即发 POST /cart/add -->
		<view class="add-cart" :class="{ 'is-busy': addCartSubmitting }" @tap.stop="handleAddToCart">
			{{ addCartSubmitting ? '加入中…' : '加入购物车' }}
		</view>
		<view class="pay-button" @tap.stop="handleBuyNow">立即购买</view>
	</view>
</template>

<script setup>
	import { ref, watch } from 'vue'
	import { useApiBaseUrlStore } from '../../../../stores/ApiBaseUrl'
	import { addToCart } from '../../../../utils/cartApi'

	const apiBaseUrlStore = useApiBaseUrlStore()
	const baseUrl = apiBaseUrlStore.baseurl

	const props = defineProps({
		detailData: {
			type: Object,
			required: true
		},
		goodsId: {
			type: [String, Number],
			required: true
		}
	})

	const emit = defineEmits(['added-to-cart'])

	const selectSpecsIndex = ref(0)
	const selectPicUrl = ref('')
	const selectSpecsPrice = ref('')
	const selectSpecsTitle = ref('')
	const selectSpecsInventory = ref(0)
	const counterNum = ref(1)
	const addCartSubmitting = ref(false)

	/** 根据 SKU 下标刷新展示（价格、库存、主图） */
	function applySkuIndex(index) {
		const d = props.detailData
		if (!d?.skus?.[index]) return
		const sku = d.skus[index]
		selectPicUrl.value = sku.picture == '' ? baseUrl + d.mainPictures[0] : baseUrl + sku.picture
		selectSpecsIndex.value = index
		selectSpecsPrice.value = sku.price
		selectSpecsTitle.value = sku.specs[0].valueName
		selectSpecsInventory.value = sku.inventory
	}

	watch(
		() => props.detailData,
		(d) => {
			if (d?.skus?.length) {
				counterNum.value = 1
				applySkuIndex(0)
			}
		},
		{ immediate: true, deep: true }
	)

	function onPickSpec(index) {
		counterNum.value = 1
		applySkuIndex(index)
	}

	function subNum() {
		if (counterNum.value > 1) {
			counterNum.value = counterNum.value - 1
		}
	}

	function addNum() {
		if (counterNum.value < selectSpecsInventory.value) {
			counterNum.value = counterNum.value + 1
		}
	}

	/**
	 * 淘宝流程：在面板内确认规格与数量后再请求加购
	 */
	async function handleAddToCart() {
		if (addCartSubmitting.value) return
		const gid = Number(props.goodsId)
		if (Number.isNaN(gid) || gid <= 0) {
			uni.showToast({ title: '缺少商品信息', icon: 'none' })
			return
		}
		const sku = props.detailData.skus[selectSpecsIndex.value]
		const payload = {
			goodsId: gid,
			quantity: counterNum.value,
			specSummary: sku.specs?.[0]?.valueName ?? ''
		}
		if (sku.id != null) payload.skuId = String(sku.id)
		else if (sku.skuId != null) payload.skuId = String(sku.skuId)

		addCartSubmitting.value = true
		try {
			await addToCart(payload)
			uni.showToast({ title: '已加入购物车', icon: 'success' })
			emit('added-to-cart')
		} catch (e) {
			// 错误提示由 request 统一处理
		} finally {
			addCartSubmitting.value = false
		}
	}

	function handleBuyNow() {
		uni.showToast({ title: '立即购买（待接入）', icon: 'none' })
	}
</script>

<style lang="scss" scoped>
	.specs-scroll {
		height: 28.125rem;
		width: 100%;
		padding: 0.9375rem 0.78125rem;
		box-sizing: border-box;
		padding-bottom: 0;
		.good-info-box {
			height: 6.375rem;
			display: flex;
			.good-img-box {
				width: 6.375rem;
				padding: 0.5rem;
				box-sizing: border-box;
				.good-img {
					height: 100%;
					width: auto;
				}
			}
			.good-info {
				flex: 1;
				height: 100%;
				.price-box {
					color: rgb(254, 86, 10);
					font-size: 1.5rem;
					.price-logo {
						font-size: 1rem;
					}
				}
				.inventory-box {
					margin-top: 0.2rem;
					font-size: 0.75rem;
					color: #999;
				}
				.selected-content {
					margin-top: 0.2rem;
					font-size: 0.875rem;
				}
			}
		}
	}

	.spces-box {
		margin-top: 1rem;
		.specs-title {
			font-size: 0.875rem;
			color: #999;
			margin-bottom: 0.8rem;
		}
		.specs-elemet {
			width: fit-content;
			height: 1.6875rem;
			color: rgb(51, 51, 51);
			border: rgb(244, 244, 244) solid 0.005rem;
			border-radius: 0.2rem;
			padding: 0.25rem 0.8rem;
			box-sizing: border-box;
			font-size: 0.75rem;
			margin-bottom: 0.575rem;
		}
		.selected-specs-element {
			color: rgb(39, 186, 155);
			border-color: rgb(39, 186, 155);
		}
	}

	.counter-box {
		margin-top: 2rem;
		height: 2.5rem;
		display: flex;
		justify-content: space-between;
	}
	.counter {
		display: flex;
		justify-content: center;
		padding: 0.6rem;
		.counter-add {
			width: 1.8rem;
			font-size: 1.125rem;
			text-align: center;
			line-height: 1;
			font-weight: bold;
			border-radius: 0.2rem;
			background-color: rgb(242 243 245);
		}
		.count-num {
			font-size: 0.8rem;
			width: 2.5rem;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 0.2rem;
			background-color: rgb(242 243 245);
			border-radius: 0.2rem;
		}
		.counter-sub {
			width: 1.8rem;
			font-size: 1.125rem;
			line-height: 1.5rem;
			text-align: center;
			line-height: 1;
			font-weight: bold;
			border-radius: 0.2rem;
			background-color: rgb(242 243 245);
		}
		.button-disable {
			color: #c8c9cc;
			background: #f7f8fa;
		}
	}

	.pay-box {
		height: 3.75rem;
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		padding: 0 0.8125rem;
		box-sizing: border-box;
		.add-cart {
			flex: 1;
			line-height: 2rem;
			border-radius: 1.1875rem 0px 0px 1.1875rem;
			color: rgb(255, 255, 255);
			background-color: rgb(255, 168, 104);
			text-align: center;
		}
		.add-cart.is-busy {
			opacity: 0.85;
		}
		.pay-button {
			flex: 1;
			line-height: 2rem;
			border-radius: 0px 1.1875rem 1.1875rem 0px;
			color: rgb(255, 255, 255);
			background-color: rgb(39, 186, 155);
			text-align: center;
		}
	}
</style>
