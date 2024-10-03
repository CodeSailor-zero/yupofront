<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
<!--    <van-button type="primary" @click="doJoinTeam">创建队伍</van-button>-->
    <team-card-list :teamList="teamList"/>
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>
    <van-icon @click="doJoinTeam" name="add" size="60px"
              style="color: dodgerblue;position: fixed; bottom: 90px;
              width: 50px; right: 15px; height: 50px; border-radius: 50%;" />
  </div>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showToast} from "vant/es";

const router = useRouter();
const route = useRoute();
const searchText = ref("");

const userId = route.query.userId;
/**
 * 搜索队伍
 * @param val
 * @returns {Promise<void>}
 */

const listTeam = async (val = '') => {
  const res = await myAxios.get("/team/list/my/create",{
    params: {
      searchText: val,
      pageNum: 1,
      userId: userId
    }
  });
  if (res?.code === 0 && res.data) {
    teamList.value = res.data;
  }else{
    showFailToast('加载队伍失败，请刷新重试');
  }
}
const doJoinTeam = () => {
  router.push({
    path:"/team/add"
  })
}

const teamList = ref([]);
//页面加载时加载
onMounted(() => {
    listTeam();
})

const onSearch = (val) => {
  listTeam(val)
}
</script>

<style scoped>

</style>