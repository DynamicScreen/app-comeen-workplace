import useUtils from '../useUtils'
import { VueInstance } from "@comeen/comeen-play-sdk-js";
import QRCodeStyling from "qr-code-styling";

import s from './QRCode.module.scss'

export default {
  name: "QRCode",
  props: ['url'],
  setup(props) {
    const { ref, computed, onMounted, h } = window.comeen_rooms.vue as VueInstance

    const { currentTime, getHoursMinutes } = useUtils({ ref: ref, computed: computed })

    const qrCodeContainer = ref<HTMLDivElement>()
    const qrCode = ref<HTMLDivElement>()

    onMounted(() => {
      if (qrCodeContainer.value) {
        const qc = new QRCodeStyling({
          width: qrCodeContainer.value.clientWidth,
          height: qrCodeContainer.value.clientHeight,
          type: "svg",
          data: props.url,
          image: '',
          dotsOptions: {
            color: "#000",
            type: "classy"
          },
          backgroundOptions: {
            color: "#FFF",
          },
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 20
          },
          cornersSquareOptions: {
            type: "square"
          }
        });

        qc.append(qrCode.value);
      }
    })

    return () => h('div', {
      class: s['qrcode-container'],
      ref: qrCodeContainer
    }, [
      h('div', { class: 'qrcode', ref: qrCode })
    ])
  }
}
