<template>
  <div id="teamAddPage" >
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="updateTeamData.name"
            name="name"
            label="队伍名"
            placeholder="请输入队伍名"
            :rules="[{ required: true, message: '请输入队伍名' }]"
        />

        <van-field
            v-model="updateTeamData.description"
            rows="4"
            autosize
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />

        <van-field
          is-link
          readonly
          clickable
          name="date-picker"
          label="过期时间"
          :value="updateTeamData.expireTime"
          v-model="updateTeamData.expireTime"
          :placeholder="'点击选择过期时间'"
          @click="showPicker = true"
      />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker-group
              title="设定过期日期"
              :tabs="['选择日期', '选择时间']"
              @confirm="onConfirm"
              @cancel="showPicker = false"
          >
            <van-date-picker
                v-model="currentDate"
                :min-date="minDate"
            />
            <van-time-picker
                v-model="currentTime"
                :columns-type="columnsType"
            />
          </van-picker-group>
        </van-popup>

        <van-field name="radio" label="队伍状态">
          <template #input>
            <van-radio-group v-model="updateTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
            v-if="Number(updateTeamData.status) === 2"
            v-model="updateTeamData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入队伍密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />


      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";


const router = useRouter();
const route = useRoute();
// 展示日期选择器
const showPicker = ref(false);

const currentDate = ref(['2022', '06', '01']);		//定义一个初始时间(年月日)
const currentTime = ref(['12', '00', '00']);		//定义一个初始时间(时分秒)
const columnsType = ['hour', 'minute', 'second'];

const id = route.query.id;

// 获取之前的队伍信息
const updateTeamData = ref({});
onMounted(async () => {
  if (Number(id) <= 0) {
    showFailToast('加载队伍失败，请重新尝试');
  }
  const res = await myAxios.get("/team/get",{
    params: {
      id: id
    }
  });
  if (res?.code === 0){
    updateTeamData.value = res.data;
  }else{
    showFailToast('获取队伍列表失败，请重新尝试');
  }
})

// const initFormData = {
//   "description": "",
//   "expireTime": null,
//   "maxNum": 3,
//   "name": "",
//   "password": "",
//   "status": 0
// }



const onConfirm = () => {
  //组合过期时间，'T'是满足后端序列化配的
  updateTeamData.value.expireTime = currentDate.value.join('-') + 'T' + currentTime.value.join(':');
  showPicker.value = false;		//有了这行才会使picker点击“确认”后自动关闭
  
};

const minDate = new Date();


//提交
const onSubmit = async () => {
  //将status转成数字类型
  const postData = {
    ...updateTeamData.value,
    status: Number(updateTeamData.value.status)
  }
  // todo 前端参数校验
  const  res = await myAxios.post("/team/update", postData)
  if (res?.code === 0 && res.data) {
    showSuccessToast('修改成功');
    router.push({
      path: "/team",
      replace: true
    });
  }
  else {
    showFailToast('修改失败');
  }
}

</script>

<style scoped>

</style>