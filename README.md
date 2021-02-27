## Vue.js 移动端项目--IT头条

### 1. 项目简介

> 基于 Vue.js 开发的移动端项目——IT头条(仿今日头条)
>
> 本项目采用前后端分离的开发模式，使用 Vue.js 和 vant组件库 构建的移动端 SPA 单页面应用程序。
>

项目已经完成功能如下：

- 个人中心

  - 登录/退出
  - 展示当前登录用户信息
  - 个人信息(头像、昵称、、性别、生日)的编辑

  - 我的收藏

  - 我的历史

  - 我的作品

![个人中心](https://i.loli.net/2021/02/27/4lNBSwnMfyP21pv.png)



-  首页
   -  频道列表
   -  频道编辑
   -  文章列表

![首页.png](https://i.loli.net/2021/02/27/ObqIvzQ43B9kH7j.png)



-  搜索
   -  联想建议
   -  搜索历史记录
   -  搜索结果

![搜索结果.png](https://i.loli.net/2021/02/27/hdyKQLf4J1j3ORW.png)



-  文章详情
   -  关注用户
   -  文章收藏
   -  文章点赞

![搜索结果.png](https://i.loli.net/2021/02/27/hdyKQLf4J1j3ORW.png)



-  文章评论
   -  文章评论
   -  评论回复
   -  发布文章评论
   -  发布评论回复
   -  评论点赞

![评论.png](https://i.loli.net/2021/02/27/CTsOYeZkBoGrHFu.png)

















### 2. 技术栈

1. 基于 `Vue.js` 的前端框架

1. 基于 `webpack` 工程化开发解决方案

1. 基于 `Vant` 的前端 `UI` 组件库，开发效率更高

1. 基于 `axios` 的请求库

1. 基于 `RESTful` 风格的数据 `API` 解决方案

1. 基于 `JWT` 的 `Token` 状态维持解决方案

1. 基于 `Vue Router` 的路由管理方案

1. 基于 `Vuex` 的状态共享方案

1. 基于 `Vue CLI` 的脚手架工具，快速创建项目快速开发

1. 基于 `PostCSS` 的移动端 REM 适配解决方案



### 3. 项目概览

- 基于 Token 的验证方案处理用户登录
- 移动端表单验证方案及交互提示
- 用户中心、个人资料展示
- 对文章内容的收藏、点赞和分享
- 列表类页面的加载、缓存及优化
- 列表类页面的下拉刷新和上拉加载更多
- 资讯类文章详情展示和文章评论
- 完整的搜索业务：输入联想建议、搜索关键词高亮、搜索历史记录、搜索结果列表





### 4. 项目运行

clone项目：

```
git clone https://github.com/feng-yu-jian/IT-toutiao.git
```

安装项目依赖：

```shell
npm install    |   yarn install
```

项目运行：

``` shell
npm run serve  |   yarn serve
```

项目打包

```sehll
npm run build  |   yarn build
```



### 5. 展望

后续会完成如下功能

-  消息通知
-  小爱同学
   -  展示聊天消息列表
   -  发送/接收消息





### 解决方案详解

#### 1. 移动端 REM 适配

Vant 中的样式默认使用 `px` 作为单位，如果需要使用 `rem` 单位，请使用以下两个工具：

- [lib-flexible](https://github.com/amfe/lib-flexible) 用于设置 rem 基准值
- [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) 是一款 postcss 插件，用于将px转化为 rem

**一、使用 [lib-flexible](https://github.com/amfe/lib-flexible) 动态设置 REM 基准值（html 标签的字体大小）**

1、安装

```shell
npm i amfe-flexible
```

2、然后在 `main.js` 中加载执行该模块

```javascript
import 'amfe-flexible'
```

**二、使用 [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) 将 `px` 转为 `rem`**

1、安装

```shell
npm install postcss-pxtorem -D
```

2、然后在**项目根目录**中创建 `.postcssrc.js` 文件

```javascript
/**
 * PostCSS 配置文件
 */
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // postcss-pxtorem 处理每个 CSS 文件的时候都会来调用这个函数
      // 它会把被处理的 CSS 文件相关的信息通过参数传递给该函数
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 配置要转换的 CSS 属性
      propList: ['*'],

      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}

```

**注意：**

- 该插件**不能转换行内样式中的 `px`**，例如 `<div style="width: 200px;"></div>`



#### 2. 处理用户 Token

Token 是用户登录成功之后服务端返回的一个身份令牌，在项目中的多个业务中需要使用到：

- 登录成功，将 Token 存储到 Vuex 容器中
  - 获取方便
  - 响应式
- 为了**持久化**，把 Token 放到本地存储

在 `src/store/index.js` 中

```js
import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 一个对象，存储当前登录用户信息（token等数据）
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      setItem(TOKEN_KEY, state.user)
    }
  }
})

```

在 `src/utils/storage.js` 模块中设置localStorage

``` js
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

export const setItem = (name, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export const removeItem = name => {
  window.localStorage.removeItem(name)
}

```



#### 3. 使用请求拦截器统一添加 Token

在 `src/utils/request.js` 中添加拦截器统一设置 token：

```js
/**
 * 请求模块
 */
import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // config ：本次请求的配置对象，里面有一个属性：headers
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

export default request
```



#### 4. 关于 Token 过期问题

概述：服务器生成token的过程中，会有两个时间，一个是token失效时间，一个是token刷新时间，刷新时间肯定比失效时间长，当用户的 `token` 过期时，拿着过期的token去换取新的token，来保持用户的登陆状态

处理流程：

1. 在axios的**响应拦截器**中加入token刷新逻辑
2. 当用户token过期时，去向服务器请求新的 token
3. 把旧的token替换为新的token
4. 然后继续用户当前的请求

在请求的响应拦截器中统一处理 token 过期：

在`src/utils/request.js` 中添加响应拦截器处理过期的token

```js
const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // config ：本次请求的配置对象，里面有一个属性：headers
  const { user } = store.state

  // 如果用户已登录，统一给接口设置 token 信息
  if (user && user.token) {
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
    // 这里为啥使用 axios 请求刷新token?
    // 如果我们使用 request 请求刷新 token, 则会走 request 的请求拦截器
    // 如果 request 刷新token 失效了，还会进入 request 自己的响应拦截器中
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
```



#### 5. 关于第三方图片资源403问题

为什么文章列表数据中的好多图片资源请求失败返回 403？

- 这是因为项目的接口数据是后端通过爬虫抓取的第三方平台内容，而第三方平台对图片资源做了防盗链保护处理。

第三方平台怎么处理图片资源保护的？

- 服务端一般使用 Referer 请求头识别访问来源，然后处理资源访问。

- Referer 是什么东西？

> 扩展参考：http://www.ruanyifeng.com/blog/2019/06/http-referer.html

怎么解决？

```
不要发送 referrer
```

直接在 HTMl 页面头中通过 meta 属性全局配置：

```
<meta name="referrer" content="no-referrer" />
```



#### 6. 处理相对时间

[Day.js](https://day.js.org/zh-CN/) 是一个轻量的处理时间和日期的仅 2kb 大小的 JavaScript 库，和 [Moment.js](https://momentjs.com/) 的 API 设计保持完全一样。

1、安装

```sh
npm i dayjs
```

2、创建 `utils/dayjs.js`

```js
import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

// 全局过滤器：处理相对时间
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

```

3、在 `main.js` 中加载初始化

```js
import './utils/dayjs'
```

4、使用

使用过滤器：

```html
<p>{{ 日期数据 | relativeTime }}</p>
```



#### 7. 防抖优化

1、安装 lodash

```bash
npm i lodash
```

2、防抖处理

```js
// lodash 支持按需加载，有利于打包结果优化
import { debounce } from "lodash"
```

> 不建议下面这样使用，因为这样会加载整个模块。
>
> ```
> import _ from 'lodash'
> _.debounce()
> ```

```js
watch: {
  searchText: {
    // debounce 函数
    // 参数1：函数
    // 参数2：延迟时间，单位是毫秒
    // 返回值：防抖之后的函数
    handler: debounce(function (value) {
      this.loadSearchSuggestions(value)
    }, 200),
    // handler (value) {
    //   this.loadSearchSuggestions(value)
    // },
    immediate: true // 该回调将会在侦听开始之后被立即调用
  }
},
methods: {
  async loadSearchSuggestions (q) {
    try {
      const { data } = await getSearchSuggestions(q)
      this.suggestions = data.data.options
    } catch (err) {
      this.$toast('数据获取失败，请稍后重试')
    }
  }
}
```



#### 8. 搜索关键字高亮

1、在 methods 中添加一个方法处理高亮

```js
highlight (text) {
  const highlightStr = `<span class="active">${this.searchText}</span>`

  // RegExp 正则表达式构造函数
  //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
  //    参数2：匹配模式
  const reg = new RegExp(this.searchText, 'gi')
  return text.replace(reg, highlightStr)
}
```

2、然后在联想建议列表项中绑定调用

```html
<!-- 联想建议 -->
<van-cell-group v-else-if="searchContent">
  <van-cell
    icon="search"
    v-for="(item, index) in suggestions"
    :key="index"
    @click="onSearch(item)"
  >
    <div slot="title" v-html="highlight(item)"></div>
  </van-cell>
</van-cell-group>
<!-- /联想建议 -->
```





#### 9.关于后端返回数据中的大数字问题

> json-bigint 会把超出 JS 安全整数范围的数字转为一个 BigNumber 类型的对象，我们要做的就是在使用的时候把BigNumber 类型的对象转为字符串来使用

```js
const jsonStr = '{ "art_id": 1245953273786007552 }'

// JSONBig 可以处理数据中超出 JavaScript 安全整数范围的问题
console.log(JSONBig.parse(jsonStr)) // 把 JSON 格式的字符串转为 JavaScript 对象

// 使用的时候需要把 BigNumber 类型的数据转为字符串来使用
console.log(JSONBig.parse(jsonStr).art_id.toString()) // 1245953273786007552
```

通过 Axios 请求得到的数据都是 Axios 处理（JSON.parse）之后的，我们应该在 Axios 执行处理之前手动使用 json-bigint 来解析处理。Axios 提供了自定义处理原始后端返回数据的 API：`transformResponse` 

```js
import axios from 'axios'
import jsonBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 处理原始后端返回数据
  transformResponse: [function (data) {
    // 后端返回的数据一般都是 JSON 格式的字符串,以防后端返回的数据可能不是 JSON 格式字符串
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
```






