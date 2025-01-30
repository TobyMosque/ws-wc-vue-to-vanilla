<script lang="ts" generic="T extends Component">
import { type PropType, defineAsyncComponent, createApp, defineComponent, ref, toRefs, onMounted } from 'vue';
import { type Pinia } from 'pinia';
import { PiniaColada } from '@pinia/colada';
import { Quasar } from 'quasar';

export default defineComponent({
  props: {
    pinia: {
      type: Object as PropType<Pinia>,
      required: true
    },
    is: {
      type: Object as PropType<ReturnType<typeof defineComponent> | ReturnType<typeof defineAsyncComponent>>,
      required: true
    }
  },
  setup(props) {
    const subApp = ref<HTMLDialogElement>()
    const { pinia, is } = toRefs(props)
    
    onMounted(() => {
      if (!subApp.value) {
        return;
      }

      const app = createApp(is.value)
      app.use(pinia.value)
      app.use(PiniaColada)
      app.use(Quasar, {
        plugins: {},
      });
      app.mount(subApp.value)
    })

    return {
      subApp
    }
  }
})
</script>

<template>
  <div ref="subApp" v-pre></div>
</template>
