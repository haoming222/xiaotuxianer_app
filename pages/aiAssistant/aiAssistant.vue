<template>
	<view class="ai-assistant">
		<view class="top-bar">
			<view class="title">AI 购物助手</view>
			<view class="new-chat-btn" @click="newChat">新对话</view>
		</view>
		<scroll-view class="msg-list" scroll-y="true" :scroll-top="scrollTop" scroll-with-animation>
			<view v-if="messages.length === 0" class="welcome">
				<view class="welcome-icon">🛍️</view>
				<view class="welcome-text">你好！我是 AI 购物助手</view>
				<view class="welcome-hint">可以帮你搜索商品、下单、支付</view>
				<view class="quick-actions">
					<view class="quick-btn" @click="sendQuick('帮我推荐热门商品')">🔥 热门推荐</view>
					<view class="quick-btn" @click="sendQuick('搜索羽绒服')">🔍 搜索羽绒服</view>
					<view class="quick-btn" @click="sendQuick('帮我推荐新品')">✨ 新鲜好物</view>
				</view>
			</view>
			<view v-for="(msg, idx) in messages" :key="idx" :class="['msg-item', msg.role]">
				<view class="msg-avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</view>
				<view class="msg-content">
					<view v-if="msg.role === 'assistant' && !msg.content && loading && idx === messages.length - 1"
						class="typing-dots">
						<view class="dot"></view>
						<view class="dot"></view>
						<view class="dot"></view>
					</view>
					<view v-else-if="msg.role === 'assistant'" class="msg-text" v-html="renderMarkdown(msg.content)"></view>
					<view v-else class="msg-text">{{ msg.content }}</view>
				</view>
			</view>
			<view style="height: 60px;"></view>
		</scroll-view>
		<view class="input-bar">
			<input class="msg-input" v-model="inputText" placeholder="输入你想买的商品..." @confirm="sendMessage" />
			<view class="send-btn" @click="sendMessage">发送</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		nextTick
	} from 'vue'
	import {
		difyChat
	} from '../../utils/difyApi'

	const messages = ref([])
	const inputText = ref('')
	const loading = ref(false)
	const scrollTop = ref(0)
	let conversationId = ''

	function cleanText(text) {
		if (!text) return ''
		const paragraphs = text.split(/\n\n+/)
		const keep = paragraphs.filter(p => {
			const t = p.trim()
			if (!t) return false
			if (/^(思考|步骤\s*\d|我需要|用户想要|首先|然后|接下来|最后|根据|为了|现在|让我|我来|这个|这里)/.test(t)) return false
			if (/\{[\s\S]*\}/.test(t) || /\b(from|to|params)\s*[:：]/.test(t)) return false
			return true
		})
		if (keep.length === 0) keep.push(...paragraphs.slice(-3))
		return keep.join('\n\n').trim()
	}

	function renderMarkdown(text) {
		if (!text) return ''
		let html = text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
		html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
		html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>')
		html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>')
		html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>')
		html = html.replace(/\n\n/g, '</p><p>')
		html = html.replace(/\n/g, '<br>')
		html = '<p>' + html + '</p>'
		html = html.replace(/<p><\/p>/g, '')
		html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
		html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
		return html
	}

	function scrollToBottom() {
		nextTick(() => {
			scrollTop.value = 99999999 // 设为超大值自动滚到底部
		})
	}

	function sendMessage() {
		const text = inputText.value.trim()
		if (!text || loading.value) return
		inputText.value = ''
		messages.value.push({
			role: 'user',
			content: text
		})
		scrollToBottom()
		const aiIdx = messages.value.length
		messages.value.push({
			role: 'assistant',
			content: ''
		})
		loading.value = true
		difyChat(text, conversationId,
			(answer, newConvId) => {
				messages.value[aiIdx].content = cleanText(answer)
				conversationId = newConvId
				loading.value = false
				scrollToBottom()
			},
			(errMsg) => {
				messages.value[aiIdx].content = '抱歉，出了点问题：' + errMsg
				loading.value = false
				scrollToBottom()
			}
		)
	}

	function sendQuick(text) {
		inputText.value = text;
		sendMessage()
	}

	function newChat() {
		messages.value = [];
		conversationId = ''
	}
