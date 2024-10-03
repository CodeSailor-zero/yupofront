<template>
<!--  friend.id-->
  <van-card

      v-for="friend in friendList"
      :desc="`申请好友描述： ${friend.remark}`"
      :title="friend.username"
      :thumb="friend.avatarUrl"
  >
    <template #tags>
      <van-tag plain type="primary" v-for="tag in friend.tags" color="#FF8888">{{tag}}</van-tag>
    </template>
    <template #footer v-if="open">
      <van-button size="small" color="#FF88C2" @click="agreeApply(friend.id)" >接受</van-button>
      <van-button size="small" color="#CC0000" @click="cancelApply(friend.id)">拒绝</van-button>
    </template>


  </van-card>

  <van-empty v-if="!friendList || friendList.length < 1" description="找不到好友" />
</template>



<script setup lang="ts">
import {useRoute} from "vue-router";
import myAxios from "../plugins/myAxios";
import {onMounted, ref} from "vue";
import {showFailToast, showSuccessToast} from "vant/es";
import {RecordsType} from "../models/records";

const route = useRoute();

const friendList = ref<RecordsType[]>();
const open = ref(true);

//fromId时申请好友的id
/**
 * 接受好友申请
 * @param fromId
 */
const agreeApply = async (fromId: number) => {
  const res = await myAxios.post(`/friends/agree/${fromId}`);
  if (res?.code == 0 && res.data) {
    showSuccessToast('接受好友申请成功');
    open.value = false;
    window.location.reload();
  }else {
    showFailToast('接受好友申请失败');
  }
}

const cancelApply = async (fromId: number) => {
  const res = await myAxios.post(`/friends//cancel/apply/${fromId}`);
  if (res?.code == 0 && res.data) {
    showSuccessToast('取消好友申请成功');
    open.value =false;
    window.location.reload();
  }else {
    showFailToast('取消好友申请失败');
  }
}

const getRecords = async () => {
  const res = await myAxios.post('/friends/get/records');
  if (res?.code == 0 && res?.data) {
    friendList.value = res.data;
    showSuccessToast('获取好友申请记录成功');
  }else {
    showFailToast('获取好友申请记录失败');
  }
  if (friendList.value) {
    friendList.value.forEach((user: RecordsType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
  }
};

onMounted(getRecords);
</script>

<style scoped>

</style>