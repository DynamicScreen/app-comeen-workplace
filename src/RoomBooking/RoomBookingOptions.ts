import {
  ISlideOptionsContext,
  SlideOptionsModule, VueInstance
} from "@comeen/comeen-play-sdk-js";

export default class RoomBookingOptionsModule extends SlideOptionsModule {
  constructor(context: ISlideOptionsContext) {
    super(context);
  }

  async onReady() {
    return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideOptionsContext) {
const en = require("/home/scleriot/Dev/dynamicscreen/app-server/storage/apps//app-comeen-workplace/0.2.0/languages/en.json");
const fr = require("/home/scleriot/Dev/dynamicscreen/app-server/storage/apps//app-comeen-workplace/0.2.0/languages/fr.json");
const translator: any = this.context.translator;
translator.addResourceBundle('en', 'room-booking', en);
translator.addResourceBundle('fr', 'room-booking', fr);
this.t = (key: string, namespace: string = 'room-booking') => translator.t(key, {ns: namespace});

    const { h } = vue;

    const update = context.update;

    const { Field, TextInput, Toggle } = this.context.components

    return () =>
      h("div", {}, [
        h(Field, {}, this.t('modules.room-booking.options.display_options')),
        h(Toggle, { class: 'mt-4', ...update.option("hide_meeting_name") }, this.t('modules.room-booking.options.hide_meeting_name')),
        h(Toggle, { class: 'mt-4', ...update.option("hide_organizer") }, this.t('modules.room-booking.options.hide_organizer')),
        h(Toggle, { class: 'mt-4', ...update.option("hide_company_logos") }, this.t('modules.room-booking.options.hide_company_logos')),

        h(Field, { class: 'mt-4' }, this.t('modules.room-booking.options.action_options')),
        h(Toggle, { class: 'mt-4', ...update.option("authentication_book_required_action") }, this.t('modules.room-booking.options.authentication_book_required_action')),
        h(Toggle, { class: 'mt-4', ...update.option("authentication_check_in_out_required_action") }, this.t('modules.room-booking.options.authentication_check_in_out_required_action')),
        h(Toggle, { class: 'mt-4', ...update.option("disable_on_the_fly_booking") }, this.t('modules.room-booking.options.disable_on_the_fly_booking')),
        h(Toggle, { class: 'mt-4', ...update.option("disable_cancel_meeting_from_screen") }, this.t('modules.room-booking.options.disable_cancel_meeting_from_screen')),
        h(Toggle, { class: 'mt-4', ...update.option("manual_reload") }, this.t('modules.room-booking.options.manual_reload'))
      ]
    )
  }
}
