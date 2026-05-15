<template>
	<view class="address-info-box">
		<view class="info-item">
			<view class="title">收货人</view>
			<input type="text" v-model="name" placeholder="请填写收货人姓名" />
		</view>
		<view class="info-item">
			<view class="title">手机号码</view>
			<input type="text" v-model="tele" placeholder="请填写收货人手机号码" />
		</view>
		<view class="info-item">
			<view class="title">所在地区</view>
			<picker mode="multiSelector" :range="selectorRegionData" @change="regionPickerChange" @columnchange="regionColumnChange">
				<text>当前选择</text>
				<text class="region-label">{{province}}</text>
				<text class="region-label">{{city}}</text>
				<text class="region-label">{{county}}</text>
			</picker>
		</view>
		<view class="info-item">
			<view class="title">详细地址</view>
			<input type="text" v-model="addressDetail" placeholder="街道、楼牌号等信息" />
		</view>
		<view class="defalut-switch-box">
			<view class="label">设为默认地址</view>
			<view>
				<switch checked @change="switchChange" style="transform:scale(0.7)" />
			</view>
		</view>
	</view>
	<view class="save-button" @click="saveButton">
		保存并使用
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import request from '@/utils/request.js';
	import { useApiBaseUrlStore } from '@/stores/ApiBaseUrl.js';
	import {onShow}	from "@dcloudio/uni-app"

	const pages = getCurrentPages();
	const id = ref(pages[pages.length-1].options.id)
	const name = ref("")
	const tele = ref("")
	const addressDetail = ref("")
	const isDefaultAddress = ref(true)
	const regionData = ref([])
	const countryList =ref([])
	const provinceList = ref([])
	const cityList = ref([])
	const countyList = ref([])
	const proviceIndex = ref(0)
	const cityIndex = ref(0)
	const countyIndex = ref(0)
	const province = ref("")
	const city = ref("")
	const county = ref("")
	const selectorRegionData = ref([provinceList.value,cityList.value,countryList.value])
	
	const regionPickerChange = (e)=>{
	};
	const regionColumnChange = (e)=>{
		if(e.detail.column == 0){
			proviceIndex.value = e.detail.value
			cityList.value = []
			countyList.value = []
			regionData.value.forEach((element)=>{
				if(element.city 
				&& cityList.value.indexOf(element.city) <= -1 
				&& element.province == provinceList.value[proviceIndex.value]){
					cityList.value.push(element.city)
				}
			})
			selectorRegionData.value[1] = cityList.value
			
			regionData.value.forEach((element)=>{
				if(element.county 
				&& countyList.value.indexOf(element.county) <= -1 
				&& element.province == provinceList.value[proviceIndex.value] 
				&& element.city == cityList.value[0]){
					countyList.value.push(element.county)
				}
			})
			selectorRegionData.value[2] = countyList.value
		}
		else if(e.detail.column == 1){
			cityIndex.value = e.detail.value
			countyList.value = []
			regionData.value.forEach((element)=>{
				if(element.county 
				&& countyList.value.indexOf(element.county) <= -1 
				&& element.province == provinceList.value[proviceIndex.value] 
				&& element.city == cityList.value[cityIndex.value]){
					countyList.value.push(element.county)
				}
			})
			selectorRegionData.value[2] = countyList.value
		}
		else{
			countyIndex.value = e.detail.value
		}
		province.value = provinceList.value[proviceIndex.value]
		city.value = cityList.value[cityIndex.value]
		county.value = countyList.value[countyIndex.value]
	}
	const fetchRegionData = async(id)=>{
		const data = await request({
			url:"/region/region_info"
		})
		regionData.value = data.data
		regionData.value.forEach((element)=>{
			if(provinceList.value.indexOf(element.province) <= -1){
				provinceList.value.push(element.province)
			}
		})
		selectorRegionData.value[0] = provinceList.value
		
		
		regionData.value.forEach((element)=>{
			if(element.city 
			&& cityList.value.indexOf(element.city) <= -1 
			&& element.province == provinceList.value[0]){
				cityList.value.push(element.city)
			}
		})
		selectorRegionData.value[1] = cityList.value
		
		regionData.value.forEach((element)=>{
			if(element.county 
			&& countyList.value.indexOf(element.county) <= -1 
			&& element.province == provinceList.value[0] 
			&& element.city == cityList.value[0]){
				countyList.value.push(element.county)
			}
		})
		selectorRegionData.value[2] = countyList.value
		if(!id){
			province.value = provinceList.value[proviceIndex.value]
			city.value = cityList.value[cityIndex.value]
			county.value = countyList.value[countyIndex.value]
		}
	}
	const switchChange = (e)=>{
		isDefaultAddress.value = e.detail.value
	}
	const addAddress = async()=>{
		const data = await request({
			url:"/member/address",
			method:"POST",
			data:{
				receiver:name.value,
				contact:tele.value,
				province:provinceList.value[proviceIndex.value],
				city:cityList.value[cityIndex.value],
				county:countyList.value[countyIndex.value],
				address:addressDetail.value,
				isDefault:isDefaultAddress.value == true ? 1 : 0,
				account:uni.getStorageSync("accountInfo").account
			}
		})
	}
	const modifyAddress = async(id)=>{
		try{
			const data = await request({
				url:"/member/address/"+id,
				method:"PUT",
				data:{
					receiver:name.value,
					contact:tele.value,
					province:province.value,
					city:city.value,
					county:county.value,
					address:addressDetail.value,
					isDefault:isDefaultAddress.value == true ? 1 : 0,
					account:uni.getStorageSync("accountInfo").account
				}
			})
		}catch(e){
			console.log("请求错误：",e);
		}
	}
	const saveButton = ()=>{
		if(!id.value){
			addAddress()
		}else{
			modifyAddress(id.value)
		}
		setTimeout(()=>{
			uni.navigateTo({
				url:"/pages/addressManagement/addressManagement"
			})
		},100)
	}
	const fetchAddressInfo = async(id)=>{
		try{
			const data = await request({
				url:"/member/address/"+id
			})
			name.value = data.data.receiver;
			tele.value = data.data.contact;
			addressDetail.value = data.data.address;
			province.value = data.data.province;
			city.value = data.data.city;
			county.value =data.data.county
		}catch(e){
			console.log("请求错误：",e);
		}
	}
	
	onShow(()=>{
		const pages = getCurrentPages();
		const id = pages[pages.length-1].options.id;
		fetchRegionData(id)
		if(id){
			fetchAddressInfo(id)
		}
	})
	
</script>

<style scoped lang="scss">
	.address-info-box{
		background-color: #fff;
		border-radius: .3rem;
		padding: .625rem;
		box-sizing: border-box;
		.info-item{
			border-bottom: .03125rem solid #ddd;
			margin-bottom: 1rem;
			font-size: .875rem;
			line-height: 1;
			picker{
				height: 2rem;
				display: flex;
				align-items: center;
				.region-label{
					font-size: 1rem;
					margin-left: 1.2rem;
				}
			}
		}
	}
	.defalut-switch-box{
		display: flex;
		justify-content: space-between;
		.region-label{
			font-size: .875rem;
		}
	}
	.save-button{
		margin-top: .825rem;
		background-color: #27ba9b;
		height: 2.2rem;
		border-radius: 2.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>