<template>
  <van-nav-bar title="用户登录页面"/>

  <van-image class="image"
             width="150"
             height="150"
             round
             fit="cover"
             position="center"
             :src=userLoginImg
  />
  <br/>
  <h3 style="text-align: center">伙伴匹配系统，欢迎加入</h3>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
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
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        登录
      </van-button>
    </div>

    <div style="margin: 16px;">
      <van-button round block type="primary" @click="userRegister">
        注册
      </van-button>
    </div>
  </van-form>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";
import userLoginImg from '../assets/userLogin.jpg';

const router = useRouter();
const route = useRoute();


const userAccount = ref('');
const userPassword = ref('');
const onSubmit = async () => {
  const res = await myAxios.post('/user/login', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
  })

  if (res.code === 0 && res.data) {
    showSuccessToast('登录成功');
    const redirectUrl = route.query?.redirect ?? '/'
    window.location.href = redirectUrl;
  } else {
    showFailToast(res.description);
  }
};

const userRegister = async () => {
  router.push({
    path: "/user/register"
  })

}

</script>

<style scoped>
.image {
  display: block;
  margin: auto;
  width: 40%;
  /*text-align: center;*/
  margin-top: 30px;

}
</style>