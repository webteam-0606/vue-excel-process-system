import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import PreviewExcel from '@/components/PreviewExcel'
// import UploadExcel from '@/components/UploadExcel'
// import App from 'src\App.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // }
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
