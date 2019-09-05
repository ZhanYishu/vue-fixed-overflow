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