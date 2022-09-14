<template>
  <div class="booking-form">
    <div class="chevron left" @click="emitToggleOnFlyBookingEvent()">
    </div>
    <p class="title">{{ i18n("choose-the-duration") }}</p>
    <div class="durations">
      <div class="top-duration">
        <div class="duration-item" @click="setDurationTag('15m', !after15min)" :class="{'checked': duration === '15m', 'unavailable': after15min }">
          <div v-if="after15min" class="unavailable-icon">
            <i class="fad fa-hourglass-end"></i>
          </div>
          <span>{{ i18n("15min") }}</span>
        </div>
        <div class="duration-item" @click="setDurationTag('30m', !after30min)" :class="{'checked': duration === '30m', 'unavailable': after30min }">
          <div v-if="after30min" class="unavailable-icon">
            <i class="fad fa-hourglass-end"></i>
          </div>
          <span>{{ i18n("30min") }}</span>
        </div>
        <div class="duration-item" @click="setDurationTag('1h', !after60min)" :class="{'checked': duration === '1h', 'unavailable': after60min }">
          <div v-if="after60min" class="unavailable-icon">
            <i class="fad fa-hourglass-end"></i>
          </div>
          <span>{{ i18n("one-hour") }}</span>
        </div>
        <div class="duration-item" @click="setDurationTag('1h30', !after90min)" :class="{'checked': duration === '1h30', 'unavailable': after90min }">
          <div v-if="after90min" class="unavailable-icon">
            <i class="fad fa-hourglass-end"></i>
          </div>
          <span>1h30</span>
        </div>
      </div>
      <div>
        <div class="duration-item" @click="setDurationTag('until-next-hour', !afterEndOfHour)" :class="{'checked': duration === 'until-next-hour', 'unavailable': afterEndOfHour }">
          <div v-if="afterEndOfHour" class="unavailable-icon">
            <i class="fad fa-hourglass-end"></i>
          </div>
          <span>{{ i18n("until-the-end-of-the-hour") }}</span>
        </div>
      </div>
      <div>
        <div class="duration-item" @click="setDurationTag('until-next-meeting', firstEventTime)" :class="{'checked': duration === 'until-next-meeting', 'unavailable': !firstEventTime }">
          <div v-if="!firstEventTime" class="unavailable-icon">
            <i class="fad fa-hourglass-end"></i>
          </div>
          <span>{{ i18n("until-the-next-reservation") }} {{ timeLeftUntilNextEvent }}</span>
        </div>
      </div>
    </div>
    <div class="valid-booking-button" :class="{ 'disable': !duration }" @click="validate()">
      <p>{{ i18n("validate-booking") }}</p>
      <div class="valid-container">
        <div v-if="!requesting" class="valid">
        </div>
        <SpinnerLoader v-else/>
      </div>
    </div>
    <div class="out-duration-message" :class="{'appears-out-duration': hasOutDuration}">
      <div class="unavailable-icon">
        <i class="fad fa-hourglass-end"></i>
      </div>
      <span class="duration-message">{{ i18n("out-duration-message") }}</span>
    </div>
  </div>
</template>

<script>
import Utils from "../../mixins/Utils";
import SpinnerLoader from "../Animations/SpinnerLoader";
import moment from "moment";
import axios from "axios";

