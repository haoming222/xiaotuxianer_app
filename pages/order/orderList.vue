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
					<!-- 待支付订单：剩余支付时间倒计时 -->
					<view class="order-countdown" v-if="order.status === 0 && getRemainingSeconds(order) > 0">
						<text class="countdown-icon">⏳</text>
						<text class="countdown-label">剩余支付时间：</text>
						<text class="countdown-time" :class="{ 'countdown-urgent': isTimeUrgent(order) }">
							{{ formatRemaining(order) }}
						</text>
					</view>
					<view class="order-countdown expired" v-else-if="order.status === 0 && getRemainingSeconds(order) <= 0">
						<text class="countdown-icon">⏰</text>
						<text class="countdown-label">订单已超时，即将自动取消</text>
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
		computed,
		onUnmounted
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
	const now = ref(Date.now()); // 当前时间戳，每秒更新
	const AUTO_CANCEL_MINUTES = 5; // 订单自动取消时间（分钟）
	let timer = null; // 倒计时定时器

	// 根据传入参数确定初始 tab
	onShow(() => {
		// 启动倒计时定时器
		startCountdown();
		// 从路由参数获取初始筛选状态
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const options = currentPage?.$page?.options || {};
		if (options.status !== undefined) {
			activeStatus.value = Number(options.status);
		}
		fetchOrders();
	});

		onUnmounted(() => {
			stopCountdown();
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

	const startCountdown = () => {
		stopCountdown(); // 防止重复启动
		now.value = Date.now();
		// 记录上一秒还有效但当前已过期的订单ID（避免重复刷新）
		let expiredChecked = new Set();
		timer = setInterval(() => {
			now.value = Date.now();
			// 检测是否有待支付订单刚好过期，自动刷新数据
			const pendingOrders = allOrders.value.filter(o => o.status === 0);
			for (const order of pendingOrders) {
				const remaining = getRemainingSeconds(order);
				if (remaining <= 0 && !expiredChecked.has(order.id)) {
					expiredChecked.add(order.id);
					// 延迟一小段时间让后端 Redis 过期回调先执行
					setTimeout(() => {
						fetchOrders();
					}, 1500);
				}
			}
		}, 1000);
	};

	const stopCountdown = () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	};

	// 计算订单剩余自动取消时间（秒），仅待支付订单有效
	const getRemainingSeconds = (order) => {
		if (order.status !== 0) return 0;
		if (!order.createTime) return 0;
		const createTimestamp = new Date(order.createTime).getTime();
		const expireTimestamp = createTimestamp + AUTO_CANCEL_MINUTES * 60 * 1000;
		const remaining = Math.floor((expireTimestamp - now.value) / 1000);
		return Math.max(0, remaining);
	};

	// 格式化剩余时间为 HH:MM:SS 或 MM:SS
	const formatRemaining = (order) => {
		const seconds = getRemainingSeconds(order);
		if (seconds <= 0) return '即将过期';
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		const pad = (n) => String(n).padStart(2, '0');
		if (h > 0) {
			return `${pad(h)}:${pad(m)}:${pad(s)}`;
		}
		return `${pad(m)}:${pad(s)}`;
	};

	// 剩余时间是否紧张（少于60秒）
	const isTimeUrgent = (order) => {
		return getRemainingSeconds(order) > 0 && getRemainingSeconds(order) <= 60;
	};

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

			.order-countdown {
				display: flex;
				align-items: center;
				padding: 0.5rem 0;
				margin: 0 -0.8rem;
				padding-left: 0.8rem;
				padding-right: 0.8rem;
				background-color: #fff7f0;
				border-top: 1px dashed #ffd9b3;

				&.expired {
					background-color: #fff0f0;
					border-top-color: #ffb3b3;
				}

				.countdown-icon {
					font-size: 0.9rem;
					margin-right: 0.3rem;
				}

				.countdown-label {
					font-size: 0.75rem;
					color: #666;
				}

				.countdown-time {
					font-size: 0.85rem;
					font-weight: bold;
					color: #ff6b35;
					font-variant-numeric: tabular-nums;
					letter-spacing: 0.05rem;

					&.countdown-urgent {
						color: #e74c3c;
						animation: countdown-pulse 1s infinite;
					}
				}

				&.expired .countdown-label {
					color: #e74c3c;
					font-weight: bold;
				}
			}

			@keyframes countdown-pulse {
				0%, 100% { opacity: 1; }
				50% { opacity: 0.5; }
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