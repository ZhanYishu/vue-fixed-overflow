/**
 * @directive: vue-fixed-overflow
 * @author: zhanzf
 * @github: https://github.com/ZhanYishu/vue-fixed-overflow
 */
import { addResizeListener, removeResizeListener } from './utils'

export default {
  name: 'fixed-overflow',
  option: {
    inserted (el, binding, vnode) {
      const instance = vnode.context
      const fixHeight = Number(binding.value) || 0
      instance.$nextTick(() => {
        
        const positionNode = getPositionNode(el)
        const offsetTop = getToPositionNodeTop(el, positionNode)
        
        let left = getOffset(el).left || 0
        let right = getOffset(el).right || 0
        let top = getOffset(positionNode).top - parseInt(getStyle(el, 'margin-top') || 0)
        let bodyOffsetWidth = document.body.offsetWidth
        
        // 高度补偿，设置临时占位dom, 避免fixed时移位
        const cloneDom = insertBeforeCloneDom(el)
        
        let ticking = false
        let isResetFixed = false
        let isSetFixed = false
        
        instance.handleScroll = function () {
          if (!ticking) {
            window.requestAnimationFrame(function () {
              const scrollTop = getScrollTop(positionNode)
              
              if (scrollTop < offsetTop) {
                isSetFixed = false
                if (!isResetFixed) {
                  setStyle(cloneDom, 'display', 'none')
                  resetDomFixed()
                  
                  isResetFixed = true
                }
              }
              
              if (scrollTop >= offsetTop + fixHeight) {
                isResetFixed = false
                
                if (!isSetFixed) {
                  setDomFixed()
                  setStyle(cloneDom, 'display', 'block')
                  
                  isSetFixed = true
                }
              }
              ticking = false
            })
            ticking = true
          }
        }
        
        instance.autoResizeListener = function () {
          left = getOffset(cloneDom).left  || left
          right = getOffset(cloneDom).right || right
          top = getOffset(positionNode).top - parseInt(getStyle(el, 'margin-top') || 0) || top
          bodyOffsetWidth = document.body.offsetWidth
          
          if (!(getScrollTop(positionNode) < offsetTop)) {
            setDomFixed()
          }
        }
        
        addResizeListener(cloneDom, instance.autoResizeListener)
        
        // 监听滚动容器元素滚动事件，动态设置固定头部显隐
        if (positionNode.nodeName === 'BODY') {
          window.addEventListener('scroll', instance.handleScroll)
        } else {
          positionNode.addEventListener('scroll', instance.handleScroll)
        }
        
        function setDomFixed () {
          const options = {
            position: 'fixed',
            top: top + 'px',
            left: left + 'px',
            right: bodyOffsetWidth - right + 'px',
            zIndex: 888
          }
          setFixedStyle(el, options)
        }
        
        function resetDomFixed () {
          const options = {
            position: '',
            top: '',
            left: '',
            right: '',
            zIndex: ''
          }
          setFixedStyle(el, options)
        }
      })
    },
    unbind (el, binding, vnode) {
      const instance = vnode.context
      removeResizeListener(el, instance.autoResizeListener)
    }
  }
}

/**
 * 获取元素可视区域距离窗口的距离
 * @param el {HTMLElement}
 * @returns {{top: number, left: number, right: number}}
 */
function getOffset (el) {
  const rect = el.getBoundingClientRect()
  const win = el.ownerDocument.defaultView
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
    right: rect.right + win.pageXOffset,
    bottom: rect.bottom + win.pageXOffset
  }
}

/**
 * 设置样式
 * @param el {HTMLElement}
 * @param attribute {string}
 * @param value {string}
 */
function setStyle (el, attribute, value) {
  el.style[attribute] = value
}

/**
 * 获取元素的滚动距离
 * @param el {HTMLElement}
 * @returns {number}
 */
function getScrollTop (el) {
  if (el.nodeName === 'BODY') {
    return document.documentElement.scrollTop || document.body.scrollTop
  }
  return el.scrollTop
}

/**
 * 获取第一个具有滚动属性的祖先元素即用作定位元素
 * @param el {HTMLElement}
 */
function getPositionNode (el) {
  const positionNode = el.parentNode
  if (positionNode.nodeName === 'BODY') return positionNode
  
  if (getStyle(positionNode, 'overflow') === 'scroll' || getStyle(positionNode, 'overflowY') === 'scroll') {
    return positionNode
  } else {
    return getPositionNode(positionNode)
  }
}

/**
 * 获取距离定位元素的距离
 * @param el {HTMLElement}
 * @param positionNode {HTMLElement}
 */
function getToPositionNodeTop (el, positionNode) {
  return getOffset(el).top - getOffset(positionNode).top
}

/**
 * 获取样式
 * @param el {HTMLElement}
 * @param property {string}
 * @returns {*}
 */
function getStyle (el, property) {
  if (window.getComputedStyle) {
    getStyle = function (el, property) {
      return window.getComputedStyle(el)[property]
    }
  } else {
    getStyle = function (el, property) {
      return el.currentStyle[property]
    }
  }
  return getStyle(el, property)
}

/**
 * 重置固定定位
 * @param el {HTMLElement}
 * @param options {object}
 */
function setFixedStyle (el, options = {}) {
  const { position, top, left, right, zIndex } = options
  setStyle(el, 'position', position || '')
  setStyle(el, 'top', top || '')
  setStyle(el, 'right', right || '')
  setStyle(el, 'left', left || '')
  setStyle(el, 'zIndex', zIndex || '')
}

/**
 * 设置临时占位节点
 * @param el {HTMLElement}
 * @returns {HTMLDivElement}
 */
function insertBeforeCloneDom (el) {
  const cloneDom = document.createElement('div')
  setStyle(cloneDom, 'height', getFullHeight(el) + 'px')
  setStyle(cloneDom, 'display', 'none')
  el.parentNode.insertBefore(cloneDom, el)
  return cloneDom
}

/**
 * 获取节点完整高度
 * @param el {HTMLElement}
 * @returns {number}
 */
function getFullHeight (el) {
  let offsetHeight = el.offsetHeight
  
  offsetHeight = ['top', 'bottom'].map((side) => {
    return parseInt(getStyle(el, ['margin-' + side]), 10)
  }).reduce((total, side) => {
    return total + side
  }, offsetHeight)
  
  return offsetHeight
}
