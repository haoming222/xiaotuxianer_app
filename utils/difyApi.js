/**
 * Dify Chat API 封装
 * 调用 Dify Agent（已连接 MCP Server），流式返回 AI 回复
 *
 * Dify Agent Chat App 只支持 streaming 模式
 * uni.request 等待完整响应后，手动解析 SSE 文本流
 */

const DIFY_BASE = 'http://localhost/v1'
const DIFY_API_KEY = 'app-yw8qnFsvqYA0LiMYofCkza45'

/**
 * 发送消息到 Dify Agent（streaming 模式，等待完整回复）
 * @param {string} query - 用户输入
 * @param {string} conversationId - 会话 ID
 * @param {function} onDone - 完成时回调 (answer, conversationId)
 * @param {function} onError - 出错时回调 (errorMsg)
 */
export function difyChat(query, conversationId, onDone, onError) {
	uni.showLoading({ title: 'AI 思考中...' })

	uni.request({
		url: `${DIFY_BASE}/chat-messages`,
		method: 'POST',
		timeout: 120000,
		responseType: 'text',  // 以文本形式接收 SSE 流
		header: {
			'Authorization': `Bearer ${DIFY_API_KEY}`,
			'Content-Type': 'application/json',
		},
		data: {
			query: query,
			user: 'zhm',
			conversation_id: conversationId || '',
			response_mode: 'streaming',  // Agent Chat 只支持流式
			inputs: {},
		},
		success: (res) => {
			uni.hideLoading()
			try {
				// 解析 SSE 文本流：每行格式 "data: {...}\n\n"
				const rawText = typeof res.data === 'string' ? res.data : ''
				const lines = rawText.split('\n')

				let answer = ''
				let newConvId = conversationId || ''

				for (const line of lines) {
					const trimmed = line.trim()
					if (!trimmed.startsWith('data: ')) continue
					const jsonStr = trimmed.slice(6).trim()
					if (!jsonStr) continue
					try {
						const eventData = JSON.parse(jsonStr)
						// 收集所有事件的 answer（后续在前端清洗）
						if (eventData.event === 'message' || eventData.event === 'agent_message') {
							if (eventData.answer) {
								answer += eventData.answer
							}
						} else if (eventData.event === 'message_end') {
							newConvId = eventData.conversation_id || newConvId
						} else if (eventData.event === 'error') {
							onError(eventData.message || 'AI 返回错误')
							return
						}
					} catch (e) { /* 跳过解析失败的行 */ }
				}

				if (answer) {
					onDone(answer, newConvId)
				} else {
					onError('AI 未返回有效回复')
				}
			} catch (e) {
				onError('解析响应失败: ' + e.message)
			}
		},
		fail: (err) => {
			uni.hideLoading()
			onError(err.errMsg || '网络错误')
		},
	})
}

/**
 * 获取会话历史消息
 */
export function difyGetMessages(conversationId) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${DIFY_BASE}/messages`,
			method: 'GET',
			header: { 'Authorization': `Bearer ${DIFY_API_KEY}` },
			data: { conversation_id: conversationId, user: 'zhm' },
			success: (res) => {
				res.statusCode === 200 ? resolve(res.data.data || []) : reject(res.data)
			},
			fail: reject,
		})
	})
}