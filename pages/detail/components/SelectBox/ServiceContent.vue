<template>
	<view class="service-content">
		<view class="title">服务说明</view>
		<view class="content-item">
			<view class="item-title">无忧退货</view>
			<view class="item-content">
				 自收到商品之日起30天内，可在线申请无忧退货服务（食品等特殊商品除外） 
			</view>
		</view>
		
		<view class="content-item">
			<view class="item-title">快速退款</view>
			<view class="item-content">
				收到退货包裹并确认无误后，将在48小时内办理退款， 退款将原路返回，不同银行处理时间不同，预计1-5个工作日到账
			</view>
		</view>
		
		<view class="content-item">
			<view class="item-title">满88元免邮费</view>
			<view class="item-content">
				单笔订单金额(不含运费)满88元可免邮费，不满88元， 单笔订单收取10元邮费
			</view>
		</view>
	</view>
</template>

<script setup>
	
</script>

<style lang="scss" scoped>
	.service-content{
		padding: 0 1rem;
		width: 100%;
		box-sizing: border-box;
		.title{
			line-height: 1;
			padding: 1.25rem 0;
			text-align: center;
			font-size: 1rem;
			font-weight: 400;
			border-bottom: .03125rem solid #ddd;
			color: #444;
			box-sizing: border-box;
		}
	}
	.content-item{
		 margin-top: .625rem;
		 .item-title{
			 margin-bottom: .3125rem;
			 font-size: .875rem;
			 color: #333;
			 font-weight: 500;
			 position: relative;
			 box-sizing: border-box;
		 }
		 .item-content{
			 line-height: 1.6;
			 font-size: .8125rem;
			 color: #999;
		 }
	}
	
</style>