export default {
  name: "RoomBookForm",
  components: {
    "SpinnerLoader": SpinnerLoader
  },
  mixins: [Utils],
  props: ['firstEventTime', 'bookMeetingRoomUrl', 'clockFormat', 'options', 'meeting_room_id'],
  data() {
    return {
      duration: null,
      durationFormat: null,
      requesting: null
    }
  },
  mounted() {
  },
  watch: {
    duration(tag) {
      this.setSelectedDurationFormat(tag);
    },
    after15min(value) {
      if (value) {
        this.duration = null;
      }
    },
    after30min(value) {
      if (value) {
        this.duration = null;
      }
    },
    after60min(value) {
      if (value) {
        this.duration = null;
      }
    },
    after90min(value) {
      if (value) {
        this.duration = null;
      }
    },
    afterEndOfHour(value) {
      if (value) {
        this.duration = null;
      }
    },
  },
  computed: {
    firstEventFormat() {
      if (!this.firstEventTime) {
        return "--:--";
      }
      return this.clockFormat === '24h' ? this.firstEvent.format('HH:mm') : this.firstEvent.format('hh:mm')
    },
    firstEvent() {
      return moment(this.firstEventTime);
    },
    after15min() {
      return this.currentTime.clone().add(15, 'minutes').isAfter(this.firstEvent);
    },
    after30min() {
      return this.currentTime.clone().add(30, 'minutes').isAfter(this.firstEvent);
    },
    after60min() {
      return this.currentTime.clone().add(60, 'minutes').isAfter(this.firstEvent);
    },
    after90min() {
      return this.currentTime.clone().add(90, 'minutes').isAfter(this.firstEvent);
    },
    afterEndOfHour() {
      if (!this.firstEvent.isValid()) {
        return false;
      }
      let endOfHour = this.currentTime.clone().add(1, 'hours').set({minute: 0, second: 0});
      return !(endOfHour.isBefore(this.firstEvent) || endOfHour.isSame(this.firstEvent, 'hours') && endOfHour.isSame(this.firstEvent, 'minutes') && endOfHour.isSame(this.firstEvent, 'seconds'))
      // return !this.currentTime.clone().add(1, 'hours').set({minute: 0, second: 0}).isSameOrBefore(this.firstEvent);
    },
    timeLeftUntilNextEvent() {
      return this.firstEvent.isValid() ? "- " + this.currentTime.clone().from(this.firstEvent, true) : "";
    },
    hasOutDuration() {
      return this.after15min || this.after30min || this.after60min || this.after90min || this.afterEndOfHour;
    }
  },
  methods: {
    emitToggleOnFlyBookingEvent() {
      this.$emit('toggleOnFlyBooking');
    },
    setDurationTag(duration, isValid) {
      if (isValid) {
        this.duration = duration;
      }
    },
    setSelectedDurationFormat(duration) {
      switch (duration) {
        case '15m':
          this.durationFormat = this.currentTime.clone().add(15, 'minutes').utc().format();
          break;
        case '30m':
          this.durationFormat = this.currentTime.clone().add(30, 'minutes').utc().format();
          break;
        case '1h':
          this.durationFormat = this.currentTime.clone().add(60, 'minutes').utc().format();
          break;
        case '1h30':
          this.durationFormat = this.currentTime.clone().add(90, 'minutes').utc().format();
          break;
        case 'until-next-hour':
          this.durationFormat = this.currentTime.clone().add(1, 'hours').set({minute: 0, second: 0}).utc().format();
          break;
        case 'until-next-meeting':
          this.durationFormat = moment(this.firstEventTime).utc().format();
          break;
      }
    },
    validate() {
      if (this.duration) {
        const dateStart = this.currentTime.clone().utc().format();
        const dateEnd = this.durationFormat;
        if (this.options['authentication_book_required_action']) {
          this.authenticateBook();
        } else {
          this.bookingApiCall(dateStart, dateEnd);
        }
      }
    },
    authenticateBook() {
      this.requesting = true;

      this.$emit("displayPopup", {
        status: "booking-qrcode",
        title: this.i18n("booking"),
        message: this.i18n("scan-qrcode"),
        data: {
          type: "qrcode",
          url: "https://my.comeen.io/rooms/" + this.meeting_room_id + "?duration=" + this.duration,
        },
        duration: 30000
      });
    },
    bookingApiCall(dateStart, dateEnd) {
      this.requesting = true;
      axios.post(this.bookMeetingRoomUrl, {
        "title": this.i18n("on-the-fly-meeting"),
        "description": this.i18n("booked-from-this-display"),
        "date_start": dateStart,
        "date_end": dateEnd,
      }).then((response) => {
        let appointment = {
          start_time: dateStart,
          end_time: dateEnd,
          topic: this.i18n("on-the-fly-meeting"),
          organizer: this.i18n("booked-from-this-display"),
          organizer_email: "@resource.calendar.google.com",
          attendees: []
        };

        this.$emit('addAppointment', appointment);
      }).catch((error) => {
        this.$emit('displayPopup', {
          status: "error",
          title: this.i18n("popup-oops-title"),
          message: this.i18n("popup-oops-message"),
        });
      });
    }
  }
}
</script>

<style scoped>

.debug {
  position: absolute;
  line-break: anywhere;
  width: 100%;
  height: 100%;
  background: #10141e;
  color: white;
  font-size: 10px;
  padding: 20px;
}

.booking-form {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 30px;
  height: 100%;
  width: 100%;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.durations {
  display: flex;
  flex-direction: column;
  width: 80%;
}

.top-duration {
  display: flex;
  flex-direction: row;
}

.top-duration > .duration-item {
  width: 100%;
}

.duration-item {
  position: relative;
  display: flex;
  background: #181f33;
  padding: 15px;
  border-radius: 5px;
  height: 80px;
  margin: 5px;
  font-size: 1.5rem;
  align-items: center;
  justify-content: center;
  transition: all .5s ease;
}

.unavailable-icon {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -5px;
  right: -5px;
  font-size: 10px;
  background: #f1c40f;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  color: black;
}

.out-duration-message .unavailable-icon {
  position: inherit;
  display: inline-flex;
  margin-right: 5px;
}

.out-duration-message {
  overflow: hidden;
  height: 0;
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.appears-out-duration {
  animation: appears-out-duration 1s forwards;
}

@keyframes appears-out-duration {
  0% {
    height: 0;
  }

  100% {
    height: 40px;
  }
}

.duration-message {
  font-size: 1rem;
}

.unavailable {
  background: #1a1e2a;
  color: gray;
}

.disable {
  border: 3px solid #181f33 !important;
  color: #181f33 !important;
}

.disable > .valid-container {
  background: rgba(24, 31, 51, 0.3);
}

.disable .valid {
  border-bottom: 7px solid #181f33;
  border-right: 7px solid #181f33;
}

.valid-booking-button {
  display: flex;
  align-items: center;
  width: 65%;
  padding: 10px;
  border-radius: 5px;
  border: 3px solid #26e689;
  color: #26e689;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: bold;
}

.valid-booking-button > p {
  margin: 0 30px 0 15px;
}

.valid-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(38, 230, 137, 0.3);
  border-radius: 5px;
  margin-left: auto;
  width: 50px;
  height: 50px;
}

.valid {
  position: absolute;
  top: 12px;
  left: 20px;
  display: inline-block;
  margin-right: 14px;
  transform: rotate(45deg);
  border-radius: 3px;
  height: 24px;
  width: 12px;
  border-bottom: 7px solid #25e874;
  border-right: 7px solid #25e874;
}

.checked {
  box-shadow: inset 0px 0px 0px 6px #25e874;
}

.chevron::before {
  position: absolute;
  top: 3rem;
  margin-left: 3rem;
  border-style: solid;
  border-width: 0.25em 0.25em 0 0;
  content: '';
  display: inline-block;
  height: 1rem;
  width: 1rem;
  transform: rotate(-45deg);
  vertical-align: top;
  border-radius: 5px;
}

.chevron.left:before {
  left: 0.25em;
  transform: rotate(-135deg);
}

</style>