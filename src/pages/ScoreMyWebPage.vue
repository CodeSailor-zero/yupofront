<template>
  <div class="rating-page">
    <van-rate
        v-model="score"
        :max="5"
        color="#ffd21e"
        @change="onScoreChange"
    />
    <van-button type="primary" @click="submitRating">提交</van-button>
    <transition name="fade">
      <div v-if="showResult" class="result-container">
<!--        <sapn> {{remark}}</sapn>-->
        <van-image :src="resultGif" width="400px" height="400px" fit="scale-down" alt="Result GIF" class="result-gif" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {showSuccessToast} from "vant/es";

const score = ref(0);
const showResult = ref(false);
const resultGif = ref('');
const remark = ref('');

const onScoreChange = (newScore: number) => {
  console.log('Current score:', newScore);
};

const submitRating = () => {
  if (score.value >= 4) {
    resultGif.value = 'https://pic1.zhimg.com/50/v2-302c9750130b4c523105738071ee2022_720w.gif?source=1940ef5c';
    remark.value = '谢谢你对我网站的评价';
  } else {
    resultGif.value = 'https://www.bing.com/th/id/OGC.0b8875624e8222b332adb461ca594b19?pid=1.7&rurl=https%3a%2f%2fpic2.zhimg.com%2fv2-0b8875624e8222b332adb461ca594b19_b.gif&ehk=dHBujb6Plo2H9A6Z8Q4yHKR3mgTACXFj4Gfz744eku0%3d';
    remark.value = '感谢你的评价';
  }
  showResult.value = true;
  showSuccessToast('评分成功！');
};
</script>

<style scoped>
.rating-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.result-container {
  display: flex;
  justify-content: center;
}

.result-gif {
  width: 200px;
  height: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
   