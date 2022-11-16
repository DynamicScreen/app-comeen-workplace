import SpinnerLoader from "./components/Animations/SpinnerLoader"
import SpinnerTransition from "./components/Animations/SpinnerTransition"
import axios from "axios";
import { defineComponent, h, PropType, Transition } from 'vue'
import moment from "moment";

import s from './MeetingRoomBooking.module.scss'
import useUtils from './useUtils'
import { IPublicSlide, VueInstance } from "@comeen/comeen-play-sdk-js";
import BookButton from "./components/Booking/BookButton";
import BookedRoom from "./components/Booking/BookedRoom";
import RoomBookForm from "./components/Booking/RoomBookForm";
import Appointments from "./components/Appointments/Appointments";

export default {
  name: 'MeetingRoomBooking',
  props: {
    slide : { type: Object as PropType<IPublicSlide>, required: true },
    inMeeting: { type: Boolean },
    hasMetadata: { type: Boolean },
    currentAppointment: { type: Object }
  },
  setup(props, { emit }) {
    const { ref, computed, watch, onMounted } = window.comeen_rooms.vue as VueInstance
    const t = window.comeen_rooms.t

    const date = ref(null)
    const interval = ref(0)
    const refreshInterval = ref(null)
    const displayRoomBookForm = ref(false)
    const loading = ref(false)
    const hasReleasedAppointment = ref(false)
    const popupDisplayed = ref(false);

    const { currentTime } = useUtils({ ref, computed })

    const clockFormat = computed(() => props.slide.data.clock_format)
    const options = computed(() => props.slide.data.slide_options)
    const appointmentsList = computed(() => {
      if (!currentTime.value || !props.hasMetadata) {
        return [];
      }
      return props.slide.data.appointments.map((appointment) => {
        if (!currentTime.value.isBetween(moment(appointment.start_time), moment(appointment.end_time))
            && !currentTime.value.isAfter(moment(appointment.start_time))) {
          return appointment;
        }
      }).filter(a => a);
    })
    const enableBookButton = computed(() => {
      return !props.inMeeting && !displayRoomBookForm.value && !loading.value;
    })
    const enableBookedRoom = computed(() => {
      return props.inMeeting && !displayRoomBookForm.value && !loading.value;
    })
    const enableRoomBookForm = computed(() => {
      return displayRoomBookForm.value && !props.inMeeting && !loading.value;
    })
    const firstEventTime = computed(() => {
      return appointmentsList.value.length ? appointmentsList.value[0].start_time : null;
    })
    const nextMeeting = computed(() => {
      return appointmentsList.value.length ? appointmentsList.value[0] : null;
    })
    const nextEventIncoming = computed(() => {
      return currentTime.value.clone().add(5, 'minutes').isAfter(firstEventTime.value);
    })

    function addAppointment(data) {
      // Create id of meeting from timestamp. This id will be reallocate by the webhook triggered by Comeen
      data.id = moment().unix();
      toggleOnFlyBooking();
      props.slide.data.appointments.push(data);
      loading.value = true;

      setTimeout(() => {
        loading.value = false;
      }, 3000);
    }
    function toggleOnFlyBooking() {
      displayRoomBookForm.value = !displayRoomBookForm.value;
    }
    function emitDisplayPopupEvent(payload) {
      popupDisplayed.value = true;
      emit("displayPopup", payload);
    }
    function releaseAppointment() {
      hasReleasedAppointment.value = true;
    }
    function emitHidePopupEvent() {
      emit("hidePopup");
    }

    watch(() => props.inMeeting, (after, before) => {
      console.log("in meeting changed", after, before, hasReleasedAppointment.value)
      displayRoomBookForm.value = false;
      if (popupDisplayed.value) {
        popupDisplayed.value = false;
        emitHidePopupEvent();
      }

      if (before && hasReleasedAppointment.value) {
        hasReleasedAppointment.value = false;
        emit("displayPopup", {
          status: "success",
          title: t("checked-out-title"),
          message: t("checked-out-message"),
          duration: 3000
        });
      }
    })

    return () => h('div', { class: s['comeen-main-booking-container'] }, [
      h('div', { class: [ s['book-container'], { [s['book-portrait-meeting-height']]: props.inMeeting, [s['book-portrait-free-height']]: !props.inMeeting && !displayRoomBookForm.value, [s['on-fly-booking-form']]: displayRoomBookForm.value } ] }, [
        // h(Transition, { name: 'slide', mode: 'out-in' }, [
          loading.value && h(SpinnerTransition, { title: t('loading'), key: '0' }),

          enableBookButton.value && h(BookButton, {
            onDisplayPopup: emitDisplayPopupEvent,
            onToggleOnFlyBooking: toggleOnFlyBooking,
            nextEventIncoming: nextEventIncoming.value,
            nextMeeting: nextMeeting.value,
            checkInAction: props.slide.data.check_in_meeting_signed_url,
            firstEventTime: firstEventTime.value,
            options: options.value,
            clockFormat: props.slide.data.clock_format,
            key: '1'
          }),

          enableBookedRoom.value && h(BookedRoom, {
            onDisplayPopup: emitDisplayPopupEvent,
            onReleaseAppointment: releaseAppointment,
            meetingRoomId: props.slide.data.meeting_room_id,
            currentTime: currentTime.value,
            appointment: props.currentAppointment,
            options: options.value,
            checkInAction: props.slide.data.check_in_meeting_signed_url,
            checkOutAction: props.slide.data.check_out_meeting_signed_url,
            clockFormat: props.slide.data.clock_format,
            key: '2'
          }),

          enableRoomBookForm.value && h(RoomBookForm, {
            onToggleOnFlyBooking: toggleOnFlyBooking,
            onAddAppointment: addAppointment,
            onDisplayPopup: emitDisplayPopupEvent,
            clockFormat: clockFormat.value,
            firstEventTime: firstEventTime.value,
            options: options.value,
            meeting_room_id: props.slide.data.meeting_room_id,
            key: '3'
          })
        // ])
      ]),

      h('div', { class: s['appointments-container'] }, [
        h(Appointments, { appointments: appointmentsList.value, options: options.value, clockFormat: clockFormat.value })
      ])
    ])
  }
}
