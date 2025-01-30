import { createApp } from 'vue'
import { register } from './index'
import App from './App.vue'

const app = createApp(App);
register({
  apiUrl: 'https://digi-api.com/api/v1/'
});
app.mount("#app");