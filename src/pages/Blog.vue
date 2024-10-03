<template>
  <van-nav-bar title="博客列表页"/>

  <!-- 根据tittle来 搜索-->
  <form action="/">
    <van-search
        show-action
        v-model="searchText"
        placeholder="请输入搜索词"
        @search="onSearch"
    >
      <!--    todo    签到功能-->
      <template #action>
        <van-icon name="shop-collect" size="30px" color="#FFDAB9"/>
      </template>
    </van-search>
  </form>

  <!--将下面封装成组件-->
  <blog-card-list :blogList="blogList" :change="false"/>
  <van-empty v-if="blogList?.length < 1" description="数据为空"/>

  <van-button class="add-button" style="background: pink" color="pink" icon="plus" @click="doCreateBlog"/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";

import BlogCardList from "../components/blogCardList.vue";

const active = ref(0);
const router = useRouter();
const blogList = ref([]);
const searchText = ref('');


/**
 * 跳转到搜索博客 结果页面
 */
const onSearch = () => {
  router.push({
    path: '/blog/search/result',
    query: {
      searchText: searchText.value
    }
  });

}

/**
 * 添加博客
 */
const doCreateBlog = () => {
  router.push({
    path: '/blog/add'
  });
};


/**
 * 获取博客列表
 */
const getBlogList = async () => {
  const res = await myAxios.post('/blog/list');
  if (res?.code == 0 && res?.data) {
    showSuccessToast('获取博客列表成功');
    blogList.value = res.data;
  } else {
    showFailToast('获取博客列表失败');
  }
}

onMounted(getBlogList);

</script>

<style scoped>
.tags {
  margin-left: auto; /* 将标签推到最右边 */
}
</style>