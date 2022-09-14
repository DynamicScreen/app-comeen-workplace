import { defineComponent, h } from 'vue'
import style from './SpinnerLoader.module.css'

export default defineComponent({
  name: "SpinnerLoader",
  setup() {
    return () => h('div', { class: style['comeen-room-load'] }, [
      h('div', { class: style['comeen-room-load-dot'] }),
      h('div', { class: style['comeen-room-load-dot'] }),
      h('div', { class: style['comeen-room-load-dot'] }),
      h('div', { class: style['comeen-room-load-dot'] }),
      h('div', { class: style['comeen-room-load-dot'] }),
      h('div', { class: style['comeen-room-load-dot'] })
    ])
  }
})
