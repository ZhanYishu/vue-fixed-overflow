# vue-fixed-overflow

基于 vue 的 vue-fixed-overflow 指令

一个简单的指令便可随父级滚动容器滚动位置自动显示与隐藏

## 强大功能
#### 1、可自定义目标元素顶部离开可视区域多高时显示
#### 2、可跟随目标元素resize自动调整宽高
#### 3、流畅的滚动体验与突出的性能

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
import App from './app.vue'

//1、 使用注册插件方式注册指令
Vue.use(vueFixedOverflow)
//2、 或者使用注册指令方式
// Vue.directive(vueFixedOverflow.name, vueFixedOverflow.option)

new Vue({
  name: 'admin',
  render: createElement => createElement(App)
}).$mount('#app')
```
app1.vue
```vue
<template>
  <div>
    <div style="height: 700px;"></div>
    <div v-fixed-overflow style="background-color: yellow; ">vue-fixed-overflow</div>
  </div>
</template>

<script>
  export default {    
    data() {
      return {}
    }
  }
</script>
```
app2.vue

可自定义目标元素顶部离开可视区域高度时显示
```vue
<template>
  <div>
    <div style="height: 700px;"></div>
    <div v-fixed-overflow="100" style="background-color: yellow; ">vue-fixed-overflow</div>
  </div>
</template>

<script>
  export default {    
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

