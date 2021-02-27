<template>
  <div class="user-articles">
    <!-- 导航栏 -->
    <!--
      router.push 会形成历史记录
      router.replace 不会形成历史记录
     -->
    <van-nav-bar
      title="我的收藏/历史/作品"
      left-arrow
      @click-left="$router.replace('/my')"
      fixed
    />
    <!-- /导航栏 -->

    <!-- 便签列表 -->
    <van-tabs v-model="active">
      <van-tab title="我的收藏">
        <!-- <collect-article /> -->
      </van-tab>
      <van-tab title="浏览历史">
        <!-- <history-article /> -->
      </van-tab>
      <van-tab title="我的作品">
        <!-- <user-article /> -->
      </van-tab>
    </van-tabs>
    <!-- /便签列表 -->

    <!-- 动态组件 -->
    <keep-alive>
      <component v-bind:is="currentTabComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
// import UserArticle from './components/article'
// import CollectArticle from './components/collect'
// import HistoryArticle from './components/history'

export default {
  name: 'UserArticles',
  props: {
    type: {
      // 我的作品的type为undefined
      type: String // 接收动态路由参数
    }
  },
  components: {
    // 异步组件 结合 动态组件
    UserArticle: () => import('./components/article'),
    CollectArticle: () => import('./components/collect'),
    HistoryArticle: () => import('./components/history')
  },
  // 组件被缓存之后，生命周期都不再执行，除了activated，deactivated
  // activated () {
  //   console.log('activated')
  // },
  // deactivated () {
  //   console.log('deactivated')
  // },
  data () {
    // 点击的进入也免得时候展现当前的active
    let active = ['collect', 'history'].indexOf(this.type)
    if (active === -1) {
      active = 2 // 如果数组没有找到内容,就会返回-1,也就是作品3
    }
    return {
      active // 控制激活的标签选项
    }
  },
  computed: {
    currentTabComponent () {
      return ['CollectArticle', 'HistoryArticle', 'UserArticle'][this.active]
    }
  },
  beforeRouteLeave (to, from, next) {
    // console.log(to)
    // 如果跳转的是文章详情页，则把当前页面缓存起来，否则不缓存
    // if (to.name === 'my-article') {
    if (to.name === 'article') {
      console.log('to.name === "article"')
      this.$store.commit('addCachePage', 'UserArticles')
    } else {
      this.$$store.commit('removeCachePage', 'UserArticles')
    }
    next()
  }
}
</script>

<style scoped lang="less">
.user-articles {
  padding-top: 90px;
  padding-bottom: 50px;
  /deep/ .van-tabs__wrap {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
