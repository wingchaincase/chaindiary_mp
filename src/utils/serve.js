// /open/user/ma/login
import permission from './permission'

export const loginApi = async (params) => {
  return permission.request.post({
    url: '/api/init',
    loadingTip: '数据加载中',
    data:params
  })
}
export const NoteCall = async (params, loadingTip) => {
  loadingTip = loadingTip ? loadingTip : '数据加载中'
  return permission.request.post({
    url: '/api/call',
    loadingTip,
    data:params
  })
}

