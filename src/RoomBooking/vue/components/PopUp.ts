import useUtils from '../useUtils'
import { VueInstance } from "@comeen/comeen-play-sdk-js";
import moment from "moment";

import s from './PopUp.module.scss'
import QRCode from './QRCode';

export default {
  name: "PopUp",
  props: ["display", "status", "title", "message", "data", "duration"],
  setup(props, { emit }) {
    const { ref, computed, onMounted, watch, h } = window.comeen_rooms.vue as VueInstance
    const t = window.comeen_rooms.t

    const show = ref(false)
    const timeout = ref<number | null>(null)

    const qrCodeStatus = computed(() => props.status === 'booking-qrcode')

    watch(() => props.display, (value: boolean) => {
      console.log("wath props display")
      show.value = value
      if (props.duration && show.value) {
        console.log("Canceled at: " + moment().format("HH:mm:ss"))
        timeout.value = window.setTimeout(() => {
          console.log("Closing: " + moment().format("HH:mm:ss"))
          emitHidePopupEvent();
          console.log(timeout.value);
        }, props.duration);
      }
    })

    function emitHidePopupEvent() {
      show.value = false;
      if (props.duration && timeout.value) {
        console.log("clear timeout", timeout.value)
        clearTimeout(timeout.value);
      }
      setTimeout(() => {
        qrCodeStatus.value ? emit("cancelPopup") : emit("hidePopup");
      }, 500);
    }

    return () => h('div', { class: s['popup-container'], style: props.display ? {'z-index': '1'} : {'z-index': '-1'} }, [
      // h(Transition, { name: 'popup-slide' }, [
        show.value && h('div', { class: s['popup-wrapper'] }, [
          h('div', { class: [ s['icon'], s[props.status] ] }, [
            props.status === 'error' && h('i', { class: 'fas fa-times' }),
            props.status === 'success' && h('i', { class: 'fas fa-check' }),
            qrCodeStatus.value && h('i', { class: 'fad fa-qrcode' })
          ]),

          h('div', { class: s['popup-content'] }, [
            h('div', { class: s['contents'] }, [
              h('div', { class: s['title'] }, h('p', props.title)),
              (qrCodeStatus.value || props.data) ?
                h('div', { class: s['subtitle'] }, h('p', props.message))
                : h('div', { class: s['message'] }, h('p', props.message)),

              (qrCodeStatus.value || props.data) && h('div', { class: s['message'] }, [
                h(QRCode, { url: props.data.url })
              ]),

              props.data && props.data.type === 'gif' && h('div', { class: s['gif'] }, [
                h('img', { src: props.data.url })
              ])
            ]),

            h('div', { class: s['exit-button-container'] }, [
              h('div', { onClick: emitHidePopupEvent, class: s['exit-button'] }, [
                h('span', qrCodeStatus.value ? t('cancel') : 'OK')
              ])
            ])
          ])
        ])
      // ])
    ])
  }
}
