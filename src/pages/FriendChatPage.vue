<template >
  <div class="wrapper" >
    <div class="abs cover container">
      <div class="abs cover pnl">
        <div class="top pnl-head" style="padding: 20px ; color: white;">
          <div id="userName" v-if="my">
            当前用户：{{ my.username }}
            <span style="float: right;color: green;font-size: 20px" v-if="isOnline">在线</span>
            <span style="float: right;color: red;font-size: 20px" v-else>离线</span>
          </div>

          <div id="chatMes" v-show="chatMes" style="text-align: center;color: #6fbdf3;font-family: 新宋体,serif">
            正在和 {{ toName }} 聊天
          </div>
        </div>
        <!--聊天区开始-->
        <div class="abs cover pnl-body" id="pnlBody">
          <div class="abs cover pnl-left" id="initBackground" style="background-color: white; width: 100%">
            <div class="abs cover pnl-left" id="chatArea" v-show="isShowChat">
              <div class="abs cover pnl-message scroll" id="show">
                <div class="pnl-list" v-for="message in historyMessage">

                  <!-- 消息展示区域 -->
                  <!--对方在聊天框的左边-->
                  <!--todo 头像展示问题-->
                  <div class="msg guest" v-if="!message.isFromMe">
                    <div class="msg-left">
                      <div class="msg-host photo">
                        <van-image round width="35px" height="35px" :src="friendValue?.avatarUrl" class="avatar"/>
                      </div>
                      <div class="msg-ball">
                        {{ message.message }}
                      </div>
                    </div>
                  </div>
                  <!--自己在聊天框的右边-->
                  <div class="msg host" v-else>
                    <div class="msg-right">
                      <div class="msg-host photo">
                        <van-image round width="35px" height="35px" :src="my?.avatarUrl" class="avatar"/>
                      </div>
                      <div class="msg-ball">
                        {{ message.message }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="abs bottom pnl-text">
                <div class="abs cover pnl-input">
                            <textarea class="scroll" id="context_text"
                                      @keyup.enter="submit" wrap="hard"
                                      placeholder="在此输入文字信息..."
                                      v-model="sendMessage.message">
                            </textarea>
                  <div class="abs auto-complete-pnl scroll hide">
                    <ul class="auto-complete"></ul>
                  </div>
                </div>

                <div class="abs br pnl-btn" id="submit" @click="submit"
                     style="background-color: rgb(32, 196, 202); color: rgb(255, 255, 255);">
                  发送
                </div>
              </div>
            </div>

            <!--聊天区 结束-->
            <div class="abs right pnl-right">
              <div class="slider-container hide"></div>
              <div class="pnl-right-content">
                <div class="pnl-tabs">
                  <div class="tab-btn active" id="hot-tab">好友列表</div>
                </div>
                <div class="pnl-hot">
                  <ul class="rel-list unselect">
                    <li class="rel-item" v-for="friend in friendsList">
                      <a @click="showChat(friend)">
                        <van-space>
                          <van-image round height="40px" width="40px" :src="friend?.avatarUrl" class="avatar"/>
                          <div class="name">{{ friend?.username }}</div>
                        </van-space>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="pnl-right-content">
                <div class="pnl-tabs">
                  <div class="tab-btn active">系统广播</div>
                </div>
                <div class="pnl-hot">
                  <div class="rel-list unselect" id="broadcastList">
                    <div class="rel-item" v-for="name in systemMessages">
                      您的好友 {{ name }} 已上线
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import {showToast} from "vant/es";
import {getCurrentUser} from "../service/user";
import myAxios from "../plugins/myAxios";
import {UserType} from "../models/user";




//websocket对象
const webSocket = ref()
//是否显示聊天区域
const isShowChat = ref(false)
//是否显示正在和谁聊天
const chatMes = ref(false)
//是否在线
const isOnline = ref(true)
//当前用户的名字
const username = ref('')
//要聊天的好友的名字
const toName = ref('')
//当前的用户
const my = ref<UserType>();

//好友列表
const friendsList = ref([])
//历史消息列表
const historyMessage = ref([])
//系统广播
const systemMessages = ref([])
// 定义消息对象
interface Message {
  fromName: string;
  message: string;
  isFromMe: boolean; // 新增字段，标识是否来自当前用户
}
//发送的消息的包装
const sendMessage = ref({
  toName: '',
  message: ''
})

const init = async () => {
  //创建websocket的对象
  webSocket.value = new WebSocket("ws://localhost:8080/api/chat");
  webSocket.value.open = onOpen;
  //接受到后端的消息触发
  webSocket.value.onmessage = onMessage;
  webSocket.value.onclose = onClose;
};

const onOpen = () => {
  console.log("连接成功");
  isOnline.value = true;
}

const onClose = () => {
  console.log("连接关闭");
  isOnline.value = false;
  retryConnection();
}


/**
 * websocket 重连
 */
const retryConnection = () => {
  setTimeout(() => {
    console.log('Retrying WebSocket connection...');
    init();
  }, 5000); // 5秒后重试
}

onMounted(() => {
  init();
});

onUnmounted(() => {
  if (webSocket.value && webSocket.value.readyState === WebSocket.OPEN) {
    webSocket.value.close();
  }
});

const onMessage = (event) => {
  // 解析消息 event.data是后端发送过来的消息对象
  //这里需要将他转化为一个Json 对象
  const response = JSON.parse(event.data);
  console.log('接受到后端的消息', response);

  if (response.isSystem) {
    //好友的名字
    let names = response.message;
    systemMessages.value = [];
    // friendsList.value = [];
    for (let i = 0; i < names.length; i++) {
      if (names[i] !== my.value?.username) {
        // friendsList.value.push(names[i]);
        systemMessages.value.push(names[i]);
      }
    }
  } else {
    //非系统消息
    let history = sessionStorage.getItem(response.fromName);
    if (!history) {
      historyMessage.value = [];
    }
    // 添加 isFromMe 字段
    const message = {
      fromName: response.fromName,
      message: response.message,
      isFromMe: response.fromName === my.value?.username
    };

    historyMessage.value.push(message);
    sessionStorage.setItem(response.fromName, JSON.stringify(historyMessage.value));
  }
}

onMounted(() => {
  init();
  getCurrentUser().then(user => {
    my.value = user;
  }
);
  getFriendList();
});

const getFriendList = async () => {
  const res = await myAxios.post("/friends/list");
  if (res?.code === 0) {
    friendsList.value = res?.data;
  }
}

const friendValue = ref<UserType>();
const showChat = (friend) => {
  //可以获取当前用户的信息
  friendValue.value = friend;

  toName.value = friend.username;

  //清空聊天区的消息
  let history = sessionStorage.getItem(toName.value);
  if (!history) {
    historyMessage.value = [];
  } else {
    historyMessage.value = JSON.parse(history);
  }

  // 展示聊天对话框
  isShowChat.value = true

  //显示正在和谁聊天的文字
  chatMes.value = true;


}

const submit = () => {
  //去除空格
  sendMessage.value.message = sendMessage.value.message.trim();
  // 判断是否为输入文字，没有则提示
  if (!sendMessage.value.message) {
    showToast("请输入要发送的消息");
    return
  }

  sendMessage.value.toName = toName.value;


  historyMessage.value.push({
    fromName: my.value.username,
    message: sendMessage.value.message,
    isFromMe: true
  });
  sessionStorage.setItem(toName.value, JSON.stringify(historyMessage.value));

  //发送消息
  webSocket.value.send(JSON.stringify(sendMessage.value))
  //发送完毕，清空输入框
  sendMessage.value.message = '';
}
</script>

<style scoped>
@import "../css/chat.css";
@import "../css/bootstrap.min.css";

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2) repeat;
}

.guest-name {
  margin-left: 1%;
  font-size: 12px;
}

.hostname {
  font-size: 12px;
  margin-bottom: -2%;
  text-align: right;
}
</style>