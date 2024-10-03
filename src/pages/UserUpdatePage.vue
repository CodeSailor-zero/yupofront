<template>
  <van-nav-bar left-arrow @click-left="router.back()" title="个人信息编辑页"></van-nav-bar>
  <template v-if=user>
    <van-cell title="昵称" is-link to="user/edit" :value="user.username"
              @click="toEdit('username','昵称',user.username)"/>
    <van-cell title="账号" is-link to="user/edit" :value="user.userAccount"
              @click="toEdit('userAccount','账号',user.userAccount)"/>
    <van-cell title="头像" is-link to="/user/edit" :value="user.avatarUrl"
              @click="toEdit('avatarUrl','头像',user.avatarUrl)">
      <img style="height: 48px" :src="user.avatarUrl"/>
    </van-cell>
    <van-cell title="性别" is-link to="user/edit" :value="user.gender === 0 ? '女': '男'"
              @click="toEdit('gender','性别',user.gender === 0 ? '女': '男')"/>
    <van-cell title="电话" is-link to="user/edit" :value="user.phone" @click="toEdit('phone','电话',user.phone)"/>
    <van-cell title="邮箱" is-link to="user/edit" :value="user.email" @click="toEdit('email','邮箱',user.email)"/>
    <van-cell title="标签" is-link to="user/edit"  @click="toEditTags('tags','标签',user.tags)">
      <template #title>
        <span class="custom-title">标签</span>
      </template>
      <template #value >
        <van-space size="0.5px">
          <van-tag type="primary" color="#8B7500" style="margin-right: 8px;margin-top: 8px"
                   v-for="tag in user.tags">
            {{tag}}
          </van-tag>
        </van-space>
      </template>
    </van-cell>
  </template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../service/user";
import {UserType} from "../models/user";


const user = ref<UserType>();
onMounted(async () => {
  user.value = await getCurrentUser();
  if (user.value) {
   if (user.value.tags) {
     user.value.tags = JSON.parse(user.value.tags);
   }
  }
})

const router = useRouter();

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue
    }
  })
};

/**
 * 跳转到修改标签页
 * @param editKey
 * @param editName
 * @param currentValue
 */
const toEditTags = (editKey: string, editName: string, currentValue: string[]) => {
  router.push({
    path: '/user/tags/update',
    query: {
      editId: user.value?.id,
      currentValue: JSON.stringify(currentValue)
    }
  })
};


</script>

<style scoped>

</style>