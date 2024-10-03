<template>
  <div id="teamCardList">
    <van-card
        v-for="team in props.teamList"
        :thumb="girl"
        :desc="team.description"
        :title="`${team.name}`"
    >
      <template #tags>
        <van-tag plain type="danger" style="margin-right: 8px;margin-top: 8px">
          {{
            teamStatusEnum[team.status]
          }}
        </van-tag>
      </template>
      <template #bottom>
        <div>
          {{`队伍人数: ${team.hasJoinNum}/${team.maxNum}` }}
        </div>
        <div v-if="team.expireTime">
          {{
            `过期时间: ` + team.expireTime
          }}
        </div>
        <div>
          {{
            `创建时间: ` + team.createTime
          }}
        </div>
      </template>
      <template #footer>
        <van-button v-if="team.userId === currentUser?.id" plain round size="small" type="success"
                    @click="doUpdateTeam(team.id)">
          更新队伍
        </van-button>
        <!--仅创建者不可见 并且 加入的人也应该不可见-->
        <van-button v-if="team.userId !== currentUser?.id && !team.hasJoin" size="small" plain round type="primary"
                    @click="preJoinTeam(team)">
          加入队伍
        </van-button>

        <!--仅加入队伍可见(创建人不可见)-->
        <van-button v-if="team.userId !== currentUser?.id && team.hasJoin" size="small" plain round type="primary"
                    @click="doQuitTeam(team.id)">
          退出队伍
        </van-button>
        <van-button v-if="team.userId === currentUser?.id" size="small" plain round type="danger"
                    @click="doDeleteTeam(team.id)">
          解散队伍
        </van-button>
      </template>

    </van-card>
    <van-dialog v-model:show="showDialogPassword" title="请输入密码" show-cancel-button @confirm="doJoinTeam" @cancel="doJoinCancel">
      <van-field v-model="password" placeholder="请输入密码"/>
    </van-dialog>

  </div>
</template>

<script setup lang="ts">

import {TeamType} from "../models/team";
import {teamStatusEnum} from "../constants/team.ts";
import girl from "../assets/girl.png";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../service/user";
import {useRouter} from "vue-router";

const currentUser = ref();
onMounted(async () => {
  currentUser.value = await getCurrentUser();
})

interface TeamCardListProps {
  teamList: TeamType[];
}

const props = withDefaults(defineProps<TeamCardListProps>(), {
  //@ts-ignore
  teamList: []
});

const showDialogPassword = ref(false);
const password = ref('');
const joinTeamId = ref();

const router = useRouter();

const doJoinCancel = () => {
  password.value = '';
  joinTeamId.value = 0;
}

const preJoinTeam = (team : TeamType) => {
    joinTeamId.value = team.id;
    if(team.status === 0 ) {
      doJoinTeam()
    }else {
      showDialogPassword.value = true;
    }
}

/**
 * 加入队伍
 */
const doJoinTeam = async () => {
  if (!joinTeamId.value) {
    return;
  }
  const res = await myAxios.post("/team/join", {
    teamId: joinTeamId.value,
    password: password.value
  })
  console.log(res, "加入队伍");
  if (res?.code === 0) {
    showSuccessToast('加入成功');
    doJoinCancel();
  } else {
    showFailToast('加入失败' + (res.description? `,${res.description}` : ''));
  }
}

/**
 * 跳转至更新队伍页面
 * @param id
 */
const doUpdateTeam = async (id: number) => {
  await router.push({
    path: "/team/update",
    query: {
      id: id
    }
  })
}

/**
 * 退出队伍
 * @param id
 */
const doQuitTeam = async (id: number) => {
  const res = await myAxios.post("/team/quit/", {
    teamId: id
  })
  if (res?.code === 0) {
    showSuccessToast('退出成功');
  } else {
    showFailToast('退出失败' + (res.description ? `,${res.description}` : ''));
  }
}

/**
 * 解散队伍
 * @param id
 */
const doDeleteTeam = async (id: number) => {
  const res = await myAxios.post("/team/delete", {
    id,
  })
  if (res?.code === 0) {
    showSuccessToast('解散成功');
  } else {
    showFailToast('解散失败' + (res.description ? `,${res.description}` : ''));
  }
}

</script>

<style scoped>
#teamCardList:deep(.van-image__img) {
  height: 128px;
  object-fit: unset;
}
</style>