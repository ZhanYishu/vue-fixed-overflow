import vueFixedOverflow from './src/index.js'

vueFixedOverflow.install = function (vue) {
  vue.directive(vueFixedOverflow.name, vueFixedOverflow.option)
}

export default vueFixedOverflow
