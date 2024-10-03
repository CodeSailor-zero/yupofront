<template>
  <blog-card-list :blogList="blogList"/>
  <van-empty v-if="!blogList || blogList.length < 1" description="数据为空"/>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";
import {onMounted, ref} from "vue";
import BlogCardList from "../components/blogCardList.vue";

//传过来的搜索参数
const route = useRoute();
const searchText = route.query.searchText;
const userId = route.query.userId;
const blogList = ref([]);

const getSearchResult = async () => {
  const res = await myAxios.get('/blog/search', {
    params: {
      searchText: searchText,
      userId: userId
    }
  });
  if (res?.code == 0) {
    showSuccessToast('搜索博客成功');
    blogList.value = res.data;
  } else {
    showFailToast('搜索博客失败');
  }
};
onMounted(getSearchResult);

</script>

<style scoped>

</style>