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
    const { h } = vue;

    const update = context.update;

    const { Field, TextInput, Toggle } = this.context.components

    context.updateAutoName("Comeen Workplace - Room Booking")

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
