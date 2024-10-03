<template>
  <van-skeleton title avatar :row="3" :loading="props.loading" v-for="user in props.userList" v-if="currentUser">
    <van-card
        v-if="user.id !== currentUser.id"
        :desc="user?.profile"
        :title="user?.username"
        :thumb="user.avatarUrl ? user.avatarUrl : defaultAvatarUrl"
        @click-thumb="ToUserInfo(user.id)"
    >
      <template #tags>
        <van-tag
            type="danger"
            color="#8B7500"
            style="margin-right: 8px;margin-top: 8px"
            v-for="tag in user.tags"
        >
          {{ tag }}
        </van-tag>
      </template>

      <template #footer>
        <van-button size="small"
                    color="#00BFFF"
                    v-if="!isFriend(user.id)"
                    @click="toFriendRequest(user.id)"
        >
          发送好友申请
        </van-button>
      </template>

    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";
import {getCurrentUser} from "../service/user";

const defaultAvatarUrl = ref('https://img.yzcdn.cn/vant/cat.jpeg');
const router = useRouter();
const currentUser = ref(null);
const friends = ref<number[]>([]);

const id = ref(0);


// 获取当前用户的好友列表
const fetchFriends = async () => {
  try {
    const response = await myAxios.post('/friends/list', {
      friendId: id.value
    });
    if (response.data ) {
      friends.value = response.data.map((friend: UserType) => friend.id);
    }
  } catch (error) {
    console.error('Failed to fetch friends:', error);
  }
};

onMounted(async () => {
  const user = await getCurrentUser();
  currentUser.value = user;
  id.value = user?.id;
  await fetchFriends();
});

interface UserCardListProps {
  loading: boolean;
  userList: UserType[];
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  //@ts-ignore
  userList: [] as UserType[],
  loading: false
});


const ToUserInfo = (friendId: number) => {
  router.push({
    path: '/friend/info',
    query: {
      friendId: friendId,
    }
  });
}

const toFriendRequest =(friendId : number) => {
  router.push({
    path: '/friend/apply',
    query: {
      receivedId: friendId
    }
  });
}

const isFriend = (userId: number) => friends.value.includes(userId)


</script>

<style scoped>

</style>