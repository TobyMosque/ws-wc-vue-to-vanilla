import { useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import { uid } from "quasar"
import { ref } from "vue"

export const useAppStore = defineStore('app', () => {
  const apiUrl = ref('/')
  const urlPath = ref('/')
  const deviceId = useLocalStorage('device-id', uid())
  return {
    apiUrl,
    urlPath,
    deviceId
  }
})