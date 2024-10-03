<template>
  <van-nav-bar left-arrow title="个人信息页">
    <template #right>
      <van-icon @click="toUpdate" name="setting" color="#673ab7"/>
    </template>
  </van-nav-bar>
  <van-notice-bar
      scrollable
      text="无论我们能活多久，我们能够享受的只有无法分割的此刻，此外别无其他。"
  />

  <user-info :user="user"/>

  <van-button class="loginOutButton"
              v-if="user"
              @click="loginOut"
  >
    <font color="#f0f8ff">
      退出登录
    </font>
  </van-button>
  <van-empty v-if="!user" description="用户错误"/>
</template>
>


<script setup lang="ts">
import {useRouter} from "vue-router";

import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../service/user";
import UserInfo from "../components/userInfo.vue";
import {UserType} from "../models/user";

const user = ref();
onMounted(async () => {
  user.value = await getCurrentUser();
  if (user.value.tags) {
    user.value.tags = JSON.parse(user.value.tags);
  }
});

const router = useRouter();

const toUpdate = async () => {
  await router.push({
    path: '/user/update'
  })
}

const loginOut = async () => {
  const res = await myAxios.post('/user/logout');
  if (res?.code == 0) {
    showSuccessToast('退出成功');
    router.push({
      path: '/user/login',
      replace: true
    })
  } else {
    showFailToast('退出失败');
  }
}


</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  padding: 20px;
}

.image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 16px;
}

.username {
  font-size: 18px;
  color: #333;
  margin-bottom: 16px;
}

.loginOutButton {
  margin-top: 30px;
  background-color: dodgerblue;
  color: white;
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.loginOutButton:hover {
  background-color: #0056b3;
}


</style>