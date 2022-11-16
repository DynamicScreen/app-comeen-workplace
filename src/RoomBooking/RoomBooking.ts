import {
  ISlideContext,
  SlideModule,
  VueInstance
} from "@comeen/comeen-play-sdk-js";
// import './css/style.scss'
import BaseComponent from "./vue/BaseComponent";

export default class RoomBookingSlideModule extends SlideModule {
  constructor(context: ISlideContext) {
    console.log("rooms", "creating")
    super(context);
  }

  async onReady() {
    console.log("rooms", "On ready")
    return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideContext) {
    const { h, reactive, ref, computed } = vue;

    console.log("rooms", "setting up")

    window.comeen_rooms = {
      vue: vue,
      t: this.t,
      slide: props.slide,
      context: context
    }

    // const url = ref(slide.data.url);

    this.context.onPrepare(async () => {
      console.log("rooms", "preparing");
    });

    this.context.onReplay(async () => {
    });

    this.context.onPlay(async () => {
      console.log("rooms", "playing");
    });

    this.context.onPause(async () => {
    });
    this.context.onResume(async () => {
    });

    this.context.onEnded(async () => {
    });

    return () => h(BaseComponent, {
      key: 'base-component',
      slide: props.slide
    })
  }
}
