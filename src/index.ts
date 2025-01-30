import { defineCustomElement, defineAsyncComponent, ref, h } from "vue";
import AppWrapper from "src/components/AppWrapper.vue";
import { createPinia, type Pinia } from "pinia";
import { useAppStore } from "stores/app";

import "@quasar/extras/material-icons/material-icons.css"
import "quasar/src/css/index.sass"
import QuasarIconsCss from "@quasar/extras/material-icons/material-icons.css?inline"
import QuasarStyleSass from "quasar/src/css/index.sass?inline"

const pinia = ref<Pinia>()
function setPinia(val?: Pinia) {
  pinia.value = val ?? createPinia()
}

function setDeviceId(val: string) {
  const appStore = useAppStore(pinia.value)
  appStore.deviceId = val
}

function setApiUrl(val?: string) {
  const appStore = useAppStore(pinia.value)
  appStore.apiUrl = val ?? '/'
}

function createApp(comp: ReturnType<typeof defineAsyncComponent>) {
  const AppElement = defineCustomElement({
    styles: [QuasarIconsCss, QuasarStyleSass],
    setup() {      
      return () => pinia.value ? h(AppWrapper, { 
        pinia: pinia.value,
        is: comp,
      }) : h('div')
    }
  })

  return class extends AppElement {
    constructor() {
      super()
    }
  }
}

const AppDigimonElement = createApp(defineAsyncComponent(() => import('components/AppDigimon.vue')))

function register({ apiUrl, pinia }: { apiUrl?: string, pinia?: Pinia } = {}) {
  setPinia(pinia)
  setApiUrl(apiUrl)
  customElements.define('app-digimon', AppDigimonElement)
}

export {
  AppDigimonElement, 
  register, 
  setPinia,
  setDeviceId,
  setApiUrl
}