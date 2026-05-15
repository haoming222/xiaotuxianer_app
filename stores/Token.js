import { defineStore } from "pinia";

export const useTokenStore = defineStore('token',{
	state:()=>({
		token:""
	}),
	actions:{
		setToken(token){
			this.token = token;
		}
	}
})