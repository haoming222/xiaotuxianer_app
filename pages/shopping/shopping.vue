<template>
	<view class="cart-page">
		<scroll-view scroll-y class="cart-scroll" :show-scrollbar="false">
			<view v-for="item in displayItems" :key="item.cartItemId" class="cart-item">
				<view class="cart-item__thumb-wrap">
					<image v-if="fullImageUrl(item.picture)" class="cart-item__thumb" :src="fullImageUrl(item.picture)"
						mode="aspectFill" />
				</view>
				<view class="cart-item__body">
					<view class="item_info_bbox">
						<text class="cart-item__name">{{ item.name }}</text>
						<text class="cart-item__spec">{{ item.specSummary }}</text>
						<view class="cart-item__row">
							<view class="cart-item__price">
								<text class="cart-item__yen">￥</text>
								<text class="cart-item__price-num">{{ item.price }}</text>
							</view>
							<text class="cart-item__qty">x{{ item.quantity }}</text>
						</view>
					</view>
					<view class="item_options_bbox">
						<img class="delete_options_image" @click="deleteCartItem(item)" src="../../static/logoimg/删除.png" alt="" />
						<view class="submit_options_button" @click="submitCartItem(item)">
							提交订单
						</view>
						<!-- <button class="submit_options_button">提交订单</button> -->
					</view>
				</view>
			</view>
			<view v-if="!displayItems.length" class="cart-empty">购物车是空的</view>
			<view class="cart-scroll__pad" />
		</scroll-view>
	</view>

	<uni-popup ref="deleteCartItemPopup">
		<view class="delete_popup_box">
			<view class="delete_item_info">
				<p>{{deleteItemInfo.name}}</p>
				<image v-if="fullImageUrl(deleteItemInfo.picture)" class="delete_item_image"
					:src="fullImageUrl(deleteItemInfo.picture)" mode="aspectFill" />
			</view>
			<view class="delele_button" @click="confirmDeleteItem">
				确认从购物车中删除
			</view>
		</view>
	</uni-popup>
	
	<uni-popup ref="submitCartItemPopup">
		<view class="submit_popup_box">
			<view class="submit_item_info">
				<p>{{submitItemInfo.name}}</p>
				<image v-if="fullImageUrl(submitItemInfo.picture)" class="submit_item_image"
					:src="fullImageUrl(submitItemInfo.picture)" mode="aspectFill" />
			</view>
			<view class="submit_button" @click="confirmSubmitItem">
				确认提交该订单
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		getCartList
	} from '../../utils/cartApi'
	import {
		useApiBaseUrlStore
	} from '../../stores/ApiBaseUrl'
	import request from '@/utils/request.js';

	const apiStore = useApiBaseUrlStore()
	const baseurl = apiStore.baseurl

	const cartItems = ref([])
	const deleteCartItemPopup = ref(null)
	const deleteItemInfo = ref(null)
	const submitCartItemPopup = ref(null)
	const submitItemInfo = ref(null)

	/** 与 goods/detail 一致：request resolve 的是响应体 JSON，列表一般在 body.data 或 body.data.items */
	function normalizeCartItems(body) {
		if (!body) return []
		const d = body.data
		if (d === undefined || d === null) return []
		if (Array.isArray(d)) return d
		if (Array.isArray(d.items)) return d.items
		if (Array.isArray(d.list)) return d.list
		if (Array.isArray(d.records)) return d.records
		return []
	}

	const displayItems = computed(() => cartItems.value)

	function fullImageUrl(picture) {
		if (!picture || typeof picture !== 'string') return ''
		if (/^https?:\/\//i.test(picture)) return picture
		return baseurl + picture
	}

	async function loadCart() {
		try {
			const res = await getCartList()
			const list = normalizeCartItems(res)
			if (list.length >= 0) {
				cartItems.value = list
				return
			}
			cartItems.value = [...FAKE_CART_ITEMS]
		} catch (e) {
			cartItems.value = [...FAKE_CART_ITEMS]
		}
	}
	const deleteCartItemRequest = async (cartItemId) => {
		try {
			const result = await request({
				url: "/cart/delete?cartItemId=" + cartItemId,
				method: "DELETE"
			})
			if (result.code === 200) { // 根据你的接口返回格式调整
				uni.showToast({
					title: "删除成功",
					icon: "success"
				});
				deleteCartItemPopup.value.close()
				loadCart()
			}
		} catch (e) {
			uni.showToast({
				title: "网络错误：" + e
			})
		}
	}
	const deleteCartItem = (item) => {
		deleteCartItemPopup.value.open()
		deleteItemInfo.value = item
	}
	
	const submitCartItem = (item) => {
		submitCartItemPopup.value.open()
		submitItemInfo.value = item
	}
	const confirmDeleteItem = () => {
		deleteCartItemRequest(deleteItemInfo.value.cartItemId)
	}
	
	const confirmSubmitItem = async () => {
		const item = submitItemInfo.value
		if (!item) return
		try {
			const result = await request({
				url: "/order/create",
				method: "POST",
				data: {
					goodsId: item.goodsId,
					skuId: item.skuId,
					quantity: item.quantity,
					specSummary: item.specSummary
				}
			})
			if (result.code === 200) {
				uni.showToast({
					title: "下单成功，请在30分钟内支付",
					icon: "success",
					duration: 2500
				})
				submitCartItemPopup.value.close()
				loadCart()
			} else {
				uni.showToast({
					title: result.msg || "下单失败",
					icon: "none"
				})
			}
		} catch (e) {
			uni.showToast({
				title: "网络错误",
				icon: "none"
			})
		}
	}
	onShow(() => {
		loadCart()
	})
</script>

<style lang="scss" scoped>
	.cart-page {
		min-height: 100vh;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: rgb(244 244 244);
		box-sizing: border-box;
	}


	.cart-scroll {
		flex: 1;
		height: 0;
		box-sizing: border-box;
	}

	.cart-scroll__pad {
		height: 1rem;
	}

	.cart-item {
		display: flex;
		flex-direction: row;
		margin: 0.5rem 0.5rem 0;
		padding: 0.75rem;
		background-color: #fff;
		border-radius: 0.3125rem;
		box-sizing: border-box;
	}

	.cart-item__thumb-wrap {
		flex-shrink: 0;
		width: 5rem;
		height: 5rem;
		margin-right: 0.625rem;
		border-radius: 0.25rem;
		overflow: hidden;
		background-color: #f5f5f5;
	}

	.cart-item__thumb {
		width: 100%;
		height: 100%;
		display: block;
	}

	.cart-item__thumb--placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
		color: #bbb;
		background-color: #eaeaea;
	}

	.cart-item__body {
		flex: 1;
		display: flex;
		flex-direction: row;
		min-width: 0;
		// height: 100%;

		.item_info_bbox {
			width: 90%;
			height: 1;
		}

		.item_options_bbox {
			width: 10%;
			display: flex;
			flex-direction: column;

			.delete_options_image {
				width: 100%;
				height: auto;
			}

			.submit_options_button {
			    width: 100%;
			    font-size: .725rem;
			    text-align: center;     
			    border-radius: .3rem;
			    background-color: #03aaa0;
			    padding: 0.8rem 0;
					margin-top: .8rem;
			}
			.submit_options_button:hover {
			    background-color: #34c4bc;
			}
		}
	}

	.cart-item__name {
		font-size: 0.875rem;
		color: #333;
		line-height: 1.35;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.cart-item__spec {
		margin-top: 0.25rem;
		font-size: 0.75rem;
		color: #999;
	}

	.cart-item__row {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
		margin-top: auto;
		padding-top: 0.5rem;
	}

	.cart-item__price {
		color: #cf4444;
	}

	.cart-item__yen {
		font-size: 0.75rem;
	}

	.cart-item__price-num {
		font-size: 1rem;
		font-weight: 600;
	}

	.cart-item__qty {
		font-size: 0.8125rem;
		color: #666;
	}

	.cart-empty {
		padding: 3rem 1rem;
		text-align: center;
		font-size: 0.875rem;
		color: #999;
	}

	.delete_popup_box {
		height: 15rem;
		width: 15rem;
		background-color: #ffffff;
		display: flex;
		flex-direction: column;

		.delete_item_info {
			flex: 5;
			width: 15rem;
			box-sizing: border-box;
			font-size: .875rem;
			padding: 1rem;
			display: flex;
			flex-direction: column;
			align-items: center;

			.delete_item_image {
				height: 70%;
				width: 70%;
			}
		}


		.delele_button {
			display: flex;
			flex: 1;
			align-items: center;
			justify-content: center;
			color: red;
			border-top: 0.01px #bbb solid;
			width: 15rem;
			box-sizing: border-box;
		}
	}
	
	.submit_popup_box {
		height: 15rem;
		width: 15rem;
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
	
		.submit_item_info {
			flex: 5;
			width: 15rem;
			box-sizing: border-box;
			font-size: .875rem;
			padding: 1rem;
			display: flex;
			flex-direction: column;
			align-items: center;
	
			.submit_item_image {
				height: 70%;
				width: 70%;
			}
		}
	
	
		.submit_button {
			display: flex;
			flex: 1;
			align-items: center;
			justify-content: center;
			color: #03aaa0;
			border-top: 0.01px #bbb solid;
			width: 15rem;
			box-sizing: border-box;
		}
	}
</style>