import { VueInstance } from "@comeen/comeen-play-sdk-js";
import { defineComponent, h, TransitionGroup, withDirectives, PropType } from 'vue'
import useUtils from '../../useUtils'
import moment from 'moment'
import axios from "axios";
import { Emitter } from 'mitt'

import s from './BookedRoom.module.scss'
import SpinnerLoader from "../Animations/SpinnerLoader";
import { request } from "http";

export default {
  name: "BookedRoom",
  props: {
    meetingRoomId: { type: Number, required: true },
    options: { type: Array as PropType<Array<any>>, required: true },
    appointment: { type: Object as PropType<any>, required: true },
    clockFormat: { type: String, required: true },
    checkInAction: { type: Object as PropType<any>, required: true },
    checkOutAction: { type: Object as PropType<any>, required: true },
    isOnTheFlyMeeting: { type: Boolean, required: true }
  },
  setup(props, { emit }) {
    const { ref, computed, onMounted, inject, watch } = window.comeen_rooms.vue as VueInstance
    const t = window.comeen_rooms.t
    const slide = window.comeen_rooms.slide
    const emitter = inject('emitter') as Emitter<any>

    const { currentTime, getHoursMinutes } = useUtils({ ref: ref, computed: computed })

    const logos = ref([])
    const counts = ref([])
    const requesting = ref(false)

    onMounted(() => {
      emitter.on('popupCanceled', popupCanceled)
    })

    const progressValue = computed(() => {
      let start = moment(props.appointment.start_time);
      let end = moment(props.appointment.end_time);
      let current = currentTime.value;

      // @ts-ignore
      return Math.round((current - start) / (end - start) * 100);
    })
    const meetingRoomStatus = computed(() => {
      return props.appointment.meeting_room_status;
    })

    watch(meetingRoomStatus, () => requesting.value = false)

    function checkIn() {
      requesting.value = true;
      console.log(props.options, props.options['authentication_check_in_out_required_action'])
      if (props.options['authentication_check_in_out_required_action']) {
        authenticateCheckInOut("checkin");
      } else {
        slide.context.callRemoteMethod('check-in', {
          'booking_id': props.appointment.booking_id
        }).then().catch(() => {
          requesting.value = false;
          emit('displayPopup', {
            status: "error",
            title: t("popup-oops-title"),
            message: t("popup-oops-message"),
          });
        });
      }
    }
    function checkOut() {
      requesting.value = true;
      if (props.options['authentication_check_in_out_required_action']) {
        authenticateCheckInOut("checkout");
      } else {
        slide.context.callRemoteMethod('check-out', {
          'booking_id': props.appointment.booking_id
        }).then(() => {
          emit("releaseAppointment");
        }).catch(() => {
          requesting.value = false;
          emit('displayPopup', {
            status: "error",
            title: t("popup-oops-title"),
            message: t("popup-oops-message"),
          });
        });
      }
    }
    function authenticateCheckInOut(action) {
      emit("displayPopup", {
        status: "booking-qrcode",
        title: t(action + "-qrcode-title"),
        message: t("scan-qrcode"),
        data: {
          type: "qrcode",
          url: "https://my.comeen.io/rooms/" + props.meetingRoomId + "?action=" + action,
        },
        duration: 30000
      });
    }
    function popupCanceled() {
      requesting.value = false;
    }

    return () => h('div', { class: s['booked-room'] }, [
      h('div', { class: s['scroll'] }, [
        h('div', { class: s['scrollBar'] , style: { width: progressValue.value + '%' } })
      ]),
      h('div', { class: s['meeting-time'] }, [
        h('p', getHoursMinutes(props.appointment.start_time, props.clockFormat)),
        h('p', getHoursMinutes(props.appointment.end_time, props.clockFormat))
      ]),

      h('div', { class: s['details'] }, [
        !props.options['hide_meeting_name'] ?
          h('h1', { class: s['title'] }, props.appointment.topic)
          : h('h1', { class: s['title'] }, t('booked')),

        props.appointment.topic === t('on-the-fly-meeting') ?
          h('p', { class: s['comeen-secondary'], innerHTML: `${t('booked-from-this-display')}&nbsp;&nbsp;<i class="fad fa-paper-plane"></i>` })
          : ((!props.options['hide_organizer'] && props.appointment.organizer) && h('p', { class: s['comeen-secondary'] }, `${t('organized-by')} ${props.appointment.organizer}`)),

        (!props.options['hide_company_logos'] && logos.value.length) && h('div', { class: s['compagny-container'] }, [
          h('p', { class: s['comeen-secondary'] }, t('with')),
          h('div', { class: 'company-logos' }, [
            logos.value.forEach(logo => h('div', { class: 'company-logo' }, [
              h('img', { src: 'https://logo.clearbit.com/' + logo, alt: '' }),
              counts.value[logo] > 1 && h('span', { class: 'company-count' }, counts.value[logo])
            ]))
          ])
        ])
      ].filter(e => e)),

      (!props.options['disable_cancel_meeting_from_screen'] && !meetingRoomStatus.value) && h('div', { class: s['waiting-button'] }, [
        h('p', t('loading')),
        h('div', { class: s['waiting-container'] }, h(SpinnerLoader))
      ]),

      (!props.options['disable_cancel_meeting_from_screen'] && meetingRoomStatus.value === 'booked') && h('div', { class: s['check-in-button'], onClick: () => !requesting.value ? checkIn() : {} }, [
        h('p', t('check-in')),
        h('div', { class: s['valid-container'] }, [
          !requesting.value ?
            h('div', { class: s['valid'] })
            : h(SpinnerLoader)
        ])
      ]),

      (!props.options['disable_cancel_meeting_from_screen'] && meetingRoomStatus.value === 'checked_in') && h('div', { class: s['check-out-button'], onClick: () => !requesting.value ? checkOut() : {} }, [
        h('p', t('check-out')),
        h('div', { class: s['close-container'] }, [
          !requesting.value ?
            h('div', { class: s['close'] })
            : h(SpinnerLoader)
        ])
      ]),

      meetingRoomStatus.value === 'checked_out' && h('div', { class: s['released-button'] }, [
        h('p', t('meeting-finished')),
        h('div', { class: s['close-container'] }, h(SpinnerLoader))
      ])
    ])
  }
}
