import moment from "moment";

export default function ({ ref, computed }) {
  const time = ref(moment());
  const currentTime = computed(() => time.value)

  function updateTimer() {
    time.value = moment();
  }
  function getHoursMinutes(time, clockFormat) {
    return clockFormat ==='24h' ? moment(time).format("HH:mm") : moment(time).format("hh:mm a");
  }
  function checkInMeeting() {
    return null;
  }
  function updateLed() {
    return null;
  }

  return {
    time, currentTime,
    updateTimer, getHoursMinutes, checkInMeeting, updateLed
  }
}
