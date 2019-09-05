# vue-fixed-overflow

基于 vue 的 vue-fixed-overflow 指令

一个简单的指令便可随父级定位元素的滚动位置自动显示与隐藏

#### [在线实例地址](http://static.zhanzf.com/components-inline-demo/element-table-header.html)
#### [代码实例地址](https://github.com/ZhanYishu/components-inline-demo/blob/master/src/views/element-table-header/app.vue)

## 安装
### yarn
```shell
yarn add vue-fixed-overflow
```
### npm
```shell
npm install vue-fixed-overflow --save
```

## 使用
### 全局注册指令
main.js
```js
import Vue from 'vue'
import vueFixedOverflow from 'vue-fixed-overflow'
import 'vue-fixed-overflow/lib/main.css'
import App from './app.vue'

Vue.use(ElementUI)
//1、 使用注册插件方式注册指令
Vue.use(vueFixedOverflow)
//2、 或者使用注册指令方式
// Vue.directive(vueFixedOverflow.name, vueFixedOverflow.option)

new Vue({
  name: 'admin',
  render: createElement => createElement(App)
}).$mount('#app')
```
app.vue
```vue
<template>
  <div>
    <div style="height: 700px;"></div>
    <div v-fixed-overflow style="background-color: yellow; ">vue-fixed-overflow</div>
  </div>
</template>

<script>
  import vFixedOverflow from 'index.js'
  export default {
    
    directives: {
      [vFixedOverflow.name]: vFixedOverflow.option
    },
    
    data() {
      return {}
    }
  }
</script>
```

### 局部注册指令
[实例demo](https://github.com/ZhanYishu/vue-fixed-overflow/blob/master/demo/index.vue)

## 注意事项
使用时请确保组件或dom所在的父级滚动条是唯一的，不建议布局时采用双层滚动条布局

