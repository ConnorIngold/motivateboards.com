import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { ref, reactive, onMounted, computed } from "vue";

window.ref = ref;
window.reactive = reactive;
window.onMounted = onMounted;
window.computed = computed;

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
