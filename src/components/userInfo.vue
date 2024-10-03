<template>
  <template v-if="props.user">
    <div class="container">
      <van-image
          class="image"
          width="100px"
          height="100px"
          fit="cover"
          position="center"
          round
          :src="props.user?.avatarUrl || defaultAvatarUrl"
      />
      <div class="myname">{{ props.user?.username }}</div>
      <div class="tags">
        <van-tag plain type="primary" v-for="tag in props.user.tags" :key="tag" color="#FF8888">{{ tag }}</van-tag>
      </div>
    </div>


    <van-grid style="margin-top: 20px" center gutter="auto">
      <van-grid-item
          :icon="createTeamImg"
          text="创建的队伍"
          :to="`/user/team/create?userId=${props.user.id}`"
      />
      <van-grid-item
          :icon="joinTeamImg"
          text="加入的队伍"
          :to="`/user/team/join?userId=${props.user.id}`"
      />
      <van-grid-item
          icon="newspaper-o"
          icon-color="blue"
          text="我的博客"
          is-link
          :to="`/my/blog?userId=${props.user.id}`"
      />
      <van-grid-item
          icon="comment-o"
          :badge="applyNum"
          icon-color="blue"
          text="接受好友申请"
          is-link
          to="/friend/agree"
      />
      <van-grid-item
          icon="friends-o"
          icon-color="blue"
          text="好友"
          is-link
          :to="`/my/friend`"
      />
      <van-grid-item
          icon="friends-o"
          icon-color="blue"
          text="好友"
          is-link
      />      <van-grid-item
          icon="friends-o"
          icon-color="blue"
          text="好友"
          is-link
      />
      <van-grid-item
          icon="records-o"
          icon-color="blue"
          text="评分"
          is-link
          to="/score"
      />
    </van-grid>


  </template>
</template>


<script setup lang="ts">
import {defineProps,  onUpdated, ref, withDefaults} from 'vue';
import createTeamImg from '../assets/createteam.png';
import joinTeamImg from '../assets/jointeam.png';
import {UserType} from '../models/user';
import {useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";


const router = useRouter();
const defaultAvatarUrl = ref('https://img.yzcdn.cn/vant/cat.jpeg');
const applyNum = ref(0);

interface UserInfoProps {
  user: UserType | null;
}

const props = withDefaults(defineProps<UserInfoProps>(), {
  user: null,
});

const getApplyNum = async () => {
  const res = await myAxios.post('/friends/get/records/number');
  if (res?.code === 0) {
    applyNum.value = res.data;
  }
}
onUpdated(getApplyNum);


</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #f5f5f5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.myname {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  font-weight: bold;
  position: center;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.tags .van-tag {
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 14px;
  color: #fff;

}

.van-grid {
  margin-top: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.van-grid-item__content {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.van-grid-item__icon {
  font-size: 24px;
  color: #333;
}

.van-grid-item__text {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

.van-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff8888;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 16px;
}





</style>
