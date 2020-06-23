
import Vue from 'vue';
import calculator from './components/calculator';

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  components: { calculator },
  template: `<calculator></calculator>`
});
