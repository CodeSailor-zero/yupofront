<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab title="公开" name="public"/>
      <van-tab title="加密" name="private"/>
    </van-tabs>
    <div style="margin-top: 20px"/>
    <van-button  class="add-button" type="primary" icon="plus" @click="doCreateTeam"/>
    <team-card-list :teamList="teamList"/>
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>
  </div>

</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast} from "vant/es";

const active = ref('public');
const router = useRouter();
const searchText = ref("");
const teamList = ref([]);

/**
 * 切换标签
 * @param name
 */
const onTabChange = (name) => {
  //查公开
  if (name === 'public') {
    listTeam(searchText.value,0)
  }else {
    //查加密
    listTeam(searchText.value,2)
  }
}

/**
 * 搜索队伍
 * @param val
 * @param status
 * @returns {Promise<void>}
 */

const listTeam = async (val = '',status = 0) => {
  const res = await myAxios.get("/team/list",{
    params: {
      searchText: val,
      pageNum: 1,
      status,
    }
  });
  if (res?.code === 0 && res.data) {
    teamList.value = res.data;
  }else{
    showFailToast('加载队伍失败，请刷新重试');
  }
}



const doCreateTeam = () => {
  router.push({
    path:"/team/add"
  })
}

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