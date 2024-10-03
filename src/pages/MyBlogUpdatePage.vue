<template>
  <van-nav-bar
      title="我的博客修改页"
      left-arrow
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
          v-model="updateBlogData.tittle"
          name="name"
          placeholder="请输入完整的帖子标题(5-31个字)"
          :rules="[{ required: true, message: '请输入标题' }]"
      />

      <van-field
          v-model="updateBlogData.text"
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
                   v-for="tag in tagList"
                   :color="selectedTag === tag ? '#F4606C' : 'black'"
                   :text-color="selectedTag === tag ? '#F4606C' : 'black'"
                   :key="tag"
                   @click="toggleTag(tag)"
          >
            {{ tag }}
          </van-tag>
        </van-space>
      </van-cell>
    </van-cell-group>
  </van-form>
  {{selectedTag}}
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";


const route = useRoute();
const router = useRouter();
const blogId = route.query.blogId
const tittle = route.query.tittle;
const text = route.query.text;
const topicTags = route.query.topicTags;

const selectedTag = ref(topicTags); // 用于跟踪当前选中的标签

const updateBlogData = ref({
  tittle: tittle,
  text: text,
  topicTags: topicTags
});

const tagList = ref([
  "java",
  "python",
  "c++"
]);

const onClickLeft = () => {
  router.back();
};




/**
 * 修改博客
 */
const onClickRight = async () => {
  const res = await myAxios.post('/blog/update', {
    blogId: blogId,
    tittle: updateBlogData.value.tittle,
    text: updateBlogData.value.text,
    topicTags: updateBlogData.value.topicTags
  });
  if (res?.code == 0 && res?.data) {
    showSuccessToast('修改博客成功');
    window.location.href = '/my/blog';
  } else {
    showFailToast('修改博客失败');
  }
};

/**
 * 切换标签的选择状态
 * @param tag
 */
const toggleTag = (tag: string) => {
  if (selectedTag.value === tag) {
    // 如果已经是选中的标签，则取消选择
    selectedTag.value = '';
    updateBlogData.value.topicTags = '';
  } else {
    // 否则选择该标签
    selectedTag.value = tag;
    updateBlogData.value.topicTags = tag;
  }
};



</script>

<style scoped>

</style>