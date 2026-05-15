import { defineStore } from 'pinia';


export const useApiBaseUrlStore = defineStore('apibaseurl',{
	state:() =>({
		// baseurl:"http://localhost:16301"
		baseurl: "http://localhost:18080"
	}),
	// actions:{
	// 	setBaseUrl(baseurl){
	// 		this.baseurl = baseurl
	// 	}
	// }
})