import SpinnerLoader from "./components/Animations/SpinnerLoader"
import SpinnerTransition from "./components/Animations/SpinnerTransition"
import axios from "axios";
import { defineComponent, h, PropType, Transition } from 'vue'
import moment from "moment";

import s from './MeetingRoomBooking.module.scss'
import useUtils from './useUtils'
import { IPublicSlide, VueInstance } from "@comeen/comeen-play-sdk-js";
// import BookButton from "./components/Booking/BookButton";
// import BookedRoom from "./components/Booking/BookedRoom";
import Appointments from "./components/Appointments/Appointments";

export default defineComponent({
  props: {
    slide : { type: Object as PropType<IPublicSlide>, required: true },
    vue: { type: Object as PropType<VueInstance>, required: true },
    inMeeting: { type: Boolean },
    hasMetadata: { type: Boolean },
    currentAppointment: { type: Object }
  },
  setup(props) {
    const { ref, computed } = props.vue

    const date = ref(null)
    const interval = ref(0)
    const refreshInterval = ref(null)
    const displayRoomBookForm = ref(false)
    const loading = ref(false)
    const hasReleasedAppointment = ref(false)

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

    return () => h('div', { class: s['comeen-main-booking-container'] }, [
      h('div', { class: [ s['book-container'], { [s['book-portrait-meeting-height']]: props.inMeeting, [s['book-portrait-free-height']]: !props.inMeeting && !displayRoomBookForm.value, [s['on-fly-booking-form']]: displayRoomBookForm.value } ] }, [
        h(Transition, { name: 'slide', mode: 'out-in' }, [
          loading.value && h(SpinnerTransition, { title: 'loading' }),
        ].filter(e => e))
      ]),

      h('div', { class: s['appointments-container'] }, [
        h(Appointments, { appointments: appointmentsList.value, options: options.value, clockFormat: clockFormat.value })
      ])
    ])
  }
})
