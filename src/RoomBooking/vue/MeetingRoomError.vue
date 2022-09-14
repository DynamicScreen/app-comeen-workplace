<template>
  <div class="error-message">
    <div class="message">
      <i class="fad fa-exclamation-triangle"></i>
      <p>{{ i18n(type) }}</p>
    </div>
  </div>
</template>

<script>
import Utils from "./mixins/Utils";

export default {
  name: "MeetingRoomError",
  mixins: [Utils],
  props: ['slide'],
  computed: {
    type() {
      return this.slide.data.type;
    }
  },
}
</script>

<style scoped>
.error-message {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.message {
  background: #171f34;
  border-radius: 5px;
  padding: 30px;
  width: 50%;
  text-align: center;
}

.message p {
  font-size: 2rem;
}

.message i {
  font-size: 3rem;
  margin-right: 30px;
  color: #fd5236;
}
</style>