<template>
	<view class="order-box">
		<view class="order-content">
			<view class="order-title">
				<text class="title">我的订单</text>
				<text class="show-all">查看全部订单 ></text>
			</view>
			<view class="order-section">
				<view class="order-card">
					<view class="pointer">1</view>
					<img src="@/static/logoimg/3.1待付款.png" alt="" />
					<text>待付款</text>
				</view>
				<view class="order-card">
					<img src="@/static/logoimg/3.1待发货.png" alt="" />
					<text>待发货</text>
				</view>
				<view class="order-card">
					<img src="@/static/logoimg/3.1待收货.png" alt="" />
					<text>待收货</text>
				</view>
				<view class="order-card">
					<img src="@/static/logoimg/3.1待评价.png" alt="" />
					<text>待评价</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
</script>

<style scoped lang="scss">
	.order-box{
		height: 7.5rem;
		padding: .5rem 1rem;
		box-sizing: border-box;
	}
	.order-content{
		height: 100%;
		width: 100%;
		background-color: #fff;
		border-radius: .3125rem;
		display: flex;
		flex-direction: column;
		.order-title{
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 2rem;
			padding: 0 1rem;
			box-sizing: border-box;
			display: flex;
			align-items: flex-end;
			.title{
				font-size: .875rem;
				color: #1e1e1e;
			}
			.show-all{
					font-size: .75rem;
					color: #939393;
			}
		}
		.order-section{
			display: flex;
			flex: 1;
			.order-card{
				height: 100%;
				flex: 1;
				padding: .45rem 1.3rem .25rem;
				box-sizing: border-box;
				font-size: .8rem;
				position: relative;
				img{
					width: 100%;
					padding: 0 .4rem;
					box-sizing: border-box;
				}
				.pointer{
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					position: absolute;
					height: 1rem;
					min-width: 1rem;
					border-radius: 1rem;
					z-index: 100;
					right: 1.4rem;
					top: .45rem;
					background-color: #fb3c31;
				}
				text{
					display: flex;
					width: 100%;
					justify-content: center;
				}
			}
		}
	}
</style>