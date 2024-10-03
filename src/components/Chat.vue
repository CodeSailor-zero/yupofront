<template>
<!--  todo websocket 未完成 -->
  <van-nav-bar fixed left-arrow title="聊天室" @click-left="$router.go(-1)"/>
  <div class="chat-container">
    <div class="chat-messages" ref="messagesRef">
      <!-- 消息列表 -->
      <div v-for="(message, index) in messages" :key="index" :class="['message', { me: message.isMe }]">
        <div class="avatar" v-if="!message.isMe">
          <img :src="message.avatar" alt="Avatar">
        </div>
        <div class="message-content" :class="{ me: message.isMe }">
          <p>{{ message.text }}</p>
        </div>
        <div class="avatar" v-if="message.isMe">
          <img :src="message.avatar" alt="Avatar">
        </div>
      </div>
    </div>
    <div class="send-box">
      <van-field
          v-model="inputMessage"
          placeholder="输入消息"
          clearable
          @keyup.enter="sendMessage"
      />
      <van-button type="primary" round @click="sendMessage">发送</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import {useRoute} from "vue-router";

// 消息列表
const messages = ref([
  { text: '你好！', isMe: false, avatar: 'https://example.com/avatar.jpg' },
  { text: '嗨，很高兴见到你。', isMe: true, avatar: 'https://example.com/avatar.jpg' }
])

// 输入消息
const inputMessage = ref('')

// 消息容器引用
const messagesRef = ref(null)

//获取到当前用户
//获取路径中的friendId
const route = useRoute();
const friendId = route.query.friendId;
const userId = route.query.currentId;

// WebSocket连接
const socket = ref<WebSocket | null>()


// 发送消息
const sendMessage = () => {
  if (inputMessage.value.trim() === '') return
  messages.value.push({ text: inputMessage.value, isMe: true, avatar: 'https://example.com/avatar.jpg' })
  inputMessage.value = ''
  scrollToBottom()

  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    const message = {
      targetUserId: friendId, // 替换为目标用户的ID
      message: inputMessage.value
    };
    socket.value.send(JSON.stringify(message));
  }
}

// 滚动到最新消息
const scrollToBottom = () => {
  nextTick(() => {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  })
}

// 接收消息
const receiveMessage = (newMessage) => {
  messages.value.push(newMessage)
  scrollToBottom()
}

// 初始化WebSocket连接
const initWebSocket = () => {
  if (!socket.value) {
    socket.value = new WebSocket(`ws://localhost:8080/webSocketServer/${userId}`);
    socket.value.onopen = () => {
      console.log('WebSocket connected');
    };
    // socket.value.onclose = () => {
    //   console.log('WebSocket disconnected');
    // };
    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
      receiveMessage(data);
    };
    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
}

// 初始化时滚动到底部
onMounted(() => {
  initWebSocket()
  scrollToBottom()

  // 使用 Intersection Observer 监听滚动
  useIntersectionObserver(messagesRef, ([entry]) => {
    if (entry.isIntersecting) {
      scrollToBottom()
    }
  })
})

// // 示例：模拟接收新消息
// setTimeout(() => {
//   receiveMessage({ text: '这是新消息', isMe: false, avatar: 'https://example.com/avatar.jpg' })
// }, 3000)

</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  padding-top: 46px; /* 考虑到顶部导航栏的高度 */
  padding-bottom: 70px; /* 考虑到底部发送框的高度 */
  box-sizing: border-box;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f7f7f7;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.message-content {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  word-wrap: break-word;
  word-break: break-all;
}

.message-content.me {
  background-color: #dcf8c6;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 10px;
}

.message-content:not(.me) {
  background-color: #fff;
  margin-left: 10px;
  margin-right: auto;
}

.avatar {
  margin: 5px;
}

.avatar img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.send-box {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ebebeb;
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
}

.van-field {
  flex: 1;
  margin-right: 10px;
  border-radius: 20px;
  padding: 10px;
  border: none;
  background-color: #f5f5f5;
}

.van-button {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
}
</style>


