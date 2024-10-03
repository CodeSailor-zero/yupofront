<template>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode"/>
    </template>
  </van-cell>

  <user-card-list :user-list="userList" :loading="loading"/>


  <van-empty v-if="!userList || userList.length < 1" description="数据为空"/>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {ref, watchEffect} from "vue";
import myAxios from "../plugins/myAxios";
import UserCardList from "../components/userCardList.vue";
import {showFailToast} from "vant/es";
import {UserType} from "../models/user";


const route = useRoute();
const isMatchMode = ref(false);


const {tags} = route.query;

const userList = ref([]);
const loading = ref(true);

/**
 * 加载数据
 */
const loadData = async () => {
  let userListData;
  loading.value = true;
  if (isMatchMode.value) {
    // 匹配模式/心动模式：根据标签匹配用户
    const num = 10;
    userListData = await myAxios.get('/user/match', {
      params: {
        num,
      },
    })
        .then(function (response) {
          return response?.data;//返回数据  ?.可选链操作符，避免数据为null或undefined时报错
        })
        .catch(function (error) {
          console.error('/user/match error', error);
          showFailToast('请求失败');
        })
  } else {
    // 推荐模式，直接分页查询用户
    userListData = await myAxios.get('/user/recommend', {
      params: {
        pageSize: 8,
        pageNum: 1,
      },
    })
        .then(function (response) {
          return response?.data?.records;//返回数据  ?.可选链操作符，避免数据为null或undefined时报错
        })
        .catch(function (error) {
          console.error('/user/recommend error', error);
          showFailToast('请求失败');
        })
  }
  if (userListData) {
    userListData.forEach((user: UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
  loading.value = false;
}

watchEffect(() => {
  loadData();
})
</script>

<style scoped>

</style>