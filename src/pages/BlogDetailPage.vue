<template>
  <div class="blog-container" v-if="blog">
    <div class="blog-header">

      <h2 class="break-word">{{ blog.tittle }}</h2>

      <div v-if="blog.createUser" class="user-info">
        <van-space align="center" style="padding: 1px;">
          <van-image
              weight="35px"
              height="35px"
              round
              :src="blog.createUser.avatarUrl"
          />
          <div>
            <span class="username bold">{{ blog.createUser.username }}</span><br/>
            <span class="create-time">{{ blog.createTime }}</span>
          </div>
          <van-button hairline square size="small" color="#87CEFA" @click="doFollow">关注</van-button>
        </van-space>
      </div>
    </div>

    <van-divider
        hairline="false"
        :style="{ color: '#808080', borderColor: '#808080', padding: '0 20px' }"
    />
    <br/>

    <div class="blog-content">
      <div class="blog-text" style="margin-top: 20px;">
        <p v-for="paragraph in formattedText" :key="paragraph">
          {{ paragraph }}
        </p>
      </div>
    </div>
    <br/>

    <van-divider
        hairline="false"
        :style="{ color: '#808080', borderColor: '#808080', padding: '0 20px' }"
    />
  </div>
  <br/>



  <!--  评论区-->

  <div class="blog-container" v-if="blog">
    <div class="comment-title">
      <van-space align="center" style="padding: 1px;">
        <span style="font-size: 20px;">评论</span>
        <span>{{ remarkList.length }}</span>
      </van-space>
    </div>

    <div class="comments">
      <van-cell-group v-for="remark in remarkList" :key="remark.id">
        <van-cell v-if="remark">
          <template #title>
            <van-space align="center" style="padding: 1px;">
              <van-image
                  weight="30px"
                  height="30px"
                  round
                  :src="remark.remarkUser.avatarUrl"
                  @click="$router.push({ path: '/friend/info', query: { friendId: remark.remarkUser.id } })"
              />
              <span class="username bold" style="color: lightpink; font-size: 15px;">{{
                  remark.remarkUser.username
                }}</span>
            </van-space>
          </template>

          <template #label>
            <span style="color: black; font-size: 15px;">{{ remark.remark }}</span><br/><br/>

            <van-space :size="10">
              <div>
                <van-space :size="5">
                  <van-icon :name="like" size="20px" color="#A9A9A9" @click="ThumbsUpRemark(remark)"/>
                  <span style="font-size: 15px;">{{ remark.remarkNum }}</span>
                </van-space>
              </div>

              <!--              <div>-->
              <!--                <van-space :size="5">-->
              <!--                  <van-icon :name="concellike" size="20px" color="#A9A9A9"/>-->
              <!--                  <span style="font-size: 15px;">{{ 0 }}</span>-->
              <!--                </van-space>-->
              <!--              </div>-->
            </van-space>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="comment-form">
      <van-cell-group inset>
        <van-field
            type="textarea"
            rows="1"
            autosize
            v-model="commentText"
            placeholder="写下你的评论..."
            label-align="left"
        />
      </van-cell-group>
      <div class="button-container">
        <van-button type="primary" size="small" @click="submitComment">发表评论</van-button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import myAxios from "../plugins/myAxios";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showFailToast, showSuccessToast} from "vant/es";
import {BlogType} from "../models/blog";
import concellike from "../assets/concellike.svg";
import like from "../assets/like.svg";


const route = useRoute();
const router = useRouter();
const blogId = route.query.blogId;
const blog = ref<BlogType>(); // 初始化为 null
const formattedText = ref<string[]>([]);
const value = ref('');
const remarkList = ref<string[]>([]);
const commentText = ref('');






/**
 * 点赞评论
 */
const ThumbsUpRemark = async (remark) => {
  const res = await myAxios.post('/blog/thumbsup/remark', {
    userId: remark?.remarkUser?.id,
    blogId: blog?.value?.blogId,
    remark: remark.remark
  });
  if (res?.code === 0) {
    showSuccessToast('点赞成功');
    remark.remarkNum = res.data;
  } else {
    showFailToast(res.description);
  }
}

/**
 * 关注功能，添加为好友
 */
const doFollow = async () => {
  const res = await myAxios.post('/friends/add', {
    receivedId: blog?.value?.createUser?.id
  });
  if (res?.code === 0) {
    showSuccessToast('关注成功');
  } else {
    showFailToast(res.description);
  }
};


/**
 * 发布评论
 * todo 实时刷新评论区，可以使用 WebSocket 实现
 */
const submitComment = async () => {
  const res = await myAxios.post('/blog/remark', {
    blogId: blogId,
    remark: commentText.value
  });
  if (res?.code === 0) {
    showSuccessToast('评论成功');
    // 在这里获取最新的评论列表
    await getRemarkList();
    remarkList.value.push(res.data);

    // 清空评论输入框
    commentText.value = '';
  } else {
    showFailToast('评论失败');
  }
};


/**
 * 获取评论列表
 */
const getRemarkList = async () => {
  // 异步更新数据
  const res = await myAxios.get(`/blog/get/remark/${blogId}`);
  if (res?.code == 0 && res?.data) {
    showSuccessToast('获取评论成功');
    const remarksWithNum = res.data.map(remark => ({
      ...remark,
      remarkNum: remark.remarkNum || 0
    }));
    // remarkList.value = res.data;
    remarkList.value = remarksWithNum
  } else {
    showFailToast('获取评论失败');
  }
};


/**
 * 获取当前点击后博客
 */
const getBlog = async () => {
  const res = await myAxios.get(`/blog/get/${blogId}`);
  if (res?.code == 0 && res?.data) {
    showSuccessToast('获取博客成功');
    await getRemarkList();
    blog.value = res.data;
    formatText(res.data.text);
  } else {
    showFailToast('获取博客失败');
  }
}

/**
 * 格式化文本，按段落分割
 * @param text 原始文本
 */
const formatText = (text: string) => {
  // 使用正则表达式分割文本，确保每段之间有至少两个换行符
  const paragraphs = text.split(/\n{1,}/).filter(paragraph => paragraph.trim() !== '');
  formattedText.value = paragraphs;
};

const blogList = ref<BlogType[]>([]);
const getFriendBlog = async () => {
  const res = await myAxios.get('/blog/recommend');
  if (res?.code === 0) {
    showSuccessToast('获取推荐博客成功');
    blogList.value = res.data;
    blogList.value.forEach(blog => {
      formatText(blog.text);
    })
  } else {
    showFailToast('获取推荐博客失败');
  }
}

onMounted(getBlog);
onMounted(getFriendBlog);

</script>

<style scoped>
.blog-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.blog-recommend {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgb(237, 229, 229);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(255, 247, 247, 0.87);
}

.blog-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 10px; /* 添加间隔 */
}

.username {
  font-size: 16px;
  font-weight: bold;
}

.create-time {
  font-size: 14px;
  color: #666;
}

.blog-content {
  margin-top: 20px;
}

.blog-text {
  margin-top: 20px;
}

.comments {
  margin-top: 20px;
}

.comment-form {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.van-cell-group {
  width: 100%;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  width: 100%;
}

.van-button--primary {
  width: 100%;
}

.van-button--primary:hover {
  background-color: #1989fa;
}


</style>