<template>
  <van-nav-bar title="用户注册页面"
               left-arrow
               @click-left="onClickLeft"
  />
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userName"
          name="userAccount"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名，规则不为空即可' }]"
      />
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
          v-model="checkPassword"
          type="password"
          name="userPassword"
          label="确认密码"
          placeholder="请确认输入密码"
          :rules="[{ required: true, message: '请确认密码' }]"
      />


    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>

  </van-form>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";

const router = useRouter();
const route = useRoute();

const userAccount = ref('');
const userPassword = ref('');
const checkPassword = ref('');
const userName = ref('');

/**
 * 返回上一页
 */
const onClickLeft = () => {
  router.back();
};

/**
 * 注册功能
 */
const onSubmit = async () => {
  const res = await myAxios.post('/user/register', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
    userName: userName.value
  })
  //console.log(res,"正在登录");
  if (res?.code === 0 && res.data) {
    showSuccessToast('注册成功');
    const redirectUrl = route.query?.redirect ?? '/'
    window.location.href = redirectUrl;
  } else {
    showFailToast('注册失败');
  }
};

</script>

<style scoped>

</style>