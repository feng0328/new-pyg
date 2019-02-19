// 让axios变成Vue插件
// 把axios相关代码封装成Vue的插件
// 结果 在main.js可以Vue.use(axios)

import axios from 'axios'
// Vue插件
const HttpServer = {}

HttpServer.install = function(Vue) {
  // 插件要封装的功能
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'



  axios.interceptors.request.use(
    function(config) {
      // 在发送请求之前做些什么
      // console.log('拦截器被触发----')
  
      // 1. headers请求头
      // 2. url 请求标识路径
      // console.log(config);
      // 如果请求是login, 直接发送请求
      if (config.url !== 'login') {
        const AUTH_TOKEN = localStorage.getItem('token')
        // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
        config.headers['Authorization']=AUTH_TOKEN
      }
      // 当请求不是login, 先加头部,然后继续发送请求
  
      return config
    },
    function(error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    }
  )
  

  Vue.prototype.$http = axios
}
export default HttpServer