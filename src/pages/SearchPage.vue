<template>
  <!--  添加搜索框-->
  <form action="/">
    <van-search
        v-model="SearchText"
        show-action
        placeholder="请输入搜索标签"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>
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
    <van-button block type="primary" @click="doSearchResult">搜索</van-button>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from "vue-router";

const router = useRouter();

const SearchText = ref('');

// 标签列表
const originTagList =[
  {
    text: '性别',
    children: [
      { text: '男', id: '男' },
      { text: '女', id: '女' },
    ],
  },
  {
    text: '年级',
    children: [
      { text: '大一', id: '大一' },
      { text: '大二', id: '大二' },
      { text: '大三', id: '大三' },
      { text: '大四', id: '大四' },
    ],
  },
  {
    text: '方向语言',
    children: [
      { text: 'Java', id: 'Java' },
      { text: 'C', id: 'C' },
      { text: 'C++', id: 'C++' },
      { text: 'Python', id: 'Python' },
    ],
  }
];

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

const doSearchResult = () => {
  router.push({
    path: '/user/list',
    query: {tags: activeIds.value}
  })
}
</script>

<style scoped>

</style>