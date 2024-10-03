<template>
  <van-form  @submit.submit-on-enter="onSubmit">
      <van-field v-if="editUser.editName !== '头像'"
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          :label="editUser.editName"
          :placeholder="`请输入${editUser.editName}`">
      </van-field>

    <div style="margin: 16px;" v-if="editUser.editName !== '头像'">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>


  <van-uploader v-if="editUser.editName === '头像'" :after-read="afterRead"  />

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {getCurrentUser} from "../service/user";
import {showFailToast, showSuccessToast} from "vant/es";


const route = useRoute();
const router = useRouter();

/**
 * 获取参数
 */
const editUser = ref({
  //as string规范语言
  editKey: route.query.editKey as string,
  currentValue: route.query.currentValue as string,
  editName: route.query.editName as string
});

let currentUser = ref(null);
/**
 * 更新除去头像 和 标签
 */
const onSubmit = async () => {
  currentUser = await getCurrentUser();
  if (!currentUser) {
    showFailToast('用户未登录');
    return;
  }
  // 把editKey、currentValue、editName提交到后台
  const res = await myAxios.post('/user/update',{
    'id': currentUser.id,
    [editUser.value.editKey]: editUser.value.currentValue,
  })
  console.log(res,"更新用户信息");
  if (res?.code === 0 && res.data > 0) {
    showSuccessToast('修改成功');
    router.back();
  }else {
    showFailToast('修改错误')
  }
};

/**
 * 上传图片
 * @param userAvatar
 */

const afterRead = async (userAvatar) => {
  const formData = new FormData();
  formData.append('file', userAvatar.file);
  // 此时可以自行将文件上传至服务器
  const res = await myAxios.post('/user/uploadAvatar',formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  if (res?.code === 0) {
    showSuccessToast('上传成功');
  }else {
    showFailToast('上传错误');
  }
};



</script>

<style scoped>

</style>