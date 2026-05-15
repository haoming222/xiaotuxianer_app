<template>
	<view class="nav-bar-box">
		<view class="nav-bar-left">
			<img class="nav-img" :src="left_icon_path" alt="" />
		</view>
		<view class="nav-bar-title">
			{{title}}
		</view>
		<view class="nav-bar-right">
			<img class="nav-img" :src="right_icon_path" alt="" />
			<span class="message-badge" v-if="messageCount > 0">{{ messageCount }}</span>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const title = ref("首页")
const left_icon_path = ref("../../static/logoimg/搜索.png")
const right_icon_path = ref("../../static/logoimg/消息.png")
const messageCount = ref(2);
</script>

<style>
.nav-bar-box{
	position: fixed;
	height: 44px;
	width: 100%;
	background-color: #f8f8f8;
	/* background-color: #edf2fa; */
	/* box-shadow: #f8f8f8 0px 4px 5px; */
	box-sizing: border-box;
	display: flex;
	font-size: 16px;
	z-index: 100;
	overflow: hidden;
}
.nav-bar-left{
	height: 44px;
	width: 44px;
	box-sizing: border-box;
	padding: 7px;
}
.nav-bar-title{
	flex: 1;
	text-align: center;
	line-height: 44px;
	font-size: 16px;
	font-weight: bold;
}
.nav-bar-right{
	height: 44px;
	width: 44px;
	box-sizing: border-box;
	padding: 7px;
	position: relative; 
}
.nav-img{
	height: 30px;
	width: 30px;
}

.message-badge {
  position: absolute; /* 绝对定位 */
  top: 4px; /* 距离顶部 */
  right: 4px; /* 距离右侧 */
  background-color: red; /* 红色背景 */
  color: white; /* 白色文字 */
  font-size: 12px; /* 字体大小 */
  width: 16px; /* 宽度 */
  height: 16px; /* 高度 */
  border-radius: 50%; /* 圆形 */
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1; /* 文字居中 */
}
</style>