</script>

<style scoped>
	.ai-assistant {
		height: calc(100vh - 44px);
		width: 100%;
		display: flex;
		flex-direction: column;
		background: #f5f5f5;
		padding-bottom: 52px;
		box-sizing: border-box;
	}

	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		height: 44px;
		border-bottom: 1px solid #eee;
	}

	.title {
		font-size: 17px;
		font-weight: bold;
	}

	.new-chat-btn {
		font-size: 14px;
		color: #1296db;
		padding: 4px 12px;
		border: 1px solid #1296db;
		border-radius: 4px;
	}

	.msg-list {
		box-sizing: border-box;
		width: 100%;
		flex: 1;
		padding: 12px;;
		background: #f5f5f5;
	}

	.welcome {
		text-align: center;
		padding-top: 60px;
	}

	.welcome-icon {
		font-size: 48px;
		margin-bottom: 16px;
	}

	.welcome-text {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 8px;
	}

	.welcome-hint {
		font-size: 13px;
		color: #999;
		margin-bottom: 24px;
	}

	.quick-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}

	.quick-btn {
		padding: 8px 16px;
		background: #fff;
		border: 1px solid #e0e0e0;
		border-radius: 20px;
		font-size: 13px;
		color: #333;
	}

	.msg-item {
		display: flex;
		margin-bottom: 16px;
	}

	.msg-item.user {
		flex-direction: row-reverse;
	}

	.msg-avatar {
		width: 32px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		font-size: 18px;
		flex-shrink: 0;
	}

	.msg-content {
		display: flex;
		flex-direction: column;
		max-width: 80%;
		padding: 0 8px;
	}

	.msg-text {
		padding: 10px 14px;
		border-radius: 12px;
		font-size: 14px;
		line-height: 1.6;
		word-break: break-word;
	}

	.msg-item.user .msg-text {
		background: #1296db;
		color: #fff;
	}

	.msg-item.assistant .msg-text {
		background: #fff;
		color: #333;
	}

	.msg-text :deep(h2) {
		font-size: 16px;
		font-weight: bold;
		margin: 8px 0 4px;
	}

	.msg-text :deep(h3) {
		font-size: 15px;
		font-weight: bold;
		margin: 6px 0 3px;
	}

	.msg-text :deep(h4) {
		font-size: 14px;
		font-weight: bold;
		margin: 4px 0 2px;
	}

	.msg-text :deep(p) {
		margin: 0 0 6px;
	}

	.msg-text :deep(strong) {
		font-weight: bold;
	}

	.msg-text :deep(code) {
		background: #f0f0f0;
		padding: 1px 4px;
		border-radius: 3px;
		font-size: 12px;
	}

	.msg-text :deep(li) {
		margin-left: 16px;
		list-style-type: disc;
	}

	.typing-dots {
		display: flex;
		gap: 4px;
		padding: 10px 14px;
		background: #fff;
		border-radius: 12px;
	}

	.dot {
		width: 6px;
		height: 6px;
		background: #ccc;
		border-radius: 50%;
		animation: blink 1.4s infinite;
	}

	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes blink {

		0%,
		60%,
		100% {
			opacity: 0.2
		}

		30% {
			opacity: 1
		}
	}

	.input-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		display: flex;
		width: 100vw;
		box-sizing: border-box;
		align-items: center;
		padding: 8px 12px;
		padding-right: 23px;
		background: #fff;
		border-top: 1px solid #eee;
		gap: 8px;
	}

	.msg-input {
		flex: 1;
		height: 36px;
		padding: 0 12px;
		background: #f5f5f5;
		border-radius: 18px;
		font-size: 14px;
	}

	.send-btn {
		padding: 8px 16px;
		background: #1296db;
		color: #fff;
		border-radius: 18px;
		font-size: 14px;
	}
</style>