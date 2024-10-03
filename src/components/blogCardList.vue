<template>
  <van-card v-for="blog in props.blogList" :key="blog.blogId">
    <template #title>
      <h2 @click="toBlogDetailPage(blog.blogId)" class="blog-title">
        {{ blog.tittle }}
      </h2>
    </template>

    <template #desc>
      <div class="blog-desc">
        <van-space align="center" style="padding: 1px;">
          <van-image
              width="25px"
              height="25px"
              round
              :src="blog.createUser.avatarUrl"
          />
          <span class="username" style="font-weight: bold; font-size: 15px;">
            {{ blog.createUser.username }}
          </span>
        </van-space>
      </div>
    </template>

    <template #price>
      <div class="blog-content">
        <van-text-ellipsis
            rows="1"
            :content="blog.text"
            style="font-weight: normal; font-size: 15px;"
        />
      </div>
      <div class="blog-icons">
        <van-space :size="30">
          <van-icon
              name="good-job-o"
              size="20px"
              color="#A9A9A9"
              @click="ThumbsUp(blog)"
          >
            <span class="icon-text">{{ blog.startNum }}</span>
          </van-icon>

          <van-icon
              name="chat-o"
              size="20px"
              color="#A9A9A9"
          >
            <span class="icon-text">{{ blog.remarkNum }}</span>
          </van-icon>
        </van-space>
      </div>
    </template>

    <template #footer>
      <van-tag v-if="blog.topicTags.length > 0" class="blog-tag" type="primary" color="#8B7500">
        {{ blog.topicTags }}
      </van-tag>
      <br/>

      <div v-if="change">
        <van-button round type="primary" size="small" style="margin-top: 5px;" @click="toUpdateBlog(blog)">
          修改
        </van-button>
        <van-button round type="danger" size="small" style="margin-top: 5px;" @click="deleteBlog(blog.blogId)">
          删除
        </van-button>
      </div>

    </template>

  </van-card>
</template>


<script setup lang="ts">
import {useRouter} from "vue-router";
import {BlogType} from "../models/blog";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant/es";

const router = useRouter();


interface blogCardListProps {
  change: boolean;
  blogList: BlogType[];
}

const props = withDefaults(defineProps<blogCardListProps>(), {
  //@ts-ignore
  blogList: [] as BlogType[]
});


/**
 * 删除博客
 */
const deleteBlog = async (blogId: number) => {
  const res = await myAxios.post(`/blog/delete?blogId=${blogId}`);
  if (res?.code == 0 && res?.data) {
    showSuccessToast('删除成功');
    window.location.reload();
  } else {
    showFailToast('删除失败');
  }
}



/**
 * 跳转到修改博客页面
 */
const toUpdateBlog = (blog : BlogType) => {
  router.push({
    path: '/update/blog',
    query: {
      blogId: blog.blogId,
      tittle: blog.tittle,
      text: blog.text,
      topicTags: blog.topicTags,
    },
  });
};

/**
 * 点赞博客
 */
const ThumbsUp = async (blog: BlogType) => {
  const res = await myAxios.post(`/blog/thumbsup/${blog.blogId}`);
  if (res?.code == 0) {
    showSuccessToast('点赞成功');
    blog.startNum = res.data;
  } else {
    showFailToast('请勿重复给文章点赞');
  }
};

/**
 * 跳转博客详情页
 * @param blogId
 */
const toBlogDetailPage = (blogId: number) => {
  router.push({
    path: '/blog/detail',
    query: {
      blogId: blogId
    }
  });
};


</script>

<style scoped>

.blog-title {
  font-size: 18px; /* 增大标题字体大小 */
  cursor: pointer;
}

.blog-desc {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.username {
  margin-left: 5px;
}

.blog-content {
  margin-top: 5px;
}

.blog-icons {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.icon-text {
  font-size: 12px;
  margin-left: 5px;
}

.blog-tag {
  margin-top: 5px;
}

</style>