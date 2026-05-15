
import { useTokenStore } from "../stores/Token";

// const BASE_URL = 'http://localhost:8080';
// const BASE_URL = 'http://localhost:16301';
const BASE_URL = 'http://localhost:18080'
const HELPER_CHAT_BASE_URL = 'http://localhost:18013';

export default function request(options) {
    return new Promise((resolve, reject) => {
			// console.log(useTokenStore().token);
			uni.request({
					url: BASE_URL + options.url, // 拼接完整URL
					method: options.method || 'GET', // 默认GET请求
					data: options.data || {}, // 请求数据
					header: {
						...options.header, // 合并用户自定义header
						Authorization:uni.getStorageSync('token') || '',
						// Authorization: useTokenStore().token || "",
					},
					success: (res) => {
							// console.log(res)
							if (res.statusCode === 200) {
									resolve(res.data); // 请求成功返回数据
							} else if(res.statusCode === 444 || res.statusCode === 445){
								console.log(res.data);
								uni.showToast({
									icon:"error",
									title:res.data.error,
									duration:2000
								})
								resolve(res.data)
								uni.reLaunch({
									url:"/pages/login/login"
								})
							}else {
									uni.showToast({ title: res.data.message || '请求失败', icon: 'none' });
									reject(res.data); 
							}
					},
					fail: (err) => {
						console.log(err.statusCode);
						uni.showToast({ title: '网络错误', icon: 'none' });
						reject(err); // 网络错误
					},
			});
	});
}

// 助手相关请求
export function helper_chat_request(options) {
    return new Promise((resolve, reject) => {
			// console.log(HELPER_CHAT_BASE_URL)
			// console.log(useTokenStore().token);
			uni.request({
					url: HELPER_CHAT_BASE_URL + options.url, // 拼接完整URL
					method: options.method || 'GET', // 默认GET请求
					data: options.data || {}, // 请求数据
					header: {
						...options.header, // 合并用户自定义header
						Authorization:uni.getStorageSync('token') || '',
						// Authorization: useTokenStore().token || "",
					},
					success: (res) => {
							// console.log(res)
							if (res.statusCode === 200) {
									resolve(res.data); // 请求成功返回数据
							} else if(res.statusCode === 444 || res.statusCode === 445){
								console.log(res.data);
								uni.showToast({
									icon:"error",
									title:res.data.error,
									duration:2000
								})
								resolve(res.data)
								uni.reLaunch({
									url:"/pages/login/login"
								})
							}else {
									uni.showToast({ title: res.data.message || '请求失败', icon: 'none' });
									reject(res.data); 
							}
					},
					fail: (err) => {
						console.log(err.statusCode);
						uni.showToast({ title: '网络错误', icon: 'none' });
						reject(err); // 网络错误
					},
			});
	});
}