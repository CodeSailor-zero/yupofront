<template>
  <van-nav-bar title="修改标签页"
               left-arrow
               @click-left="onClickLeft"
  />

  <van-notice-bar color="red" left-icon="volume-o">
    至少选择一个标签！
  </van-notice-bar>


  <van-divider content-position="left">已选标签</van-divider>
  <div v-if="activeIds.length === 0">请选择标签</div>
  <van-row gutter="16" style="padding: 0 16px">
    <van-col v-for="tag in activeIds">
      <van-tag closeable size="small" type="primary" @close="doClose(tag)">
        {{ tag }}
      </van-tag>
    </van-col>

  </van-row>

  <van-divider content-position="left">选择标签</van-divider>
  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
  />

  <div style="padding: 20px">
    <van-button block type="primary" @click="doUpdateTags">修改</van-button>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {showSuccessToast} from "vant/es";

const router = useRouter();
const route = useRoute();
const SearchText = ref('');
const userId = route.query.editId;

// 标签列表
const originTagList = [
  {
    text: '年级',
    children: [
      {text: '大一', id: '大一'},
      {text: '大二', id: '大二'},
      {text: '大三', id: '大三'},
      {text: '大四', id: '大四'},
    ],
  },
  {
    text: '方向语言',
    children: [
      {text: 'Java', id: 'Java'},
      {text: 'C', id: 'C'},
      {text: 'C++', id: 'C++'},
      {text: 'Python', id: 'Python'},
    ],
  }
];

const onClickLeft = () => {
  router.back();
};


const tagList = ref(originTagList);
/**
 * 搜索过滤
 * @param val
 */
const onSearch = (val) => {
  // tagList.value = tagList.value.map(parentTag => {
  //   parentTag.children = parentTag.children.filter(item => item.text.includes(SearchText.value));
  //   return parentTag;
  // })

  //其他人的
  tagList.value = tagList.value.map(parentTag => {
    const tempChilderen = [...parentTag.children];
    const tempParentTag = {...parentTag};
    tempParentTag.children = tempChilderen.filter(item => item.text
        .includes(SearchText.value));
    return tempParentTag;
  });
};
const onCancel = () => {
  SearchText.value = '';
  tagList.value = originTagList;
};

// 已选中的标签
const activeIds = ref([]);
const activeIndex = ref(0);


// 移除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter(item => {
    return item !== tag;
  })
};

/**
 * 修改标签
 */
const doUpdateTags = async () => {
  if (activeIds.value.length === 0) {
    showSuccessToast('至少选择一个标签');
    return;
  }
  const res = await myAxios.post('/user/update', {
    id: userId,
    tags: JSON.stringify(activeIds.value)
  });
  if (res?.code === 0) {
    showSuccessToast('修改成功');
    await router.push({
      path: '/user',
      replace: true
    });
  } else {
    showSuccessToast('修改失败');
  }
}
</script>

<style scoped>

</style>