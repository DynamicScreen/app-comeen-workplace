import { defineComponent, h } from 'vue'
import s from './SpinnerTransition.module.css'

export default defineComponent({
  name: "SpinnerTransition",
  setup() {
    return () => h('div', { class: s['spinner-container'] }, [
      h('p', { class: s['title'] }),
      h('div', { class: s['spinner'] }, [
        h('img', { src: '/assets/dynamicscreen.comeen/logo-comeen.svg' })
      ])
    ])
  }
})
