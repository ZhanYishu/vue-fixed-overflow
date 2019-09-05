/**
 * vue-fixed-overflow: 用于自动显示表格头部的指令
 */
import { addResizeListener, removeResizeListener } from './utils'

export default {
  name: 'fixed-overflow',
  option: {
    inserted (el, binding, vnode) {
      const instance = vnode.context
      
      instance.$nextTick(() => {
        const positionNode = getPositionNode(el)
        let left = getOffset(el).left || 0
        let right = getOffset(el).right || 0
        let top = getOffset(positionNode).top || 0
        const offsetTop = getToPositionNodeTop(el, positionNode)
        const screenWidth = screen.width
        
        // 高度补偿，避免fixed时移位
        const newDiv = document.createElement('div')
        setStyle(newDiv, 'height', el.offsetHeight + 'px')
        setStyle(newDiv, 'display', 'none')
        el.parentNode.insertBefore(newDiv, el)
        
        // 父级滚动监听
        let offsetParentTicking = false
        let isResetFixed = false
        let isSetFixed = false
        setStyle(el, 'width', getStyle(el, 'width'))
        
        instance.handleOffsetParentScroll = function () {
          if (!offsetParentTicking) {
            window.requestAnimationFrame(function () {
              if (getScrollTop(positionNode) < offsetTop) {
                isSetFixed = false
                if (!isResetFixed) {
                  setStyle(newDiv, 'display', 'none')
                  resetDomFixed()
                  
                  isResetFixed = true
                }
              } else {
                isResetFixed = false
                
                if (!isSetFixed) {
                  setDomFixed()
                  setStyle(newDiv, 'display', 'block')
                  
                  isSetFixed = true
                }
              }
              offsetParentTicking = false
            })
            offsetParentTicking = true
          }
        }
        
        instance.autoResizeListener = function () {
          left = getOffset(el).left  || 0
          right = getOffset(el).right || 0
          top = getOffset(positionNode).top || 0
          
          if (!(getScrollTop(positionNode) < offsetTop)) {
            setDomFixed()
          }
        }
        
        addResizeListener(el, instance.autoResizeListener)
        
        // 监听父级定位元素滚动事件，动态设置固定头部显隐
        if (positionNode.nodeName === 'BODY') {
          window.addEventListener('scroll', instance.handleOffsetParentScroll)
        } else {
          positionNode.addEventListener('scroll', instance.handleOffsetParentScroll)
        }
        
        function setDomFixed () {
          const options = {
            position: 'fixed',
            top: top + 'px',
            left: left + 'px',
            zIndex: 888
          }
          setFixedStyle(el, options)
        }
        
        function resetDomFixed () {
          const options = {
            position: '',
            top: '',
            left: '',
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
 * @param el {element}
 * @returns {{top: number, left: number, right: number}}
 */
function getOffset (el) {
  const rect = el.getBoundingClientRect()
  const win = el.ownerDocument.defaultView
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
    right: rect.right + win.pageXOffset
  }
}

/**
 * 设置样式
 * @param el {element}
 * @param attribute {string}
 * @param value {string}
 */
function setStyle (el, attribute, value) {
  el.style[attribute] = value
}

/**
 * 获取元素的滚动距离
 * @param el {element}
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
 * @param el {element}
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
 * @param el {element}
 * @param positionNode {element}
 */
function getToPositionNodeTop (el, positionNode) {
  return getOffset(el).top - getOffset(positionNode).top
}

/**
 * 获取样式
 * @param el {element}
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
 * 重置表头固定定位
 * @param el {element}
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
