<template>
  <user-info :user="friend"/>
</template>


<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {onMounted, ref} from "vue";
import {UserType} from "../models/user";
import {showFailToast, showSuccessToast} from "vant/es";

import UserInfo from "../components/userInfo.vue";


const route = useRoute;
const router = useRouter;
const friend = ref<UserType>();


const friendId = route().query.friendId;

/**
 * 获取当前好友信息
 */
const getFriendInfo = async () => {
  const res = await myAxios.get('/friends/current', {
    params: {
      friendId: friendId
    }
  });
  if (res?.code === 0) {
    showSuccessToast('获取好友信息成功');
    friend.value = res.data;
    if (friend.value.tags) {
      friend.value.tags = JSON.parse(friend.value.tags);
    }
  } else {
    showFailToast('获取好友信息失败');
  }
}

onMounted(() => {
  getFriendInfo();
});


</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 16px; /* 添加一些间距 */
}

.username {
  font-size: 18px;
  color: #333;
}
</style>