/**
 * 请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'

// 在非组件模块中获取 store 必须通过这种方式
// 这里单独加载 store，和在组件中 this.$store 是一样的
import store from '@/store/'
import router from '@/router/'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 处理原始后端返回数据
  transformResponse: [function (data) {
    // 后端返回的数据可能不是 JSON 格式字符串
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      // 如果转换失败了，则进入这里
      // 在这里把数据原封不动的直接返回给请求使用
      return data
    }
  }]
})

const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // config ：本次请求的配置对象，里面有一个属性：headers
  const { user } = store.state

  // 如果用户已登录，统一给接口设置 token 信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完之后一定要把 config 返回，否则请求就会停在这里
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 响应成功进入这里
  return response
}, async function (error) {
  // 响应失败进入这里
  const status = error.response.status
  if (status === 400) {
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token 无效
    const { user } = store.state
    if (!user || !user.refresh_token) {
      // 直接跳转到登录页
      return redirectLogin()
    }
    // 这里为啥使用axios 请求刷新token?
    // 如果我们使用request 请求刷新 token, 则会走request 的请求拦截器
    // 如果request 刷新token 失效了，还会进入request 自己的响应拦截器中
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 拿到新的 token 之后把它更新到容器中
      user.token = data.data.token
      store.commit('setUser', user)

      // 把失败的请求重新发出去
      // error.config 是本次请求的相关配置信息对象
      // 这里使用 request 发请求，它会走request的请求拦截器
      return request(error.config)
    } catch (err) {
      // 刷新 token 失败了，直接跳转登录页
      redirectLogin()
    }
  } else if (status === 403) {
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    Toast.fail('服务端异常，请稍后重试')
  }
  return Promise.reject(error)
})

// 登录成功跳转回原来页面
function redirectLogin () {
  // 写法一：
  // router.push('/login?key=value&key=value')

  // 写法二：自动转化为?key=value&key=value 的格式
  router.push({
    name: 'login',
    query: {
      // redirect是自定义的属性名称
      // js模块中以 router.currentRoute 获取当前路由对象，好比我们在组件中的this.$route
      // fullPath就是当前路由的路径
      redirect: router.currentRoute.fullPath
    }
  })
}

// 导出
export default request
