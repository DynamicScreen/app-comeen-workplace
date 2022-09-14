<script>
import moment from "moment";

export default {
  name: "Utils",
  data()  {
    return {
      time: moment(),
    }
  },
  mounted() {
    this.updateTimer()
    this.checkInMeeting();
    this.updateLed();
    this.refreshInterval = setInterval(() => {
      this.updateTimer()
      this.checkInMeeting();
      this.updateLed();
    }, 2000)
  },
  destroyed() {
    clearInterval(this.interval)
    if (this.refreshInterval != null) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  },
  computed: {
    currentTime() {
      return this.time;
    },
  },
  methods: {
    updateTimer() {
      moment.locale(this.$store.getters.settings.language);
      this.time = moment();
    },
    i18n(key) {
      return i18n(this.$store.getters.settings.language, key);
    },
    getHoursMinutes(time, clockFormat) {
      return clockFormat ==='24h' ? moment(time).format("HH:mm") : moment(time).format("hh:mm a");
    },
    checkInMeeting() {
      return null;
    },
    updateLed() {
      return null;
    }
  }
}
</script>
