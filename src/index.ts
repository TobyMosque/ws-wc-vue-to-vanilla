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

function setUrlPath(val?: string) {
  const appStore = useAppStore(pinia.value)
  appStore.urlPath = val ?? '/'
}

function createApp(comp: ReturnType<typeof defineAsyncComponent>) {
  let styles: string[] | undefined
  if (import.meta.env.DEV) {
    styles = [QuasarIconsCss, QuasarStyleSass]
  }
  const AppElement = defineCustomElement({
    styles: styles,
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
      if (import.meta.env.PROD) {
        const appStore = useAppStore(pinia.value)
        const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" });
        const style = document.createElement('link')
        style.rel = 'stylesheet'
        style.type = "text/css";
        style.href = `${appStore.urlPath}wc-lib.css`
        style.media = "all";
        shadow.appendChild(style);
      }
    }
  }
}

const AppDigimonElement = createApp(defineAsyncComponent(() => import('components/AppDigimon.vue')))

function register({ apiUrl, urlPath, pinia }: { apiUrl?: string, urlPath?: string, pinia?: Pinia } = {}) {
  setPinia(pinia)
  setApiUrl(apiUrl)
  setUrlPath(urlPath)
  customElements.define('app-digimon', AppDigimonElement)
}

export {
  AppDigimonElement, 
  register, 
  setPinia,
  setDeviceId,
  setApiUrl,
  setUrlPath
}