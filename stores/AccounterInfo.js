import {
	defineStore
} from "pinia";

export const useAccountInfo = defineStore('accountInfo', {
	state: () => ({
		accountInfo: null
	}),
	actions: {
		setAccountInfo(accountInfo) {
			this.accountInfo = accountInfo
		}
	},
	persist: true
})