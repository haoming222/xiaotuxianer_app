import { defineStore } from 'pinia';


export const useHelperChat = defineStore('helperchat',{
	state:() =>({
		showHelperContentBox:false
	}),
	actions:{
		changeShowHelperContentBox(){
			this.showHelperContentBox = !this.showHelperContentBox
		}
	}
})