<template>
<div ref="popup" class="popup-container" :style="[display ? {'z-index': '1'} : {'z-index': '-1'}]">
  <transition name="popup-slide">
    <div v-if="show" class="popup-wrapper">
      <div class="icon" :class="status">
        <i v-if="status === 'error'" class="fas fa-times"></i>
        <i v-if="status === 'success'" class="fas fa-check"></i>
        <i v-if="qrCodeStatus" class="fad fa-qrcode"></i>
      </div>
      <div class="popup-content">
        <div class="contents">
          <div class="title">
            <p>{{ title }}</p>
          </div>
          <div v-if="qrCodeStatus || data" class="subtitle">
            <p>{{ message }}</p>
          </div>
          <div v-else ref="message" class="message">
            <p>{{ message }}</p>
          </div>
          <div v-if="qrCodeStatus && data" class="message">
            <QrCode v-if="qrCodeStatus" :url="data.url" />
          </div>
          <div v-if="data && data.type === 'gif'" class="gif">
            <img v-if="data.type === 'gif'" :src="data.url" alt="">
          </div>

        </div>
        <div class="exit-button-container">
          <div @click="emitHidePopupEvent()" class="exit-button">
            <span>{{ qrCodeStatus ? i18n('cancel') : "OK" }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import Utils from "../mixins/Utils";
import QrCode from "./QrCode";
import moment from "moment";

export default {
  name: "PopUp",
  mixins: [Utils],
  components: {
    "QrCode": QrCode
  },
  props: ["display", "status", "title", "message", "data", "duration"],
  data() {
    return {
      show: false,
      timeout: null,
    };
  },
  watch: {
    display(value) {
      this.show = value;
      if (this.duration && this.show) {
        console.log("Canceled at: " + moment().format("HH:mm:ss"))
        this.timeout = setTimeout(() => {
          console.log("Closing: " + moment().format("HH:mm:ss"))
          this.emitHidePopupEvent();
          console.log(this.timeout);
        }, this.duration);
      }
    }
  },
  computed: {
    qrCodeStatus() {
      return this.status === 'booking-qrcode';
    }
  },
  mounted() {
  },
  methods: {
    emitHidePopupEvent() {
      this.show = false;
      if (this.duration) {
        console.log("clear timeout", this.timeout)
        clearTimeout(this.timeout);
      }
      setTimeout(() => {
        this.qrCodeStatus ? this.$emit("cancelPopup") : this.$emit("hidePopup");
      }, 500);
    },
  }
}
</script>

<style scoped>
.popup-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  z-index: 2;
  background: rgba(18, 18, 18, 0.75);
}

.popup-wrapper {
  position: relative;
  background: #374874;
  width: fit-content;
  height: 70%;
  border-radius: 5px;
  padding: 30px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.contents {
  padding: 30px 30px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.icon-container {
  margin-bottom: 20%;
}

.icon {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 100px;
  height: 100px;
}

.icon > i {
  font-size: 3rem;
}

.error {
  background: #fd5236;
}

.success {
  background: #25e874;
}

.booking-qrcode {
  background: #171f34;
}

.title {
  text-align: center;
  padding: 5px;
}

.title > p {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
}

.subtitle {
  text-align: center;
}

.subtitle > p {
  font-size: 1rem;
  margin: 0;
}

.gif {
  width: 100%;
  height: 90%;
  border-radius: 5px;
  overflow: hidden;
}

.gif > img {
  object-fit: cover;
}

.message {
  display: flex;
  justify-content: center;
  max-width: 100%;
  height: 100%;
  margin-top: 10%;
  text-align: center;
  margin-bottom: 10px;
}

.exit-button-container {
  margin-top: auto;
}

.exit-button {
  width: fit-content;
  margin-left: auto;
  padding: 15px 20px;
  border-radius: 5px;
  background: #171f34;
  font-size: 20px;
}

.popup-slide-enter-active {
  transition: all 1s ease;
}
.popup-slide-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.popup-slide-enter, .popup-slide-leave-to {
  /*transform: translateY(100%);*/
  opacity: 0;
}

@media (orientation: portrait) {
  .popup-wrapper {
    width: 60%;
    height: 50%;
  }
}

</style>