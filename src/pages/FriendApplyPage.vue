<template>
<!--好友申请界面-->
<!--我们正常点击发送好友申请后，直接添加到friends中。当对方同意，我们修改 status 为 1 -->
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="remark"
          name="备注信息"
          label="备注信息"
          placeholder="请填写备注信息"
          :rules="[{ required: false }]"
      />
    </van-cell-group>
    <div style="margin: 16px;" >
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>

</template>

<script setup lang="ts">

import {useRoute} from "vue-router";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";
import {ref} from "vue";

const route = useRoute();
const receivedId = route.query.receivedId;
const remark = ref('');


const onSubmit = async () => {
  const res = await myAxios.post('/friends/add',{
    receivedId: receivedId,
    remark: remark.value
  });
  if(res.code === 0){
    showSuccessToast('申请成功');
    window.location.href = '/';
  }else{
    showFailToast('申请失败');
  }
}
</script>

<style scoped>

</style>