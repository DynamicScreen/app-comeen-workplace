import moment from "moment";

export default function ({ ref, computed }) {
  const time = window.comeen_rooms.time || ref(moment());
  if (!window.comeen_rooms.time) window.comeen_rooms.time = time
  const currentTime = computed(() => time.value)

  function updateTimer() {
    time.value = moment();
  }
  function getHoursMinutes(time, clockFormat) {
    return clockFormat ==='24h' ? moment(time).format("HH:mm") : moment(time).format("hh:mm a");
  }

  return {
    time, currentTime,
    updateTimer, getHoursMinutes
  }
}
