import SpinnerLoader from "./components/Animations/SpinnerLoader"
import axios from "axios";
import { defineComponent, h, PropType } from 'vue'

import style from './MeetingRoomSetup.module.scss'
import useUtils from './useUtils'
import { IPublicSlide, VueInstance } from "@comeen/comeen-play-sdk-js";

export default defineComponent({
  props: {
    slide : { type: Object as PropType<IPublicSlide>, required: true },
    vue: { type: Object as PropType<VueInstance>, required: true }
  },
  setup(props) {
    const { ref, computed } = props.vue

    const search = ref('')
    const requesting = ref(false)
    const loading = ref(false)
    const buildingId = ref(null)
    const meetingRoomId = ref(null)
    const noMeetingRoomFound = ref(false)
    const unknowBuilding = ref(false)

    const slide = props.slide

    const buildings = computed(() => slide.data.buildings)

    const meetingRooms = computed(() => {
      if (!buildingId.value) {
          return [];
        }

        let meetingRoomsFound = slide.data.meeting_rooms.filter(meeting_room => {
          return meeting_room.building_id === buildingId.value;
        });

        if (! meetingRoomsFound.length) {
          search.value = '';
          meetingRoomId.value = null;
          noMeetingRoomFound.value = true;
        } else {
          noMeetingRoomFound.value = false;
        }

        meetingRoomsFound = meetingRoomsFound.filter(meeting_room => {
          return meeting_room.name.toLowerCase().includes(search.value.toLowerCase());
        });

        return meetingRoomsFound;
    })
    const hasNoBuildingRooms = computed(() => slide.data.no_building_rooms.length)
    const noBuildingRooms = computed(() => {
      let meetingRoomsFound = slide.data.no_building_rooms.filter(meeting_room => {
          return meeting_room.name.toLowerCase().includes(search.value.toLowerCase());
        });
        return meetingRoomsFound;
    })

    function validMeetingRoomSelection() {
      requesting.value = true;

      slide.context.callRemoteMethod('validate-room-setup', {
        meeting_room_id: meetingRoomId.value
      }).then(res => {
        console.log("ok")
        loading.value = false;
        requesting.value = false;
      }).catch(err => {
        console.error(err)
        loading.value = false;
        requesting.value = false;
      });
    }

    return () => h('div', { class: style['comeen-main-setup-container'] }, [
      h('div', { class: [ style['setup-container'], buildingId.value ? [style['setup-portrait-width-building'], style['setup-height-building'] ] : [style['setup-portrait-width-no-building'], style['setup-height-no-building'] ] ] }, [
        buildings.value.length && h('p', null, 'select-building'),
        h('div', { class: 'buildings' }, [
          !buildings.value.length && h('div', { class: [ style['building'], style['empty-building'] ] }, [
            h('div', { class: style['empty-icon'] }, [
              h('i', { class: 'fad fa-empty-set' })
            ]),
            h('p', { class: style['message'] }, [ 'no-building' ])
          ]),
          buildings.value.map(building => h('div', { onClick: () => buildingId.value = building.id, class: [ style['building'], { [style['checked']]: buildingId.value === building.id } ], key: building.id }, [
            h('p', null, [
              building.name,
              h('span', { class: style['comeen-secondary'] }, ` - ${building.address}`)
            ])
          ]))
        ])
      ]),

      h('div', { class: [ style['meeting-rooms-container'], { [style['appear-anim']]: buildingId.value, [style['meeting-rooms-height-building']]: buildingId.value, [style['meeting-rooms-height-no-building']]: !buildingId.value} ] }, [
        (!noMeetingRoomFound.value || buildingId.value === 'unknown') && h('p', null, 'select-meeting-room'),
        ((meetingRooms.value.length >= 8) || (noBuildingRooms.value.length >= 8 && buildingId.value === 'unknown') && !noMeetingRoomFound.value || buildingId.value === 'unknown') && h('input', { class: style['search-input'], type: 'text', placeholder: 'search', modelValue: search.value, 'onUpdate:modelValue': (value) => search.value = value }),

        !meetingRooms.value.length && buildingId.value !== 'unknown' ? h('div', { class: style['meeting-room empty-meeting-room'] }, [
          h('div', { class: style['empty-icon'] }, [
            h('i', { class: 'fad fa-empty-set' })
          ]),
          h('p', { class: style['message'] }, [ 'no-meeting-room' ])
        ]) : h('div', { class: style['meeting-rooms'] }, [
          meetingRooms.value.map(meetingRoom => h('div', { onClick: () => meetingRoomId.value = meetingRoom.id, class: [ style['meeting-room'], { [style['checked']]: meetingRoomId.value === meetingRoom.id } ], key: meetingRoom.id }, [
            h('p', null, meetingRoom.name)
          ]))
        ]),

        hasNoBuildingRooms && buildingId.value === 'unknown' && h('div', { class: style['meeting-rooms'] }, [
          noBuildingRooms.value.map(meetingRoom => h('div', { onClick: () => meetingRoomId.value = meetingRoom.id, class: [ style['meeting-room'], { [style['checked']]: meetingRoomId.value === meetingRoom.id } ], key: meetingRoom.id }, [
            h('p', null, meetingRoom.name)
          ]))
        ]),

        buildingId.value && meetingRoomId.value && h('div', { onClick: validMeetingRoomSelection, class: [ style['valid-setup-button'], { [style['loading']]: loading.value } ] }, [
          h('p', null, [ loading.value ? 'loading' : 'valid' ]),
          !requesting.value ? h('div', { class: style['valid'] }) : h(SpinnerLoader)
        ])
      ])
    ])
  }
})
