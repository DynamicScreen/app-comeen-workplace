import { h, PropType } from 'vue'

import s from './BaseComponent.module.scss'
import useUtils from './useUtils'
import {
  ISlideContext,
  IPublicSlide,
  SlideModule,
  VueInstance,
  LedColors
} from "@comeen/comeen-play-sdk-js";
import mitt from 'mitt'

import MeetingRoomSetup from "./MeetingRoomSetup";
import MeetingRoomBooking from "./MeetingRoomBooking";
import MeetingRoomError from "./MeetingRoomError.vue";
import PopUp from "./components/PopUp";
import moment from 'moment'

export default {
  name: 'BaseComponent',
  props: {
    slide : { type: Object as PropType<IPublicSlide>, required: true }
  },
  setup(props, { emit }) {
    const { ref, computed, reactive, onMounted, onUnmounted, provide } = window.comeen_rooms.vue
    const t = window.comeen_rooms.t
    const context = window.comeen_rooms.context as ISlideContext

    const emitter = mitt()
    provide('emitter', emitter)

    const slide = reactive(props.slide) as IPublicSlide;

    const date = ref(null)
    const inMeeting = ref(false)
    const currentAppointment = ref(null)
    const interval = ref(0)
    const refreshInterval = ref(null)
    const isNextEventIncoming = ref(null)
    const isPopupDisplayed = ref(false)
    const popupStatus = ref(null)
    const popupTitle = ref(null)
    const popupMessage = ref(null)
    const popupData = ref(null)
    const popupDuration = ref(null)
    const requesting = ref(false)

    const { currentTime, updateTimer, getHoursMinutes } = useUtils({ ref, computed })
    console.log(slide);
    const hasMetadata = computed(() => slide.data.hasMetadata)
    const hasError = computed(() => slide.data.error || null)
    const clockFormat = computed(() => slide.data.clock_format)
    const appointments = computed(() => slide.data.appointments)
    const pageType = computed(() => {
      if (hasError.value) {
        return "error"
      }

      if (!hasMetadata.value) {
        context.manageLEDs().then(ability => ability.turnOn(LedColors.orange))
        // if ("askToTurnOnOrangeLed" in window.$host) {
          // TODO: window.$host.askToTurnOnOrangeLed();
        // }
      }

      return hasMetadata.value ? "booking" : "setup";
    })
    const component = computed(() => {
      switch(pageType.value) {
        case 'setup': return MeetingRoomSetup
        case 'booking': return MeetingRoomBooking
      }
      return MeetingRoomSetup
    })
    const headerStatus = computed(() => {
      if ((inMeeting.value && pageType.value === 'booking') || hasError.value) {
        return 'red';
      } else if (isNextEventIncoming.value) {
        return 'orange'
      } else if (pageType.value === 'booking' && !inMeeting.value) {
        return 'green';
      } else if (pageType.value === 'setup') {
        return 'yellow';
      }
    })

    const getTimeFormatted = (format) => {
      return !currentTime.value ? '-' : currentTime.value.format(format);
    }

    function checkInMeeting() {
      if (!hasMetadata.value || hasError.value) {
        return;
      }

      if (appointments.value.length === 0) {
        inMeeting.value = false;
      }

      const hasCurrentAppointment = appointments.value.some((appointment) => {
        if (appointment.meeting_room_status != 'checked_out' && moment().isBetween(moment(appointment.start_time), moment(appointment.end_time))) {
          inMeeting.value = true;
          currentAppointment.value = Object.assign({}, currentAppointment.value, appointment)
          return true;
        }
      });

      if (!hasCurrentAppointment) {
        inMeeting.value = false;
        currentAppointment.value = null;
      }
    }

    const reload = () => {
      console.log("RELOAD")
      requesting.value = true;
      slide.context.callRemoteMethod('webhook-update-display', {
        calendar: {
          meeting_room: {
            id: slide.data.meeting_room_id
          }
        }
      }).then(res => {
        requesting.value = false;
      }).catch();
    }

    function displayPopup(payload) {
      isPopupDisplayed.value = true;
      popupStatus.value = payload.status;
      popupTitle.value = payload.title;
      popupMessage.value = payload.message;
      popupData.value = payload.data;
      popupDuration.value = payload.duration;
    }
    function hidePopup() {
      isPopupDisplayed.value = false;
    }
    function cancelPopup() {
      isPopupDisplayed.value = false;
      emitter.emit('popupCanceled');
    }
    function nextEventIncoming(value) {
      isNextEventIncoming.value = value;
    }

    function updateLed() {
      if (inMeeting.value) {
        context.manageLEDs().then(ability => ability.turnOn(LedColors.red))
      } else if (isNextEventIncoming.value) {
        context.manageLEDs().then(ability => ability.turnOn(LedColors.orange))
      } else {
        context.manageLEDs().then(ability => ability.turnOn(LedColors.green))
      }
    }

    onMounted(() => {
      updateTimer();
      checkInMeeting();
      updateLed();

      refreshInterval.value = setInterval(() => {
        updateTimer()
        checkInMeeting();
        updateLed();
      }, 2000)
    })
    onUnmounted(() => {
      // clearInterval(interval.value)
      if (refreshInterval.value != null) {
        clearInterval(refreshInterval.value);
        refreshInterval.value = null;
      }
    })

    return () => h('div', { class: s['container'] }, [
      h('div', { class: s['slide-content'] }, [
        h('div', { class: s['meeting-room'] }, [
          h('div', { class: [ s['header'], s[`${headerStatus.value}-header`]] }, [
            hasMetadata.value ?
              h('div', { class: s['location'] }, [
                h('p', { class: s['comeen-secondary'] }, [
                  slide.data.meeting_room_building_name,
                  slide.data.meeting_room_building_name && h('span', ' -'),
                  t('floor'),
                  slide.data.floor
                ]),
                h('p', { class: s['comeen-primary'] }, slide.data.meeting_room_name)
              ])
              : h('div', { class: 'logo' }, [
                // h('img', { src: require('./assets/logo-comeen.svg') })
              ]),

            (hasMetadata.value && !hasError.value && slide.data.slide_options['manual_reload']) && h('div', { class: s['reload'], onClick: () => reload() }, [
              h('i', { class: ['fad fa-sync-alt', { spin: requesting.value }]})
            ]),

            h('div', { class: s['time'] }, [
              h('div', [
                h('p', { class: [ s['comeen-secondary'], s['text-end'] ] }, getTimeFormatted('ll')),
                h('p', { class: [s['comeen-primary'], s['text-end'], 'p-0'] }, [
                  h('i', { class: [s['comeen-fa-small'], 'far fa-clock'] }),
                  clockFormat.value === '24h' ? getTimeFormatted('HH:mm') : getTimeFormatted('hh:mm'),
                  h('small', { class: s['small-text'] }, getTimeFormatted('a' ))
                ])
              ])
            ])
          ]),

          h('div', { class: s['component-container'] }, [
            h(PopUp, {
              display: isPopupDisplayed.value,
              onHidePopup: hidePopup,
              onCancelPopup: cancelPopup,
              status: popupStatus.value,
              title: popupTitle.value,
              message: popupMessage.value,
              data: popupData.value,
              duration: popupDuration.value
            }),

            h(component.value, {
              key: 'booking',
              slide: slide,
              hasMetadata: hasMetadata.value,
              inMeeting: inMeeting.value,
              currentAppointment: currentAppointment.value,
              onDisplayPopup: displayPopup,
              onHidePopup: hidePopup,
              onNextEventIncoming: nextEventIncoming
            })
          ])
        ])
      ])
    ])
  }
}
