<template>
  <van-nav-bar :title="title"
               left-arrow
               @click-left="onClickLeft"
               @click-right="onClickRight"
               v-if="title !== '个人信息页' &&
                      title !== '创建博客页' && title !== '博客列表页' &&
                      title !== '我的博客页' && title !== '我的博客修改页' &&
                      title !== '好友聊天页面' && title !== '登录' &&
                      title !== '更新信息' & title !== '至少选择一个tag'">
  >
    <template #right  >
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>



  <div id="content">
    <!--根据不同的路由，展示不同的页面    -->
    <router-view/>
  </div>
  <van-tabbar route v-if="title !== '登录'">
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/blog" icon="newspaper-o" name="blog">博客</van-tabbar-item>
    <van-tabbar-item to="/team" icon="contact-o" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/friend/chat" icon="chat-o" name="info">好友聊天</van-tabbar-item>
    <van-tabbar-item to="/user" icon="user-o" name="user">个人</van-tabbar-item>
  </van-tabbar>

</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {ref} from "vue";
import routes from "../config/route";

const router = useRouter();
const DEFAULT_TITLE = '伙伴匹配';
const title = ref(DEFAULT_TITLE);


const onClickLeft = () => {
  router.back();
};
const onClickRight = () => {
  router.push('/search')
};

/**
 * 路由变化时，更新标题
 */
router.beforeEach((to, from) => {
  const toPath = to.path;
  const route = routes.find((route) => {
    return toPath === route.path;
  })
  if (!route?.title) {
    title.value = DEFAULT_TITLE;
  } else {
    title.value = route.title;
  }
})

</script>

<style scoped>
#content {
  padding-bottom: 50px;
}
</style>