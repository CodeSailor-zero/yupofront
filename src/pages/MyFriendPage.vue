<template>
  <friend-card-list :friend-list="friendList"/>
  <van-empty v-if="!friendList || friendList.length < 1" description="数据为空"/>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {UserType} from "../models/user";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";
import FriendCardList from "../components/friendCardList.vue";



const friendList = ref<UserType[]>([]);


const getFriendList = async () => {
  const res = await myAxios.post("/friends/list");
  if (res?.code === 0) {
    friendList.value = res?.data;
    if (friendList) {
      friendList.value.forEach((user: UserType) => {
        if (user.tags) {
          user.tags = JSON.parse(user.tags);
        }
      })
    }
    showSuccessToast('获取好友成功');
  } else {
    showFailToast('获取好友失败');
  }
}


// 页面加载时获取好友列表
onMounted(() => {
  getFriendList();
});


</script>

<style scoped>

</style>