<template>
  <van-nav-bar left-arrow
               title="创建博客"
               @click-left="onClickLeft"
               @click-right="onClickRight"
  >
    <template #right>
      <van-icon
          name="https://tse1-mm.cn.bing.net/th/id/OIP-C.R3R1RsK96ODS3M3rqteTsgAAAA?w=162&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
          size="30px"/>
    </template>
  </van-nav-bar>

  <van-form>
    <van-cell-group inset>
      <van-field
          v-model="addBlogData.tittle"
          name="name"
          placeholder="请输入完整的帖子标题(5-31个字)"
          :rules="[{ required: true, message: '请输入标题' }]"
      />

      <van-field
          v-model="addBlogData.text"
          rows="4"
          autosize
          type="textarea"
          placeholder="请输入正文(建议200 - 1000字)"
          :rules="[{ required: true, message: '请输入正文' }]"
      />

    </van-cell-group>
    <van-cell-group>
      <van-cell title="板块分区">
        <van-space>
          <van-tag type="primary"
                   size="large"
                   plain
                   round
                   :color="selectedTag === tag ? '#F4606C' : 'black'"
                   :text-color="selectedTag === tag ? '#F4606C' : 'black'"
                   v-for="tag in tagList"
                   :key="tag"
                   @click="toggleTag(tag)"
          >
            {{ tag }}
          </van-tag>
        </van-space>
      </van-cell>
    </van-cell-group>
  </van-form>

</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";


const router = useRouter();
const selectedTag = ref<string>(''); // 用于跟踪当前选中的标签

const initFormData = {
  "tittle": "",
  "text": "",
  "topicTags": ""
};

const tagList = ref([
  "java",
  "python",
  "c++"
]);


const addBlogData = ref({...initFormData});


const onClickLeft = () => {
  router.back();
};

/**
 * 切换标签的选择状态
 * @param tag
 */
const toggleTag = (tag: string) => {
  if (selectedTag.value === tag) {
    // 如果已经是选中的标签，则取消选择
    selectedTag.value = '';
    addBlogData.value.topicTags = '';
  } else {
    // 否则选择该标签
    selectedTag.value = tag;
    addBlogData.value.topicTags = tag;
  }
};

const onClickRight = async () => {
  const res = await myAxios.post('/blog/add', {
    tittle: addBlogData.value.tittle,
    text: addBlogData.value.text,
    topicTags: addBlogData.value.topicTags
  });
  if (res?.code == 0) {
    showSuccessToast('创建博客成功');
    window.location.href = '/blog';
  } else {
    showFailToast('创建博客失败');
  }
};

</script>

<style scoped>

</style>