<template>
	<view class="order-list-page">
		<!-- 状态 Tab 切换 -->
		<view class="status-tabs">
			<view v-for="(tab, index) in statusTabs" :key="index" class="tab-item"
				:class="{ active: activeStatus === tab.value }" @click="switchTab(tab.value)">
				{{ tab.label }}
			</view>
		</view>

		<!-- 订单列表 -->
		<scroll-view class="order-scroll" scroll-y="true" v-if="filteredOrders.length > 0">
			<view class="order-list-container">
				<view class="order-card" v-for="order in filteredOrders" :key="order.id">
					<view class="order-header">
						<text class="order-id">订单号：{{ order.id }}</text>
						<text class="order-status" :class="statusClass(order.status)">
							{{ statusText(order.status) }}
						</text>
					</view>
					<view class="order-body">
						<image class="goods-img" :src="order.goodsImage || '/static/logoimg/3.1待付款.png'" mode="aspectFill" />
						<view class="goods-info">
							<text class="goods-name">{{ order.goodsName }}</text>
							<text class="goods-spec" v-if="order.specSummary">{{ order.specSummary }}</text>
							<view class="goods-price-row">
								<text class="goods-price">¥{{ order.price }}</text>
								<text class="goods-quantity">x{{ order.quantity }}</text>
							</view>
						</view>
					</view>
					<view class="order-footer">
						<text class="total-label">合计：</text>
						<text class="total-price">¥{{ order.totalPrice }}</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 空状态 -->
		<view class="empty-box" v-else>
			<image class="empty-img" src="/static/logoimg/3.1待付款.png" mode="aspectFit" />
			<text class="empty-text">暂无相关订单</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app';
	import request from '../../utils/request';

	const statusTabs = [{
			label: '全部',
			value: -1
		},
		{
			label: '待付款',
			value: 0
		},
		{
			label: '已支付',
			value: 1
		},
		{
			label: '已取消',
			value: 2
		},
		{
			label: '已过期',
			value: 3
		},
	];

	const activeStatus = ref(-1);
	const allOrders = ref([]);

	// 根据传入参数确定初始 tab
	onShow(() => {
		// 从路由参数获取初始筛选状态
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const options = currentPage?.$page?.options || {};
		if (options.status !== undefined) {
			activeStatus.value = Number(options.status);
		}
		fetchOrders();
	});

	const fetchOrders = async () => {
		try {
			const data = await request({
				url: '/order/list'
			});
			allOrders.value = (data.data || []).map(order => ({
				...order,
				price: formatPrice(order.price),
				totalPrice: formatPrice(order.totalPrice),
			}));
		} catch (error) {
			console.log('获取订单列表失败:', error);
			uni.showToast({
				title: '获取订单失败',
				icon: 'none'
			});
		}
	};

	const formatPrice = (price) => {
		if (price === null || price === undefined) return '0.00';
		return Number(price).toFixed(2);
	};

	const filteredOrders = computed(() => {
		if (activeStatus.value === -1) {
			return allOrders.value;
		}
		return allOrders.value.filter(order => order.status === activeStatus.value);
	});

	const switchTab = (value) => {
		activeStatus.value = value;
	};

	const statusText = (status) => {
		const map = {
			0: '待付款',
			1: '已支付',
			2: '已取消',
			3: '已过期'
		};
		return map[status] || '未知';
	};

	const statusClass = (status) => {
		const map = {
			0: 'status-pending',
			1: 'status-paid',
			2: 'status-cancel',
			3: 'status-expired'
		};
		return map[status] || '';
	};
</script>

<style scoped lang="scss">
	.order-list-page {
		height: 100vh;
		width: 100%;
		box-sizing: border-box;
		background-color: #f7f7f7;
		display: flex;
		flex-direction: column;
		overflow-x: hidden; // 防止整个页面横向滚动

		.status-tabs {
			display: flex;
			background-color: #fff;
			padding: 0.5rem 0;
			border-bottom: 1px solid #eee;
			box-sizing: border-box;
			width: 100%;

			.tab-item {
				flex: 1;
				text-align: center;
				font-size: 0.85rem;
				color: #666;
				padding: 0.5rem 0;

				&.active {
					color: #1296db;
					font-weight: bold;
					position: relative;

					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						width: 2rem;
						height: 3px;
						background-color: #1296db;
						border-radius: 2px;
					}
				}
			}
		}

		.order-scroll {
			width: 100%;
			flex: 1;
			padding: 0.8rem;
			box-sizing: border-box; // 关键修复：确保 padding 不影响宽度
		}

		.order-list-container {
			width: 100%;
		}

		.order-card {
			width: 100%;
			background-color: #fff;
			border-radius: 0.5rem;
			padding: 0.8rem;
			margin-bottom: 0.8rem;
			box-sizing: border-box; // 确保 padding 不影响宽度

			.order-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 0.6rem;
				border-bottom: 1px solid #f0f0f0;

				.order-id {
					font-size: 0.75rem;
					color: #999;
				}

				.order-status {
					font-size: 0.8rem;
					font-weight: bold;

					&.status-pending {
						color: #ff6b35;
					}

					&.status-paid {
						color: #1296db;
					}

					&.status-cancel {
						color: #999;
					}

					&.status-expired {
						color: #999;
					}
				}
			}

			.order-body {
				display: flex;
				padding: 0.8rem 0;

				.goods-img {
					width: 5rem;
					height: 5rem;
					border-radius: 0.3rem;
					margin-right: 0.8rem;
					background-color: #f5f5f5;
					flex-shrink: 0; // 防止图片被压缩
				}

				.goods-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					min-width: 0; // 防止文字溢出

					.goods-name {
						font-size: 0.9rem;
						color: #333;
						font-weight: 500;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.goods-spec {
						font-size: 0.75rem;
						color: #999;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.goods-price-row {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.goods-price {
							font-size: 0.9rem;
							color: #e74c3c;
							font-weight: bold;
						}

						.goods-quantity {
							font-size: 0.8rem;
							color: #666;
						}
					}
				}
			}

			.order-footer {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding-top: 0.6rem;
				border-top: 1px solid #f0f0f0;

				.total-label {
					font-size: 0.8rem;
					color: #666;
				}

				.total-price {
					font-size: 1rem;
					color: #e74c3c;
					font-weight: bold;
				}
			}
		}

		.empty-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.empty-img {
				width: 8rem;
				height: 8rem;
				opacity: 0.5;
			}

			.empty-text {
				font-size: 0.9rem;
				color: #999;
				margin-top: 1rem;
			}
		}
	}
</style>