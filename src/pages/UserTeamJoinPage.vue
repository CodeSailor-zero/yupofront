<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
    <team-card-list :teamList="teamList"/>
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>
  </div>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast} from "vant/es";

const router = useRouter();
const searchText = ref("");
const route = useRoute();
const userId = route.query.userId;

/**
 * 搜索队伍
 * @param val
 * @returns {Promise<void>}
 */

const listTeam = async (val = '') => {
  const res = await myAxios.get("team/list/my/join",{
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