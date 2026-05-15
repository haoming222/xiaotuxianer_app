<template>
	<view class="detail-action-bar">
		<view class="detail-action-bar__inner">
			<view class="detail-action-bar__icon-group">
				<view class="detail-action-bar__item" @click="onService">
					<image
						class="detail-action-bar__icon"
						src="/static/icons/detail-action/客服.png"
						mode="aspectFit"
					/>
					<text class="detail-action-bar__label">客服</text>
				</view>
				<view class="detail-action-bar__item" @click="onFavorite">
					<image
						class="detail-action-bar__icon"
						src="/static/icons/detail-action/收藏.png"
						mode="aspectFit"
					/>
					<text class="detail-action-bar__label">收藏</text>
				</view>
			</view>
			<view class="detail-action-bar__btns">
				<!-- 与淘宝一致：先弹出规格面板，再在面板内确认加购 -->
				<view class="detail-action-bar__btn detail-action-bar__btn--cart" @click="onAddCart">
					加入购物车
				</view>
				<view class="detail-action-bar__btn detail-action-bar__btn--buy" @click="onCouponBuy">
					领券购买
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	/**
	 * 底部操作栏：加购不直接请求接口，仅通知父级打开规格弹层（见 detail.vue + SelectBox）
	 */
	const emit = defineEmits(['open-specs'])

	function noopTip(name) {
		uni.showToast({
			title: `${name}（待接入）`,
			icon: 'none',
			duration: 1800
		})
	}

	function onService() {
		noopTip('客服')
	}

	function onFavorite() {
		noopTip('收藏')
	}

	function onAddCart() {
		emit('open-specs')
	}

	function onCouponBuy() {
		noopTip('领券购买')
	}
</script>

<style lang="scss" scoped>
	.detail-action-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
		background-color: #fff;
		border-top: 1px solid #eaeaea;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04);
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.detail-action-bar__inner {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0.75rem;
		min-height: 3.125rem;
		box-sizing: border-box;
	}

	.detail-action-bar__icon-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
	}

	.detail-action-bar__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 3rem;
		padding: 0 0.25rem;
	}

	.detail-action-bar__icon {
		width: 1.375rem;
		height: 1.375rem;
		margin-bottom: 0.125rem;
	}

	.detail-action-bar__label {
		font-size: 0.625rem;
		color: #555;
		line-height: 1.2;
	}

	.detail-action-bar__btns {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: flex-end;
		margin-left: 0.5rem;
		min-width: 0;
	}

	.detail-action-bar__btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 9rem;
		padding: 0.5rem 0.375rem;
		font-size: 0.8125rem;
		font-weight: 500;
		border-radius: 2rem;
		box-sizing: border-box;
		line-height: 1.2;
		text-align: center;
	}

	.detail-action-bar__btn--cart {
		color: #ff5000;
		background-color: #fff;
		border: 1px solid #ff5000;
		margin-right: 0.5rem;
	}

	.detail-action-bar__btn--buy {
		color: #fff;
		border: none;
		background: linear-gradient(90deg, #ff9500 0%, #ff5000 100%);
	}
</style>
