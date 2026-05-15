import request from './request'

/**
 * 加入购物车（与项目其它接口一致：走 utils/request，BASE_URL 拼接 url）
 * 调用时机：商品详情页规格弹层（SelectSpces）内，用户已选 SKU 与数量后再请求（与淘宝流程一致）。
 *
 * @param {Object} data
 * @param {string|number} data.goodsId 商品 ID（与详情页路由参数 id 一致）
 * @param {string|number} [data.skuId] 当前选中的 SKU id（good_skus.id）
 * @param {number} data.quantity 数量（规格面板中的件数）
 * @param {string} [data.specSummary] 规格文案摘要，便于购物车展示与后端校验
 */
export function addToCart(data) {
	// 小程序等端上 POST 需 JSON 字符串 + Content-Type，Spring @RequestBody 才能稳定接到字段
	const body = JSON.stringify(data)
	return request({
		url: '/cart/add',
		method: 'POST',
		data: body,
		header: {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	})
}

/**
 * 购物车列表
 * @param {Object} [params] 预留分页等：{ page, pageSize }
 */
export function getCartList(params = {}) {
	return request({
		url: '/cart/list',
		method: 'GET',
		data: params
	})
}
