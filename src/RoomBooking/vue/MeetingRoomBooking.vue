<template>
  <div class="comeen-main-booking-container">
    <div class="book-container" :class="{'book-portrait-meeting-height': inMeeting, 'book-portrait-free-height': !inMeeting && !displayRoomBookForm, 'on-fly-booking-form': displayRoomBookForm}" >
      <transition name="slide" mode="out-in">
        <SpinnerTransition v-if="loading"
                 :title="i18n('loading')" :key="0"/>

        <BookButton v-if="enableBookButton"
                    @displayPopup="emitDisplayPopupEvent"
                    @toggleOnFlyBooking="toggleOnFlyBooking"
                    :nextEventIncoming="nextEventIncoming"
                    :nextMeeting="nextMeeting"
                    :checkInAction="slide.data.check_in_meeting_signed_url"
                    :firstEventTime="firstEventTime" :options="options"
                    :clock-format="slide.data.clock_format" :key="1"/>

        <BookedRoom v-else-if="enableBookedRoom"
                    @displayPopup="emitDisplayPopupEvent"
                    @releaseAppointment="releaseAppointment"
                    :meetingRoomId="slide.data.meeting_room_id"
                    :image="slide.data.image" :currentTime="currentTime"
                    :appointment="currentAppointment" :options="options"
                    :checkInAction="slide.data.check_in_meeting_signed_url"
                    :checkOutAction="slide.data.check_out_meeting_signed_url"
                    :clock-format="slide.data.clock_format" :key="2"/>

        <RoomBookForm v-else-if="enableRoomBookForm" @toggleOnFlyBooking="toggleOnFlyBooking"
                      @addAppointment="addAppointment" @displayPopup="emitDisplayPopupFromFormEvent"
                      :bookMeetingRoomUrl="slide.data.book_meeting_room_signed_url"
                      :clockFormat="clockFormat"
                      :firstEventTime="firstEventTime"
                      :options="options"
                      :meeting_room_id="slide.data.meeting_room_id"
                      :key="3"/>
      </transition>
    </div>
    <div class="appointments-container">
      <Appointments :appointments="appointmentsList" :options="options" :clockFormat="clockFormat"/>
    </div>
  </div>
</template>

<script>
import Utils from "./mixins/Utils";
import BookButton from "./components/Booking/BookButton";
import BookedRoom from "./components/Booking/BookedRoom";
import Appointments from "./components/Appointments/Appointments";
import moment from 'moment';
import RoomBookForm from "./components/Booking/RoomBookForm";
import SpinnerTransition from "./components/Animations/SpinnerTransition"

