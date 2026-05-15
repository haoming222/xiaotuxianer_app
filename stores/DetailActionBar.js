import {
	defineStore
} from "pinia";

export const useDetailActionBarStore = defineStore('detailActionBar', {
	state: () => ({
		isShow: true
	}),
	actions: {
		setIsShow(isShowValue) {
			this.isShow = isShowValue
		},
		changeIsShow() {
			this.isShow = !this.isShow
		}
	},
	persist: true
})