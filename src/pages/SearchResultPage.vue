<template>
  <user-card-list :user-list="userList" />

  <van-empty v-if="!userList || userList.length < 1" description="搜索不到用户"/>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import qs from 'qs';
import UserCardList from "../components/userCardList.vue";
import {showFailToast, showSuccessToast} from "vant/es";


const route = useRoute();
const tags = route.query.tags;

const userList = ref([]);


onMounted(async () => {
  const userListData = await myAxios.get('/user/search/tags',{
    params: {
      tagNameList: tags
    },
    paramsSerializer: function(params) {
      // return qs.stringify(params, {arrayFormat: 'repeat'})
      return qs.stringify(params,{indices: false})
    }
  })
      .then(function (response) {
        console.log('/user/search/tags success',response);
        showSuccessToast('请求成功');
        return response?.data;//返回数据  ?.可选链操作符，避免数据为null或undefined时报错
      })
      .catch(function (error) {
        console.error('/user/search/tags error',error);
        showFailToast('请求失败');
      });
  if (userListData) {
    userListData.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    });
    userList.value = userListData;
  }
});


</script>

<style scoped>

</style>