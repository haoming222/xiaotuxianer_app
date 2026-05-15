import { defineStore } from 'pinia';


export const useHotTypeStore = defineStore('hottype',{
	state:() =>({
		hottype:""
	}),
	actions:{
		sethottype(hottype){
			this.hottype = hottype
		}
	}
})