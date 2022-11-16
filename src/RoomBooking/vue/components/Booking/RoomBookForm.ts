import { VueInstance } from "@comeen/comeen-play-sdk-js";
import { defineComponent, h, TransitionGroup, withDirectives, PropType } from 'vue'
import useUtils from '../../useUtils'
import moment from 'moment'
import axios from "axios";
import { Emitter } from 'mitt'

import s from './RoomBookForm.module.scss'
import SpinnerLoader from "../Animations/SpinnerLoader";

export default {
  name: "RoomBookForm",
  props: {
    firstEventTime: { type: Object as PropType<any>, required: true },
    clockFormat: { type: String, required: true },
    options: { type: Array as PropType<Array<any>>, required: true },
    meeting_room_id: { type: String, required: true }
  },
  setup(props, { emit }) {
    const { ref, computed, onMounted, inject, watch } = window.comeen_rooms.vue as VueInstance
    const t = window.comeen_rooms.t
    const slide = window.comeen_rooms.slide
    const emitter = inject('emitter') as Emitter<any>

    const { currentTime } = useUtils({ ref, computed })

    const duration = ref(null)
    const durationFormat = ref<string | null>(null)
    const requesting = ref(false)

    const firstEventFormat = computed(() => {
      if (!props.firstEventTime) {
        return "--:--";
      }
      return props.clockFormat === '24h' ? props.firstEvent.format('HH:mm') : props.firstEvent.format('hh:mm')
    })
    const firstEvent = computed(() => moment(props.firstEventTime))
    const after15min = computed(() => currentTime.value.clone().add(15, 'minutes').isAfter(firstEvent.value))
    const after30min = computed(() => currentTime.value.clone().add(30, 'minutes').isAfter(firstEvent.value))
    const after60min = computed(() => currentTime.value.clone().add(60, 'minutes').isAfter(firstEvent.value))
    const after90min = computed(() => currentTime.value.clone().add(90, 'minutes').isAfter(firstEvent.value))
    const afterEndOfHour = computed(() => {
      if (!firstEvent.value.isValid()) {
        return false;
      }
      let endOfHour = currentTime.value.clone().add(1, 'hours').set({minute: 0, second: 0});
      return !(endOfHour.isBefore(firstEvent.value) || endOfHour.isSame(firstEvent.value, 'hours') && endOfHour.isSame(firstEvent.value, 'minutes') && endOfHour.isSame(firstEvent.value, 'seconds'))
    })
    const timeLeftUntilNextEvent = computed(() => firstEvent.value.isValid() ? "- " + currentTime.value.clone().from(firstEvent.value, true) : "")
    const hasOutDuration = computed(() => after15min.value || after30min.value || after60min.value || after90min.value || afterEndOfHour.value)

    function emitToggleOnFlyBookingEvent() {
      emit('toggleOnFlyBooking');
    }
    function setDurationTag(_duration, isValid) {
      if (isValid) {
        duration.value = _duration;
      }
    }
    function setSelectedDurationFormat(_duration) {
      switch (_duration) {
        case '15m':
          durationFormat.value = currentTime.value.clone().add(15, 'minutes').utc().format();
          break;
        case '30m':
          durationFormat.value = currentTime.value.clone().add(30, 'minutes').utc().format();
          break;
        case '1h':
          durationFormat.value = currentTime.value.clone().add(60, 'minutes').utc().format();
          break;
        case '1h30':
          durationFormat.value = currentTime.value.clone().add(90, 'minutes').utc().format();
          break;
        case 'until-next-hour':
          durationFormat.value = currentTime.value.clone().add(1, 'hours').set({minute: 0, second: 0}).utc().format();
          break;
        case 'until-next-meeting':
          durationFormat.value = moment(props.firstEventTime).utc().format();
          break;
      }
    }
    function validate() {
      if (duration.value) {
        const dateStart = currentTime.value.clone().utc().format();
        const dateEnd = durationFormat.value;
        if (props.options['authentication_book_required_action']) {
          authenticateBook();
        } else {
          bookingApiCall(dateStart, dateEnd);
        }
      }
    }
    function authenticateBook() {
      requesting.value = true;

      emit("displayPopup", {
        status: "booking-qrcode",
        title: t("booking"),
        message: t("scan-qrcode"),
        data: {
          type: "qrcode",
          url: "https://my.comeen.io/rooms/" + props.meeting_room_id + "?duration=" + duration.value,
        },
        duration: 30000
      });
    }
    function bookingApiCall(dateStart, dateEnd) {
      requesting.value = true;

      slide.context.callRemoteMethod('book-room', {
        "meeting_room_id": props.meeting_room_id,
        "title": t("on-the-fly-meeting"),
        "description": t("booked-from-this-display"),
        "date_start": dateStart,
        "date_end": dateEnd,
      }).then(() => {
        let appointment = {
          start_time: dateStart,
          end_time: dateEnd,
          topic: t("on-the-fly-meeting"),
          organizer: t("booked-from-this-display"),
          organizer_email: "@resource.calendar.google.com",
          attendees: []
        };

        emit('addAppointment', appointment);
      }).catch(() => {
        emit('displayPopup', {
          status: "error",
          title: t("popup-oops-title"),
          message: t("popup-oops-message"),
        });
      })
    }

    watch(duration, (tag) => setSelectedDurationFormat(tag))
    watch([after15min, after30min, after60min, after90min, afterEndOfHour], (value) => { if(value) duration.value = null })

    return () => h('div', { class: s['booking-form'] }, [
      h('div', { class: [s['chevron'], s['left']], onClick: emitToggleOnFlyBookingEvent }),
      h('p', { class: s['title'] }, t('choose-the-duration')),
      h('div', { class: s['durations'] }, [
        h('div', { class: s['top-duration'] }, [
          h('div', { class: [s['duration-item'], {[s['checked']]: duration.value === '15m', [s['unavailable']]: after15min.value }], onClick: () => setDurationTag('15m', !after15min.value) }, [
            after15min.value && h('div', { class: s['unavailable-icon'] }, h('i', { class: 'fad fa-hourglass-end' })),
            h('span', t('15min'))
          ]),
          h('div', { class: [s['duration-item'], {[s['checked']]: duration.value === '30m', [s['unavailable']]: after30min.value }], onClick: () => setDurationTag('30m', !after30min.value) }, [
            after30min.value && h('div', { class: s['unavailable-icon'] }, h('i', { class: 'fad fa-hourglass-end' })),
            h('span', t('30min'))
          ]),
          h('div', { class: [s['duration-item'], {[s['checked']]: duration.value === '1h', [s['unavailable']]: after60min.value }], onClick: () => setDurationTag('1h', !after60min.value) }, [
            after60min.value && h('div', { class: s['unavailable-icon'] }, h('i', { class: 'fad fa-hourglass-end' })),
            h('span', t('one-hour'))
          ]),
          h('div', { class: [s['duration-item'], {[s['checked']]: duration.value === '1h30', [s['unavailable']]: after90min.value }], onClick: () => setDurationTag('1h30', !after90min.value) }, [
            after90min.value && h('div', { class: s['unavailable-icon'] }, h('i', { class: 'fad fa-hourglass-end' })),
            h('span', '1h30')
          ]),
        ]),

        h('div', [
          h('div', { class: [s['duration-item'], {[s['checked']]: duration.value === 'until-next-hour', [s['unavailable']]: afterEndOfHour.value }], onClick: () => setDurationTag('until-next-hour', !afterEndOfHour.value) }, [
            afterEndOfHour.value && h('div', { class: s['unavailable-icon'] }, h('i', { class: 'fad fa-hourglass-end' })),
            h('span', t('until-the-end-of-the-hour'))
          ]),
        ]),

        h('div', [
          h('div', { class: [s['duration-item'], {[s['checked']]: duration.value === 'until-next-meeting', [s['unavailable']]: props.firstEventTime }], onClick: () => setDurationTag('until-next-meeting', !props.firstEventTime) }, [
            props.firstEventTime && h('div', { class: s['unavailable-icon'] }, h('i', { class: 'fad fa-hourglass-end' })),
            h('span', t('until-the-next-reservation'))
          ]),
        ])
      ]),

      h('div', { class: [s['valid-booking-button'], { [s['disable']]: !duration.value }], onClick: validate }, [
        h('p', t('validate-booking')),
        h('div', { class: s['valid-container'] }, [
          !requesting.value ?
            h('div', { class: s['valid'] })
            : h(SpinnerLoader)
        ])
      ]),

      h('div', { class: [s['out-duration-message'], {'appears-out-duration': hasOutDuration.value}] }, [
        h('div', { class: s['unavailable-icon'] }, h('i', { class: 'fad fa-hourglass-end' })),
        h('span', { class: s['duration-message'] }, t('out-duration-message'))
      ])
    ])
  }
}
