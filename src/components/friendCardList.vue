<template>
  <van-swipe-cell v-for="user in props.friendList">
    <van-card
        class="goods-card"
        :title="user?.username"
        desc="显示发送/收到信息"
        :thumb="user?.avatarUrl?user.avatarUrl:defaultAvatarUrl"
    >
      <template #tags>
        <van-tag plain type="danger" v-for="tag in user.tags" style="margin-right: 8px;margin-top: 8px">
          {{ tag }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="small" color="#ffb3e6" @click="toChat(user)" >联系我</van-button>
      </template>
    </van-card>
    <template #right>
      <van-button class="delete-button" square text="删除" type="danger" @click="deleteFriend(user)"/>
    </template>
  </van-swipe-cell>

</template>


<script setup lang="ts">
import {UserType} from "../models/user";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";
import {useRouter} from "vue-router";
import {getCurrentUser} from "../service/user";

const defaultAvatarUrl = ref('https://img.yzcdn.cn/vant/cat.jpeg');
const router = useRouter();
const currentId = ref(0);

interface friendCardListProps {
  friendList: UserType[];
}

const props = withDefaults(defineProps<friendCardListProps>(), {
  //@ts-ignore
  friendList: [] as UserType[]
});


onMounted(async ()=>{
  const user = await  getCurrentUser();
  currentId.value = user.id
});

/**
 * 跳转到聊天页面
 */
const toChat = (friend : UserType) => {
  router.push({
    path : '/friend/chat',
    query: {
      id: friend.id,
      currentId: currentId.value
    }
  });
}

/**
 * 删除好友
 * @param user
 */
const deleteFriend = async (user: UserType) => {
  const res = await myAxios.post("/friends/delete", {
    friendId: user?.id
  });
  if (res?.code === 0) {
    showSuccessToast('删除好友成功');
    window.location.href = `/my/friend?friendId=${currentId.value}`;
  } else {
    showFailToast('删除好友失败');
  }
}

</script>

<style scoped>
.goods-card {
  margin: 0;
  background-color: white;
}

.delete-button {
  height: 100%;
}
</style>