export default {
  name: "MeetingRoomBooking",
  components: {
    "RoomBookForm": RoomBookForm,
    "BookButton": BookButton,
    "BookedRoom": BookedRoom,
    "Appointments": Appointments,
    "SpinnerTransition": SpinnerTransition,
  },
  mixins: [Utils],
  props: ['slide', 'hasMetadata', 'inMeeting', 'currentAppointment'],
  data() {
    return {
      date: null,
      interval: 0,
      refreshInterval: null,
      displayRoomBookForm: false,
      loading: false,
      hasReleasedAppointment: false,
    }
  },
  watch: {
    inMeeting(after, before) {
      this.displayRoomBookForm = false;
      if (this.popupDisplayed) {
        this.popupDisplayed = false;
        this.emitHidePopupEvent();
      }

      if (before && this.hasReleasedAppointment) {
        this.hasReleasedAppointment = false;
        this.$emit("displayPopup", {
          status: "success",
          title: this.i18n("checked-out-title"),
          message: this.i18n("checked-out-message"),
          duration: 3000
        });
      }
    },
    nextEventIncoming() {
      this.emitNextEventIncoming();
    }
  },
  mounted() {
    this.emitNextEventIncoming();
  },
  created() {
    this.$parent.$on('popupCanceled', this.emitPopupCanceled);
  },
  computed: {
    enableBookButton() {
      return !this.inMeeting && !this.displayRoomBookForm && !this.loading;
    },
    enableBookedRoom() {
      return this.inMeeting && !this.displayRoomBookForm && !this.loading;
    },
    enableRoomBookForm() {
      return this.displayRoomBookForm && !this.inMeeting && !this.loading;
    },
    clockFormat() {
      return this.slide.data.clock_format;
    },
    options() {
      return this.slide.data.slide_options;
    },
    appointmentsList() {
      if (!this.currentTime || !this.hasMetadata) {
        return [];
      }
      return this.slide.data.appointments.map((appointment) => {
        if (!this.currentTime.isBetween(moment(appointment.start_time), moment(appointment.end_time))
            && !this.currentTime.isAfter(moment(appointment.start_time))) {
          return appointment;
        }
      }).filter(a => a);
    },
    firstEventTime() {
      return this.appointmentsList.length ? this.appointmentsList[0].start_time : null;
    },
    nextMeeting() {
      return this.appointmentsList.length ? this.appointmentsList[0] : null;
    },
    nextEventIncoming() {
      return this.currentTime.clone().add(5, 'minutes').isAfter(this.firstEventTime);
    }
  },
  methods: {
    toggleOnFlyBooking() {
      this.displayRoomBookForm = !this.displayRoomBookForm;
    },
    addAppointment(data) {
      // Create id of meeting from timestamp. This id will be reallocate by the webhook triggered by Comeen
      data.id = moment().unix();
      this.toggleOnFlyBooking();
      this.slide.data.appointments.push(data);
      this.loading = true;

      setTimeout(() => {
        this.loading = false;
      }, 3000);
    },
    releaseAppointment() {
      this.hasReleasedAppointment = true;
    },
    emitDisplayPopupEvent(payload) {
      this.popupDisplayed = true;
      this.$emit("displayPopup", payload);
    },
    emitDisplayPopupFromFormEvent(payload) {
      this.toggleOnFlyBooking();
      this.popupDisplayed = true;
      this.$emit("displayPopup", payload);
    },
    emitHidePopupEvent() {
      this.$emit("hidePopup");
    },
    emitPopupCanceled() {
      this.$emit('popupCanceled');
    },
    emitNextEventIncoming() {
      this.$emit('nextEventIncoming', this.nextEventIncoming);
    }
  }
}
</script>

<style scoped>
/********
* Main
********/

.slide-leave-active,
.slide-enter-active {
  transition: all .5s ease-in-out;
}
.slide-leave, .slide-enter-to {
  opacity: 1;
}
.slide-leave-to, .slide-enter {
  opacity: 0;
}


.comeen-main-booking-container {
  display: flex;
  flex-flow: row;
  flex: 1;
}

.book-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  min-width: 60%;
}

.appointments-container {
  position: relative;
  width: 35%;
  min-width: 35%;
  background: #171f34;
  scrollbar-width: auto;
  scrollbar-color: #0b0f1e rgba(255, 255, 255, 0);
}

/* Chrome, Edge, and Safari */
.appointments-container::-webkit-scrollbar {
  width: 10px;
  background: rgba(255, 255, 255, 0);
}

.appointments-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0);
}

.appointments-container::-webkit-scrollbar-thumb {
  background-color: #0b0f1e;
  border-radius: 10px;
  border: 3px solid rgba(255, 255, 255, 0);
}

.book-portrait-meeting-height {
  height: 100%;
}

.book-portrait-free-height {
  height: 100%;
}

@media (orientation: portrait) {
  .comeen-main-booking-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .book-container {
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
    flex-grow: 0;
    transition: height 1s ease;
  }

  .book-portrait-meeting-height {
    height: 50%;
  }

  .book-portrait-free-height {
    height: 40%
  }

  .on-fly-booking-form {
    height: 50%;
  }

  .appointments-container {
    width: 100%;
    flex: 1;
    padding: 30px;
  }

}

</style>