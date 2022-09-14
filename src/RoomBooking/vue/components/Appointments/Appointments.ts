import { defineComponent, h, TransitionGroup, withDirectives, PropType, ref, computed } from 'vue'
import useUtils from '../../useUtils'

import s from './Appointments.module.scss'

export default {
  name: "Appointments",
  props: {
    appointments: { type: Array as PropType<Array<any>>, required: true },
    options: { type: Array as PropType<Array<any>>, required: true },
    clockFormat: { type: String, required: true }
  },
  setup(props) {
    const { getHoursMinutes } = useUtils({ ref: ref, computed: computed });

    console.log(props.appointments.length);

    return () => h('div', { class: s['appointments-container'] }, [
      h('div', { class: s['appointments'] }, [
        // h(TransitionGroup, { name: 'fade' }, [
          h('div', { class: [s['appointment'], s['empty-appointment']] }, [
            h('div', { class: s['empty-icon'] }, [
              h('i', { class: 'fad fa-empty-set' })
            ]),
            h('p', null, 'no-meeting')
          ]),
          !props.appointments.length ?
            h('div', { class: [s['appointment'], s['empty-appointment']] }, [
              h('div', { class: s['empty-icon'] }, [
                h('i', { class: 'fad fa-empty-set' })
              ]),
              h('p', null, 'no-meeting')
            ])
            : props.appointments.map(appointment => h('div', { class: [s['appointment']], key: appointment.id }, [
              h('div', { class: s['schedule-wrapper'] }, [
                h('p', { class: s['schedule'] }, [
                  h('i', { class: [s['comeen-fa-small'], 'far fa-clock'] }),
                  `${getHoursMinutes(appointment.start_time, props.clockFormat)} - ${getHoursMinutes(appointment.end_time, props.clockFormat)}`
                ])
              ]),

              !props.options['hide_meeting_name'] ?
                h('div', { class: s['event'] }, appointment.topic)
                : h('div', { class: s['event'] }, "booked"),

              !props.options['hide_organizer'] && h('div', { class: [s['organizer'], s['comeen-secondary']] }, `organized-by ${appointment.organizer}`)
            ]))
        // ])
      ])
    ])
  }
}
