<template>
	<view class="helper-chat-box">
		<view class="helper-chat-content">
			<view class="top-bar">
				<view class="add-chat-bbox" @click="clickAddChatButton">
					<img class="add-chat-button" :src="addChatAvatar" alt="" />
				</view>
				<view class="close-button-box" @click="clickCloseButton">
					<img class="close-button" :src="closeAvatar" alt="">
				</view>
			</view>
			<view class="bottom-content">
				<view class="content-left-bbox">
					<view class="chat-item-bbox" v-for="n in ChatList" :key="n">
						<!-- <img class="chat-item" :src="chatAvatar" alt="" /> -->
						<p>{{n.createTime}}{{n.content}}</p>
					</view>
				</view>
				<view class="content-right-bbox">
					<scroll-view scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true" class="chat-container">
						<view v-for="(msg, index) in messages" :key="index"
							:class="['message', msg.sender === 'USER' ? 'right' : 'left']">
							<view class="bubble" v-if="msg.content != null && msg.content != ''">
								{{ msg.content }}
							</view>
						</view>
					</scroll-view >
					<view class="user-input-bbox">
						<view class="input-bbox">
							<input type="text" v-model="inputBoxContent" />
						</view>
						<view class="send-button-bbox" @click="clickSendButton">
							<img class="send-button" :src="sendAvatar" alt="">
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		useHelperChat
	} from '../../../stores/HelperChat';
	import {
		useAccountInfo
	} from "../../../stores/AccounterInfo";
	import {
		helper_chat_request
	} from '../../../utils/request';

	const closeAvatar = ref("static/logoimg/关闭.png")
	const chatAvatar = ref("static/logoimg/对话.png")
	const addChatAvatar = ref("static/logoimg/加_聊天.png")
	const sendAvatar = ref("static/logoimg/315指向上.png")
	const scrollTop = ref(0.001)
	const messages = ref([])
	const accountInfo = uni.getStorageSync("accountInfo");
	const ChatList = ref([])
	const defaultChatId = ref(null)
	const inputBoxContent = ref("")

	const helperChatStore = useHelperChat()
	const clickCloseButton = () => {
		helperChatStore.changeShowHelperContentBox()
	}

	const getChatList = async () => {
		try {
			const data = await helper_chat_request({
				url: '/ai/get_chats_id_by_user_id',
				method: 'get',
				data: {
					"userId": accountInfo.id
				}
			})
			ChatList.value = data.data.map(item => ({
				...item,
				createTime: item.createTime.split('T')[0]
			}));
			defaultChatId.value = data.data[0].chatId
			// console.log(ChatList.value[0].chatId)
		} catch (e) {
			console.log("请求失败：", e);
		}
	}
	const getChatMessage = async () => {
		try {
			const data = await helper_chat_request({
				url: '/ai/get_history_messages',
				method: 'get',
				data: {
					"chatId": ChatList.value[0].chatId,
					"userId": accountInfo.id
				}
			})
			data.data.forEach(msg => {
				// 去除思考部分
				msg.content = msg.content.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
			});
			messages.value = data.data
			// console.log(messages.value)
		} catch (e) {
			console.log("请求失败：", e);
		}
	}

	const clickAddChatButton = () => {
		// 生成uuid 即chat_id
		const chatId = crypto.randomUUID()
		// 进行对话

	}

	const askChat = async (question) => {
		try {
			if (inputBoxContent.value != "" && inputBoxContent.value != null) {
				const data = await helper_chat_request({
					url: '/ai/ask',
					method: 'get',
					data: {
						"userId": accountInfo.id,
						"question": question,
					}
				})
			}
			else{
				uni.showToast({ title: '输入框内容为空', icon: 'none' })
			}
			
		} catch (e) {
			console.log("请求失败：", e);
		}
	}
	
	const clickSendButton = async () => {
		await messages.value.push({
			"sender": "USER",
			"content": inputBoxContent.value
		})
		await messages.value.push({
			"sender": "ASSISTANT",
			"content": "....."
		})
		scrollTop.value = scrollTop.value + 999999
		// console.log(messages.value)
		await askChat(inputBoxContent.value)
		inputBoxContent.value = null
		await getChatList()
		if (ChatList.value.length > 0) {
			await getChatMessage()
			scrollTop.value = scrollTop.value + 999999
		}
	}

	onShow(async () => {
		await getChatList()
		if (ChatList.value.length > 0) {
			await getChatMessage()
			scrollTop.value = scrollTop.value + 999999
		}
	})
</script>

<style lang="scss" scoped>
	.helper-chat-box {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 10px;

		.helper-chat-content {
			height: 100%;
			width: 100%;
			display: flex;
			flex-direction: column;
		}

		.top-bar {
			height: 30px;
			width: 100%;
			position: relative;

			.add-chat-bbox {
				display: flex;
				flex-direction: row-reverse;
				height: 100%;
				position: absolute;
				left: 20px;
				top: 0px;

				.add-chat-button {
					height: 100%;
					width: auto;
				}
			}

			.close-button-box {
				display: flex;
				flex-direction: row-reverse;
				height: 100%;
				position: absolute;
				right: 0px;
				top: 0px;

				.close-button {
					height: 100%;
					width: auto;
				}
			}
		}

		.bottom-content {
			flex: 1;
			border: #03aaa0 solid 2px;
			border-radius: 10px;
			display: flex;
			flex-direction: row;
			overflow: hidden;

			.content-left-bbox {
				width: 70px;
				height: 100%;
				border-right: #03aaa0 solid;
				display: flex;
				flex-direction: column;
				padding: 2px;
				box-sizing: border-box;

				.chat-item-bbox {
					width: 100%;
					height: auto;
					overflow: hidden;

					p {
						display: -webkit-box;
						-webkit-line-clamp: 3;
						/* 控制显示行数 */
						-webkit-box-orient: vertical;
						overflow: hidden;
						text-overflow: ellipsis;
						font-size: 12px;
					}

					.chat-item {
						width: 100%;
						height: auto;
					}
				}
			}

			.content-right-bbox {
				flex: 1;
				height: 100%;
				display: flex;
				flex-direction: column;

				.chat-container {
					height: 90%;
					padding: 20px;
					// overflow-y: auto;
					box-sizing: border-box;

					.message {
						display: flex;
						margin-bottom: 14px;

						&.left {
							justify-content: flex-start;

							.bubble {
								background: #03aaa0;
								color: #333;
								white-space: pre-wrap;
								/* 保留换行符 */
								word-break: break-all;
								/* 可选：长单词换行 */
							}
						}

						&.right {
							justify-content: flex-end;

							.bubble {
								background: #4e9af1;
								color: #fff;
							}
						}

						.bubble {
							max-width: 65%;
							padding: 10px 16px;
							border-radius: 18px;
							box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
							word-break: break-word;
							line-height: 1.4;
							transition: all 0.2s ease;
						}
					}
				}

				.user-input-bbox {
					height: 10%;
					// background-color: #aaaaaa;
					padding: .2rem;
					box-sizing: border-box;
					display: flex;

					.input-bbox {
						height: 100%;
						width: 80%;
						border: #4e9af1 2px solid;
						padding: 0 .3rem;
						box-sizing: border-box;
						border-radius: .3rem;

						input {
							height: 100%;
						}
					}

					.send-button-bbox {
						margin-left: .5rem;
						height: 100%;

						.send-button {
							box-sizing: border-box;
							border: #4e9af1 .1rem solid;
							border-radius: 100%;
							height: 100%;
							width: auto;
						}
					}
				}
			}
		}
	}
</style>