<template>
	<view class="spec-selector">
		<view class="spec-header">
			<text class="spec-price">￥{{ selectedSpec?.price || detailData?.price }}</text>
			<text class="spec-stock">库存{{ selectedSpec?.inventory || 0 }}件</text>
		</view>
		
		<view v-for="(spec, index) in detailData.skus" :key="index" 
		      :class="['spec-item', { 'selected': selectedSpec?.id === spec.id }]" 
		      @click="selectSpec(spec)">
			<text class="spec-name">{{ spec.specSummary }}</text>
			<text class="spec-price">￥{{ spec.price }}</text>
		</view>
		
		<view class="quantity-section">
			<text class="quantity-label">数量</text>
			<view class="quantity-control">
				<button class="quantity-btn" @click="decreaseQuantity">-</button>
				<input class="quantity-input" type="number" v-model.number="quantity" />
				<button class="quantity-btn" @click="increaseQuantity">+</button>
			</view>
		</view>
		
		<view class="action-buttons">
			<button class="confirm-btn" @click="addToCart">加入购物车</button>
		</view>
	</view>
</template>

<script setup>
	import { ref, defineProps } from 'vue';
	import { addToCart as addCartToServer } from '../../../utils/cartApi';

	const props = defineProps({
		detailData: {
			type: Object,
			default: null
		},
		goodsId: {
			type: [String, Number],
			default: ''
		}
	})

	// 选择的规格
	const selectedSpec = ref(null)
	
	// 数量
	const quantity = ref(1)

	// 打开规格面板
	const specsPopup = ref(null)

	// 选择规格
	const selectSpec = (spec) => {
		selectedSpec.value = spec
	}

	// 增加数量
	const increaseQuantity = () => {
		if (selectedSpec.value && quantity.value < (selectedSpec.value.inventory || Infinity)) {
			quantity.value++
		} else if (!selectedSpec.value) {
			quantity.value++
		}
	}

	// 减少数量
	const decreaseQuantity = () => {
		if (quantity.value > 1) {
			quantity.value--
		}
	}

	// 添加到购物车
	const addToCart = async () => {
		if (!selectedSpec.value) {
			uni.showToast({
				title: '请先选择商品规格',
				icon: 'none'
			});
			return;
		}

		if (quantity.value < 1) {
			uni.showToast({
				title: '购买数量不能少于1',
				icon: 'none'
			});
			return;
		}

		if (selectedSpec.value.inventory !== undefined && quantity.value > selectedSpec.value.inventory) {
			uni.showToast({
				title: `库存不足，最多可购买${selectedSpec.value.inventory}件`,
				icon: 'none'
			});
			return;
		}

		try {
			const cartData = {
				goodsId: props.goodsId,
				skuId: selectedSpec.value.id,
				quantity: quantity.value,
				specSummary: selectedSpec.value.specSummary
			};

			const result = await addCartToServer(cartData);
			
			if (result.code === 200) {
				uni.showToast({
					title: '已成功加入购物车',
					icon: 'success'
				});
				
				// 关闭规格弹窗
				uni.$emit('close-specs-popup');
			} else {
				uni.showToast({
					title: result.message || '加入购物车失败',
					icon: 'none'
				});
			}
		} catch (error) {
			console.error('添加购物车失败:', error);
			uni.showToast({
				title: '网络错误，请重试',
				icon: 'none'
			});
		}
	}

	defineExpose({
		selectSpec,
		addToCart
	})
</script>

<style lang="scss" scoped>
	.spec-selector {
		display: flex;
		flex-direction: column;
	}

	.spec-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid #eee;
	}

	.spec-name {
		font-size: 0.875rem;
		color: #333;
	}

	.spec-header {
		padding: 0.75rem;
		border-bottom: 1px solid #eee;
	}

	.spec-price {
		font-size: 1.25rem;
		color: #ff5000;
		font-weight: bold;
		margin-right: 0.5rem;
	}

	.spec-stock {
		font-size: 0.75rem;
		color: #999;
	}

	.spec-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid #eee;
	}

	.spec-item.selected {
		background-color: #f0f9ff;
		color: #ff5000;
	}

	.spec-name {
		font-size: 0.875rem;
		color: #333;
	}

	.spec-price {
		font-size: 0.875rem;
		color: #ff5000;
	}

	.quantity-section {
		padding: 0.75rem;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #eee;
	}

	.quantity-label {
		font-size: 0.875rem;
		color: #333;
		margin-right: 0.5rem;
	}

	.quantity-control {
		display: flex;
		align-items: center;
	}

	.quantity-btn {
		width: 2rem;
		height: 2rem;
		border: 1px solid #ddd;
		background: #fff;
		font-size: 1.2rem;
		line-height: 1.8rem;
	}

	.quantity-input {
		width: 3rem;
		height: 2rem;
		text-align: center;
		border: 1px solid #ddd;
		border-left: 0;
		border-right: 0;
	}

	.action-buttons {
		padding: 0.75rem;
	}

	.confirm-btn {
		width: 100%;
		height: 3rem;
		background: linear-gradient(90deg, #ff9500 0%, #ff5000 100%);
		color: #fff;
		border: none;
		border-radius: 0.25rem;
		font-size: 1rem;
		font-weight: bold;
	}
</style>
