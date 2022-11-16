import { VueInstance } from "@comeen/comeen-play-sdk-js";
import { defineComponent, h, TransitionGroup, withDirectives, PropType } from 'vue'
import useUtils from '../../useUtils'
import { Emitter } from 'mitt'

import s from './BookButton.module.scss'
import buttonSVG from '../../../assets/book_button.svg'

export default {
  name: "BookButton",
  props: {
    firstEventTime: { type: Object as PropType<any>, required: true },
    options: { type: Array as PropType<Array<any>>, required: true },
    clockFormat: { type: String, required: true },
    nextEventIncoming: { type: Object as PropType<any>, required: true },
    nextMeeting: { type: Object as PropType<any>, required: true },
    checkInAction: { type: Object as PropType<any>, required: true }

  },
  setup(props, { emit }) {
    const { ref, computed, onMounted, inject } = window.comeen_rooms.vue as VueInstance
    const t = window.comeen_rooms.t
    const emitter = inject('emitter') as Emitter<any>

    const requesting = ref(false);

    const { getHoursMinutes, currentTime } = useUtils({ ref: ref, computed: computed })

    function emitToggleOnFlyBookingEvent() {
      emit('toggleOnFlyBooking');
    }
    function popupCanceled() {
      requesting.value = false;
    }

    onMounted(() => {
      emitter.on('popupCanceled', popupCanceled)
    })

    return () => h('div', { class: s['book-button'] }, [
      (props.firstEventTime && !props.nextEventIncoming) ?
        h('p', `${t("available-until")} ${getHoursMinutes(props.firstEventTime, props.clockFormat)}`)
        : (
          props.nextEventIncoming ?
            h('div', { class: s['incoming-text'] }, [
              h('p', `${t("next-meeting-start-in")} ${props.firstEventTime ? currentTime.value.clone().from(props.firstEventTime, true) : ""}}`),
            ])
            : h('div', { class: s["title"] }, t("free-now"))
        ),

      (!props.options['disable_on_the_fly_booking'] && !props.nextEventIncoming) && h('div', { class: s['book-button-wrapper'] }, [
        h('div', { class: [s['dots'], s['pulse']], innerHTML: buttonSVG }),
        h('div', { onClick: emitToggleOnFlyBookingEvent, class: s['book'] }, t('book-now'))
      ])
    ].filter(e => e))
  }
}
