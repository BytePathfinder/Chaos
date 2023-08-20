// 引入request.js
import '@/utils/request.js'
import App from './App'
// 引入全局uView
import uView from '@/uni_modules/uview-ui'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

// Vue2使用插件
Vue.use(uView)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif