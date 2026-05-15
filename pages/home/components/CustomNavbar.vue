<script>
	const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<template>
	<view class="navbar" :style="{paddingTop: safeAreaInsets?.top+'px' }">
		<view class="logo">
			<view class="title">
				小兔鲜儿
			</view>
			<view class="logo-text">
				新鲜・亲民・快捷
			</view>
		</view>
		<view class="search">
			<view class="search-box">
				<img class="icon" src="@/static/logoimg/搜索灰色.png" alt="" />
				<input class="input-box" placeholder="搜索商品">
					</input>
				<img class="icon" src="@/static/logoimg/扫一扫.png" alt="" />
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.navbar{
		position: fixed;
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 70px;
		background-color: #03aaa0;
		box-sizing: border-box;
		padding:0 5px 0 5px;
		z-index: 100;
	}
	.logo{
		flex:0.8;
		box-sizing: border-box;
		.title{
			position: relative;
			font-size: 17px;
			height: 100%;
			width: 90px;
			color: #eeeeee;
			font-weight: bold;
			float: left;
			box-sizing: border-box;
			line-height: 35px;
			text-align: center;
			font-family: Georgia, serif;
		}
		.logo-text{
			font-size: 12px;
			height: 100%;
			width: 130px;
			color: #eeeeee;
			font-weight: bold;
			float: left;
			box-sizing: border-box;
			line-height: 35px;
			text-align: center;
			font-family: Georgia, serif;
			white-space: nowrap;
			overflow: hidden;
		}
	}
	.title::after{
		content: '';
		position: absolute;
		top: 5px; /* 距离顶部的距离 */
		right: 0;
		height: 60%; /* 边框的高度 */ 
		width: 1px;
		background-color: #d5d5d6;
	}
	
	.search{
		flex:1;
		position: relative;
		box-sizing: border-box;
		.search-box{
			display: flex;
			height: 80%;
			background-color: #77d7d1;
			width: 100%;
			border-radius: 28px;
			.input-box{
				flex: 1;
				margin-top: 3px;
			}
			.icon{
				padding: 6px;
				height: 18px;
				width: 18px;
			}
		}
	}
</style>