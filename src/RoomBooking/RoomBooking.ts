import {
  ISlideContext,
  IPublicSlide,
  SlideModule,
  VueInstance
} from "@comeen/comeen-play-sdk-js";

import { nextTick } from 'vue';

import MeetingRoomSetup from "./vue/MeetingRoomSetup";
import MeetingRoomBooking from "./vue/MeetingRoomBooking";
import MeetingRoomError from "./MeetingRoomError.vue";
import PopUp from "./components/PopUp.vue";
import moment from "moment";
import useUtils from "./vue/useUtils";
import './css/style.scss'

export default class RoomBookingSlideModule extends SlideModule {
  constructor(context: ISlideContext) {
    super(context);
  }

  async onReady() {
    return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideContext) {
const en = require("/home/scleriot/Dev/dynamicscreen/app-server/storage/apps//app-comeen-workplace/0.2.0/languages/en.json");
const fr = require("/home/scleriot/Dev/dynamicscreen/app-server/storage/apps//app-comeen-workplace/0.2.0/languages/fr.json");
const translator: any = this.context.translator;
translator.addResourceBundle('en', 'room-booking', en);
translator.addResourceBundle('fr', 'room-booking', fr);
this.t = (key: string, namespace: string = 'room-booking') => translator.t(key, {ns: namespace});

    const { h, reactive, ref, computed } = vue;

    // @ts-ignore
    console.log("comp", MeetingRoomSetup)

    const slide = reactive(props.slide) as IPublicSlide;
    this.context = reactive(props.slide.context);

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

    const { currentTime, updateTimer, getHoursMinutes, checkInMeeting, updateLed } = useUtils({ ref, computed })
    console.log(slide);
    const hasMetadata = computed(() => slide.data.hasMetadata)
    const pageType = computed(() => {
      // if (hasError) {
      //   return "error"
      // }

      // if (!hasMetadata) {
      //   if ("askToTurnOnOrangeLed" in window.$host) {
      //     window.$host.askToTurnOnOrangeLed();
      //   }
      // }

      return hasMetadata.value ? "booking" : "setup";
    })

    const headerStatus = computed(() => {
      if ((inMeeting.value && pageType.value === 'booking') /*|| this.hasError*/) {
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

    // const url = ref(slide.data.url);

    this.context.onPrepare(async () => {
    });

    this.context.onReplay(async () => {
    });

    this.context.onPlay(async () => {
    });

    this.context.onPause(async () => {
    });
    this.context.onResume(async () => {
    });

    this.context.onEnded(async () => {
    });

    return {
      template: require('./vue/BaseComponent.cmn').default,
      data: {
        date,
        inMeeting,
        currentAppointment,
        interval,
        refreshInterval,
        isNextEventIncoming,
        isPopupDisplayed,
        popupStatus,
        popupTitle,
        popupMessage,
        popupData,
        popupDuration,
        requesting,
        slide,

        pageType,
        headerStatus,

        getTimeFormatted
      },
      components: {
        MeetingRoomSetup,
        MeetingRoomBooking
      }
    }
  }
}
