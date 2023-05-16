function _mergeNamespaces (n, m) {
  for (let i = 0; i < m.length; i++) {
    const e = m[i]
    if (typeof e !== 'string' && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== 'default' && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k)
          if (d) {
            Object.defineProperty(n, k, d.get
              ? d
              : {
                  enumerable: true,
                  get: () => e[k]
                })
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }))
}
(function polyfill () {
  const relList = document.createElement('link').relList
  if (relList && relList.supports && relList.supports('modulepreload')) {
    return
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link)
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'childList') {
        continue
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === 'LINK' && node.rel === 'modulepreload') { processPreload(node) }
      }
    }
  }).observe(document, { childList: true, subtree: true })
  function getFetchOpts (link) {
    const fetchOpts = {}
    if (link.integrity) { fetchOpts.integrity = link.integrity }
    if (link.referrerPolicy) { fetchOpts.referrerPolicy = link.referrerPolicy }
    if (link.crossOrigin === 'use-credentials') { fetchOpts.credentials = 'include' } else if (link.crossOrigin === 'anonymous') { fetchOpts.credentials = 'omit' } else { fetchOpts.credentials = 'same-origin' }
    return fetchOpts
  }
  function processPreload (link) {
    if (link.ep) { return }
    link.ep = true
    const fetchOpts = getFetchOpts(link)
    fetch(link.href, fetchOpts)
  }
})()
const styles = ''
const top = 'top'
const bottom = 'bottom'
const right = 'right'
const left = 'left'
const auto = 'auto'
const basePlacements = [top, bottom, right, left]
const start = 'start'
const end = 'end'
const clippingParents = 'clippingParents'
const viewport = 'viewport'
const popper = 'popper'
const reference = 'reference'
const variationPlacements = /* @__PURE__ */ basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + '-' + start, placement + '-' + end])
}, [])
const placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + '-' + start, placement + '-' + end])
}, [])
const beforeRead = 'beforeRead'
const read = 'read'
const afterRead = 'afterRead'
const beforeMain = 'beforeMain'
const main$1 = 'main'
const afterMain = 'afterMain'
const beforeWrite = 'beforeWrite'
const write = 'write'
const afterWrite = 'afterWrite'
const modifierPhases = [beforeRead, read, afterRead, beforeMain, main$1, afterMain, beforeWrite, write, afterWrite]
function getNodeName (element) {
  return element ? (element.nodeName || '').toLowerCase() : null
}
function getWindow (node) {
  if (node == null) {
    return window
  }
  if (node.toString() !== '[object Window]') {
    const ownerDocument = node.ownerDocument
    return ownerDocument ? ownerDocument.defaultView || window : window
  }
  return node
}
function isElement$1 (node) {
  const OwnElement = getWindow(node).Element
  return node instanceof OwnElement || node instanceof Element
}
function isHTMLElement (node) {
  const OwnElement = getWindow(node).HTMLElement
  return node instanceof OwnElement || node instanceof HTMLElement
}
function isShadowRoot (node) {
  if (typeof ShadowRoot === 'undefined') {
    return false
  }
  const OwnElement = getWindow(node).ShadowRoot
  return node instanceof OwnElement || node instanceof ShadowRoot
}
function applyStyles (_ref) {
  const state = _ref.state
  Object.keys(state.elements).forEach(function (name2) {
    const style = state.styles[name2] || {}
    const attributes = state.attributes[name2] || {}
    const element = state.elements[name2]
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return
    }
    Object.assign(element.style, style)
    Object.keys(attributes).forEach(function (name3) {
      const value = attributes[name3]
      if (value === false) {
        element.removeAttribute(name3)
      } else {
        element.setAttribute(name3, value === true ? '' : value)
      }
    })
  })
}
function effect$2 (_ref2) {
  const state = _ref2.state
  const initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  }
  Object.assign(state.elements.popper.style, initialStyles.popper)
  state.styles = initialStyles
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow)
  }
  return function () {
    Object.keys(state.elements).forEach(function (name2) {
      const element = state.elements[name2]
      const attributes = state.attributes[name2] || {}
      const styleProperties = Object.keys(state.styles.hasOwnProperty(name2) ? state.styles[name2] : initialStyles[name2])
      const style = styleProperties.reduce(function (style2, property) {
        style2[property] = ''
        return style2
      }, {})
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return
      }
      Object.assign(element.style, style)
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute)
      })
    })
  }
}
const applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
}
function getBasePlacement (placement) {
  return placement.split('-')[0]
}
const max = Math.max
const min = Math.min
const round = Math.round
function getUAString () {
  const uaData = navigator.userAgentData
  if (uaData != null && uaData.brands) {
    return uaData.brands.map(function (item) {
      return item.brand + '/' + item.version
    }).join(' ')
  }
  return navigator.userAgent
}
function isLayoutViewport () {
  return !/^((?!chrome|android).)*safari/i.test(getUAString())
}
function getBoundingClientRect (element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false
  }
  const clientRect = element.getBoundingClientRect()
  let scaleX = 1
  let scaleY = 1
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1
  }
  const _ref = isElement$1(element) ? getWindow(element) : window; const visualViewport = _ref.visualViewport
  const addVisualOffsets = !isLayoutViewport() && isFixedStrategy
  const x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX
  const y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY
  const width = clientRect.width / scaleX
  const height = clientRect.height / scaleY
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
  }
}
function getLayoutRect (element) {
  const clientRect = getBoundingClientRect(element)
  let width = element.offsetWidth
  let height = element.offsetHeight
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  }
}
function contains (parent, child) {
  const rootNode = child.getRootNode && child.getRootNode()
  if (parent.contains(child)) {
    return true
  } else if (rootNode && isShadowRoot(rootNode)) {
    let next = child
    do {
      if (next && parent.isSameNode(next)) {
        return true
      }
      next = next.parentNode || next.host
    } while (next)
  }
  return false
}
function getComputedStyle$1 (element) {
  return getWindow(element).getComputedStyle(element)
}
function isTableElement (element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0
}
function getDocumentElement (element) {
  return ((isElement$1(element) ? element.ownerDocument : (
    // $FlowFixMe[prop-missing]
    element.document
  )) || window.document).documentElement
}
function getParentNode (element) {
  if (getNodeName(element) === 'html') {
    return element
  }
  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element)
  )
}
function getTrueOffsetParent (element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle$1(element).position === 'fixed') {
    return null
  }
  return element.offsetParent
}
function getContainingBlock (element) {
  const isFirefox = /firefox/i.test(getUAString())
  const isIE = /Trident/i.test(getUAString())
  if (isIE && isHTMLElement(element)) {
    const elementCss = getComputedStyle$1(element)
    if (elementCss.position === 'fixed') {
      return null
    }
  }
  let currentNode = getParentNode(element)
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host
  }
  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    const css = getComputedStyle$1(currentNode)
    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode
    } else {
      currentNode = currentNode.parentNode
    }
  }
  return null
}
function getOffsetParent (element) {
  const window2 = getWindow(element)
  let offsetParent = getTrueOffsetParent(element)
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent)
  }
  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
    return window2
  }
  return offsetParent || getContainingBlock(element) || window2
}
function getMainAxisFromPlacement (placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y'
}
function within (min$1, value, max$1) {
  return max(min$1, min(value, max$1))
}
function withinMaxClamp (min2, value, max2) {
  const v = within(min2, value, max2)
  return v > max2 ? max2 : v
}
function getFreshSideObject () {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
}
function mergePaddingObject (paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject)
}
function expandToHashMap (value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value
    return hashMap
  }, {})
}
const toPaddingObject = function toPaddingObject2 (padding, state) {
  padding = typeof padding === 'function'
    ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    }))
    : padding
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements))
}
function arrow (_ref) {
  let _state$modifiersData$
  const state = _ref.state; const name2 = _ref.name; const options = _ref.options
  const arrowElement = state.elements.arrow
  const popperOffsets2 = state.modifiersData.popperOffsets
  const basePlacement = getBasePlacement(state.placement)
  const axis = getMainAxisFromPlacement(basePlacement)
  const isVertical = [left, right].indexOf(basePlacement) >= 0
  const len = isVertical ? 'height' : 'width'
  if (!arrowElement || !popperOffsets2) {
    return
  }
  const paddingObject = toPaddingObject(options.padding, state)
  const arrowRect = getLayoutRect(arrowElement)
  const minProp = axis === 'y' ? top : left
  const maxProp = axis === 'y' ? bottom : right
  const endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len]
  const startDiff = popperOffsets2[axis] - state.rects.reference[axis]
  const arrowOffsetParent = getOffsetParent(arrowElement)
  const clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0
  const centerToReference = endDiff / 2 - startDiff / 2
  const min2 = paddingObject[minProp]
  const max2 = clientSize - arrowRect[len] - paddingObject[maxProp]
  const center = clientSize / 2 - arrowRect[len] / 2 + centerToReference
  const offset2 = within(min2, center, max2)
  const axisProp = axis
  state.modifiersData[name2] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$)
}
function effect$1 (_ref2) {
  const state = _ref2.state; const options = _ref2.options
  const _options$element = options.element; let arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element
  if (arrowElement == null) {
    return
  }
  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement)
    if (!arrowElement) {
      return
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return
  }
  state.elements.arrow = arrowElement
}
const arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
}
function getVariation (placement) {
  return placement.split('-')[1]
}
const unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}
function roundOffsetsByDPR (_ref) {
  const x = _ref.x; const y = _ref.y
  const win = window
  const dpr = win.devicePixelRatio || 1
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  }
}
function mapToStyles (_ref2) {
  let _Object$assign2
  const popper2 = _ref2.popper; const popperRect = _ref2.popperRect; const placement = _ref2.placement; const variation = _ref2.variation; const offsets = _ref2.offsets; const position = _ref2.position; const gpuAcceleration = _ref2.gpuAcceleration; const adaptive = _ref2.adaptive; const roundOffsets = _ref2.roundOffsets; const isFixed = _ref2.isFixed
  const _offsets$x = offsets.x; let x = _offsets$x === void 0 ? 0 : _offsets$x; const _offsets$y = offsets.y; let y = _offsets$y === void 0 ? 0 : _offsets$y
  const _ref3 = typeof roundOffsets === 'function'
    ? roundOffsets({
      x,
      y
    })
    : {
        x,
        y
      }
  x = _ref3.x
  y = _ref3.y
  const hasX = offsets.hasOwnProperty('x')
  const hasY = offsets.hasOwnProperty('y')
  let sideX = left
  let sideY = top
  const win = window
  if (adaptive) {
    let offsetParent = getOffsetParent(popper2)
    let heightProp = 'clientHeight'
    let widthProp = 'clientWidth'
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2)
      if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight'
        widthProp = 'scrollWidth'
      }
    }
    offsetParent = offsetParent
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom
      const offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        offsetParent[heightProp]
      )
      y -= offsetY - popperRect.height
      y *= gpuAcceleration ? 1 : -1
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right
      const offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        offsetParent[widthProp]
      )
      x -= offsetX - popperRect.width
      x *= gpuAcceleration ? 1 : -1
    }
  }
  const commonStyles = Object.assign({
    position
  }, adaptive && unsetSides)
  const _ref4 = roundOffsets === true
    ? roundOffsetsByDPR({
      x,
      y
    })
    : {
        x,
        y
      }
  x = _ref4.x
  y = _ref4.y
  if (gpuAcceleration) {
    let _Object$assign
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? 'translate(' + x + 'px, ' + y + 'px)' : 'translate3d(' + x + 'px, ' + y + 'px, 0)', _Object$assign))
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + 'px' : '', _Object$assign2[sideX] = hasX ? x + 'px' : '', _Object$assign2.transform = '', _Object$assign2))
}
function computeStyles (_ref5) {
  const state = _ref5.state; const options = _ref5.options
  const _options$gpuAccelerat = options.gpuAcceleration; const gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat; const _options$adaptive = options.adaptive; const adaptive = _options$adaptive === void 0 ? true : _options$adaptive; const _options$roundOffsets = options.roundOffsets; const roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets
  const commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  }
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })))
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets
    })))
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  })
}
const computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
}
const passive = {
  passive: true
}
function effect (_ref) {
  const state = _ref.state; const instance = _ref.instance; const options = _ref.options
  const _options$scroll = options.scroll; const scroll = _options$scroll === void 0 ? true : _options$scroll; const _options$resize = options.resize; const resize = _options$resize === void 0 ? true : _options$resize
  const window2 = getWindow(state.elements.popper)
  const scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper)
  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive)
    })
  }
  if (resize) {
    window2.addEventListener('resize', instance.update, passive)
  }
  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive)
      })
    }
    if (resize) {
      window2.removeEventListener('resize', instance.update, passive)
    }
  }
}
const eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn () {
  },
  effect,
  data: {}
}
const hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
}
function getOppositePlacement (placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched]
  })
}
const hash = {
  start: 'end',
  end: 'start'
}
function getOppositeVariationPlacement (placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched]
  })
}
function getWindowScroll (node) {
  const win = getWindow(node)
  const scrollLeft = win.pageXOffset
  const scrollTop = win.pageYOffset
  return {
    scrollLeft,
    scrollTop
  }
}
function getWindowScrollBarX (element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft
}
function getViewportRect (element, strategy) {
  const win = getWindow(element)
  const html = getDocumentElement(element)
  const visualViewport = win.visualViewport
  let width = html.clientWidth
  let height = html.clientHeight
  let x = 0
  let y = 0
  if (visualViewport) {
    width = visualViewport.width
    height = visualViewport.height
    const layoutViewport = isLayoutViewport()
    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft
      y = visualViewport.offsetTop
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  }
}
function getDocumentRect (element) {
  let _element$ownerDocumen
  const html = getDocumentElement(element)
  const winScroll = getWindowScroll(element)
  const body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body
  const width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0)
  const height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0)
  let x = -winScroll.scrollLeft + getWindowScrollBarX(element)
  const y = -winScroll.scrollTop
  if (getComputedStyle$1(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width
  }
  return {
    width,
    height,
    x,
    y
  }
}
function isScrollParent (element) {
  const _getComputedStyle = getComputedStyle$1(element); const overflow = _getComputedStyle.overflow; const overflowX = _getComputedStyle.overflowX; const overflowY = _getComputedStyle.overflowY
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)
}
function getScrollParent (node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node
  }
  return getScrollParent(getParentNode(node))
}
function listScrollParents (element, list) {
  let _element$ownerDocumen
  if (list === void 0) {
    list = []
  }
  const scrollParent = getScrollParent(element)
  const isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body)
  const win = getWindow(scrollParent)
  const target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent
  const updatedList = list.concat(target)
  return isBody ? updatedList : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)))
  )
}
function rectToClientRect (rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  })
}
function getInnerBoundingClientRect (element, strategy) {
  const rect = getBoundingClientRect(element, false, strategy === 'fixed')
  rect.top = rect.top + element.clientTop
  rect.left = rect.left + element.clientLeft
  rect.bottom = rect.top + element.clientHeight
  rect.right = rect.left + element.clientWidth
  rect.width = element.clientWidth
  rect.height = element.clientHeight
  rect.x = rect.left
  rect.y = rect.top
  return rect
}
function getClientRectFromMixedType (element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement$1(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)))
}
function getClippingParents (element) {
  const clippingParents2 = listScrollParents(getParentNode(element))
  const canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0
  const clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element
  if (!isElement$1(clipperElement)) {
    return []
  }
  return clippingParents2.filter(function (clippingParent) {
    return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body'
  })
}
function getClippingRect (element, boundary, rootBoundary, strategy) {
  const mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary)
  const clippingParents2 = [].concat(mainClippingParents, [rootBoundary])
  const firstClippingParent = clippingParents2[0]
  const clippingRect = clippingParents2.reduce(function (accRect, clippingParent) {
    const rect = getClientRectFromMixedType(element, clippingParent, strategy)
    accRect.top = max(rect.top, accRect.top)
    accRect.right = min(rect.right, accRect.right)
    accRect.bottom = min(rect.bottom, accRect.bottom)
    accRect.left = max(rect.left, accRect.left)
    return accRect
  }, getClientRectFromMixedType(element, firstClippingParent, strategy))
  clippingRect.width = clippingRect.right - clippingRect.left
  clippingRect.height = clippingRect.bottom - clippingRect.top
  clippingRect.x = clippingRect.left
  clippingRect.y = clippingRect.top
  return clippingRect
}
function computeOffsets (_ref) {
  const reference2 = _ref.reference; const element = _ref.element; const placement = _ref.placement
  const basePlacement = placement ? getBasePlacement(placement) : null
  const variation = placement ? getVariation(placement) : null
  const commonX = reference2.x + reference2.width / 2 - element.width / 2
  const commonY = reference2.y + reference2.height / 2 - element.height / 2
  let offsets
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      }
      break
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      }
      break
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      }
      break
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      }
      break
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      }
  }
  const mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null
  if (mainAxis != null) {
    const len = mainAxis === 'y' ? 'height' : 'width'
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2)
        break
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2)
        break
    }
  }
  return offsets
}
function detectOverflow (state, options) {
  if (options === void 0) {
    options = {}
  }
  const _options = options; const _options$placement = _options.placement; const placement = _options$placement === void 0 ? state.placement : _options$placement; const _options$strategy = _options.strategy; const strategy = _options$strategy === void 0 ? state.strategy : _options$strategy; const _options$boundary = _options.boundary; const boundary = _options$boundary === void 0 ? clippingParents : _options$boundary; const _options$rootBoundary = _options.rootBoundary; const rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary; const _options$elementConte = _options.elementContext; const elementContext = _options$elementConte === void 0 ? popper : _options$elementConte; const _options$altBoundary = _options.altBoundary; const altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary; const _options$padding = _options.padding; const padding = _options$padding === void 0 ? 0 : _options$padding
  const paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements))
  const altContext = elementContext === popper ? reference : popper
  const popperRect = state.rects.popper
  const element = state.elements[altBoundary ? altContext : elementContext]
  const clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy)
  const referenceClientRect = getBoundingClientRect(state.elements.reference)
  const popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement
  })
  const popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2))
  const elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect
  const overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  }
  const offsetData = state.modifiersData.offset
  if (elementContext === popper && offsetData) {
    const offset2 = offsetData[placement]
    Object.keys(overflowOffsets).forEach(function (key) {
      const multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1
      const axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x'
      overflowOffsets[key] += offset2[axis] * multiply
    })
  }
  return overflowOffsets
}
function computeAutoPlacement (state, options) {
  if (options === void 0) {
    options = {}
  }
  const _options = options; const placement = _options.placement; const boundary = _options.boundary; const rootBoundary = _options.rootBoundary; const padding = _options.padding; const flipVariations = _options.flipVariations; const _options$allowedAutoP = _options.allowedAutoPlacements; const allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP
  const variation = getVariation(placement)
  const placements$1 = variation
    ? flipVariations
      ? variationPlacements
      : variationPlacements.filter(function (placement2) {
        return getVariation(placement2) === variation
      })
    : basePlacements
  let allowedPlacements = placements$1.filter(function (placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0
  })
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1
  }
  const overflows = allowedPlacements.reduce(function (acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)]
    return acc
  }, {})
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b]
  })
}
function getExpandedFallbackPlacements (placement) {
  if (getBasePlacement(placement) === auto) {
    return []
  }
  const oppositePlacement = getOppositePlacement(placement)
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)]
}
function flip (_ref) {
  const state = _ref.state; const options = _ref.options; const name2 = _ref.name
  if (state.modifiersData[name2]._skip) {
    return
  }
  const _options$mainAxis = options.mainAxis; const checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis; const _options$altAxis = options.altAxis; const checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis; const specifiedFallbackPlacements = options.fallbackPlacements; const padding = options.padding; const boundary = options.boundary; const rootBoundary = options.rootBoundary; const altBoundary = options.altBoundary; const _options$flipVariatio = options.flipVariations; const flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio; const allowedAutoPlacements = options.allowedAutoPlacements
  const preferredPlacement = state.options.placement
  const basePlacement = getBasePlacement(preferredPlacement)
  const isBasePlacement = basePlacement === preferredPlacement
  const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement))
  const placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto
      ? computeAutoPlacement(state, {
        placement: placement2,
        boundary,
        rootBoundary,
        padding,
        flipVariations,
        allowedAutoPlacements
      })
      : placement2)
  }, [])
  const referenceRect = state.rects.reference
  const popperRect = state.rects.popper
  const checksMap = /* @__PURE__ */ new Map()
  let makeFallbackChecks = true
  let firstFittingPlacement = placements2[0]
  for (let i = 0; i < placements2.length; i++) {
    const placement = placements2[i]
    const _basePlacement = getBasePlacement(placement)
    const isStartVariation = getVariation(placement) === start
    const isVertical = [top, bottom].indexOf(_basePlacement) >= 0
    const len = isVertical ? 'width' : 'height'
    const overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    })
    let mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide)
    }
    const altVariationSide = getOppositePlacement(mainVariationSide)
    const checks = []
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0)
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0)
    }
    if (checks.every(function (check) {
      return check
    })) {
      firstFittingPlacement = placement
      makeFallbackChecks = false
      break
    }
    checksMap.set(placement, checks)
  }
  if (makeFallbackChecks) {
    const numberOfChecks = flipVariations ? 3 : 1
    const _loop = function _loop2 (_i2) {
      const fittingPlacement = placements2.find(function (placement2) {
        const checks2 = checksMap.get(placement2)
        if (checks2) {
          return checks2.slice(0, _i2).every(function (check) {
            return check
          })
        }
      })
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement
        return 'break'
      }
    }
    for (let _i = numberOfChecks; _i > 0; _i--) {
      const _ret = _loop(_i)
      if (_ret === 'break') { break }
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name2]._skip = true
    state.placement = firstFittingPlacement
    state.reset = true
  }
}
const flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
}
function getSideOffsets (overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    }
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  }
}
function isAnySideFullyClipped (overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0
  })
}
function hide (_ref) {
  const state = _ref.state; const name2 = _ref.name
  const referenceRect = state.rects.reference
  const popperRect = state.rects.popper
  const preventedOffsets = state.modifiersData.preventOverflow
  const referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  })
  const popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  })
  const referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect)
  const popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets)
  const isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets)
  const hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets)
  state.modifiersData[name2] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  })
}
const hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
}
function distanceAndSkiddingToXY (placement, rects, offset2) {
  const basePlacement = getBasePlacement(placement)
  const invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1
  const _ref = typeof offset2 === 'function'
    ? offset2(Object.assign({}, rects, {
      placement
    }))
    : offset2; let skidding = _ref[0]; let distance = _ref[1]
  skidding = skidding || 0
  distance = (distance || 0) * invertDistance
  return [left, right].indexOf(basePlacement) >= 0
    ? {
        x: distance,
        y: skidding
      }
    : {
        x: skidding,
        y: distance
      }
}
function offset (_ref2) {
  const state = _ref2.state; const options = _ref2.options; const name2 = _ref2.name
  const _options$offset = options.offset; const offset2 = _options$offset === void 0 ? [0, 0] : _options$offset
  const data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2)
    return acc
  }, {})
  const _data$state$placement = data[state.placement]; const x = _data$state$placement.x; const y = _data$state$placement.y
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x
    state.modifiersData.popperOffsets.y += y
  }
  state.modifiersData[name2] = data
}
const offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
}
function popperOffsets (_ref) {
  const state = _ref.state; const name2 = _ref.name
  state.modifiersData[name2] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  })
}
const popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
}
function getAltAxis (axis) {
  return axis === 'x' ? 'y' : 'x'
}
function preventOverflow (_ref) {
  const state = _ref.state; const options = _ref.options; const name2 = _ref.name
  const _options$mainAxis = options.mainAxis; const checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis; const _options$altAxis = options.altAxis; const checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis; const boundary = options.boundary; const rootBoundary = options.rootBoundary; const altBoundary = options.altBoundary; const padding = options.padding; const _options$tether = options.tether; const tether = _options$tether === void 0 ? true : _options$tether; const _options$tetherOffset = options.tetherOffset; const tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset
  const overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  })
  const basePlacement = getBasePlacement(state.placement)
  const variation = getVariation(state.placement)
  const isBasePlacement = !variation
  const mainAxis = getMainAxisFromPlacement(basePlacement)
  const altAxis = getAltAxis(mainAxis)
  const popperOffsets2 = state.modifiersData.popperOffsets
  const referenceRect = state.rects.reference
  const popperRect = state.rects.popper
  const tetherOffsetValue = typeof tetherOffset === 'function'
    ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    }))
    : tetherOffset
  const normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number'
    ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
      }
    : Object.assign({
      mainAxis: 0,
      altAxis: 0
    }, tetherOffsetValue)
  const offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null
  const data = {
    x: 0,
    y: 0
  }
  if (!popperOffsets2) {
    return
  }
  if (checkMainAxis) {
    let _offsetModifierState$
    const mainSide = mainAxis === 'y' ? top : left
    const altSide = mainAxis === 'y' ? bottom : right
    const len = mainAxis === 'y' ? 'height' : 'width'
    const offset2 = popperOffsets2[mainAxis]
    const min$1 = offset2 + overflow[mainSide]
    const max$1 = offset2 - overflow[altSide]
    const additive = tether ? -popperRect[len] / 2 : 0
    const minLen = variation === start ? referenceRect[len] : popperRect[len]
    const maxLen = variation === start ? -popperRect[len] : -referenceRect[len]
    const arrowElement = state.elements.arrow
    const arrowRect = tether && arrowElement
      ? getLayoutRect(arrowElement)
      : {
          width: 0,
          height: 0
        }
    const arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject()
    const arrowPaddingMin = arrowPaddingObject[mainSide]
    const arrowPaddingMax = arrowPaddingObject[altSide]
    const arrowLen = within(0, referenceRect[len], arrowRect[len])
    const minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis
    const maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis
    const arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow)
    const clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0
    const offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0
    const tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset
    const tetherMax = offset2 + maxOffset - offsetModifierValue
    const preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1)
    popperOffsets2[mainAxis] = preventedOffset
    data[mainAxis] = preventedOffset - offset2
  }
  if (checkAltAxis) {
    let _offsetModifierState$2
    const _mainSide = mainAxis === 'x' ? top : left
    const _altSide = mainAxis === 'x' ? bottom : right
    const _offset = popperOffsets2[altAxis]
    const _len = altAxis === 'y' ? 'height' : 'width'
    const _min = _offset + overflow[_mainSide]
    const _max = _offset - overflow[_altSide]
    const isOriginSide = [top, left].indexOf(basePlacement) !== -1
    const _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0
    const _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis
    const _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max
    const _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max)
    popperOffsets2[altAxis] = _preventedOffset
    data[altAxis] = _preventedOffset - _offset
  }
  state.modifiersData[name2] = data
}
const preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
}
function getHTMLElementScroll (element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  }
}
function getNodeScroll (node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node)
  } else {
    return getHTMLElementScroll(node)
  }
}
function isElementScaled (element) {
  const rect = element.getBoundingClientRect()
  const scaleX = round(rect.width) / element.offsetWidth || 1
  const scaleY = round(rect.height) / element.offsetHeight || 1
  return scaleX !== 1 || scaleY !== 1
}
function getCompositeRect (elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false
  }
  const isOffsetParentAnElement = isHTMLElement(offsetParent)
  const offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent)
  const documentElement = getDocumentElement(offsetParent)
  const rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed)
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  }
  let offsets = {
    x: 0,
    y: 0
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent)
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true)
      offsets.x += offsetParent.clientLeft
      offsets.y += offsetParent.clientTop
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement)
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  }
}
function order (modifiers) {
  const map = /* @__PURE__ */ new Map()
  const visited = /* @__PURE__ */ new Set()
  const result = []
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier)
  })
  function sort (modifier) {
    visited.add(modifier.name)
    const requires = [].concat(modifier.requires || [], modifier.requiresIfExists || [])
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        const depModifier = map.get(dep)
        if (depModifier) {
          sort(depModifier)
        }
      }
    })
    result.push(modifier)
  }
  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier)
    }
  })
  return result
}
function orderModifiers (modifiers) {
  const orderedModifiers = order(modifiers)
  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase
    }))
  }, [])
}
function debounce (fn2) {
  let pending
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = void 0
          resolve(fn2())
        })
      })
    }
    return pending
  }
}
function mergeByName (modifiers) {
  const merged = modifiers.reduce(function (merged2, current) {
    const existing = merged2[current.name]
    merged2[current.name] = existing
      ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      })
      : current
    return merged2
  }, {})
  return Object.keys(merged).map(function (key) {
    return merged[key]
  })
}
const DEFAULT_OPTIONS$1 = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
}
function areValidElements () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key]
  }
  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function')
  })
}
function popperGenerator (generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {}
  }
  const _generatorOptions = generatorOptions; const _generatorOptions$def = _generatorOptions.defaultModifiers; const defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def; const _generatorOptions$def2 = _generatorOptions.defaultOptions; const defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS$1 : _generatorOptions$def2
  return function createPopper2 (reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions
    }
    let state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS$1, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    }
    let effectCleanupFns = []
    let isDestroyed = false
    var instance = {
      state,
      setOptions: function setOptions (setOptionsAction) {
        const options2 = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction
        cleanupModifierEffects()
        state.options = Object.assign({}, defaultOptions, state.options, options2)
        state.scrollParents = {
          reference: isElement$1(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        }
        const orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)))
        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled
        })
        runModifierEffects()
        return instance.update()
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate () {
        if (isDestroyed) {
          return
        }
        const _state$elements = state.elements; const reference3 = _state$elements.reference; const popper3 = _state$elements.popper
        if (!areValidElements(reference3, popper3)) {
          return
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper3)
        }
        state.reset = false
        state.placement = state.options.placement
        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data)
        })
        for (let index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false
            index = -1
            continue
          }
          const _state$orderedModifie = state.orderedModifiers[index]; const fn2 = _state$orderedModifie.fn; const _state$orderedModifie2 = _state$orderedModifie.options; const _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2; const name2 = _state$orderedModifie.name
          if (typeof fn2 === 'function') {
            state = fn2({
              state,
              options: _options,
              name: name2,
              instance
            }) || state
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate()
          resolve(state)
        })
      }),
      destroy: function destroy () {
        cleanupModifierEffects()
        isDestroyed = true
      }
    }
    if (!areValidElements(reference2, popper2)) {
      return instance
    }
    instance.setOptions(options).then(function (state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2)
      }
    })
    function runModifierEffects () {
      state.orderedModifiers.forEach(function (_ref3) {
        const name2 = _ref3.name; const _ref3$options = _ref3.options; const options2 = _ref3$options === void 0 ? {} : _ref3$options; const effect2 = _ref3.effect
        if (typeof effect2 === 'function') {
          const cleanupFn = effect2({
            state,
            name: name2,
            instance,
            options: options2
          })
          const noopFn = function noopFn2 () {
          }
          effectCleanupFns.push(cleanupFn || noopFn)
        }
      })
    }
    function cleanupModifierEffects () {
      effectCleanupFns.forEach(function (fn2) {
        return fn2()
      })
      effectCleanupFns = []
    }
    return instance
  }
}
const createPopper$2 = /* @__PURE__ */ popperGenerator()
const defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1]
const createPopper$1 = /* @__PURE__ */ popperGenerator({
  defaultModifiers: defaultModifiers$1
})
const defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1]
const createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
})
const Popper = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  afterMain,
  afterRead,
  afterWrite,
  applyStyles: applyStyles$1,
  arrow: arrow$1,
  auto,
  basePlacements,
  beforeMain,
  beforeRead,
  beforeWrite,
  bottom,
  clippingParents,
  computeStyles: computeStyles$1,
  createPopper,
  createPopperBase: createPopper$2,
  createPopperLite: createPopper$1,
  detectOverflow,
  end,
  eventListeners,
  flip: flip$1,
  hide: hide$1,
  left,
  main: main$1,
  modifierPhases,
  offset: offset$1,
  placements,
  popper,
  popperGenerator,
  popperOffsets: popperOffsets$1,
  preventOverflow: preventOverflow$1,
  read,
  reference,
  right,
  start,
  top,
  variationPlacements,
  viewport,
  write
}, Symbol.toStringTag, { value: 'Module' }))
/*!
  * Bootstrap v5.2.3 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
const MAX_UID = 1e6
const MILLISECONDS_MULTIPLIER = 1e3
const TRANSITION_END = 'transitionend'
const toType = (object) => {
  if (object === null || object === void 0) {
    return `${object}`
  }
  return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase()
}
const getUID = (prefix) => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID)
  } while (document.getElementById(prefix))
  return prefix
}
const getSelector = (element) => {
  let selector = element.getAttribute('data-bs-target')
  if (!selector || selector === '#') {
    let hrefAttribute = element.getAttribute('href')
    if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
      return null
    }
    if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
      hrefAttribute = `#${hrefAttribute.split('#')[1]}`
    }
    selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null
  }
  return selector
}
const getSelectorFromElement = (element) => {
  const selector = getSelector(element)
  if (selector) {
    return document.querySelector(selector) ? selector : null
  }
  return null
}
const getElementFromSelector = (element) => {
  const selector = getSelector(element)
  return selector ? document.querySelector(selector) : null
}
const getTransitionDurationFromElement = (element) => {
  if (!element) {
    return 0
  }
  let {
    transitionDuration,
    transitionDelay
  } = window.getComputedStyle(element)
  const floatTransitionDuration = Number.parseFloat(transitionDuration)
  const floatTransitionDelay = Number.parseFloat(transitionDelay)
  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0
  }
  transitionDuration = transitionDuration.split(',')[0]
  transitionDelay = transitionDelay.split(',')[0]
  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER
}
const triggerTransitionEnd = (element) => {
  element.dispatchEvent(new Event(TRANSITION_END))
}
const isElement = (object) => {
  if (!object || typeof object !== 'object') {
    return false
  }
  if (typeof object.jquery !== 'undefined') {
    object = object[0]
  }
  return typeof object.nodeType !== 'undefined'
}
const getElement = (object) => {
  if (isElement(object)) {
    return object.jquery ? object[0] : object
  }
  if (typeof object === 'string' && object.length > 0) {
    return document.querySelector(object)
  }
  return null
}
const isVisible = (element) => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false
  }
  const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible'
  const closedDetails = element.closest('details:not([open])')
  if (!closedDetails) {
    return elementIsVisible
  }
  if (closedDetails !== element) {
    const summary = element.closest('summary')
    if (summary && summary.parentNode !== closedDetails) {
      return false
    }
    if (summary === null) {
      return false
    }
  }
  return elementIsVisible
}
const isDisabled = (element) => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true
  }
  if (element.classList.contains('disabled')) {
    return true
  }
  if (typeof element.disabled !== 'undefined') {
    return element.disabled
  }
  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false'
}
const findShadowRoot = (element) => {
  if (!document.documentElement.attachShadow) {
    return null
  }
  if (typeof element.getRootNode === 'function') {
    const root = element.getRootNode()
    return root instanceof ShadowRoot ? root : null
  }
  if (element instanceof ShadowRoot) {
    return element
  }
  if (!element.parentNode) {
    return null
  }
  return findShadowRoot(element.parentNode)
}
const noop$2 = () => {
}
const reflow = (element) => {
  element.offsetHeight
}
const getjQuery = () => {
  if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
    return window.jQuery
  }
  return null
}
const DOMContentLoadedCallbacks = []
const onDOMContentLoaded = (callback) => {
  if (document.readyState === 'loading') {
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener('DOMContentLoaded', () => {
        for (const callback2 of DOMContentLoadedCallbacks) {
          callback2()
        }
      })
    }
    DOMContentLoadedCallbacks.push(callback)
  } else {
    callback()
  }
}
const isRTL = () => document.documentElement.dir === 'rtl'
const defineJQueryPlugin = (plugin) => {
  onDOMContentLoaded(() => {
    const $ = getjQuery()
    if ($) {
      const name2 = plugin.NAME
      const JQUERY_NO_CONFLICT = $.fn[name2]
      $.fn[name2] = plugin.jQueryInterface
      $.fn[name2].Constructor = plugin
      $.fn[name2].noConflict = () => {
        $.fn[name2] = JQUERY_NO_CONFLICT
        return plugin.jQueryInterface
      }
    }
  })
}
const execute = (callback) => {
  if (typeof callback === 'function') {
    callback()
  }
}
const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback)
    return
  }
  const durationPadding = 5
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding
  let called = false
  const handler = ({
    target
  }) => {
    if (target !== transitionElement) {
      return
    }
    called = true
    transitionElement.removeEventListener(TRANSITION_END, handler)
    execute(callback)
  }
  transitionElement.addEventListener(TRANSITION_END, handler)
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement)
    }
  }, emulatedDuration)
}
const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
  const listLength = list.length
  let index = list.indexOf(activeElement)
  if (index === -1) {
    return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0]
  }
  index += shouldGetNext ? 1 : -1
  if (isCycleAllowed) {
    index = (index + listLength) % listLength
  }
  return list[Math.max(0, Math.min(index, listLength - 1))]
}
const namespaceRegex = /[^.]*(?=\..*)\.|.*/
const stripNameRegex = /\..*/
const stripUidRegex = /::\d+$/
const eventRegistry = {}
let uidEvent = 1
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
}
const nativeEvents = /* @__PURE__ */ new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll'])
function makeEventUid (element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++
}
function getElementEvents (element) {
  const uid = makeEventUid(element)
  element.uidEvent = uid
  eventRegistry[uid] = eventRegistry[uid] || {}
  return eventRegistry[uid]
}
function bootstrapHandler (element, fn2) {
  return function handler (event) {
    hydrateObj(event, {
      delegateTarget: element
    })
    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn2)
    }
    return fn2.apply(element, [event])
  }
}
function bootstrapDelegationHandler (element, selector, fn2) {
  return function handler (event) {
    const domElements = element.querySelectorAll(selector)
    for (let {
      target
    } = event; target && target !== this; target = target.parentNode) {
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue
        }
        hydrateObj(event, {
          delegateTarget: target
        })
        if (handler.oneOff) {
          EventHandler.off(element, event.type, selector, fn2)
        }
        return fn2.apply(target, [event])
      }
    }
  }
}
function findHandler (events, callable, delegationSelector = null) {
  return Object.values(events).find((event) => event.callable === callable && event.delegationSelector === delegationSelector)
}
function normalizeParameters (originalTypeEvent, handler, delegationFunction) {
  const isDelegated = typeof handler === 'string'
  const callable = isDelegated ? delegationFunction : handler || delegationFunction
  let typeEvent = getTypeEvent(originalTypeEvent)
  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent
  }
  return [isDelegated, callable, typeEvent]
}
function addHandler (element, originalTypeEvent, handler, delegationFunction, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return
  }
  let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction)
  if (originalTypeEvent in customEvents) {
    const wrapFunction = (fn3) => {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn3.call(this, event)
        }
      }
    }
    callable = wrapFunction(callable)
  }
  const events = getElementEvents(element)
  const handlers = events[typeEvent] || (events[typeEvent] = {})
  const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null)
  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff
    return
  }
  const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''))
  const fn2 = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable)
  fn2.delegationSelector = isDelegated ? handler : null
  fn2.callable = callable
  fn2.oneOff = oneOff
  fn2.uidEvent = uid
  handlers[uid] = fn2
  element.addEventListener(typeEvent, fn2, isDelegated)
}
function removeHandler (element, events, typeEvent, handler, delegationSelector) {
  const fn2 = findHandler(events[typeEvent], handler, delegationSelector)
  if (!fn2) {
    return
  }
  element.removeEventListener(typeEvent, fn2, Boolean(delegationSelector))
  delete events[typeEvent][fn2.uidEvent]
}
function removeNamespacedHandlers (element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {}
  for (const handlerKey of Object.keys(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      const event = storeElementEvent[handlerKey]
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector)
    }
  }
}
function getTypeEvent (event) {
  event = event.replace(stripNameRegex, '')
  return customEvents[event] || event
}
const EventHandler = {
  on (element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, false)
  },
  one (element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, true)
  },
  off (element, originalTypeEvent, handler, delegationFunction) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return
    }
    const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction)
    const inNamespace = typeEvent !== originalTypeEvent
    const events = getElementEvents(element)
    const storeElementEvent = events[typeEvent] || {}
    const isNamespace = originalTypeEvent.startsWith('.')
    if (typeof callable !== 'undefined') {
      if (!Object.keys(storeElementEvent).length) {
        return
      }
      removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null)
      return
    }
    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1))
      }
    }
    for (const keyHandlers of Object.keys(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '')
      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        const event = storeElementEvent[keyHandlers]
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector)
      }
    }
  },
  trigger (element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null
    }
    const $ = getjQuery()
    const typeEvent = getTypeEvent(event)
    const inNamespace = event !== typeEvent
    let jQueryEvent = null
    let bubbles = true
    let nativeDispatch = true
    let defaultPrevented = false
    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args)
      $(element).trigger(jQueryEvent)
      bubbles = !jQueryEvent.isPropagationStopped()
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped()
      defaultPrevented = jQueryEvent.isDefaultPrevented()
    }
    let evt = new Event(event, {
      bubbles,
      cancelable: true
    })
    evt = hydrateObj(evt, args)
    if (defaultPrevented) {
      evt.preventDefault()
    }
    if (nativeDispatch) {
      element.dispatchEvent(evt)
    }
    if (evt.defaultPrevented && jQueryEvent) {
      jQueryEvent.preventDefault()
    }
    return evt
  }
}
function hydrateObj (obj, meta) {
  for (const [key, value] of Object.entries(meta || {})) {
    try {
      obj[key] = value
    } catch (_unused) {
      Object.defineProperty(obj, key, {
        configurable: true,
        get () {
          return value
        }
      })
    }
  }
  return obj
}
const elementMap = /* @__PURE__ */ new Map()
const Data = {
  set (element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, /* @__PURE__ */ new Map())
    }
    const instanceMap = elementMap.get(element)
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`)
      return
    }
    instanceMap.set(key, instance)
  },
  get (element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null
    }
    return null
  },
  remove (element, key) {
    if (!elementMap.has(element)) {
      return
    }
    const instanceMap = elementMap.get(element)
    instanceMap.delete(key)
    if (instanceMap.size === 0) {
      elementMap.delete(element)
    }
  }
}
function normalizeData (value) {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  if (value === Number(value).toString()) {
    return Number(value)
  }
  if (value === '' || value === 'null') {
    return null
  }
  if (typeof value !== 'string') {
    return value
  }
  try {
    return JSON.parse(decodeURIComponent(value))
  } catch (_unused) {
    return value
  }
}
function normalizeDataKey (key) {
  return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`)
}
const Manipulator = {
  setDataAttribute (element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value)
  },
  removeDataAttribute (element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`)
  },
  getDataAttributes (element) {
    if (!element) {
      return {}
    }
    const attributes = {}
    const bsKeys = Object.keys(element.dataset).filter((key) => key.startsWith('bs') && !key.startsWith('bsConfig'))
    for (const key of bsKeys) {
      let pureKey = key.replace(/^bs/, '')
      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length)
      attributes[pureKey] = normalizeData(element.dataset[key])
    }
    return attributes
  },
  getDataAttribute (element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`))
  }
}
class Config {
  // Getters
  static get Default () {
    return {}
  }

  static get DefaultType () {
    return {}
  }

  static get NAME () {
    throw new Error('You have to implement the static method "NAME", for each component!')
  }

  _getConfig (config2) {
    config2 = this._mergeConfigObj(config2)
    config2 = this._configAfterMerge(config2)
    this._typeCheckConfig(config2)
    return config2
  }

  _configAfterMerge (config2) {
    return config2
  }

  _mergeConfigObj (config2, element) {
    const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}
    return {
      ...this.constructor.Default,
      ...typeof jsonConfig === 'object' ? jsonConfig : {},
      ...isElement(element) ? Manipulator.getDataAttributes(element) : {},
      ...typeof config2 === 'object' ? config2 : {}
    }
  }

  _typeCheckConfig (config2, configTypes = this.constructor.DefaultType) {
    for (const property of Object.keys(configTypes)) {
      const expectedTypes = configTypes[property]
      const value = config2[property]
      const valueType = isElement(value) ? 'element' : toType(value)
      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`)
      }
    }
  }
}
const VERSION = '5.2.3'
class BaseComponent extends Config {
  constructor (element, config2) {
    super()
    element = getElement(element)
    if (!element) {
      return
    }
    this._element = element
    this._config = this._getConfig(config2)
    Data.set(this._element, this.constructor.DATA_KEY, this)
  }

  // Public
  dispose () {
    Data.remove(this._element, this.constructor.DATA_KEY)
    EventHandler.off(this._element, this.constructor.EVENT_KEY)
    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null
    }
  }

  _queueCallback (callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated)
  }

  _getConfig (config2) {
    config2 = this._mergeConfigObj(config2, this._element)
    config2 = this._configAfterMerge(config2)
    this._typeCheckConfig(config2)
    return config2
  }

  // Static
  static getInstance (element) {
    return Data.get(getElement(element), this.DATA_KEY)
  }

  static getOrCreateInstance (element, config2 = {}) {
    return this.getInstance(element) || new this(element, typeof config2 === 'object' ? config2 : null)
  }

  static get VERSION () {
    return VERSION
  }

  static get DATA_KEY () {
    return `bs.${this.NAME}`
  }

  static get EVENT_KEY () {
    return `.${this.DATA_KEY}`
  }

  static eventName (name2) {
    return `${name2}${this.EVENT_KEY}`
  }
}
const enableDismissTrigger = (component, method = 'hide') => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`
  const name2 = component.NAME
  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name2}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault()
    }
    if (isDisabled(this)) {
      return
    }
    const target = getElementFromSelector(this) || this.closest(`.${name2}`)
    const instance = component.getOrCreateInstance(target)
    instance[method]()
  })
}
const NAME$f = 'alert'
const DATA_KEY$a = 'bs.alert'
const EVENT_KEY$b = `.${DATA_KEY$a}`
const EVENT_CLOSE = `close${EVENT_KEY$b}`
const EVENT_CLOSED = `closed${EVENT_KEY$b}`
const CLASS_NAME_FADE$5 = 'fade'
const CLASS_NAME_SHOW$8 = 'show'
class Alert extends BaseComponent {
  // Getters
  static get NAME () {
    return NAME$f
  }

  // Public
  close () {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE)
    if (closeEvent.defaultPrevented) {
      return
    }
    this._element.classList.remove(CLASS_NAME_SHOW$8)
    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5)
    this._queueCallback(() => this._destroyElement(), this._element, isAnimated)
  }

  // Private
  _destroyElement () {
    this._element.remove()
    EventHandler.trigger(this._element, EVENT_CLOSED)
    this.dispose()
  }

  // Static
  static jQueryInterface (config2) {
    return this.each(function () {
      const data = Alert.getOrCreateInstance(this)
      if (typeof config2 !== 'string') {
        return
      }
      if (data[config2] === void 0 || config2.startsWith('_') || config2 === 'constructor') {
        throw new TypeError(`No method named "${config2}"`)
      }
      data[config2](this)
    })
  }
}
enableDismissTrigger(Alert, 'close')
defineJQueryPlugin(Alert)
const NAME$e = 'button'
const DATA_KEY$9 = 'bs.button'
const EVENT_KEY$a = `.${DATA_KEY$9}`
const DATA_API_KEY$6 = '.data-api'
const CLASS_NAME_ACTIVE$3 = 'active'
const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]'
const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`
class Button extends BaseComponent {
  // Getters
  static get NAME () {
    return NAME$e
  }

  // Public
  toggle () {
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3))
  }

  // Static
  static jQueryInterface (config2) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this)
      if (config2 === 'toggle') {
        data[config2]()
      }
    })
  }
}
EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, (event) => {
  event.preventDefault()
  const button = event.target.closest(SELECTOR_DATA_TOGGLE$5)
  const data = Button.getOrCreateInstance(button)
  data.toggle()
})
defineJQueryPlugin(Button)
const SelectorEngine = {
  find (selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector))
  },
  findOne (selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector)
  },
  children (element, selector) {
    return [].concat(...element.children).filter((child) => child.matches(selector))
  },
  parents (element, selector) {
    const parents = []
    let ancestor = element.parentNode.closest(selector)
    while (ancestor) {
      parents.push(ancestor)
      ancestor = ancestor.parentNode.closest(selector)
    }
    return parents
  },
  prev (element, selector) {
    let previous = element.previousElementSibling
    while (previous) {
      if (previous.matches(selector)) {
        return [previous]
      }
      previous = previous.previousElementSibling
    }
    return []
  },
  // TODO: this is now unused; remove later along with prev()
  next (element, selector) {
    let next = element.nextElementSibling
    while (next) {
      if (next.matches(selector)) {
        return [next]
      }
      next = next.nextElementSibling
    }
    return []
  },
  focusableChildren (element) {
    const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map((selector) => `${selector}:not([tabindex^="-"])`).join(',')
    return this.find(focusables, element).filter((el) => !isDisabled(el) && isVisible(el))
  }
}
const NAME$d = 'swipe'
const EVENT_KEY$9 = '.bs.swipe'
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`
const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`
const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`
const POINTER_TYPE_TOUCH = 'touch'
const POINTER_TYPE_PEN = 'pen'
const CLASS_NAME_POINTER_EVENT = 'pointer-event'
const SWIPE_THRESHOLD = 40
const Default$c = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null
}
const DefaultType$c = {
  endCallback: '(function|null)',
  leftCallback: '(function|null)',
  rightCallback: '(function|null)'
}
class Swipe extends Config {
  constructor (element, config2) {
    super()
    this._element = element
    if (!element || !Swipe.isSupported()) {
      return
    }
    this._config = this._getConfig(config2)
    this._deltaX = 0
    this._supportPointerEvents = Boolean(window.PointerEvent)
    this._initEvents()
  }

  // Getters
  static get Default () {
    return Default$c
  }

  static get DefaultType () {
    return DefaultType$c
  }

  static get NAME () {
    return NAME$d
  }

  // Public
  dispose () {
    EventHandler.off(this._element, EVENT_KEY$9)
  }

  // Private
  _start (event) {
    if (!this._supportPointerEvents) {
      this._deltaX = event.touches[0].clientX
      return
    }
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX
    }
  }

  _end (event) {
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX - this._deltaX
    }
    this._handleSwipe()
    execute(this._config.endCallback)
  }

  _move (event) {
    this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX
  }

  _handleSwipe () {
    const absDeltaX = Math.abs(this._deltaX)
    if (absDeltaX <= SWIPE_THRESHOLD) {
      return
    }
    const direction = absDeltaX / this._deltaX
    this._deltaX = 0
    if (!direction) {
      return
    }
    execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback)
  }

  _initEvents () {
    if (this._supportPointerEvents) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, (event) => this._start(event))
      EventHandler.on(this._element, EVENT_POINTERUP, (event) => this._end(event))
      this._element.classList.add(CLASS_NAME_POINTER_EVENT)
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, (event) => this._start(event))
      EventHandler.on(this._element, EVENT_TOUCHMOVE, (event) => this._move(event))
      EventHandler.on(this._element, EVENT_TOUCHEND, (event) => this._end(event))
    }
  }

  _eventIsPointerPenTouch (event) {
    return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)
  }

  // Static
  static isSupported () {
    return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0
  }
}
const NAME$c = 'carousel'
const DATA_KEY$8 = 'bs.carousel'
const EVENT_KEY$8 = `.${DATA_KEY$8}`
const DATA_API_KEY$5 = '.data-api'
const ARROW_LEFT_KEY$1 = 'ArrowLeft'
const ARROW_RIGHT_KEY$1 = 'ArrowRight'
const TOUCHEVENT_COMPAT_WAIT = 500
const ORDER_NEXT = 'next'
const ORDER_PREV = 'prev'
const DIRECTION_LEFT = 'left'
const DIRECTION_RIGHT = 'right'
const EVENT_SLIDE = `slide${EVENT_KEY$8}`
const EVENT_SLID = `slid${EVENT_KEY$8}`
const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`
const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`
const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`
const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`
const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`
const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`
const CLASS_NAME_CAROUSEL = 'carousel'
const CLASS_NAME_ACTIVE$2 = 'active'
const CLASS_NAME_SLIDE = 'slide'
const CLASS_NAME_END = 'carousel-item-end'
const CLASS_NAME_START = 'carousel-item-start'
const CLASS_NAME_NEXT = 'carousel-item-next'
const CLASS_NAME_PREV = 'carousel-item-prev'
const SELECTOR_ACTIVE = '.active'
const SELECTOR_ITEM = '.carousel-item'
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM
const SELECTOR_ITEM_IMG = '.carousel-item img'
const SELECTOR_INDICATORS = '.carousel-indicators'
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]'
const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]'
const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
}
const Default$b = {
  interval: 5e3,
  keyboard: true,
  pause: 'hover',
  ride: false,
  touch: true,
  wrap: true
}
const DefaultType$b = {
  interval: '(number|boolean)',
  // TODO:v6 remove boolean support
  keyboard: 'boolean',
  pause: '(string|boolean)',
  ride: '(boolean|string)',
  touch: 'boolean',
  wrap: 'boolean'
}
class Carousel extends BaseComponent {
  constructor (element, config2) {
    super(element, config2)
    this._interval = null
    this._activeElement = null
    this._isSliding = false
    this.touchTimeout = null
    this._swipeHelper = null
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element)
    this._addEventListeners()
    if (this._config.ride === CLASS_NAME_CAROUSEL) {
      this.cycle()
    }
  }

  // Getters
  static get Default () {
    return Default$b
  }

  static get DefaultType () {
    return DefaultType$b
  }

  static get NAME () {
    return NAME$c
  }

  // Public
  next () {
    this._slide(ORDER_NEXT)
  }

  nextWhenVisible () {
    if (!document.hidden && isVisible(this._element)) {
      this.next()
    }
  }

  prev () {
    this._slide(ORDER_PREV)
  }

  pause () {
    if (this._isSliding) {
      triggerTransitionEnd(this._element)
    }
    this._clearInterval()
  }

  cycle () {
    this._clearInterval()
    this._updateInterval()
    this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval)
  }

  _maybeEnableCycle () {
    if (!this._config.ride) {
      return
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.cycle())
      return
    }
    this.cycle()
  }

  to (index) {
    const items = this._getItems()
    if (index > items.length - 1 || index < 0) {
      return
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index))
      return
    }
    const activeIndex = this._getItemIndex(this._getActive())
    if (activeIndex === index) {
      return
    }
    const order2 = index > activeIndex ? ORDER_NEXT : ORDER_PREV
    this._slide(order2, items[index])
  }

  dispose () {
    if (this._swipeHelper) {
      this._swipeHelper.dispose()
    }
    super.dispose()
  }

  // Private
  _configAfterMerge (config2) {
    config2.defaultInterval = config2.interval
    return config2
  }

  _addEventListeners () {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN$1, (event) => this._keydown(event))
    }
    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause())
      EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle())
    }
    if (this._config.touch && Swipe.isSupported()) {
      this._addTouchEventListeners()
    }
  }

  _addTouchEventListeners () {
    for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
      EventHandler.on(img, EVENT_DRAG_START, (event) => event.preventDefault())
    }
    const endCallBack = () => {
      if (this._config.pause !== 'hover') {
        return
      }
      this.pause()
      if (this.touchTimeout) {
        clearTimeout(this.touchTimeout)
      }
      this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval)
    }
    const swipeConfig = {
      leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
      rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
      endCallback: endCallBack
    }
    this._swipeHelper = new Swipe(this._element, swipeConfig)
  }

  _keydown (event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return
    }
    const direction = KEY_TO_DIRECTION[event.key]
    if (direction) {
      event.preventDefault()
      this._slide(this._directionToOrder(direction))
    }
  }

  _getItemIndex (element) {
    return this._getItems().indexOf(element)
  }

  _setActiveIndicatorElement (index) {
    if (!this._indicatorsElement) {
      return
    }
    const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement)
    activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2)
    activeIndicator.removeAttribute('aria-current')
    const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement)
    if (newActiveIndicator) {
      newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2)
      newActiveIndicator.setAttribute('aria-current', 'true')
    }
  }

  _updateInterval () {
    const element = this._activeElement || this._getActive()
    if (!element) {
      return
    }
    const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10)
    this._config.interval = elementInterval || this._config.defaultInterval
  }

  _slide (order2, element = null) {
    if (this._isSliding) {
      return
    }
    const activeElement = this._getActive()
    const isNext = order2 === ORDER_NEXT
    const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap)
    if (nextElement === activeElement) {
      return
    }
    const nextElementIndex = this._getItemIndex(nextElement)
    const triggerEvent = (eventName) => {
      return EventHandler.trigger(this._element, eventName, {
        relatedTarget: nextElement,
        direction: this._orderToDirection(order2),
        from: this._getItemIndex(activeElement),
        to: nextElementIndex
      })
    }
    const slideEvent = triggerEvent(EVENT_SLIDE)
    if (slideEvent.defaultPrevented) {
      return
    }
    if (!activeElement || !nextElement) {
      return
    }
    const isCycling = Boolean(this._interval)
    this.pause()
    this._isSliding = true
    this._setActiveIndicatorElement(nextElementIndex)
    this._activeElement = nextElement
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV
    nextElement.classList.add(orderClassName)
    reflow(nextElement)
    activeElement.classList.add(directionalClassName)
    nextElement.classList.add(directionalClassName)
    const completeCallBack = () => {
      nextElement.classList.remove(directionalClassName, orderClassName)
      nextElement.classList.add(CLASS_NAME_ACTIVE$2)
      activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName)
      this._isSliding = false
      triggerEvent(EVENT_SLID)
    }
    this._queueCallback(completeCallBack, activeElement, this._isAnimated())
    if (isCycling) {
      this.cycle()
    }
  }

  _isAnimated () {
    return this._element.classList.contains(CLASS_NAME_SLIDE)
  }

  _getActive () {
    return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element)
  }

  _getItems () {
    return SelectorEngine.find(SELECTOR_ITEM, this._element)
  }

  _clearInterval () {
    if (this._interval) {
      clearInterval(this._interval)
      this._interval = null
    }
  }

  _directionToOrder (direction) {
    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT
    }
    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV
  }

  _orderToDirection (order2) {
    if (isRTL()) {
      return order2 === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT
    }
    return order2 === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT
  }

  // Static
  static jQueryInterface (config2) {
    return this.each(function () {
      const data = Carousel.getOrCreateInstance(this, config2)
      if (typeof config2 === 'number') {
        data.to(config2)
        return
      }
      if (typeof config2 === 'string') {
        if (data[config2] === void 0 || config2.startsWith('_') || config2 === 'constructor') {
          throw new TypeError(`No method named "${config2}"`)
        }
        data[config2]()
      }
    })
  }
}
EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function (event) {
  const target = getElementFromSelector(this)
  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return
  }
  event.preventDefault()
  const carousel = Carousel.getOrCreateInstance(target)
  const slideIndex = this.getAttribute('data-bs-slide-to')
  if (slideIndex) {
    carousel.to(slideIndex)
    carousel._maybeEnableCycle()
    return
  }
  if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
    carousel.next()
    carousel._maybeEnableCycle()
    return
  }
  carousel.prev()
  carousel._maybeEnableCycle()
})
EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE)
  for (const carousel of carousels) {
    Carousel.getOrCreateInstance(carousel)
  }
})
defineJQueryPlugin(Carousel)
const NAME$b = 'collapse'
const DATA_KEY$7 = 'bs.collapse'
const EVENT_KEY$7 = `.${DATA_KEY$7}`
const DATA_API_KEY$4 = '.data-api'
const EVENT_SHOW$6 = `show${EVENT_KEY$7}`
const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`
const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`
const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`
const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`
const CLASS_NAME_SHOW$7 = 'show'
const CLASS_NAME_COLLAPSE = 'collapse'
const CLASS_NAME_COLLAPSING = 'collapsing'
const CLASS_NAME_COLLAPSED = 'collapsed'
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`
const CLASS_NAME_HORIZONTAL = 'collapse-horizontal'
const WIDTH = 'width'
const HEIGHT = 'height'
const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing'
const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]'
const Default$a = {
  parent: null,
  toggle: true
}
const DefaultType$a = {
  parent: '(null|element)',
  toggle: 'boolean'
}
class Collapse extends BaseComponent {
  constructor (element, config2) {
    super(element, config2)
    this._isTransitioning = false
    this._triggerArray = []
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4)
    for (const elem of toggleList) {
      const selector = getSelectorFromElement(elem)
      const filterElement = SelectorEngine.find(selector).filter((foundElement) => foundElement === this._element)
      if (selector !== null && filterElement.length) {
        this._triggerArray.push(elem)
      }
    }
    this._initializeChildren()
    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown())
    }
    if (this._config.toggle) {
      this.toggle()
    }
  }

  // Getters
  static get Default () {
    return Default$a
  }

  static get DefaultType () {
    return DefaultType$a
  }

  static get NAME () {
    return NAME$b
  }

  // Public
  toggle () {
    if (this._isShown()) {
      this.hide()
    } else {
      this.show()
    }
  }

  show () {
    if (this._isTransitioning || this._isShown()) {
      return
    }
    let activeChildren = []
    if (this._config.parent) {
      activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter((element) => element !== this._element).map((element) => Collapse.getOrCreateInstance(element, {
        toggle: false
      }))
    }
    if (activeChildren.length && activeChildren[0]._isTransitioning) {
      return
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6)
    if (startEvent.defaultPrevented) {
      return
    }
    for (const activeInstance of activeChildren) {
      activeInstance.hide()
    }
    const dimension = this._getDimension()
    this._element.classList.remove(CLASS_NAME_COLLAPSE)
    this._element.classList.add(CLASS_NAME_COLLAPSING)
    this._element.style[dimension] = 0
    this._addAriaAndCollapsedClass(this._triggerArray, true)
    this._isTransitioning = true
    const complete = () => {
      this._isTransitioning = false
      this._element.classList.remove(CLASS_NAME_COLLAPSING)
      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7)
      this._element.style[dimension] = ''
      EventHandler.trigger(this._element, EVENT_SHOWN$6)
    }
    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1)
    const scrollSize = `scroll${capitalizedDimension}`
    this._queueCallback(complete, this._element, true)
    this._element.style[dimension] = `${this._element[scrollSize]}px`
  }

  hide () {
    if (this._isTransitioning || !this._isShown()) {
      return
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6)
    if (startEvent.defaultPrevented) {
      return
    }
    const dimension = this._getDimension()
    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`
    reflow(this._element)
    this._element.classList.add(CLASS_NAME_COLLAPSING)
    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7)
    for (const trigger of this._triggerArray) {
      const element = getElementFromSelector(trigger)
      if (element && !this._isShown(element)) {
        this._addAriaAndCollapsedClass([trigger], false)
      }
    }
    this._isTransitioning = true
    const complete = () => {
      this._isTransitioning = false
      this._element.classList.remove(CLASS_NAME_COLLAPSING)
      this._element.classList.add(CLASS_NAME_COLLAPSE)
      EventHandler.trigger(this._element, EVENT_HIDDEN$6)
    }
    this._element.style[dimension] = ''
    this._queueCallback(complete, this._element, true)
  }

  _isShown (element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$7)
  }

  // Private
  _configAfterMerge (config2) {
    config2.toggle = Boolean(config2.toggle)
    config2.parent = getElement(config2.parent)
    return config2
  }

  _getDimension () {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT
  }

  _initializeChildren () {
    if (!this._config.parent) {
      return
    }
    const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4)
    for (const element of children) {
      const selected = getElementFromSelector(element)
      if (selected) {
        this._addAriaAndCollapsedClass([element], this._isShown(selected))
      }
    }
  }

  _getFirstLevelChildren (selector) {
    const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent)
    return SelectorEngine.find(selector, this._config.parent).filter((element) => !children.includes(element))
  }

  _addAriaAndCollapsedClass (triggerArray, isOpen) {
    if (!triggerArray.length) {
      return
    }
    for (const element of triggerArray) {
      element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen)
      element.setAttribute('aria-expanded', isOpen)
    }
  }

  // Static
  static jQueryInterface (config2) {
    const _config = {}
    if (typeof config2 === 'string' && /show|hide/.test(config2)) {
      _config.toggle = false
    }
    return this.each(function () {
      const data = Collapse.getOrCreateInstance(this, _config)
      if (typeof config2 === 'string') {
        if (typeof data[config2] === 'undefined') {
          throw new TypeError(`No method named "${config2}"`)
        }
        data[config2]()
      }
    })
  }
}
EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
    event.preventDefault()
  }
  const selector = getSelectorFromElement(this)
  const selectorElements = SelectorEngine.find(selector)
  for (const element of selectorElements) {
    Collapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle()
  }
})
defineJQueryPlugin(Collapse)
const NAME$a = 'dropdown'
const DATA_KEY$6 = 'bs.dropdown'
const EVENT_KEY$6 = `.${DATA_KEY$6}`
const DATA_API_KEY$3 = '.data-api'
const ESCAPE_KEY$2 = 'Escape'
const TAB_KEY$1 = 'Tab'
const ARROW_UP_KEY$1 = 'ArrowUp'
const ARROW_DOWN_KEY$1 = 'ArrowDown'
const RIGHT_MOUSE_BUTTON = 2
const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`
const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`
const EVENT_SHOW$5 = `show${EVENT_KEY$6}`
const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`
const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`
const CLASS_NAME_SHOW$6 = 'show'
const CLASS_NAME_DROPUP = 'dropup'
const CLASS_NAME_DROPEND = 'dropend'
const CLASS_NAME_DROPSTART = 'dropstart'
const CLASS_NAME_DROPUP_CENTER = 'dropup-center'
const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center'
const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)'
const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`
const SELECTOR_MENU = '.dropdown-menu'
const SELECTOR_NAVBAR = '.navbar'
const SELECTOR_NAVBAR_NAV = '.navbar-nav'
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'
const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start'
const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end'
const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start'
const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end'
const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start'
const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start'
const PLACEMENT_TOPCENTER = 'top'
const PLACEMENT_BOTTOMCENTER = 'bottom'
const Default$9 = {
  autoClose: true,
  boundary: 'clippingParents',
  display: 'dynamic',
  offset: [0, 2],
  popperConfig: null,
  reference: 'toggle'
}
const DefaultType$9 = {
  autoClose: '(boolean|string)',
  boundary: '(string|element)',
  display: 'string',
  offset: '(array|string|function)',
  popperConfig: '(null|object|function)',
  reference: '(string|element|object)'
}
class Dropdown extends BaseComponent {
  constructor (element, config2) {
    super(element, config2)
    this._popper = null
    this._parent = this._element.parentNode
    this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent)
    this._inNavbar = this._detectNavbar()
  }

  // Getters
  static get Default () {
    return Default$9
  }

  static get DefaultType () {
    return DefaultType$9
  }

  static get NAME () {
    return NAME$a
  }

  // Public
  toggle () {
    return this._isShown() ? this.hide() : this.show()
  }

  show () {
    if (isDisabled(this._element) || this._isShown()) {
      return
    }
    const relatedTarget = {
      relatedTarget: this._element
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget)
    if (showEvent.defaultPrevented) {
      return
    }
    this._createPopper()
    if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop$2)
      }
    }
    this._element.focus()
    this._element.setAttribute('aria-expanded', true)
    this._menu.classList.add(CLASS_NAME_SHOW$6)
    this._element.classList.add(CLASS_NAME_SHOW$6)
    EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget)
  }

  hide () {
    if (isDisabled(this._element) || !this._isShown()) {
      return
    }
    const relatedTarget = {
      relatedTarget: this._element
    }
    this._completeHide(relatedTarget)
  }

  dispose () {
    if (this._popper) {
      this._popper.destroy()
    }
    super.dispose()
  }

  update () {
    this._inNavbar = this._detectNavbar()
    if (this._popper) {
      this._popper.update()
    }
  }

  // Private
  _completeHide (relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget)
    if (hideEvent.defaultPrevented) {
      return
    }
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop$2)
      }
    }
    if (this._popper) {
      this._popper.destroy()
    }
    this._menu.classList.remove(CLASS_NAME_SHOW$6)
    this._element.classList.remove(CLASS_NAME_SHOW$6)
    this._element.setAttribute('aria-expanded', 'false')
    Manipulator.removeDataAttribute(this._menu, 'popper')
    EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget)
  }

  _getConfig (config2) {
    config2 = super._getConfig(config2)
    if (typeof config2.reference === 'object' && !isElement(config2.reference) && typeof config2.reference.getBoundingClientRect !== 'function') {
      throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`)
    }
    return config2
  }

  _createPopper () {
    if (typeof Popper === 'undefined') {
      throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)")
    }
    let referenceElement = this._element
    if (this._config.reference === 'parent') {
      referenceElement = this._parent
    } else if (isElement(this._config.reference)) {
      referenceElement = getElement(this._config.reference)
    } else if (typeof this._config.reference === 'object') {
      referenceElement = this._config.reference
    }
    const popperConfig = this._getPopperConfig()
    this._popper = createPopper(referenceElement, this._menu, popperConfig)
  }

  _isShown () {
    return this._menu.classList.contains(CLASS_NAME_SHOW$6)
  }

  _getPlacement () {
    const parentDropdown = this._parent
    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
      return PLACEMENT_TOPCENTER
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
      return PLACEMENT_BOTTOMCENTER
    }
    const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end'
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP
    }
    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM
  }

  _detectNavbar () {
    return this._element.closest(SELECTOR_NAVBAR) !== null
  }

  _getOffset () {
    const {
      offset: offset2
    } = this._config
    if (typeof offset2 === 'string') {
      return offset2.split(',').map((value) => Number.parseInt(value, 10))
    }
    if (typeof offset2 === 'function') {
      return (popperData) => offset2(popperData, this._element)
    }
    return offset2
  }

  _getPopperConfig () {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [{
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }]
    }
    if (this._inNavbar || this._config.display === 'static') {
      Manipulator.setDataAttribute(this._menu, 'popper', 'static')
      defaultBsPopperConfig.modifiers = [{
        name: 'applyStyles',
        enabled: false
      }]
    }
    return {
      ...defaultBsPopperConfig,
      ...typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig
    }
  }

  _selectMenuItem ({
    key,
    target
  }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter((element) => isVisible(element))
    if (!items.length) {
      return
    }
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus()
  }

  // Static
  static jQueryInterface (config2) {
    return this.each(function () {
      const data = Dropdown.getOrCreateInstance(this, config2)
      if (typeof config2 !== 'string') {
        return
      }
      if (typeof data[config2] === 'undefined') {
        throw new TypeError(`No method named "${config2}"`)
      }
      data[config2]()
    })
  }

  static clearMenus (event) {
    if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
      return
    }
    const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN)
    for (const toggle of openToggles) {
      const context = Dropdown.getInstance(toggle)
      if (!context || context._config.autoClose === false) {
        continue
      }
      const composedPath = event.composedPath()
      const isMenuTarget = composedPath.includes(context._menu)
      if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
        continue
      }
      if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
        continue
      }
      const relatedTarget = {
        relatedTarget: context._element
      }
      if (event.type === 'click') {
        relatedTarget.clickEvent = event
      }
      context._completeHide(relatedTarget)
    }
  }

  static dataApiKeydownHandler (event) {
    const isInput = /input|textarea/i.test(event.target.tagName)
    const isEscapeEvent = event.key === ESCAPE_KEY$2
    const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key)
    if (!isUpOrDownEvent && !isEscapeEvent) {
      return
    }
    if (isInput && !isEscapeEvent) {
      return
    }
    event.preventDefault()
    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode)
    const instance = Dropdown.getOrCreateInstance(getToggleButton)
    if (isUpOrDownEvent) {
      event.stopPropagation()
      instance.show()
      instance._selectMenuItem(event)
      return
    }
    if (instance._isShown()) {
      event.stopPropagation()
      instance.hide()
      getToggleButton.focus()
    }
  }
}
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler)
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler)
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus)
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus)
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
  event.preventDefault()
  Dropdown.getOrCreateInstance(this).toggle()
})
defineJQueryPlugin(Dropdown)
const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
const SELECTOR_STICKY_CONTENT = '.sticky-top'
const PROPERTY_PADDING = 'padding-right'
const PROPERTY_MARGIN = 'margin-right'
class ScrollBarHelper {
  constructor () {
    this._element = document.body
  }

  // Public
  getWidth () {
    const documentWidth = document.documentElement.clientWidth
    return Math.abs(window.innerWidth - documentWidth)
  }

  hide () {
    const width = this.getWidth()
    this._disableOverFlow()
    this._setElementAttributes(this._element, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width)
    this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width)
    this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, (calculatedValue) => calculatedValue - width)
  }

  reset () {
    this._resetElementAttributes(this._element, 'overflow')
    this._resetElementAttributes(this._element, PROPERTY_PADDING)
    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING)
    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN)
  }

  isOverflowing () {
    return this.getWidth() > 0
  }

  // Private
  _disableOverFlow () {
    this._saveInitialAttribute(this._element, 'overflow')
    this._element.style.overflow = 'hidden'
  }

  _setElementAttributes (selector, styleProperty, callback) {
    const scrollbarWidth = this.getWidth()
    const manipulationCallBack = (element) => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return
      }
      this._saveInitialAttribute(element, styleProperty)
      const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty)
      element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`)
    }
    this._applyManipulationCallback(selector, manipulationCallBack)
  }

  _saveInitialAttribute (element, styleProperty) {
    const actualValue = element.style.getPropertyValue(styleProperty)
    if (actualValue) {
      Manipulator.setDataAttribute(element, styleProperty, actualValue)
    }
  }

  _resetElementAttributes (selector, styleProperty) {
    const manipulationCallBack = (element) => {
      const value = Manipulator.getDataAttribute(element, styleProperty)
      if (value === null) {
        element.style.removeProperty(styleProperty)
        return
      }
      Manipulator.removeDataAttribute(element, styleProperty)
      element.style.setProperty(styleProperty, value)
    }
    this._applyManipulationCallback(selector, manipulationCallBack)
  }

  _applyManipulationCallback (selector, callBack) {
    if (isElement(selector)) {
      callBack(selector)
      return
    }
    for (const sel of SelectorEngine.find(selector, this._element)) {
      callBack(sel)
    }
  }
}
const NAME$9 = 'backdrop'
const CLASS_NAME_FADE$4 = 'fade'
const CLASS_NAME_SHOW$5 = 'show'
const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`
const Default$8 = {
  className: 'modal-backdrop',
  clickCallback: null,
  isAnimated: false,
  isVisible: true,
  // if false, we use the backdrop helper without adding any element to the dom
  rootElement: 'body'
  // give the choice to place backdrop under different elements
}
const DefaultType$8 = {
  className: 'string',
  clickCallback: '(function|null)',
  isAnimated: 'boolean',
  isVisible: 'boolean',
  rootElement: '(element|string)'
}
class Backdrop extends Config {
  constructor (config2) {
    super()
    this._config = this._getConfig(config2)
    this._isAppended = false
    this._element = null
  }

  // Getters
  static get Default () {
    return Default$8
  }

  static get DefaultType () {
    return DefaultType$8
  }

  static get NAME () {
    return NAME$9
  }

  // Public
  show (callback) {
    if (!this._config.isVisible) {
      execute(callback)
      return
    }
    this._append()
    const element = this._getElement()
    if (this._config.isAnimated) {
      reflow(element)
    }
    element.classList.add(CLASS_NAME_SHOW$5)
    this._emulateAnimation(() => {
      execute(callback)
    })
  }

  hide (callback) {
    if (!this._config.isVisible) {
      execute(callback)
      return
    }
    this._getElement().classList.remove(CLASS_NAME_SHOW$5)
    this._emulateAnimation(() => {
      this.dispose()
      execute(callback)
    })
  }

  dispose () {
    if (!this._isAppended) {
      return
    }
    EventHandler.off(this._element, EVENT_MOUSEDOWN)
    this._element.remove()
    this._isAppended = false
  }

  // Private
  _getElement () {
    if (!this._element) {
      const backdrop = document.createElement('div')
      backdrop.className = this._config.className
      if (this._config.isAnimated) {
        backdrop.classList.add(CLASS_NAME_FADE$4)
      }
      this._element = backdrop
    }
    return this._element
  }

  _configAfterMerge (config2) {
    config2.rootElement = getElement(config2.rootElement)
    return config2
  }

  _append () {
    if (this._isAppended) {
      return
    }
    const element = this._getElement()
    this._config.rootElement.append(element)
    EventHandler.on(element, EVENT_MOUSEDOWN, () => {
      execute(this._config.clickCallback)
    })
    this._isAppended = true
  }

  _emulateAnimation (callback) {
    executeAfterTransition(callback, this._getElement(), this._config.isAnimated)
  }
}
const NAME$8 = 'focustrap'
const DATA_KEY$5 = 'bs.focustrap'
const EVENT_KEY$5 = `.${DATA_KEY$5}`
const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`
const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`
const TAB_KEY = 'Tab'
const TAB_NAV_FORWARD = 'forward'
const TAB_NAV_BACKWARD = 'backward'
const Default$7 = {
  autofocus: true,
  trapElement: null
  // The element to trap focus inside of
}
const DefaultType$7 = {
  autofocus: 'boolean',
  trapElement: 'element'
}
class FocusTrap extends Config {
  constructor (config2) {
    super()
    this._config = this._getConfig(config2)
    this._isActive = false
    this._lastTabNavDirection = null
  }

  // Getters
  static get Default () {
    return Default$7
  }

  static get DefaultType () {
    return DefaultType$7
  }

  static get NAME () {
    return NAME$8
  }

  // Public
  activate () {
    if (this._isActive) {
      return
    }
    if (this._config.autofocus) {
      this._config.trapElement.focus()
    }
    EventHandler.off(document, EVENT_KEY$5)
    EventHandler.on(document, EVENT_FOCUSIN$2, (event) => this._handleFocusin(event))
    EventHandler.on(document, EVENT_KEYDOWN_TAB, (event) => this._handleKeydown(event))
    this._isActive = true
  }

  deactivate () {
    if (!this._isActive) {
      return
    }
    this._isActive = false
    EventHandler.off(document, EVENT_KEY$5)
  }

  // Private
  _handleFocusin (event) {
    const {
      trapElement
    } = this._config
    if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
      return
    }
    const elements = SelectorEngine.focusableChildren(trapElement)
    if (elements.length === 0) {
      trapElement.focus()
    } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
      elements[elements.length - 1].focus()
    } else {
      elements[0].focus()
    }
  }

  _handleKeydown (event) {
    if (event.key !== TAB_KEY) {
      return
    }
    this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD
  }
}
const NAME$7 = 'modal'
const DATA_KEY$4 = 'bs.modal'
const EVENT_KEY$4 = `.${DATA_KEY$4}`
const DATA_API_KEY$2 = '.data-api'
const ESCAPE_KEY$1 = 'Escape'
const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`
const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`
const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`
const EVENT_SHOW$4 = `show${EVENT_KEY$4}`
const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`
const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`
const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`
const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`
const CLASS_NAME_OPEN = 'modal-open'
const CLASS_NAME_FADE$3 = 'fade'
const CLASS_NAME_SHOW$4 = 'show'
const CLASS_NAME_STATIC = 'modal-static'
const OPEN_SELECTOR$1 = '.modal.show'
const SELECTOR_DIALOG = '.modal-dialog'
const SELECTOR_MODAL_BODY = '.modal-body'
const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]'
const Default$6 = {
  backdrop: true,
  focus: true,
  keyboard: true
}
const DefaultType$6 = {
  backdrop: '(boolean|string)',
  focus: 'boolean',
  keyboard: 'boolean'
}
class Modal extends BaseComponent {
  constructor (element, config2) {
    super(element, config2)
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element)
    this._backdrop = this._initializeBackDrop()
    this._focustrap = this._initializeFocusTrap()
    this._isShown = false
    this._isTransitioning = false
    this._scrollBar = new ScrollBarHelper()
    this._addEventListeners()
  }

  // Getters
  static get Default () {
    return Default$6
  }

  static get DefaultType () {
    return DefaultType$6
  }

  static get NAME () {
    return NAME$7
  }

  // Public
  toggle (relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget)
  }

  show (relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
      relatedTarget
    })
    if (showEvent.defaultPrevented) {
      return
    }
    this._isShown = true
    this._isTransitioning = true
    this._scrollBar.hide()
    document.body.classList.add(CLASS_NAME_OPEN)
    this._adjustDialog()
    this._backdrop.show(() => this._showElement(relatedTarget))
  }

  hide () {
    if (!this._isShown || this._isTransitioning) {
      return
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4)
    if (hideEvent.defaultPrevented) {
      return
    }
    this._isShown = false
    this._isTransitioning = true
    this._focustrap.deactivate()
    this._element.classList.remove(CLASS_NAME_SHOW$4)
    this._queueCallback(() => this._hideModal(), this._element, this._isAnimated())
  }

  dispose () {
    for (const htmlElement of [window, this._dialog]) {
      EventHandler.off(htmlElement, EVENT_KEY$4)
    }
    this._backdrop.dispose()
    this._focustrap.deactivate()
    super.dispose()
  }

  handleUpdate () {
    this._adjustDialog()
  }

  // Private
  _initializeBackDrop () {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop),
      // 'static' option will be translated to true, and booleans will keep their value,
      isAnimated: this._isAnimated()
    })
  }

  _initializeFocusTrap () {
    return new FocusTrap({
      trapElement: this._element
    })
  }

  _showElement (relatedTarget) {
    if (!document.body.contains(this._element)) {
      document.body.append(this._element)
    }
    this._element.style.display = 'block'
    this._element.removeAttribute('aria-hidden')
    this._element.setAttribute('aria-modal', true)
    this._element.setAttribute('role', 'dialog')
    this._element.scrollTop = 0
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog)
    if (modalBody) {
      modalBody.scrollTop = 0
    }
    reflow(this._element)
    this._element.classList.add(CLASS_NAME_SHOW$4)
    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.activate()
      }
      this._isTransitioning = false
      EventHandler.trigger(this._element, EVENT_SHOWN$4, {
        relatedTarget
      })
    }
    this._queueCallback(transitionComplete, this._dialog, this._isAnimated())
  }

  _addEventListeners () {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, (event) => {
      if (event.key !== ESCAPE_KEY$1) {
        return
      }
      if (this._config.keyboard) {
        event.preventDefault()
        this.hide()
        return
      }
      this._triggerBackdropTransition()
    })
    EventHandler.on(window, EVENT_RESIZE$1, () => {
      if (this._isShown && !this._isTransitioning) {
        this._adjustDialog()
      }
    })
    EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, (event) => {
      EventHandler.one(this._element, EVENT_CLICK_DISMISS, (event2) => {
        if (this._element !== event.target || this._element !== event2.target) {
          return
        }
        if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition()
          return
        }
        if (this._config.backdrop) {
          this.hide()
        }
      })
    })
  }

  _hideModal () {
    this._element.style.display = 'none'
    this._element.setAttribute('aria-hidden', true)
    this._element.removeAttribute('aria-modal')
    this._element.removeAttribute('role')
    this._isTransitioning = false
    this._backdrop.hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN)
      this._resetAdjustments()
      this._scrollBar.reset()
      EventHandler.trigger(this._element, EVENT_HIDDEN$4)
    })
  }

  _isAnimated () {
    return this._element.classList.contains(CLASS_NAME_FADE$3)
  }

  _triggerBackdropTransition () {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1)
    if (hideEvent.defaultPrevented) {
      return
    }
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight
    const initialOverflowY = this._element.style.overflowY
    if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) {
      return
    }
    if (!isModalOverflowing) {
      this._element.style.overflowY = 'hidden'
    }
    this._element.classList.add(CLASS_NAME_STATIC)
    this._queueCallback(() => {
      this._element.classList.remove(CLASS_NAME_STATIC)
      this._queueCallback(() => {
        this._element.style.overflowY = initialOverflowY
      }, this._dialog)
    }, this._dialog)
    this._element.focus()
  }

  /**
   * The following methods are used to handle overflowing modals
   */
  _adjustDialog () {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight
    const scrollbarWidth = this._scrollBar.getWidth()
    const isBodyOverflowing = scrollbarWidth > 0
    if (isBodyOverflowing && !isModalOverflowing) {
      const property = isRTL() ? 'paddingLeft' : 'paddingRight'
      this._element.style[property] = `${scrollbarWidth}px`
    }
    if (!isBodyOverflowing && isModalOverflowing) {
      const property = isRTL() ? 'paddingRight' : 'paddingLeft'
      this._element.style[property] = `${scrollbarWidth}px`
    }
  }

  _resetAdjustments () {
    this._element.style.paddingLeft = ''
    this._element.style.paddingRight = ''
  }

  // Static
  static jQueryInterface (config2, relatedTarget) {
    return this.each(function () {
      const data = Modal.getOrCreateInstance(this, config2)
      if (typeof config2 !== 'string') {
        return
      }
      if (typeof data[config2] === 'undefined') {
        throw new TypeError(`No method named "${config2}"`)
      }
      data[config2](relatedTarget)
    })
  }
}
EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
  const target = getElementFromSelector(this)
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault()
  }
  EventHandler.one(target, EVENT_SHOW$4, (showEvent) => {
    if (showEvent.defaultPrevented) {
      return
    }
    EventHandler.one(target, EVENT_HIDDEN$4, () => {
      if (isVisible(this)) {
        this.focus()
      }
    })
  })
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1)
  if (alreadyOpen) {
    Modal.getInstance(alreadyOpen).hide()
  }
  const data = Modal.getOrCreateInstance(target)
  data.toggle(this)
})
enableDismissTrigger(Modal)
defineJQueryPlugin(Modal)
const NAME$6 = 'offcanvas'
const DATA_KEY$3 = 'bs.offcanvas'
const EVENT_KEY$3 = `.${DATA_KEY$3}`
const DATA_API_KEY$1 = '.data-api'
const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`
const ESCAPE_KEY = 'Escape'
const CLASS_NAME_SHOW$3 = 'show'
const CLASS_NAME_SHOWING$1 = 'showing'
const CLASS_NAME_HIDING = 'hiding'
const CLASS_NAME_BACKDROP = 'offcanvas-backdrop'
const OPEN_SELECTOR = '.offcanvas.show'
const EVENT_SHOW$3 = `show${EVENT_KEY$3}`
const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`
const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`
const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`
const EVENT_RESIZE = `resize${EVENT_KEY$3}`
const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`
const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]'
const Default$5 = {
  backdrop: true,
  keyboard: true,
  scroll: false
}
const DefaultType$5 = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  scroll: 'boolean'
}
class Offcanvas extends BaseComponent {
  constructor (element, config2) {
    super(element, config2)
    this._isShown = false
    this._backdrop = this._initializeBackDrop()
    this._focustrap = this._initializeFocusTrap()
    this._addEventListeners()
  }

  // Getters
  static get Default () {
    return Default$5
  }

  static get DefaultType () {
    return DefaultType$5
  }

  static get NAME () {
    return NAME$6
  }

  // Public
  toggle (relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget)
  }

  show (relatedTarget) {
    if (this._isShown) {
      return
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
      relatedTarget
    })
    if (showEvent.defaultPrevented) {
      return
    }
    this._isShown = true
    this._backdrop.show()
    if (!this._config.scroll) {
      new ScrollBarHelper().hide()
    }
    this._element.setAttribute('aria-modal', true)
    this._element.setAttribute('role', 'dialog')
    this._element.classList.add(CLASS_NAME_SHOWING$1)
    const completeCallBack = () => {
      if (!this._config.scroll || this._config.backdrop) {
        this._focustrap.activate()
      }
      this._element.classList.add(CLASS_NAME_SHOW$3)
      this._element.classList.remove(CLASS_NAME_SHOWING$1)
      EventHandler.trigger(this._element, EVENT_SHOWN$3, {
        relatedTarget
      })
    }
    this._queueCallback(completeCallBack, this._element, true)
  }

  hide () {
    if (!this._isShown) {
      return
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3)
    if (hideEvent.defaultPrevented) {
      return
    }
    this._focustrap.deactivate()
    this._element.blur()
    this._isShown = false
    this._element.classList.add(CLASS_NAME_HIDING)
    this._backdrop.hide()
    const completeCallback = () => {
      this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING)
      this._element.removeAttribute('aria-modal')
      this._element.removeAttribute('role')
      if (!this._config.scroll) {
        new ScrollBarHelper().reset()
      }
      EventHandler.trigger(this._element, EVENT_HIDDEN$3)
    }
    this._queueCallback(completeCallback, this._element, true)
  }

  dispose () {
    this._backdrop.dispose()
    this._focustrap.deactivate()
    super.dispose()
  }

  // Private
  _initializeBackDrop () {
    const clickCallback = () => {
      if (this._config.backdrop === 'static') {
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED)
        return
      }
      this.hide()
    }
    const isVisible2 = Boolean(this._config.backdrop)
    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible: isVisible2,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: isVisible2 ? clickCallback : null
    })
  }

  _initializeFocusTrap () {
    return new FocusTrap({
      trapElement: this._element
    })
  }

  _addEventListeners () {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
      if (event.key !== ESCAPE_KEY) {
        return
      }
      if (!this._config.keyboard) {
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED)
        return
      }
      this.hide()
    })
  }

  // Static
  static jQueryInterface (config2) {
    return this.each(function () {
      const data = Offcanvas.getOrCreateInstance(this, config2)
      if (typeof config2 !== 'string') {
        return
      }
      if (data[config2] === void 0 || config2.startsWith('_') || config2 === 'constructor') {
        throw new TypeError(`No method named "${config2}"`)
      }
      data[config2](this)
    })
  }
}
EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
  const target = getElementFromSelector(this)
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault()
  }
  if (isDisabled(this)) {
    return
  }
  EventHandler.one(target, EVENT_HIDDEN$3, () => {
    if (isVisible(this)) {
      this.focus()
    }
  })
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR)
  if (alreadyOpen && alreadyOpen !== target) {
    Offcanvas.getInstance(alreadyOpen).hide()
  }
  const data = Offcanvas.getOrCreateInstance(target)
  data.toggle(this)
})
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
  for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
    Offcanvas.getOrCreateInstance(selector).show()
  }
})
EventHandler.on(window, EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
    if (getComputedStyle(element).position !== 'fixed') {
      Offcanvas.getOrCreateInstance(element).hide()
    }
  }
})
enableDismissTrigger(Offcanvas)
defineJQueryPlugin(Offcanvas)
const uriAttributes = /* @__PURE__ */ new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'])
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i
const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i
const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i
const allowedAttribute = (attribute, allowedAttributeList) => {
  const attributeName = attribute.nodeName.toLowerCase()
  if (allowedAttributeList.includes(attributeName)) {
    if (uriAttributes.has(attributeName)) {
      return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue))
    }
    return true
  }
  return allowedAttributeList.filter((attributeRegex) => attributeRegex instanceof RegExp).some((regex) => regex.test(attributeName))
}
const DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  div: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
}
function sanitizeHtml (unsafeHtml, allowList, sanitizeFunction) {
  if (!unsafeHtml.length) {
    return unsafeHtml
  }
  if (sanitizeFunction && typeof sanitizeFunction === 'function') {
    return sanitizeFunction(unsafeHtml)
  }
  const domParser = new window.DOMParser()
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html')
  const elements = [].concat(...createdDocument.body.querySelectorAll('*'))
  for (const element of elements) {
    const elementName = element.nodeName.toLowerCase()
    if (!Object.keys(allowList).includes(elementName)) {
      element.remove()
      continue
    }
    const attributeList = [].concat(...element.attributes)
    const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || [])
    for (const attribute of attributeList) {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName)
      }
    }
  }
  return createdDocument.body.innerHTML
}
const NAME$5 = 'TemplateFactory'
const Default$4 = {
  allowList: DefaultAllowlist,
  content: {},
  // { selector : text ,  selector2 : text2 , }
  extraClass: '',
  html: false,
  sanitize: true,
  sanitizeFn: null,
  template: '<div></div>'
}
const DefaultType$4 = {
  allowList: 'object',
  content: 'object',
  extraClass: '(string|function)',
  html: 'boolean',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  template: 'string'
}
const DefaultContentType = {
  entry: '(string|element|function|null)',
  selector: '(string|element)'
}
class TemplateFactory extends Config {
  constructor (config2) {
    super()
    this._config = this._getConfig(config2)
  }

  // Getters
  static get Default () {
    return Default$4
  }

  static get DefaultType () {
    return DefaultType$4
  }

  static get NAME () {
    return NAME$5
  }

  // Public
  getContent () {
    return Object.values(this._config.content).map((config2) => this._resolvePossibleFunction(config2)).filter(Boolean)
  }

  hasContent () {
    return this.getContent().length > 0
  }

  changeContent (content) {
    this._checkContent(content)
    this._config.content = {
      ...this._config.content,
      ...content
    }
    return this
  }

  toHtml () {
    const templateWrapper = document.createElement('div')
    templateWrapper.innerHTML = this._maybeSanitize(this._config.template)
    for (const [selector, text] of Object.entries(this._config.content)) {
      this._setContent(templateWrapper, text, selector)
    }
    const template = templateWrapper.children[0]
    const extraClass = this._resolvePossibleFunction(this._config.extraClass)
    if (extraClass) {
      template.classList.add(...extraClass.split(' '))
    }
    return template
  }

  // Private
  _typeCheckConfig (config2) {
    super._typeCheckConfig(config2)
    this._checkContent(config2.content)
  }

  _checkContent (arg) {
    for (const [selector, content] of Object.entries(arg)) {
      super._typeCheckConfig({
        selector,
        entry: content
      }, DefaultContentType)
    }
  }

  _setContent (template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template)
    if (!templateElement) {
      return
    }
    content = this._resolvePossibleFunction(content)
    if (!content) {
      templateElement.remove()
      return
    }
    if (isElement(content)) {
      this._putElementInTemplate(getElement(content), templateElement)
      return
    }
    if (this._config.html) {
      templateElement.innerHTML = this._maybeSanitize(content)
      return
    }
    templateElement.textContent = content
  }

  _maybeSanitize (arg) {
    return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg
  }

  _resolvePossibleFunction (arg) {
    return typeof arg === 'function' ? arg(this) : arg
  }

  _putElementInTemplate (element, templateElement) {
    if (this._config.html) {
      templateElement.innerHTML = ''
      templateElement.append(element)
      return
    }
    templateElement.textContent = element.textContent
  }
}
const NAME$4 = 'tooltip'
const DISALLOWED_ATTRIBUTES = /* @__PURE__ */ new Set(['sanitize', 'allowList', 'sanitizeFn'])
const CLASS_NAME_FADE$2 = 'fade'
const CLASS_NAME_MODAL = 'modal'
const CLASS_NAME_SHOW$2 = 'show'
const SELECTOR_TOOLTIP_INNER = '.tooltip-inner'
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`
const EVENT_MODAL_HIDE = 'hide.bs.modal'
const TRIGGER_HOVER = 'hover'
const TRIGGER_FOCUS = 'focus'
const TRIGGER_CLICK = 'click'
const TRIGGER_MANUAL = 'manual'
const EVENT_HIDE$2 = 'hide'
const EVENT_HIDDEN$2 = 'hidden'
const EVENT_SHOW$2 = 'show'
const EVENT_SHOWN$2 = 'shown'
const EVENT_INSERTED = 'inserted'
const EVENT_CLICK$1 = 'click'
const EVENT_FOCUSIN$1 = 'focusin'
const EVENT_FOCUSOUT$1 = 'focusout'
const EVENT_MOUSEENTER = 'mouseenter'
const EVENT_MOUSELEAVE = 'mouseleave'
const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: isRTL() ? 'left' : 'right',
  BOTTOM: 'bottom',
  LEFT: isRTL() ? 'right' : 'left'
}
const Default$3 = {
  allowList: DefaultAllowlist,
  animation: true,
  boundary: 'clippingParents',
  container: false,
  customClass: '',
  delay: 0,
  fallbackPlacements: ['top', 'right', 'bottom', 'left'],
  html: false,
  offset: [0, 0],
  placement: 'top',
  popperConfig: null,
  sanitize: true,
  sanitizeFn: null,
  selector: false,
  template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
  title: '',
  trigger: 'hover focus'
}
const DefaultType$3 = {
  allowList: 'object',
  animation: 'boolean',
  boundary: '(string|element)',
  container: '(string|element|boolean)',
  customClass: '(string|function)',
  delay: '(number|object)',
  fallbackPlacements: 'array',
  html: 'boolean',
  offset: '(array|string|function)',
  placement: '(string|function)',
  popperConfig: '(null|object|function)',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  selector: '(string|boolean)',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string'
}
class Tooltip extends BaseComponent {
  constructor (element, config2) {
    if (typeof Popper === 'undefined') {
      throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)")
    }
    super(element, config2)
    this._isEnabled = true
    this._timeout = 0
    this._isHovered = null
    this._activeTrigger = {}
    this._popper = null
    this._templateFactory = null
    this._newContent = null
    this.tip = null
    this._setListeners()
    if (!this._config.selector) {
      this._fixTitle()
    }
  }

  // Getters
  static get Default () {
    return Default$3
  }

  static get DefaultType () {
    return DefaultType$3
  }

  static get NAME () {
    return NAME$4
  }

  // Public
  enable () {
    this._isEnabled = true
  }

  disable () {
    this._isEnabled = false
  }

  toggleEnabled () {
    this._isEnabled = !this._isEnabled
  }

  toggle () {
    if (!this._isEnabled) {
      return
    }
    this._activeTrigger.click = !this._activeTrigger.click
    if (this._isShown()) {
      this._leave()
      return
    }
    this._enter()
  }

  dispose () {
    clearTimeout(this._timeout)
    EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler)
    if (this._element.getAttribute('data-bs-original-title')) {
      this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'))
    }
    this._disposePopper()
    super.dispose()
  }

  show () {
    if (this._element.style.display === 'none') {
      throw new Error('Please use show on visible elements')
    }
    if (!(this._isWithContent() && this._isEnabled)) {
      return
    }
    const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2))
    const shadowRoot = findShadowRoot(this._element)
    const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element)
    if (showEvent.defaultPrevented || !isInTheDom) {
      return
    }
    this._disposePopper()
    const tip = this._getTipElement()
    this._element.setAttribute('aria-describedby', tip.getAttribute('id'))
    const {
      container
    } = this._config
    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip)
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED))
    }
    this._popper = this._createPopper(tip)
    tip.classList.add(CLASS_NAME_SHOW$2)
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop$2)
      }
    }
    const complete = () => {
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2))
      if (this._isHovered === false) {
        this._leave()
      }
      this._isHovered = false
    }
    this._queueCallback(complete, this.tip, this._isAnimated())
  }

  hide () {
    if (!this._isShown()) {
      return
    }
    const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2))
    if (hideEvent.defaultPrevented) {
      return
    }
    const tip = this._getTipElement()
    tip.classList.remove(CLASS_NAME_SHOW$2)
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop$2)
      }
    }
    this._activeTrigger[TRIGGER_CLICK] = false
    this._activeTrigger[TRIGGER_FOCUS] = false
    this._activeTrigger[TRIGGER_HOVER] = false
    this._isHovered = null
    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return
      }
      if (!this._isHovered) {
        this._disposePopper()
      }
      this._element.removeAttribute('aria-describedby')
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2))
    }
    this._queueCallback(complete, this.tip, this._isAnimated())
  }

  update () {
    if (this._popper) {
      this._popper.update()
    }
  }

  // Protected
  _isWithContent () {
    return Boolean(this._getTitle())
  }

  _getTipElement () {
    if (!this.tip) {
      this.tip = this._createTipElement(this._newContent || this._getContentForTemplate())
    }
    return this.tip
  }

  _createTipElement (content) {
    const tip = this._getTemplateFactory(content).toHtml()
    if (!tip) {
      return null
    }
    tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2)
    tip.classList.add(`bs-${this.constructor.NAME}-auto`)
    const tipId = getUID(this.constructor.NAME).toString()
    tip.setAttribute('id', tipId)
    if (this._isAnimated()) {
      tip.classList.add(CLASS_NAME_FADE$2)
    }
    return tip
  }

  setContent (content) {
    this._newContent = content
    if (this._isShown()) {
      this._disposePopper()
      this.show()
    }
  }

  _getTemplateFactory (content) {
    if (this._templateFactory) {
      this._templateFactory.changeContent(content)
    } else {
      this._templateFactory = new TemplateFactory({
        ...this._config,
        // the `content` var has to be after `this._config`
        // to override config.content in case of popover
        content,
        extraClass: this._resolvePossibleFunction(this._config.customClass)
      })
    }
    return this._templateFactory
  }

  _getContentForTemplate () {
    return {
      [SELECTOR_TOOLTIP_INNER]: this._getTitle()
    }
  }

  _getTitle () {
    return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title')
  }

  // Private
  _initializeOnDelegatedTarget (event) {
    return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig())
  }

  _isAnimated () {
    return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2)
  }

  _isShown () {
    return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2)
  }

  _createPopper (tip) {
    const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement
    const attachment = AttachmentMap[placement.toUpperCase()]
    return createPopper(this._element, tip, this._getPopperConfig(attachment))
  }

  _getOffset () {
    const {
      offset: offset2
    } = this._config
    if (typeof offset2 === 'string') {
      return offset2.split(',').map((value) => Number.parseInt(value, 10))
    }
    if (typeof offset2 === 'function') {
      return (popperData) => offset2(popperData, this._element)
    }
    return offset2
  }

  _resolvePossibleFunction (arg) {
    return typeof arg === 'function' ? arg.call(this._element) : arg
  }

  _getPopperConfig (attachment) {
    const defaultBsPopperConfig = {
      placement: attachment,
      modifiers: [{
        name: 'flip',
        options: {
          fallbackPlacements: this._config.fallbackPlacements
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }, {
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'arrow',
        options: {
          element: `.${this.constructor.NAME}-arrow`
        }
      }, {
        name: 'preSetPlacement',
        enabled: true,
        phase: 'beforeMain',
        fn: (data) => {
          this._getTipElement().setAttribute('data-popper-placement', data.state.placement)
        }
      }]
    }
    return {
      ...defaultBsPopperConfig,
      ...typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig
    }
  }

  _setListeners () {
    const triggers = this._config.trigger.split(' ')
    for (const trigger of triggers) {
      if (trigger === 'click') {
        EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, (event) => {
          const context = this._initializeOnDelegatedTarget(event)
          context.toggle()
        })
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1)
        const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1)
        EventHandler.on(this._element, eventIn, this._config.selector, (event) => {
          const context = this._initializeOnDelegatedTarget(event)
          context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true
          context._enter()
        })
        EventHandler.on(this._element, eventOut, this._config.selector, (event) => {
          const context = this._initializeOnDelegatedTarget(event)
          context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget)
          context._leave()
        })
      }
    }
    this._hideModalHandler = () => {
      if (this._element) {
        this.hide()
      }
    }
    EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler)
  }

  _fixTitle () {
    const title = this._element.getAttribute('title')
    if (!title) {
      return
    }
    if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
      this._element.setAttribute('aria-label', title)
    }
    this._element.setAttribute('data-bs-original-title', title)
    this._element.removeAttribute('title')
  }

  _enter () {
    if (this._isShown() || this._isHovered) {
      this._isHovered = true
      return
    }
    this._isHovered = true
    this._setTimeout(() => {
      if (this._isHovered) {
        this.show()
      }
    }, this._config.delay.show)
  }

  _leave () {
    if (this._isWithActiveTrigger()) {
      return
    }
    this._isHovered = false
    this._setTimeout(() => {
      if (!this._isHovered) {
        this.hide()
      }
    }, this._config.delay.hide)
  }

  _setTimeout (handler, timeout) {
    clearTimeout(this._timeout)
    this._timeout = setTimeout(handler, timeout)
  }

  _isWithActiveTrigger () {
    return Object.values(this._activeTrigger).includes(true)
  }

  _getConfig (config2) {
    const dataAttributes = Manipulator.getDataAttributes(this._element)
    for (const dataAttribute of Object.keys(dataAttributes)) {
      if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
        delete dataAttributes[dataAttribute]
      }
    }
    config2 = {
      ...dataAttributes,
      ...typeof config2 === 'object' && config2 ? config2 : {}
    }
    config2 = this._mergeConfigObj(config2)
    config2 = this._configAfterMerge(config2)
    this._typeCheckConfig(config2)
    return config2
  }

  _configAfterMerge (config2) {
    config2.container = config2.container === false ? document.body : getElement(config2.container)
    if (typeof config2.delay === 'number') {
      config2.delay = {
        show: config2.delay,
        hide: config2.delay
      }
    }
    if (typeof config2.title === 'number') {
      config2.title = config2.title.toString()
    }
    if (typeof config2.content === 'number') {
      config2.content = config2.content.toString()
    }
    return config2
  }

  _getDelegateConfig () {
    const config2 = {}
    for (const key in this._config) {
      if (this.constructor.Default[key] !== this._config[key]) {
        config2[key] = this._config[key]
      }
    }
    config2.selector = false
    config2.trigger = 'manual'
    return config2
  }

  _disposePopper () {
    if (this._popper) {
      this._popper.destroy()
      this._popper = null
    }
    if (this.tip) {
      this.tip.remove()
      this.tip = null
    }
  }

  // Static
  static jQueryInterface (config2) {
    return this.each(function () {
      const data = Tooltip.getOrCreateInstance(this, config2)
      if (typeof config2 !== 'string') {
        return
      }
      if (typeof data[config2] === 'undefined') {
        throw new TypeError(`No method named "${config2}"`)
      }
      data[config2]()
    })
  }
}
defineJQueryPlugin(Tooltip)
const NAME$3 = 'popover'
const SELECTOR_TITLE = '.popover-header'
const SELECTOR_CONTENT = '.popover-body'
const Default$2 = {
  ...Tooltip.Default,
  content: '',
  offset: [0, 8],
  placement: 'right',
  template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
  trigger: 'click'
}
const DefaultType$2 = {
  ...Tooltip.DefaultType,
  content: '(null|string|element|function)'
}
class Popover extends Tooltip {
  // Getters
  static get Default () {
    return Default$2
  }

  static get DefaultType () {
    return DefaultType$2
  }

  static get NAME () {
    return NAME$3
  }

  // Overrides
  _isWithContent () {
    return this._getTitle() || this._getContent()
  }

  // Private
  _getContentForTemplate () {
    return {
      [SELECTOR_TITLE]: this._getTitle(),
      [SELECTOR_CONTENT]: this._getContent()
    }
  }

  _getContent () {
    return this._resolvePossibleFunction(this._config.content)
  }

  // Static
  static jQueryInterface (config2) {
    return this.each(function () {
      const data = Popover.getOrCreateInstance(this, config2)
      if (typeof config2 !== 'string') {
        return
      }
      if (typeof data[config2] === 'undefined') {
        throw new TypeError(`No method named "${config2}"`)
      }
      data[config2]()
    })
  }
}
defineJQueryPlugin(Popover)
const NAME$2 = 'scrollspy'
const DATA_KEY$2 = 'bs.scrollspy'
const EVENT_KEY$2 = `.${DATA_KEY$2}`
const DATA_API_KEY = '.data-api'
const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`
const EVENT_CLICK = `click${EVENT_KEY$2}`
const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`
const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item'
const CLASS_NAME_ACTIVE$1 = 'active'
const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]'
const SELECTOR_TARGET_LINKS = '[href]'
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group'
const SELECTOR_NAV_LINKS = '.nav-link'
const SELECTOR_NAV_ITEMS = '.nav-item'
const SELECTOR_LIST_ITEMS = '.list-group-item'
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`
const SELECTOR_DROPDOWN = '.dropdown'
const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle'
const Default$1 = {
  offset: null,
  // TODO: v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: '0px 0px -25%',
  smoothScroll: false,
  target: null,
  threshold: [0.1, 0.5, 1]
}
const DefaultType$1 = {
  offset: '(number|null)',
  // TODO v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: 'string',
  smoothScroll: 'boolean',
  target: 'element',
  threshold: 'array'
}
class ScrollSpy extends BaseComponent {
  constructor (element, config2) {
    super(element, config2)
    this._targetLinks = /* @__PURE__ */ new Map()
    this._observableSections = /* @__PURE__ */ new Map()
    this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element
    this._activeTarget = null
    this._observer = null
    this._previousScrollData = {
      visibleEntryTop: 0,
      parentScrollTop: 0
    }
    this.refresh()
  }

  // Getters
  static get Default () {
    return Default$1
  }

  static get DefaultType () {
    return DefaultType$1
  }

  static get NAME () {
    return NAME$2
  }

  // Public
  refresh () {
    this._initializeTargetsAndObservables()
    this._maybeEnableSmoothScroll()
    if (this._observer) {
      this._observer.disconnect()
    } else {
      this._observer = this._getNewObserver()
    }
    for (const section of this._observableSections.values()) {
      this._observer.observe(section)
    }
  }

  dispose () {
    this._observer.disconnect()
    super.dispose()
  }

  // Private
  _configAfterMerge (config2) {
    config2.target = getElement(config2.target) || document.body
    config2.rootMargin = config2.offset ? `${config2.offset}px 0px -30%` : config2.rootMargin
    if (typeof config2.threshold === 'string') {
      config2.threshold = config2.threshold.split(',').map((value) => Number.parseFloat(value))
    }
    return config2
  }

  _maybeEnableSmoothScroll () {
    if (!this._config.smoothScroll) {
      return
    }
    EventHandler.off(this._config.target, EVENT_CLICK)
    EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, (event) => {
      const observableSection = this._observableSections.get(event.target.hash)
      if (observableSection) {
        event.preventDefault()
        const root = this._rootElement || window
        const height = observableSection.offsetTop - this._element.offsetTop
        if (root.scrollTo) {
          root.scrollTo({
            top: height,
            behavior: 'smooth'
          })
          return
        }
        root.scrollTop = height
      }
    })
  }

  _getNewObserver () {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin
    }
    return new IntersectionObserver((entries) => this._observerCallback(entries), options)
  }

  // The logic of selection
  _observerCallback (entries) {
    const targetElement = (entry) => this._targetLinks.get(`#${entry.target.id}`)
    const activate = (entry) => {
      this._previousScrollData.visibleEntryTop = entry.target.offsetTop
      this._process(targetElement(entry))
    }
    const parentScrollTop = (this._rootElement || document.documentElement).scrollTop
    const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop
    this._previousScrollData.parentScrollTop = parentScrollTop
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        this._activeTarget = null
        this._clearActiveClass(targetElement(entry))
        continue
      }
      const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop
      if (userScrollsDown && entryIsLowerThanPrevious) {
        activate(entry)
        if (!parentScrollTop) {
          return
        }
        continue
      }
      if (!userScrollsDown && !entryIsLowerThanPrevious) {
        activate(entry)
      }
    }
  }

  _initializeTargetsAndObservables () {
    this._targetLinks = /* @__PURE__ */ new Map()
    this._observableSections = /* @__PURE__ */ new Map()
    const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target)
    for (const anchor of targetLinks) {
      if (!anchor.hash || isDisabled(anchor)) {
        continue
      }
      const observableSection = SelectorEngine.findOne(anchor.hash, this._element)
      if (isVisible(observableSection)) {
        this._targetLinks.set(anchor.hash, anchor)
        this._observableSections.set(anchor.hash, observableSection)
      }
    }
  }

  _process (target) {
    if (this._activeTarget === target) {
      return
    }
    this._clearActiveClass(this._config.target)
    this._activeTarget = target
    target.classList.add(CLASS_NAME_ACTIVE$1)
    this._activateParents(target)
    EventHandler.trigger(this._element, EVENT_ACTIVATE, {
      relatedTarget: target
    })
  }

  _activateParents (target) {
    if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1)
      return
    }
    for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
      for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
        item.classList.add(CLASS_NAME_ACTIVE$1)
      }
    }
  }

  _clearActiveClass (parent) {
    parent.classList.remove(CLASS_NAME_ACTIVE$1)
    const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent)
    for (const node of activeNodes) {
      node.classList.remove(CLASS_NAME_ACTIVE$1)
    }
  }

  // Static
  static jQueryInterface (config2) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config2)
      if (typeof config2 !== 'string') {
        return
      }
      if (data[config2] === void 0 || config2.startsWith('_') || config2 === 'constructor') {
        throw new TypeError(`No method named "${config2}"`)
      }
      data[config2]()
    })
  }
}
EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
  for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
    ScrollSpy.getOrCreateInstance(spy)
  }
})
defineJQueryPlugin(ScrollSpy)
const NAME$1 = 'tab'
const DATA_KEY$1 = 'bs.tab'
const EVENT_KEY$1 = `.${DATA_KEY$1}`
const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`
const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`
const EVENT_SHOW$1 = `show${EVENT_KEY$1}`
const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`
const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`
const ARROW_LEFT_KEY = 'ArrowLeft'
const ARROW_RIGHT_KEY = 'ArrowRight'
const ARROW_UP_KEY = 'ArrowUp'
const ARROW_DOWN_KEY = 'ArrowDown'
const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_FADE$1 = 'fade'
const CLASS_NAME_SHOW$1 = 'show'
const CLASS_DROPDOWN = 'dropdown'
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle'
const SELECTOR_DROPDOWN_MENU = '.dropdown-menu'
const NOT_SELECTOR_DROPDOWN_TOGGLE = ':not(.dropdown-toggle)'
const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]'
const SELECTOR_OUTER = '.nav-item, .list-group-item'
const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'
const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`
const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`
class Tab extends BaseComponent {
  constructor (element) {
    super(element)
    this._parent = this._element.closest(SELECTOR_TAB_PANEL)
    if (!this._parent) {
      return
    }
    this._setInitialAttributes(this._parent, this._getChildren())
    EventHandler.on(this._element, EVENT_KEYDOWN, (event) => this._keydown(event))
  }

  // Getters
  static get NAME () {
    return NAME$1
  }

  // Public
  show () {
    const innerElem = this._element
    if (this._elemIsActive(innerElem)) {
      return
    }
    const active = this._getActiveElem()
    const hideEvent = active
      ? EventHandler.trigger(active, EVENT_HIDE$1, {
        relatedTarget: innerElem
      })
      : null
    const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
      relatedTarget: active
    })
    if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
      return
    }
    this._deactivate(active, innerElem)
    this._activate(innerElem, active)
  }

  // Private
  _activate (element, relatedElem) {
    if (!element) {
      return
    }
    element.classList.add(CLASS_NAME_ACTIVE)
    this._activate(getElementFromSelector(element))
    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.add(CLASS_NAME_SHOW$1)
        return
      }
      element.removeAttribute('tabindex')
      element.setAttribute('aria-selected', true)
      this._toggleDropDown(element, true)
      EventHandler.trigger(element, EVENT_SHOWN$1, {
        relatedTarget: relatedElem
      })
    }
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1))
  }

  _deactivate (element, relatedElem) {
    if (!element) {
      return
    }
    element.classList.remove(CLASS_NAME_ACTIVE)
    element.blur()
    this._deactivate(getElementFromSelector(element))
    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.remove(CLASS_NAME_SHOW$1)
        return
      }
      element.setAttribute('aria-selected', false)
      element.setAttribute('tabindex', '-1')
      this._toggleDropDown(element, false)
      EventHandler.trigger(element, EVENT_HIDDEN$1, {
        relatedTarget: relatedElem
      })
    }
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1))
  }

  _keydown (event) {
    if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY].includes(event.key)) {
      return
    }
    event.stopPropagation()
    event.preventDefault()
    const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key)
    const nextActiveElement = getNextActiveElement(this._getChildren().filter((element) => !isDisabled(element)), event.target, isNext, true)
    if (nextActiveElement) {
      nextActiveElement.focus({
        preventScroll: true
      })
      Tab.getOrCreateInstance(nextActiveElement).show()
    }
  }

  _getChildren () {
    return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent)
  }

  _getActiveElem () {
    return this._getChildren().find((child) => this._elemIsActive(child)) || null
  }

  _setInitialAttributes (parent, children) {
    this._setAttributeIfNotExists(parent, 'role', 'tablist')
    for (const child of children) {
      this._setInitialAttributesOnChild(child)
    }
  }

  _setInitialAttributesOnChild (child) {
    child = this._getInnerElement(child)
    const isActive = this._elemIsActive(child)
    const outerElem = this._getOuterElement(child)
    child.setAttribute('aria-selected', isActive)
    if (outerElem !== child) {
      this._setAttributeIfNotExists(outerElem, 'role', 'presentation')
    }
    if (!isActive) {
      child.setAttribute('tabindex', '-1')
    }
    this._setAttributeIfNotExists(child, 'role', 'tab')
    this._setInitialAttributesOnTargetPanel(child)
  }

  _setInitialAttributesOnTargetPanel (child) {
    const target = getElementFromSelector(child)
    if (!target) {
      return
    }
    this._setAttributeIfNotExists(target, 'role', 'tabpanel')
    if (child.id) {
      this._setAttributeIfNotExists(target, 'aria-labelledby', `#${child.id}`)
    }
  }

  _toggleDropDown (element, open) {
    const outerElem = this._getOuterElement(element)
    if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
      return
    }
    const toggle = (selector, className) => {
      const element2 = SelectorEngine.findOne(selector, outerElem)
      if (element2) {
        element2.classList.toggle(className, open)
      }
    }
    toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE)
    toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1)
    outerElem.setAttribute('aria-expanded', open)
  }

  _setAttributeIfNotExists (element, attribute, value) {
    if (!element.hasAttribute(attribute)) {
      element.setAttribute(attribute, value)
    }
  }

  _elemIsActive (elem) {
    return elem.classList.contains(CLASS_NAME_ACTIVE)
  }

  // Try to get the inner element (usually the .nav-link)
  _getInnerElement (elem) {
    return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem)
  }

  // Try to get the outer element (usually the .nav-item)
  _getOuterElement (elem) {
    return elem.closest(SELECTOR_OUTER) || elem
  }

  // Static
  static jQueryInterface (config2) {
    return this.each(function () {
      const data = Tab.getOrCreateInstance(this)
      if (typeof config2 !== 'string') {
        return
      }
      if (data[config2] === void 0 || config2.startsWith('_') || config2 === 'constructor') {
        throw new TypeError(`No method named "${config2}"`)
      }
      data[config2]()
    })
  }
}
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault()
  }
  if (isDisabled(this)) {
    return
  }
  Tab.getOrCreateInstance(this).show()
})
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
    Tab.getOrCreateInstance(element)
  }
})
defineJQueryPlugin(Tab)
const NAME = 'toast'
const DATA_KEY = 'bs.toast'
const EVENT_KEY = `.${DATA_KEY}`
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_HIDE = 'hide'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_SHOWING = 'showing'
const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
}
const Default = {
  animation: true,
  autohide: true,
  delay: 5e3
}
class Toast extends BaseComponent {
  constructor (element, config2) {
    super(element, config2)
    this._timeout = null
    this._hasMouseInteraction = false
    this._hasKeyboardInteraction = false
    this._setListeners()
  }

  // Getters
  static get Default () {
    return Default
  }

  static get DefaultType () {
    return DefaultType
  }

  static get NAME () {
    return NAME
  }

  // Public
  show () {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW)
    if (showEvent.defaultPrevented) {
      return
    }
    this._clearTimeout()
    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE)
    }
    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING)
      EventHandler.trigger(this._element, EVENT_SHOWN)
      this._maybeScheduleHide()
    }
    this._element.classList.remove(CLASS_NAME_HIDE)
    reflow(this._element)
    this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING)
    this._queueCallback(complete, this._element, this._config.animation)
  }

  hide () {
    if (!this.isShown()) {
      return
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE)
    if (hideEvent.defaultPrevented) {
      return
    }
    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE)
      this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW)
      EventHandler.trigger(this._element, EVENT_HIDDEN)
    }
    this._element.classList.add(CLASS_NAME_SHOWING)
    this._queueCallback(complete, this._element, this._config.animation)
  }

  dispose () {
    this._clearTimeout()
    if (this.isShown()) {
      this._element.classList.remove(CLASS_NAME_SHOW)
    }
    super.dispose()
  }

  isShown () {
    return this._element.classList.contains(CLASS_NAME_SHOW)
  }

  // Private
  _maybeScheduleHide () {
    if (!this._config.autohide) {
      return
    }
    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return
    }
    this._timeout = setTimeout(() => {
      this.hide()
    }, this._config.delay)
  }

  _onInteraction (event, isInteracting) {
    switch (event.type) {
      case 'mouseover':
      case 'mouseout': {
        this._hasMouseInteraction = isInteracting
        break
      }
      case 'focusin':
      case 'focusout': {
        this._hasKeyboardInteraction = isInteracting
        break
      }
    }
    if (isInteracting) {
      this._clearTimeout()
      return
    }
    const nextElement = event.relatedTarget
    if (this._element === nextElement || this._element.contains(nextElement)) {
      return
    }
    this._maybeScheduleHide()
  }

  _setListeners () {
    EventHandler.on(this._element, EVENT_MOUSEOVER, (event) => this._onInteraction(event, true))
    EventHandler.on(this._element, EVENT_MOUSEOUT, (event) => this._onInteraction(event, false))
    EventHandler.on(this._element, EVENT_FOCUSIN, (event) => this._onInteraction(event, true))
    EventHandler.on(this._element, EVENT_FOCUSOUT, (event) => this._onInteraction(event, false))
  }

  _clearTimeout () {
    clearTimeout(this._timeout)
    this._timeout = null
  }

  // Static
  static jQueryInterface (config2) {
    return this.each(function () {
      const data = Toast.getOrCreateInstance(this, config2)
      if (typeof config2 === 'string') {
        if (typeof data[config2] === 'undefined') {
          throw new TypeError(`No method named "${config2}"`)
        }
        data[config2](this)
      }
    })
  }
}
enableDismissTrigger(Toast)
defineJQueryPlugin(Toast)
const scriptRel = 'modulepreload'
const assetsURL = function (dep, importerUrl) {
  return new URL(dep, importerUrl).href
}
const seen = {}
const __vitePreload = function preload (baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule()
  }
  const links = document.getElementsByTagName('link')
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep, importerUrl)
    if (dep in seen) { return }
    seen[dep] = true
    const isCss = dep.endsWith('.css')
    const cssSelector = isCss ? '[rel="stylesheet"]' : ''
    const isBaseRelative = !!importerUrl
    if (isBaseRelative) {
      for (let i = links.length - 1; i >= 0; i--) {
        const link2 = links[i]
        if (link2.href === dep && (!isCss || link2.rel === 'stylesheet')) {
          return
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return
    }
    const link = document.createElement('link')
    link.rel = isCss ? 'stylesheet' : scriptRel
    if (!isCss) {
      link.as = 'script'
      link.crossOrigin = ''
    }
    link.href = dep
    document.head.appendChild(link)
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener('load', res)
        link.addEventListener('error', () => rej(new Error(`Unable to preload CSS for ${dep}`)))
      })
    }
  })).then(() => baseModule())
}
const __awaiter$d = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
const resolveFetch$3 = (customFetch) => {
  let _fetch
  if (customFetch) {
    _fetch = customFetch
  } else if (typeof fetch === 'undefined') {
    _fetch = (...args) => __awaiter$d(void 0, void 0, void 0, function * () {
      return yield (yield __vitePreload(() => Promise.resolve().then(() => browserPonyfill), true ? void 0 : void 0, import.meta.url)).fetch(...args)
    })
  } else {
    _fetch = fetch
  }
  return (...args) => _fetch(...args)
}
class FunctionsError extends Error {
  constructor (message, name2 = 'FunctionsError', context) {
    super(message)
    super.name = name2
    this.context = context
  }
}
class FunctionsFetchError extends FunctionsError {
  constructor (context) {
    super('Failed to send a request to the Edge Function', 'FunctionsFetchError', context)
  }
}
class FunctionsRelayError extends FunctionsError {
  constructor (context) {
    super('Relay Error invoking the Edge Function', 'FunctionsRelayError', context)
  }
}
class FunctionsHttpError extends FunctionsError {
  constructor (context) {
    super('Edge Function returned a non-2xx status code', 'FunctionsHttpError', context)
  }
}
const __awaiter$c = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
class FunctionsClient {
  constructor (url, { headers = {}, customFetch } = {}) {
    this.url = url
    this.headers = headers
    this.fetch = resolveFetch$3(customFetch)
  }

  /**
   * Updates the authorization header
   * @param token - the new jwt token sent in the authorisation header
   */
  setAuth (token) {
    this.headers.Authorization = `Bearer ${token}`
  }

  /**
   * Invokes a function
   * @param functionName - the name of the function to invoke
   */
  invoke (functionName, invokeOptions = {}) {
    let _a
    return __awaiter$c(this, void 0, void 0, function * () {
      try {
        const { headers, body: functionArgs } = invokeOptions
        const _headers = {}
        let body
        if (functionArgs && (headers && !Object.prototype.hasOwnProperty.call(headers, 'Content-Type') || !headers)) {
          if (typeof Blob !== 'undefined' && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
            _headers['Content-Type'] = 'application/octet-stream'
            body = functionArgs
          } else if (typeof functionArgs === 'string') {
            _headers['Content-Type'] = 'text/plain'
            body = functionArgs
          } else if (typeof FormData !== 'undefined' && functionArgs instanceof FormData) {
            body = functionArgs
          } else {
            _headers['Content-Type'] = 'application/json'
            body = JSON.stringify(functionArgs)
          }
        }
        const response = yield this.fetch(`${this.url}/${functionName}`, {
          method: 'POST',
          // headers priority is (high to low):
          // 1. invoke-level headers
          // 2. client-level headers
          // 3. default Content-Type header
          headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
          body
        }).catch((fetchError) => {
          throw new FunctionsFetchError(fetchError)
        })
        const isRelayError = response.headers.get('x-relay-error')
        if (isRelayError && isRelayError === 'true') {
          throw new FunctionsRelayError(response)
        }
        if (!response.ok) {
          throw new FunctionsHttpError(response)
        }
        const responseType = ((_a = response.headers.get('Content-Type')) !== null && _a !== void 0 ? _a : 'text/plain').split(';')[0].trim()
        let data
        if (responseType === 'application/json') {
          data = yield response.json()
        } else if (responseType === 'application/octet-stream') {
          data = yield response.blob()
        } else if (responseType === 'multipart/form-data') {
          data = yield response.formData()
        } else {
          data = yield response.text()
        }
        return { data, error: null }
      } catch (error) {
        return { data: null, error }
      }
    })
  }
}
const commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}
function getDefaultExportFromCjs (x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x
}
let browserPonyfillExports = {}
const browserPonyfill$1 = {
  get exports () {
    return browserPonyfillExports
  },
  set exports (v) {
    browserPonyfillExports = v
  }
};
(function (module, exports) {
  const global2 = typeof self !== 'undefined' ? self : commonjsGlobal
  const __self__ = (function () {
    function F () {
      this.fetch = false
      this.DOMException = global2.DOMException
    }
    F.prototype = global2
    return new F()
  }());
  (function (self2) {
    (function (exports2) {
      const support = {
        searchParams: 'URLSearchParams' in self2,
        iterable: 'Symbol' in self2 && 'iterator' in Symbol,
        blob: 'FileReader' in self2 && 'Blob' in self2 && (function () {
          try {
            new Blob()
            return true
          } catch (e) {
            return false
          }
        }()),
        formData: 'FormData' in self2,
        arrayBuffer: 'ArrayBuffer' in self2
      }
      function isDataView (obj) {
        return obj && DataView.prototype.isPrototypeOf(obj)
      }
      if (support.arrayBuffer) {
        const viewClasses = [
          '[object Int8Array]',
          '[object Uint8Array]',
          '[object Uint8ClampedArray]',
          '[object Int16Array]',
          '[object Uint16Array]',
          '[object Int32Array]',
          '[object Uint32Array]',
          '[object Float32Array]',
          '[object Float64Array]'
        ]
        var isArrayBufferView = ArrayBuffer.isView || function (obj) {
          return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
        }
      }
      function normalizeName (name2) {
        if (typeof name2 !== 'string') {
          name2 = String(name2)
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name2)) {
          throw new TypeError('Invalid character in header field name')
        }
        return name2.toLowerCase()
      }
      function normalizeValue (value) {
        if (typeof value !== 'string') {
          value = String(value)
        }
        return value
      }
      function iteratorFor (items) {
        const iterator = {
          next: function () {
            const value = items.shift()
            return { done: value === void 0, value }
          }
        }
        if (support.iterable) {
          iterator[Symbol.iterator] = function () {
            return iterator
          }
        }
        return iterator
      }
      function Headers2 (headers) {
        this.map = {}
        if (headers instanceof Headers2) {
          headers.forEach(function (value, name2) {
            this.append(name2, value)
          }, this)
        } else if (Array.isArray(headers)) {
          headers.forEach(function (header2) {
            this.append(header2[0], header2[1])
          }, this)
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function (name2) {
            this.append(name2, headers[name2])
          }, this)
        }
      }
      Headers2.prototype.append = function (name2, value) {
        name2 = normalizeName(name2)
        value = normalizeValue(value)
        const oldValue = this.map[name2]
        this.map[name2] = oldValue ? oldValue + ', ' + value : value
      }
      Headers2.prototype.delete = function (name2) {
        delete this.map[normalizeName(name2)]
      }
      Headers2.prototype.get = function (name2) {
        name2 = normalizeName(name2)
        return this.has(name2) ? this.map[name2] : null
      }
      Headers2.prototype.has = function (name2) {
        return this.map.hasOwnProperty(normalizeName(name2))
      }
      Headers2.prototype.set = function (name2, value) {
        this.map[normalizeName(name2)] = normalizeValue(value)
      }
      Headers2.prototype.forEach = function (callback, thisArg) {
        for (const name2 in this.map) {
          if (this.map.hasOwnProperty(name2)) {
            callback.call(thisArg, this.map[name2], name2, this)
          }
        }
      }
      Headers2.prototype.keys = function () {
        const items = []
        this.forEach(function (value, name2) {
          items.push(name2)
        })
        return iteratorFor(items)
      }
      Headers2.prototype.values = function () {
        const items = []
        this.forEach(function (value) {
          items.push(value)
        })
        return iteratorFor(items)
      }
      Headers2.prototype.entries = function () {
        const items = []
        this.forEach(function (value, name2) {
          items.push([name2, value])
        })
        return iteratorFor(items)
      }
      if (support.iterable) {
        Headers2.prototype[Symbol.iterator] = Headers2.prototype.entries
      }
      function consumed (body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError('Already read'))
        }
        body.bodyUsed = true
      }
      function fileReaderReady (reader) {
        return new Promise(function (resolve, reject) {
          reader.onload = function () {
            resolve(reader.result)
          }
          reader.onerror = function () {
            reject(reader.error)
          }
        })
      }
      function readBlobAsArrayBuffer (blob) {
        const reader = new FileReader()
        const promise = fileReaderReady(reader)
        reader.readAsArrayBuffer(blob)
        return promise
      }
      function readBlobAsText (blob) {
        const reader = new FileReader()
        const promise = fileReaderReady(reader)
        reader.readAsText(blob)
        return promise
      }
      function readArrayBufferAsText (buf) {
        const view = new Uint8Array(buf)
        const chars = new Array(view.length)
        for (let i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i])
        }
        return chars.join('')
      }
      function bufferClone (buf) {
        if (buf.slice) {
          return buf.slice(0)
        } else {
          const view = new Uint8Array(buf.byteLength)
          view.set(new Uint8Array(buf))
          return view.buffer
        }
      }
      function Body () {
        this.bodyUsed = false
        this._initBody = function (body) {
          this._bodyInit = body
          if (!body) {
            this._bodyText = ''
          } else if (typeof body === 'string') {
            this._bodyText = body
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString()
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer)
            this._bodyInit = new Blob([this._bodyArrayBuffer])
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body)
          } else {
            this._bodyText = body = Object.prototype.toString.call(body)
          }
          if (!this.headers.get('content-type')) {
            if (typeof body === 'string') {
              this.headers.set('content-type', 'text/plain;charset=UTF-8')
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set('content-type', this._bodyBlob.type)
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
            }
          }
        }
        if (support.blob) {
          this.blob = function () {
            const rejected = consumed(this)
            if (rejected) {
              return rejected
            }
            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob)
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]))
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as blob')
            } else {
              return Promise.resolve(new Blob([this._bodyText]))
            }
          }
          this.arrayBuffer = function () {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
            } else {
              return this.blob().then(readBlobAsArrayBuffer)
            }
          }
        }
        this.text = function () {
          const rejected = consumed(this)
          if (rejected) {
            return rejected
          }
          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob)
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as text')
          } else {
            return Promise.resolve(this._bodyText)
          }
        }
        if (support.formData) {
          this.formData = function () {
            return this.text().then(decode)
          }
        }
        this.json = function () {
          return this.text().then(JSON.parse)
        }
        return this
      }
      const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
      function normalizeMethod (method) {
        const upcased = method.toUpperCase()
        return methods.indexOf(upcased) > -1 ? upcased : method
      }
      function Request (input, options) {
        options = options || {}
        let body = options.body
        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError('Already read')
          }
          this.url = input.url
          this.credentials = input.credentials
          if (!options.headers) {
            this.headers = new Headers2(input.headers)
          }
          this.method = input.method
          this.mode = input.mode
          this.signal = input.signal
          if (!body && input._bodyInit != null) {
            body = input._bodyInit
            input.bodyUsed = true
          }
        } else {
          this.url = String(input)
        }
        this.credentials = options.credentials || this.credentials || 'same-origin'
        if (options.headers || !this.headers) {
          this.headers = new Headers2(options.headers)
        }
        this.method = normalizeMethod(options.method || this.method || 'GET')
        this.mode = options.mode || this.mode || null
        this.signal = options.signal || this.signal
        this.referrer = null
        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
          throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(body)
      }
      Request.prototype.clone = function () {
        return new Request(this, { body: this._bodyInit })
      }
      function decode (body) {
        const form = new FormData()
        body.trim().split('&').forEach(function (bytes) {
          if (bytes) {
            const split = bytes.split('=')
            const name2 = split.shift().replace(/\+/g, ' ')
            const value = split.join('=').replace(/\+/g, ' ')
            form.append(decodeURIComponent(name2), decodeURIComponent(value))
          }
        })
        return form
      }
      function parseHeaders (rawHeaders) {
        const headers = new Headers2()
        const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
        preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
          const parts = line.split(':')
          const key = parts.shift().trim()
          if (key) {
            const value = parts.join(':').trim()
            headers.append(key, value)
          }
        })
        return headers
      }
      Body.call(Request.prototype)
      function Response2 (bodyInit, options) {
        if (!options) {
          options = {}
        }
        this.type = 'default'
        this.status = options.status === void 0 ? 200 : options.status
        this.ok = this.status >= 200 && this.status < 300
        this.statusText = 'statusText' in options ? options.statusText : 'OK'
        this.headers = new Headers2(options.headers)
        this.url = options.url || ''
        this._initBody(bodyInit)
      }
      Body.call(Response2.prototype)
      Response2.prototype.clone = function () {
        return new Response2(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers2(this.headers),
          url: this.url
        })
      }
      Response2.error = function () {
        const response = new Response2(null, { status: 0, statusText: '' })
        response.type = 'error'
        return response
      }
      const redirectStatuses = [301, 302, 303, 307, 308]
      Response2.redirect = function (url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError('Invalid status code')
        }
        return new Response2(null, { status, headers: { location: url } })
      }
      exports2.DOMException = self2.DOMException
      try {
        new exports2.DOMException()
      } catch (err) {
        exports2.DOMException = function (message, name2) {
          this.message = message
          this.name = name2
          const error = Error(message)
          this.stack = error.stack
        }
        exports2.DOMException.prototype = Object.create(Error.prototype)
        exports2.DOMException.prototype.constructor = exports2.DOMException
      }
      function fetch2 (input, init) {
        return new Promise(function (resolve, reject) {
          const request = new Request(input, init)
          if (request.signal && request.signal.aborted) {
            return reject(new exports2.DOMException('Aborted', 'AbortError'))
          }
          const xhr = new XMLHttpRequest()
          function abortXhr () {
            xhr.abort()
          }
          xhr.onload = function () {
            const options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || '')
            }
            options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
            const body = 'response' in xhr ? xhr.response : xhr.responseText
            resolve(new Response2(body, options))
          }
          xhr.onerror = function () {
            reject(new TypeError('Network request failed'))
          }
          xhr.ontimeout = function () {
            reject(new TypeError('Network request failed'))
          }
          xhr.onabort = function () {
            reject(new exports2.DOMException('Aborted', 'AbortError'))
          }
          xhr.open(request.method, request.url, true)
          if (request.credentials === 'include') {
            xhr.withCredentials = true
          } else if (request.credentials === 'omit') {
            xhr.withCredentials = false
          }
          if ('responseType' in xhr && support.blob) {
            xhr.responseType = 'blob'
          }
          request.headers.forEach(function (value, name2) {
            xhr.setRequestHeader(name2, value)
          })
          if (request.signal) {
            request.signal.addEventListener('abort', abortXhr)
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                request.signal.removeEventListener('abort', abortXhr)
              }
            }
          }
          xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
        })
      }
      fetch2.polyfill = true
      if (!self2.fetch) {
        self2.fetch = fetch2
        self2.Headers = Headers2
        self2.Request = Request
        self2.Response = Response2
      }
      exports2.Headers = Headers2
      exports2.Request = Request
      exports2.Response = Response2
      exports2.fetch = fetch2
      Object.defineProperty(exports2, '__esModule', { value: true })
      return exports2
    })({})
  })(__self__)
  __self__.fetch.ponyfill = true
  delete __self__.fetch.polyfill
  const ctx = __self__
  exports = ctx.fetch
  exports.default = ctx.fetch
  exports.fetch = ctx.fetch
  exports.Headers = ctx.Headers
  exports.Request = ctx.Request
  exports.Response = ctx.Response
  module.exports = exports
})(browserPonyfill$1, browserPonyfillExports)
const crossFetch = /* @__PURE__ */ getDefaultExportFromCjs(browserPonyfillExports)
const browserPonyfill = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: crossFetch
}, [browserPonyfillExports])
class PostgrestBuilder {
  constructor (builder) {
    this.shouldThrowOnError = false
    this.method = builder.method
    this.url = builder.url
    this.headers = builder.headers
    this.schema = builder.schema
    this.body = builder.body
    this.shouldThrowOnError = builder.shouldThrowOnError
    this.signal = builder.signal
    this.allowEmpty = builder.allowEmpty
    if (builder.fetch) {
      this.fetch = builder.fetch
    } else if (typeof fetch === 'undefined') {
      this.fetch = crossFetch
    } else {
      this.fetch = fetch
    }
  }

  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   *
   * {@link https://github.com/supabase/supabase-js/issues/92}
   */
  throwOnError () {
    this.shouldThrowOnError = true
    return this
  }

  then (onfulfilled, onrejected) {
    if (this.schema === void 0)
      ;
    else if (['GET', 'HEAD'].includes(this.method)) {
      this.headers['Accept-Profile'] = this.schema
    } else {
      this.headers['Content-Profile'] = this.schema
    }
    if (this.method !== 'GET' && this.method !== 'HEAD') {
      this.headers['Content-Type'] = 'application/json'
    }
    const _fetch = this.fetch
    let res = _fetch(this.url.toString(), {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
      signal: this.signal
    }).then(async (res2) => {
      let _a, _b, _c
      let error = null
      let data = null
      let count = null
      let status = res2.status
      let statusText = res2.statusText
      if (res2.ok) {
        if (this.method !== 'HEAD') {
          const body = await res2.text()
          if (body === '')
            ;
          else if (this.headers.Accept === 'text/csv') {
            data = body
          } else if (this.headers.Accept && this.headers.Accept.includes('application/vnd.pgrst.plan+text')) {
            data = body
          } else {
            data = JSON.parse(body)
          }
        }
        const countHeader = (_a = this.headers.Prefer) === null || _a === void 0 ? void 0 : _a.match(/count=(exact|planned|estimated)/)
        const contentRange = (_b = res2.headers.get('content-range')) === null || _b === void 0 ? void 0 : _b.split('/')
        if (countHeader && contentRange && contentRange.length > 1) {
          count = parseInt(contentRange[1])
        }
      } else {
        const body = await res2.text()
        try {
          error = JSON.parse(body)
          if (Array.isArray(error) && res2.status === 404) {
            data = []
            error = null
            status = 200
            statusText = 'OK'
          }
        } catch (_d) {
          if (res2.status === 404 && body === '') {
            status = 204
            statusText = 'No Content'
          } else {
            error = {
              message: body
            }
          }
        }
        if (error && this.allowEmpty && ((_c = error === null || error === void 0 ? void 0 : error.details) === null || _c === void 0 ? void 0 : _c.includes('Results contain 0 rows'))) {
          error = null
          status = 200
          statusText = 'OK'
        }
        if (error && this.shouldThrowOnError) {
          throw error
        }
      }
      const postgrestResponse = {
        error,
        data,
        count,
        status,
        statusText
      }
      return postgrestResponse
    })
    if (!this.shouldThrowOnError) {
      res = res.catch((fetchError) => ({
        error: {
          message: `FetchError: ${fetchError.message}`,
          details: '',
          hint: '',
          code: fetchError.code || ''
        },
        data: null,
        count: null,
        status: 0,
        statusText: ''
      }))
    }
    return res.then(onfulfilled, onrejected)
  }
}
class PostgrestTransformBuilder extends PostgrestBuilder {
  /**
   * Perform a SELECT on the query result.
   *
   * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
   * return modified rows. By calling this method, modified rows are returned in
   * `data`.
   *
   * @param columns - The columns to retrieve, separated by commas
   */
  select (columns) {
    let quoted = false
    const cleanedColumns = (columns !== null && columns !== void 0 ? columns : '*').split('').map((c) => {
      if (/\s/.test(c) && !quoted) {
        return ''
      }
      if (c === '"') {
        quoted = !quoted
      }
      return c
    }).join('')
    this.url.searchParams.set('select', cleanedColumns)
    if (this.headers.Prefer) {
      this.headers.Prefer += ','
    }
    this.headers.Prefer += 'return=representation'
    return this
  }

  /**
   * Order the query result by `column`.
   *
   * You can call this method multiple times to order by multiple columns.
   *
   * You can order foreign tables, but it doesn't affect the ordering of the
   * current table.
   *
   * @param column - The column to order by
   * @param options - Named parameters
   * @param options.ascending - If `true`, the result will be in ascending order
   * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
   * `null`s appear last.
   * @param options.foreignTable - Set this to order a foreign table by foreign
   * columns
   */
  order (column, { ascending = true, nullsFirst, foreignTable } = {}) {
    const key = foreignTable ? `${foreignTable}.order` : 'order'
    const existingOrder = this.url.searchParams.get(key)
    this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ''}${column}.${ascending ? 'asc' : 'desc'}${nullsFirst === void 0 ? '' : nullsFirst ? '.nullsfirst' : '.nullslast'}`)
    return this
  }

  /**
   * Limit the query result by `count`.
   *
   * @param count - The maximum number of rows to return
   * @param options - Named parameters
   * @param options.foreignTable - Set this to limit rows of foreign tables
   * instead of the current table
   */
  limit (count, { foreignTable } = {}) {
    const key = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`
    this.url.searchParams.set(key, `${count}`)
    return this
  }

  /**
   * Limit the query result by `from` and `to` inclusively.
   *
   * @param from - The starting index from which to limit the result
   * @param to - The last index to which to limit the result
   * @param options - Named parameters
   * @param options.foreignTable - Set this to limit rows of foreign tables
   * instead of the current table
   */
  range (from, to, { foreignTable } = {}) {
    const keyOffset = typeof foreignTable === 'undefined' ? 'offset' : `${foreignTable}.offset`
    const keyLimit = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`
    this.url.searchParams.set(keyOffset, `${from}`)
    this.url.searchParams.set(keyLimit, `${to - from + 1}`)
    return this
  }

  /**
   * Set the AbortSignal for the fetch request.
   *
   * @param signal - The AbortSignal to use for the fetch request
   */
  abortSignal (signal) {
    this.signal = signal
    return this
  }

  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be one row (e.g. using `.limit(1)`), otherwise this
   * returns an error.
   */
  single () {
    this.headers.Accept = 'application/vnd.pgrst.object+json'
    return this
  }

  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
   * this returns an error.
   */
  maybeSingle () {
    this.headers.Accept = 'application/vnd.pgrst.object+json'
    this.allowEmpty = true
    return this
  }

  /**
   * Return `data` as a string in CSV format.
   */
  csv () {
    this.headers.Accept = 'text/csv'
    return this
  }

  /**
   * Return `data` as an object in [GeoJSON](https://geojson.org) format.
   */
  geojson () {
    this.headers.Accept = 'application/geo+json'
    return this
  }

  /**
   * Return `data` as the EXPLAIN plan for the query.
   *
   * @param options - Named parameters
   *
   * @param options.analyze - If `true`, the query will be executed and the
   * actual run time will be returned
   *
   * @param options.verbose - If `true`, the query identifier will be returned
   * and `data` will include the output columns of the query
   *
   * @param options.settings - If `true`, include information on configuration
   * parameters that affect query planning
   *
   * @param options.buffers - If `true`, include information on buffer usage
   *
   * @param options.wal - If `true`, include information on WAL record generation
   *
   * @param options.format - The format of the output, can be `"text"` (default)
   * or `"json"`
   */
  explain ({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = 'text' } = {}) {
    const options = [
      analyze ? 'analyze' : null,
      verbose ? 'verbose' : null,
      settings ? 'settings' : null,
      buffers ? 'buffers' : null,
      wal ? 'wal' : null
    ].filter(Boolean).join('|')
    const forMediatype = this.headers.Accept
    this.headers.Accept = `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`
    if (format === 'json') { return this } else { return this }
  }

  /**
   * Rollback the query.
   *
   * `data` will still be returned, but the query is not committed.
   */
  rollback () {
    let _a
    if (((_a = this.headers.Prefer) !== null && _a !== void 0 ? _a : '').trim().length > 0) {
      this.headers.Prefer += ',tx=rollback'
    } else {
      this.headers.Prefer = 'tx=rollback'
    }
    return this
  }

  /**
   * Override the type of the returned `data`.
   *
   * @typeParam NewResult - The new result type to override with
   */
  returns () {
    return this
  }
}
class PostgrestFilterBuilder extends PostgrestTransformBuilder {
  /**
   * Match only rows where `column` is equal to `value`.
   *
   * To check if the value of `column` is NULL, you should use `.is()` instead.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  eq (column, value) {
    this.url.searchParams.append(column, `eq.${value}`)
    return this
  }

  /**
   * Match only rows where `column` is not equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  neq (column, value) {
    this.url.searchParams.append(column, `neq.${value}`)
    return this
  }

  /**
   * Match only rows where `column` is greater than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gt (column, value) {
    this.url.searchParams.append(column, `gt.${value}`)
    return this
  }

  /**
   * Match only rows where `column` is greater than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gte (column, value) {
    this.url.searchParams.append(column, `gte.${value}`)
    return this
  }

  /**
   * Match only rows where `column` is less than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lt (column, value) {
    this.url.searchParams.append(column, `lt.${value}`)
    return this
  }

  /**
   * Match only rows where `column` is less than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lte (column, value) {
    this.url.searchParams.append(column, `lte.${value}`)
    return this
  }

  /**
   * Match only rows where `column` matches `pattern` case-sensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  like (column, pattern) {
    this.url.searchParams.append(column, `like.${pattern}`)
    return this
  }

  /**
   * Match only rows where `column` matches `pattern` case-insensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  ilike (column, pattern) {
    this.url.searchParams.append(column, `ilike.${pattern}`)
    return this
  }

  /**
   * Match only rows where `column` IS `value`.
   *
   * For non-boolean columns, this is only relevant for checking if the value of
   * `column` is NULL by setting `value` to `null`.
   *
   * For boolean columns, you can also set `value` to `true` or `false` and it
   * will behave the same way as `.eq()`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  is (column, value) {
    this.url.searchParams.append(column, `is.${value}`)
    return this
  }

  /**
   * Match only rows where `column` is included in the `values` array.
   *
   * @param column - The column to filter on
   * @param values - The values array to filter with
   */
  in (column, values) {
    const cleanedValues = values.map((s) => {
      if (typeof s === 'string' && new RegExp('[,()]').test(s)) { return `"${s}"` } else { return `${s}` }
    }).join(',')
    this.url.searchParams.append(column, `in.(${cleanedValues})`)
    return this
  }

  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * `column` contains every element appearing in `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  contains (column, value) {
    if (typeof value === 'string') {
      this.url.searchParams.append(column, `cs.${value}`)
    } else if (Array.isArray(value)) {
      this.url.searchParams.append(column, `cs.{${value.join(',')}}`)
    } else {
      this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`)
    }
    return this
  }

  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * every element appearing in `column` is contained by `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  containedBy (column, value) {
    if (typeof value === 'string') {
      this.url.searchParams.append(column, `cd.${value}`)
    } else if (Array.isArray(value)) {
      this.url.searchParams.append(column, `cd.{${value.join(',')}}`)
    } else {
      this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`)
    }
    return this
  }

  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is greater than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGt (column, range) {
    this.url.searchParams.append(column, `sr.${range}`)
    return this
  }

  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or greater than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGte (column, range) {
    this.url.searchParams.append(column, `nxl.${range}`)
    return this
  }

  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is less than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLt (column, range) {
    this.url.searchParams.append(column, `sl.${range}`)
    return this
  }

  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or less than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLte (column, range) {
    this.url.searchParams.append(column, `nxr.${range}`)
    return this
  }

  /**
   * Only relevant for range columns. Match only rows where `column` is
   * mutually exclusive to `range` and there can be no element between the two
   * ranges.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeAdjacent (column, range) {
    this.url.searchParams.append(column, `adj.${range}`)
    return this
  }

  /**
   * Only relevant for array and range columns. Match only rows where
   * `column` and `value` have an element in common.
   *
   * @param column - The array or range column to filter on
   * @param value - The array or range value to filter with
   */
  overlaps (column, value) {
    if (typeof value === 'string') {
      this.url.searchParams.append(column, `ov.${value}`)
    } else {
      this.url.searchParams.append(column, `ov.{${value.join(',')}}`)
    }
    return this
  }

  /**
   * Only relevant for text and tsvector columns. Match only rows where
   * `column` matches the query string in `query`.
   *
   * @param column - The text or tsvector column to filter on
   * @param query - The query text to match with
   * @param options - Named parameters
   * @param options.config - The text search configuration to use
   * @param options.type - Change how the `query` text is interpreted
   */
  textSearch (column, query, { config: config2, type } = {}) {
    let typePart = ''
    if (type === 'plain') {
      typePart = 'pl'
    } else if (type === 'phrase') {
      typePart = 'ph'
    } else if (type === 'websearch') {
      typePart = 'w'
    }
    const configPart = config2 === void 0 ? '' : `(${config2})`
    this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`)
    return this
  }

  /**
   * Match only rows where each column in `query` keys is equal to its
   * associated value. Shorthand for multiple `.eq()`s.
   *
   * @param query - The object to filter with, with column names as keys mapped
   * to their filter values
   */
  match (query) {
    Object.entries(query).forEach(([column, value]) => {
      this.url.searchParams.append(column, `eq.${value}`)
    })
    return this
  }

  /**
   * Match only rows which doesn't satisfy the filter.
   *
   * Unlike most filters, `opearator` and `value` are used as-is and need to
   * follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure they are properly sanitized.
   *
   * @param column - The column to filter on
   * @param operator - The operator to be negated to filter with, following
   * PostgREST syntax
   * @param value - The value to filter with, following PostgREST syntax
   */
  not (column, operator, value) {
    this.url.searchParams.append(column, `not.${operator}.${value}`)
    return this
  }

  /**
   * Match only rows which satisfy at least one of the filters.
   *
   * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure it's properly sanitized.
   *
   * It's currently not possible to do an `.or()` filter across multiple tables.
   *
   * @param filters - The filters to use, following PostgREST syntax
   * @param foreignTable - Set this to filter on foreign tables instead of the
   * current table
   */
  or (filters, { foreignTable } = {}) {
    const key = foreignTable ? `${foreignTable}.or` : 'or'
    this.url.searchParams.append(key, `(${filters})`)
    return this
  }

  /**
   * Match only rows which satisfy the filter. This is an escape hatch - you
   * should use the specific filter methods wherever possible.
   *
   * Unlike most filters, `opearator` and `value` are used as-is and need to
   * follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure they are properly sanitized.
   *
   * @param column - The column to filter on
   * @param operator - The operator to filter with, following PostgREST syntax
   * @param value - The value to filter with, following PostgREST syntax
   */
  filter (column, operator, value) {
    this.url.searchParams.append(column, `${operator}.${value}`)
    return this
  }
}
class PostgrestQueryBuilder {
  constructor (url, { headers = {}, schema, fetch: fetch2 }) {
    this.url = url
    this.headers = headers
    this.schema = schema
    this.fetch = fetch2
  }

  /**
   * Perform a SELECT query on the table or view.
   *
   * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
   *
   * @param options - Named parameters
   *
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   *
   * @param options.count - Count algorithm to use to count rows in the table or view.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  select (columns, { head = false, count } = {}) {
    const method = head ? 'HEAD' : 'GET'
    let quoted = false
    const cleanedColumns = (columns !== null && columns !== void 0 ? columns : '*').split('').map((c) => {
      if (/\s/.test(c) && !quoted) {
        return ''
      }
      if (c === '"') {
        quoted = !quoted
      }
      return c
    }).join('')
    this.url.searchParams.set('select', cleanedColumns)
    if (count) {
      this.headers.Prefer = `count=${count}`
    }
    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: false
    })
  }

  /**
   * Perform an INSERT into the table or view.
   *
   * By default, inserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to insert. Pass an object to insert a single row
   * or an array to insert multiple rows.
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count inserted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  insert (values, { count } = {}) {
    const method = 'POST'
    const prefersHeaders = []
    const body = values
    if (count) {
      prefersHeaders.push(`count=${count}`)
    }
    if (this.headers.Prefer) {
      prefersHeaders.unshift(this.headers.Prefer)
    }
    this.headers.Prefer = prefersHeaders.join(',')
    if (Array.isArray(values)) {
      const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), [])
      if (columns.length > 0) {
        const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`)
        this.url.searchParams.set('columns', uniqueColumns.join(','))
      }
    }
    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body,
      fetch: this.fetch,
      allowEmpty: false
    })
  }

  /**
   * Perform an UPSERT on the table or view. Depending on the column(s) passed
   * to `onConflict`, `.upsert()` allows you to perform the equivalent of
   * `.insert()` if a row with the corresponding `onConflict` columns doesn't
   * exist, or if it does exist, perform an alternative action depending on
   * `ignoreDuplicates`.
   *
   * By default, upserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to upsert with. Pass an object to upsert a
   * single row or an array to upsert multiple rows.
   *
   * @param options - Named parameters
   *
   * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
   * duplicate rows are determined. Two rows are duplicates if all the
   * `onConflict` columns are equal.
   *
   * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
   * `false`, duplicate rows are merged with existing rows.
   *
   * @param options.count - Count algorithm to use to count upserted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  upsert (values, { onConflict, ignoreDuplicates = false, count } = {}) {
    const method = 'POST'
    const prefersHeaders = [`resolution=${ignoreDuplicates ? 'ignore' : 'merge'}-duplicates`]
    if (onConflict !== void 0) { this.url.searchParams.set('on_conflict', onConflict) }
    const body = values
    if (count) {
      prefersHeaders.push(`count=${count}`)
    }
    if (this.headers.Prefer) {
      prefersHeaders.unshift(this.headers.Prefer)
    }
    this.headers.Prefer = prefersHeaders.join(',')
    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body,
      fetch: this.fetch,
      allowEmpty: false
    })
  }

  /**
   * Perform an UPDATE on the table or view.
   *
   * By default, updated rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param values - The values to update with
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count updated rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  update (values, { count } = {}) {
    const method = 'PATCH'
    const prefersHeaders = []
    const body = values
    if (count) {
      prefersHeaders.push(`count=${count}`)
    }
    if (this.headers.Prefer) {
      prefersHeaders.unshift(this.headers.Prefer)
    }
    this.headers.Prefer = prefersHeaders.join(',')
    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body,
      fetch: this.fetch,
      allowEmpty: false
    })
  }

  /**
   * Perform a DELETE on the table or view.
   *
   * By default, deleted rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count deleted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  delete ({ count } = {}) {
    const method = 'DELETE'
    const prefersHeaders = []
    if (count) {
      prefersHeaders.push(`count=${count}`)
    }
    if (this.headers.Prefer) {
      prefersHeaders.unshift(this.headers.Prefer)
    }
    this.headers.Prefer = prefersHeaders.join(',')
    return new PostgrestFilterBuilder({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: false
    })
  }
}
const version$6 = '1.4.1'
const DEFAULT_HEADERS$4 = { 'X-Client-Info': `postgrest-js/${version$6}` }
class PostgrestClient {
  // TODO: Add back shouldThrowOnError once we figure out the typings
  /**
   * Creates a PostgREST client.
   *
   * @param url - URL of the PostgREST endpoint
   * @param options - Named parameters
   * @param options.headers - Custom headers
   * @param options.schema - Postgres schema to switch to
   * @param options.fetch - Custom fetch
   */
  constructor (url, { headers = {}, schema, fetch: fetch2 } = {}) {
    this.url = url
    this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS$4), headers)
    this.schema = schema
    this.fetch = fetch2
  }

  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from (relation) {
    const url = new URL(`${this.url}/${relation}`)
    return new PostgrestQueryBuilder(url, {
      headers: Object.assign({}, this.headers),
      schema: this.schema,
      fetch: this.fetch
    })
  }

  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc (fn2, args = {}, { head = false, count } = {}) {
    let method
    const url = new URL(`${this.url}/rpc/${fn2}`)
    let body
    if (head) {
      method = 'HEAD'
      Object.entries(args).forEach(([name2, value]) => {
        url.searchParams.append(name2, `${value}`)
      })
    } else {
      method = 'POST'
      body = args
    }
    const headers = Object.assign({}, this.headers)
    if (count) {
      headers.Prefer = `count=${count}`
    }
    return new PostgrestFilterBuilder({
      method,
      url,
      headers,
      schema: this.schema,
      body,
      fetch: this.fetch,
      allowEmpty: false
    })
  }
}
let global$1
let hasRequiredGlobal
function requireGlobal () {
  if (hasRequiredGlobal) { return global$1 }
  hasRequiredGlobal = 1
  const naiveFallback = function () {
    if (typeof self === 'object' && self) { return self }
    if (typeof window === 'object' && window) { return window }
    throw new Error('Unable to resolve global `this`')
  }
  global$1 = (function () {
    if (this) { return this }
    if (typeof globalThis === 'object' && globalThis) { return globalThis }
    try {
      Object.defineProperty(Object.prototype, '__global__', {
        get: function () {
          return this
        },
        configurable: true
      })
    } catch (error) {
      return naiveFallback()
    }
    try {
      if (!__global__) { return naiveFallback() }
      return __global__
    } finally {
      delete Object.prototype.__global__
    }
  }())
  return global$1
}
const name = 'websocket'
const description = 'Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.'
const keywords = [
  'websocket',
  'websockets',
  'socket',
  'networking',
  'comet',
  'push',
  'RFC-6455',
  'realtime',
  'server',
  'client'
]
const author = 'Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)'
const contributors = [
  'Iñaki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)'
]
const version$5 = '1.0.34'
const repository = {
  type: 'git',
  url: 'https://github.com/theturtle32/WebSocket-Node.git'
}
const homepage = 'https://github.com/theturtle32/WebSocket-Node'
const engines = {
  node: '>=4.0.0'
}
const dependencies = {
  bufferutil: '^4.0.1',
  debug: '^2.2.0',
  'es5-ext': '^0.10.50',
  'typedarray-to-buffer': '^3.1.5',
  'utf-8-validate': '^5.0.2',
  yaeti: '^0.0.6'
}
const devDependencies = {
  'buffer-equal': '^1.0.0',
  gulp: '^4.0.2',
  'gulp-jshint': '^2.0.4',
  'jshint-stylish': '^2.2.1',
  jshint: '^2.0.0',
  tape: '^4.9.1'
}
const config = {
  verbose: false
}
const scripts = {
  test: 'tape test/unit/*.js',
  gulp: 'gulp'
}
const main = 'index'
const directories = {
  lib: './lib'
}
const browser$1 = 'lib/browser.js'
const license = 'Apache-2.0'
const require$$0 = {
  name,
  description,
  keywords,
  author,
  contributors,
  version: version$5,
  repository,
  homepage,
  engines,
  dependencies,
  devDependencies,
  config,
  scripts,
  main,
  directories,
  browser: browser$1,
  license
}
const version$4 = require$$0.version
let _globalThis
if (typeof globalThis === 'object') {
  _globalThis = globalThis
} else {
  try {
    _globalThis = requireGlobal()
  } catch (error) {
  } finally {
    if (!_globalThis && typeof window !== 'undefined') {
      _globalThis = window
    }
    if (!_globalThis) {
      throw new Error('Could not determine global this')
    }
  }
}
const NativeWebSocket = _globalThis.WebSocket || _globalThis.MozWebSocket
const websocket_version = version$4
function W3CWebSocket (uri, protocols) {
  let native_instance
  if (protocols) {
    native_instance = new NativeWebSocket(uri, protocols)
  } else {
    native_instance = new NativeWebSocket(uri)
  }
  return native_instance
}
if (NativeWebSocket) {
  ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function (prop) {
    Object.defineProperty(W3CWebSocket, prop, {
      get: function () {
        return NativeWebSocket[prop]
      }
    })
  })
}
const browser = {
  w3cwebsocket: NativeWebSocket ? W3CWebSocket : null,
  version: websocket_version
}
const version$3 = '2.6.0'
const DEFAULT_HEADERS$3 = { 'X-Client-Info': `realtime-js/${version$3}` }
const VSN = '1.0.0'
const DEFAULT_TIMEOUT = 1e4
const WS_CLOSE_NORMAL = 1e3
let SOCKET_STATES;
(function (SOCKET_STATES2) {
  SOCKET_STATES2[SOCKET_STATES2.connecting = 0] = 'connecting'
  SOCKET_STATES2[SOCKET_STATES2.open = 1] = 'open'
  SOCKET_STATES2[SOCKET_STATES2.closing = 2] = 'closing'
  SOCKET_STATES2[SOCKET_STATES2.closed = 3] = 'closed'
})(SOCKET_STATES || (SOCKET_STATES = {}))
let CHANNEL_STATES;
(function (CHANNEL_STATES2) {
  CHANNEL_STATES2.closed = 'closed'
  CHANNEL_STATES2.errored = 'errored'
  CHANNEL_STATES2.joined = 'joined'
  CHANNEL_STATES2.joining = 'joining'
  CHANNEL_STATES2.leaving = 'leaving'
})(CHANNEL_STATES || (CHANNEL_STATES = {}))
let CHANNEL_EVENTS;
(function (CHANNEL_EVENTS2) {
  CHANNEL_EVENTS2.close = 'phx_close'
  CHANNEL_EVENTS2.error = 'phx_error'
  CHANNEL_EVENTS2.join = 'phx_join'
  CHANNEL_EVENTS2.reply = 'phx_reply'
  CHANNEL_EVENTS2.leave = 'phx_leave'
  CHANNEL_EVENTS2.access_token = 'access_token'
})(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}))
let TRANSPORTS;
(function (TRANSPORTS2) {
  TRANSPORTS2.websocket = 'websocket'
})(TRANSPORTS || (TRANSPORTS = {}))
let CONNECTION_STATE;
(function (CONNECTION_STATE2) {
  CONNECTION_STATE2.Connecting = 'connecting'
  CONNECTION_STATE2.Open = 'open'
  CONNECTION_STATE2.Closing = 'closing'
  CONNECTION_STATE2.Closed = 'closed'
})(CONNECTION_STATE || (CONNECTION_STATE = {}))
class Timer {
  constructor (callback, timerCalc) {
    this.callback = callback
    this.timerCalc = timerCalc
    this.timer = void 0
    this.tries = 0
    this.callback = callback
    this.timerCalc = timerCalc
  }

  reset () {
    this.tries = 0
    clearTimeout(this.timer)
  }

  // Cancels any previous scheduleTimeout and schedules callback
  scheduleTimeout () {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1
      this.callback()
    }, this.timerCalc(this.tries + 1))
  }
}
class Serializer {
  constructor () {
    this.HEADER_LENGTH = 1
  }

  decode (rawPayload, callback) {
    if (rawPayload.constructor === ArrayBuffer) {
      return callback(this._binaryDecode(rawPayload))
    }
    if (typeof rawPayload === 'string') {
      return callback(JSON.parse(rawPayload))
    }
    return callback({})
  }

  _binaryDecode (buffer) {
    const view = new DataView(buffer)
    const decoder = new TextDecoder()
    return this._decodeBroadcast(buffer, view, decoder)
  }

  _decodeBroadcast (buffer, view, decoder) {
    const topicSize = view.getUint8(1)
    const eventSize = view.getUint8(2)
    let offset2 = this.HEADER_LENGTH + 2
    const topic = decoder.decode(buffer.slice(offset2, offset2 + topicSize))
    offset2 = offset2 + topicSize
    const event = decoder.decode(buffer.slice(offset2, offset2 + eventSize))
    offset2 = offset2 + eventSize
    const data = JSON.parse(decoder.decode(buffer.slice(offset2, buffer.byteLength)))
    return { ref: null, topic, event, payload: data }
  }
}
class Push {
  /**
   * Initializes the Push
   *
   * @param channel The Channel
   * @param event The event, for example `"phx_join"`
   * @param payload The payload, for example `{user_id: 123}`
   * @param timeout The push timeout in milliseconds
   */
  constructor (channel, event, payload = {}, timeout = DEFAULT_TIMEOUT) {
    this.channel = channel
    this.event = event
    this.payload = payload
    this.timeout = timeout
    this.sent = false
    this.timeoutTimer = void 0
    this.ref = ''
    this.receivedResp = null
    this.recHooks = []
    this.refEvent = null
    this.rateLimited = false
  }

  resend (timeout) {
    this.timeout = timeout
    this._cancelRefEvent()
    this.ref = ''
    this.refEvent = null
    this.receivedResp = null
    this.sent = false
    this.send()
  }

  send () {
    if (this._hasReceived('timeout')) {
      return
    }
    this.startTimeout()
    this.sent = true
    const status = this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload,
      ref: this.ref,
      join_ref: this.channel._joinRef()
    })
    if (status === 'rate limited') {
      this.rateLimited = true
    }
  }

  updatePayload (payload) {
    this.payload = Object.assign(Object.assign({}, this.payload), payload)
  }

  receive (status, callback) {
    let _a
    if (this._hasReceived(status)) {
      callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response)
    }
    this.recHooks.push({ status, callback })
    return this
  }

  startTimeout () {
    if (this.timeoutTimer) {
      return
    }
    this.ref = this.channel.socket._makeRef()
    this.refEvent = this.channel._replyEventName(this.ref)
    const callback = (payload) => {
      this._cancelRefEvent()
      this._cancelTimeout()
      this.receivedResp = payload
      this._matchReceive(payload)
    }
    this.channel._on(this.refEvent, {}, callback)
    this.timeoutTimer = setTimeout(() => {
      this.trigger('timeout', {})
    }, this.timeout)
  }

  trigger (status, response) {
    if (this.refEvent) { this.channel._trigger(this.refEvent, { status, response }) }
  }

  destroy () {
    this._cancelRefEvent()
    this._cancelTimeout()
  }

  _cancelRefEvent () {
    if (!this.refEvent) {
      return
    }
    this.channel._off(this.refEvent, {})
  }

  _cancelTimeout () {
    clearTimeout(this.timeoutTimer)
    this.timeoutTimer = void 0
  }

  _matchReceive ({ status, response }) {
    this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response))
  }

  _hasReceived (status) {
    return this.receivedResp && this.receivedResp.status === status
  }
}
let REALTIME_PRESENCE_LISTEN_EVENTS;
(function (REALTIME_PRESENCE_LISTEN_EVENTS2) {
  REALTIME_PRESENCE_LISTEN_EVENTS2.SYNC = 'sync'
  REALTIME_PRESENCE_LISTEN_EVENTS2.JOIN = 'join'
  REALTIME_PRESENCE_LISTEN_EVENTS2.LEAVE = 'leave'
})(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}))
class RealtimePresence {
  /**
   * Initializes the Presence.
   *
   * @param channel - The RealtimeChannel
   * @param opts - The options,
   *        for example `{events: {state: 'state', diff: 'diff'}}`
   */
  constructor (channel, opts) {
    this.channel = channel
    this.state = {}
    this.pendingDiffs = []
    this.joinRef = null
    this.caller = {
      onJoin: () => {
      },
      onLeave: () => {
      },
      onSync: () => {
      }
    }
    const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
      state: 'presence_state',
      diff: 'presence_diff'
    }
    this.channel._on(events.state, {}, (newState) => {
      const { onJoin, onLeave, onSync } = this.caller
      this.joinRef = this.channel._joinRef()
      this.state = RealtimePresence.syncState(this.state, newState, onJoin, onLeave)
      this.pendingDiffs.forEach((diff) => {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave)
      })
      this.pendingDiffs = []
      onSync()
    })
    this.channel._on(events.diff, {}, (diff) => {
      const { onJoin, onLeave, onSync } = this.caller
      if (this.inPendingSyncState()) {
        this.pendingDiffs.push(diff)
      } else {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave)
        onSync()
      }
    })
    this.onJoin((key, currentPresences, newPresences) => {
      this.channel._trigger('presence', {
        event: 'join',
        key,
        currentPresences,
        newPresences
      })
    })
    this.onLeave((key, currentPresences, leftPresences) => {
      this.channel._trigger('presence', {
        event: 'leave',
        key,
        currentPresences,
        leftPresences
      })
    })
    this.onSync(() => {
      this.channel._trigger('presence', { event: 'sync' })
    })
  }

  /**
   * Used to sync the list of presences on the server with the
   * client's state.
   *
   * An optional `onJoin` and `onLeave` callback can be provided to
   * react to changes in the client's local presences across
   * disconnects and reconnects with the server.
   *
   * @internal
   */
  static syncState (currentState, newState, onJoin, onLeave) {
    const state = this.cloneDeep(currentState)
    const transformedState = this.transformState(newState)
    const joins = {}
    const leaves = {}
    this.map(state, (key, presences) => {
      if (!transformedState[key]) {
        leaves[key] = presences
      }
    })
    this.map(transformedState, (key, newPresences) => {
      const currentPresences = state[key]
      if (currentPresences) {
        const newPresenceRefs = newPresences.map((m) => m.presence_ref)
        const curPresenceRefs = currentPresences.map((m) => m.presence_ref)
        const joinedPresences = newPresences.filter((m) => curPresenceRefs.indexOf(m.presence_ref) < 0)
        const leftPresences = currentPresences.filter((m) => newPresenceRefs.indexOf(m.presence_ref) < 0)
        if (joinedPresences.length > 0) {
          joins[key] = joinedPresences
        }
        if (leftPresences.length > 0) {
          leaves[key] = leftPresences
        }
      } else {
        joins[key] = newPresences
      }
    })
    return this.syncDiff(state, { joins, leaves }, onJoin, onLeave)
  }

  /**
   * Used to sync a diff of presence join and leave events from the
   * server, as they happen.
   *
   * Like `syncState`, `syncDiff` accepts optional `onJoin` and
   * `onLeave` callbacks to react to a user joining or leaving from a
   * device.
   *
   * @internal
   */
  static syncDiff (state, diff, onJoin, onLeave) {
    const { joins, leaves } = {
      joins: this.transformState(diff.joins),
      leaves: this.transformState(diff.leaves)
    }
    if (!onJoin) {
      onJoin = () => {
      }
    }
    if (!onLeave) {
      onLeave = () => {
      }
    }
    this.map(joins, (key, newPresences) => {
      let _a
      const currentPresences = (_a = state[key]) !== null && _a !== void 0 ? _a : []
      state[key] = this.cloneDeep(newPresences)
      if (currentPresences.length > 0) {
        const joinedPresenceRefs = state[key].map((m) => m.presence_ref)
        const curPresences = currentPresences.filter((m) => joinedPresenceRefs.indexOf(m.presence_ref) < 0)
        state[key].unshift(...curPresences)
      }
      onJoin(key, currentPresences, newPresences)
    })
    this.map(leaves, (key, leftPresences) => {
      let currentPresences = state[key]
      if (!currentPresences) { return }
      const presenceRefsToRemove = leftPresences.map((m) => m.presence_ref)
      currentPresences = currentPresences.filter((m) => presenceRefsToRemove.indexOf(m.presence_ref) < 0)
      state[key] = currentPresences
      onLeave(key, currentPresences, leftPresences)
      if (currentPresences.length === 0) { delete state[key] }
    })
    return state
  }

  /** @internal */
  static map (obj, func) {
    return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]))
  }

  /**
   * Remove 'metas' key
   * Change 'phx_ref' to 'presence_ref'
   * Remove 'phx_ref' and 'phx_ref_prev'
   *
   * @example
   * // returns {
   *  abc123: [
   *    { presence_ref: '2', user_id: 1 },
   *    { presence_ref: '3', user_id: 2 }
   *  ]
   * }
   * RealtimePresence.transformState({
   *  abc123: {
   *    metas: [
   *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
   *      { phx_ref: '3', user_id: 2 }
   *    ]
   *  }
   * })
   *
   * @internal
   */
  static transformState (state) {
    state = this.cloneDeep(state)
    return Object.getOwnPropertyNames(state).reduce((newState, key) => {
      const presences = state[key]
      if ('metas' in presences) {
        newState[key] = presences.metas.map((presence) => {
          presence.presence_ref = presence.phx_ref
          delete presence.phx_ref
          delete presence.phx_ref_prev
          return presence
        })
      } else {
        newState[key] = presences
      }
      return newState
    }, {})
  }

  /** @internal */
  static cloneDeep (obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  /** @internal */
  onJoin (callback) {
    this.caller.onJoin = callback
  }

  /** @internal */
  onLeave (callback) {
    this.caller.onLeave = callback
  }

  /** @internal */
  onSync (callback) {
    this.caller.onSync = callback
  }

  /** @internal */
  inPendingSyncState () {
    return !this.joinRef || this.joinRef !== this.channel._joinRef()
  }
}
let PostgresTypes;
(function (PostgresTypes2) {
  PostgresTypes2.abstime = 'abstime'
  PostgresTypes2.bool = 'bool'
  PostgresTypes2.date = 'date'
  PostgresTypes2.daterange = 'daterange'
  PostgresTypes2.float4 = 'float4'
  PostgresTypes2.float8 = 'float8'
  PostgresTypes2.int2 = 'int2'
  PostgresTypes2.int4 = 'int4'
  PostgresTypes2.int4range = 'int4range'
  PostgresTypes2.int8 = 'int8'
  PostgresTypes2.int8range = 'int8range'
  PostgresTypes2.json = 'json'
  PostgresTypes2.jsonb = 'jsonb'
  PostgresTypes2.money = 'money'
  PostgresTypes2.numeric = 'numeric'
  PostgresTypes2.oid = 'oid'
  PostgresTypes2.reltime = 'reltime'
  PostgresTypes2.text = 'text'
  PostgresTypes2.time = 'time'
  PostgresTypes2.timestamp = 'timestamp'
  PostgresTypes2.timestamptz = 'timestamptz'
  PostgresTypes2.timetz = 'timetz'
  PostgresTypes2.tsrange = 'tsrange'
  PostgresTypes2.tstzrange = 'tstzrange'
})(PostgresTypes || (PostgresTypes = {}))
const convertChangeData = (columns, record, options = {}) => {
  let _a
  const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : []
  return Object.keys(record).reduce((acc, rec_key) => {
    acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes)
    return acc
  }, {})
}
const convertColumn = (columnName, columns, record, skipTypes) => {
  const column = columns.find((x) => x.name === columnName)
  const colType = column === null || column === void 0 ? void 0 : column.type
  const value = record[columnName]
  if (colType && !skipTypes.includes(colType)) {
    return convertCell(colType, value)
  }
  return noop$1(value)
}
const convertCell = (type, value) => {
  if (type.charAt(0) === '_') {
    const dataType = type.slice(1, type.length)
    return toArray(value, dataType)
  }
  switch (type) {
    case PostgresTypes.bool:
      return toBoolean(value)
    case PostgresTypes.float4:
    case PostgresTypes.float8:
    case PostgresTypes.int2:
    case PostgresTypes.int4:
    case PostgresTypes.int8:
    case PostgresTypes.numeric:
    case PostgresTypes.oid:
      return toNumber(value)
    case PostgresTypes.json:
    case PostgresTypes.jsonb:
      return toJson(value)
    case PostgresTypes.timestamp:
      return toTimestampString(value)
    case PostgresTypes.abstime:
    case PostgresTypes.date:
    case PostgresTypes.daterange:
    case PostgresTypes.int4range:
    case PostgresTypes.int8range:
    case PostgresTypes.money:
    case PostgresTypes.reltime:
    case PostgresTypes.text:
    case PostgresTypes.time:
    case PostgresTypes.timestamptz:
    case PostgresTypes.timetz:
    case PostgresTypes.tsrange:
    case PostgresTypes.tstzrange:
      return noop$1(value)
    default:
      return noop$1(value)
  }
}
const noop$1 = (value) => {
  return value
}
const toBoolean = (value) => {
  switch (value) {
    case 't':
      return true
    case 'f':
      return false
    default:
      return value
  }
}
const toNumber = (value) => {
  if (typeof value === 'string') {
    const parsedValue = parseFloat(value)
    if (!Number.isNaN(parsedValue)) {
      return parsedValue
    }
  }
  return value
}
const toJson = (value) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch (error) {
      console.log(`JSON parse error: ${error}`)
      return value
    }
  }
  return value
}
const toArray = (value, type) => {
  if (typeof value !== 'string') {
    return value
  }
  const lastIdx = value.length - 1
  const closeBrace = value[lastIdx]
  const openBrace = value[0]
  if (openBrace === '{' && closeBrace === '}') {
    let arr
    const valTrim = value.slice(1, lastIdx)
    try {
      arr = JSON.parse('[' + valTrim + ']')
    } catch (_) {
      arr = valTrim ? valTrim.split(',') : []
    }
    return arr.map((val) => convertCell(type, val))
  }
  return value
}
const toTimestampString = (value) => {
  if (typeof value === 'string') {
    return value.replace(' ', 'T')
  }
  return value
}
const __awaiter$b = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
let REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
(function (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2) {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2.ALL = '*'
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2.INSERT = 'INSERT'
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2.UPDATE = 'UPDATE'
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2.DELETE = 'DELETE'
})(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}))
let REALTIME_LISTEN_TYPES;
(function (REALTIME_LISTEN_TYPES2) {
  REALTIME_LISTEN_TYPES2.BROADCAST = 'broadcast'
  REALTIME_LISTEN_TYPES2.PRESENCE = 'presence'
  REALTIME_LISTEN_TYPES2.POSTGRES_CHANGES = 'postgres_changes'
})(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}))
let REALTIME_SUBSCRIBE_STATES;
(function (REALTIME_SUBSCRIBE_STATES2) {
  REALTIME_SUBSCRIBE_STATES2.SUBSCRIBED = 'SUBSCRIBED'
  REALTIME_SUBSCRIBE_STATES2.TIMED_OUT = 'TIMED_OUT'
  REALTIME_SUBSCRIBE_STATES2.CLOSED = 'CLOSED'
  REALTIME_SUBSCRIBE_STATES2.CHANNEL_ERROR = 'CHANNEL_ERROR'
})(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}))
class RealtimeChannel {
  constructor (topic, params = { config: {} }, socket) {
    this.topic = topic
    this.params = params
    this.socket = socket
    this.bindings = {}
    this.state = CHANNEL_STATES.closed
    this.joinedOnce = false
    this.pushBuffer = []
    this.params.config = Object.assign({
      broadcast: { ack: false, self: false },
      presence: { key: '' }
    }, params.config)
    this.timeout = this.socket.timeout
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout)
    this.rejoinTimer = new Timer(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs)
    this.joinPush.receive('ok', () => {
      this.state = CHANNEL_STATES.joined
      this.rejoinTimer.reset()
      this.pushBuffer.forEach((pushEvent) => pushEvent.send())
      this.pushBuffer = []
    })
    this._onClose(() => {
      this.rejoinTimer.reset()
      this.socket.log('channel', `close ${this.topic} ${this._joinRef()}`)
      this.state = CHANNEL_STATES.closed
      this.socket._remove(this)
    })
    this._onError((reason) => {
      if (this._isLeaving() || this._isClosed()) {
        return
      }
      this.socket.log('channel', `error ${this.topic}`, reason)
      this.state = CHANNEL_STATES.errored
      this.rejoinTimer.scheduleTimeout()
    })
    this.joinPush.receive('timeout', () => {
      if (!this._isJoining()) {
        return
      }
      this.socket.log('channel', `timeout ${this.topic}`, this.joinPush.timeout)
      this.state = CHANNEL_STATES.errored
      this.rejoinTimer.scheduleTimeout()
    })
    this._on(CHANNEL_EVENTS.reply, {}, (payload, ref) => {
      this._trigger(this._replyEventName(ref), payload)
    })
    this.presence = new RealtimePresence(this)
  }

  /** Subscribe registers your client with the server */
  subscribe (callback, timeout = this.timeout) {
    let _a, _b
    if (this.joinedOnce) {
      throw 'tried to subscribe multiple times. \'subscribe\' can only be called a single time per channel instance'
    } else {
      const { config: { broadcast, presence } } = this.params
      this._onError((e) => callback && callback('CHANNEL_ERROR', e))
      this._onClose(() => callback && callback('CLOSED'))
      const accessTokenPayload = {}
      const config2 = {
        broadcast,
        presence,
        postgres_changes: (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r) => r.filter)) !== null && _b !== void 0 ? _b : []
      }
      if (this.socket.accessToken) {
        accessTokenPayload.access_token = this.socket.accessToken
      }
      this.updateJoinPayload(Object.assign({ config: config2 }, accessTokenPayload))
      this.joinedOnce = true
      this._rejoin(timeout)
      this.joinPush.receive('ok', ({ postgres_changes: serverPostgresFilters }) => {
        let _a2
        this.socket.accessToken && this.socket.setAuth(this.socket.accessToken)
        if (serverPostgresFilters === void 0) {
          callback && callback('SUBSCRIBED')
        } else {
          const clientPostgresBindings = this.bindings.postgres_changes
          const bindingsLen = (_a2 = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a2 !== void 0 ? _a2 : 0
          const newPostgresBindings = []
          for (let i = 0; i < bindingsLen; i++) {
            const clientPostgresBinding = clientPostgresBindings[i]
            const { filter: { event, schema, table, filter } } = clientPostgresBinding
            const serverPostgresFilter = serverPostgresFilters && serverPostgresFilters[i]
            if (serverPostgresFilter && serverPostgresFilter.event === event && serverPostgresFilter.schema === schema && serverPostgresFilter.table === table && serverPostgresFilter.filter === filter) {
              newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }))
            } else {
              this.unsubscribe()
              callback && callback('CHANNEL_ERROR', new Error('mismatch between server and client bindings for postgres changes'))
              return
            }
          }
          this.bindings.postgres_changes = newPostgresBindings
          callback && callback('SUBSCRIBED')
        }
      }).receive('error', (error) => {
        callback && callback('CHANNEL_ERROR', new Error(JSON.stringify(Object.values(error).join(', ') || 'error')))
      }).receive('timeout', () => {
        callback && callback('TIMED_OUT')
      })
    }
    return this
  }

  presenceState () {
    return this.presence.state
  }

  track (payload, opts = {}) {
    return __awaiter$b(this, void 0, void 0, function * () {
      return yield this.send({
        type: 'presence',
        event: 'track',
        payload
      }, opts.timeout || this.timeout)
    })
  }

  untrack (opts = {}) {
    return __awaiter$b(this, void 0, void 0, function * () {
      return yield this.send({
        type: 'presence',
        event: 'untrack'
      }, opts)
    })
  }

  on (type, filter, callback) {
    return this._on(type, filter, callback)
  }

  send (payload, opts = {}) {
    return new Promise((resolve) => {
      let _a, _b, _c
      const push = this._push(payload.type, payload, opts.timeout || this.timeout)
      if (push.rateLimited) {
        resolve('rate limited')
      }
      if (payload.type === 'broadcast' && !((_c = (_b = (_a = this.params) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
        resolve('ok')
      }
      push.receive('ok', () => resolve('ok'))
      push.receive('timeout', () => resolve('timed out'))
    })
  }

  updateJoinPayload (payload) {
    this.joinPush.updatePayload(payload)
  }

  /**
   * Leaves the channel.
   *
   * Unsubscribes from server events, and instructs channel to terminate on server.
   * Triggers onClose() hooks.
   *
   * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
   * channel.unsubscribe().receive("ok", () => alert("left!") )
   */
  unsubscribe (timeout = this.timeout) {
    this.state = CHANNEL_STATES.leaving
    const onClose = () => {
      this.socket.log('channel', `leave ${this.topic}`)
      this._trigger(CHANNEL_EVENTS.close, 'leave', this._joinRef())
    }
    this.rejoinTimer.reset()
    this.joinPush.destroy()
    return new Promise((resolve) => {
      const leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout)
      leavePush.receive('ok', () => {
        onClose()
        resolve('ok')
      }).receive('timeout', () => {
        onClose()
        resolve('timed out')
      }).receive('error', () => {
        resolve('error')
      })
      leavePush.send()
      if (!this._canPush()) {
        leavePush.trigger('ok', {})
      }
    })
  }

  /** @internal */
  _push (event, payload, timeout = this.timeout) {
    if (!this.joinedOnce) {
      throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`
    }
    const pushEvent = new Push(this, event, payload, timeout)
    if (this._canPush()) {
      pushEvent.send()
    } else {
      pushEvent.startTimeout()
      this.pushBuffer.push(pushEvent)
    }
    return pushEvent
  }

  /**
   * Overridable message hook
   *
   * Receives all events for specialized message handling before dispatching to the channel callbacks.
   * Must return the payload, modified or unmodified.
   *
   * @internal
   */
  _onMessage (_event, payload, _ref) {
    return payload
  }

  /** @internal */
  _isMember (topic) {
    return this.topic === topic
  }

  /** @internal */
  _joinRef () {
    return this.joinPush.ref
  }

  /** @internal */
  _trigger (type, payload, ref) {
    let _a, _b
    const typeLower = type.toLocaleLowerCase()
    const { close, error, leave, join } = CHANNEL_EVENTS
    const events = [close, error, leave, join]
    if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
      return
    }
    let handledPayload = this._onMessage(typeLower, payload, ref)
    if (payload && !handledPayload) {
      throw 'channel onMessage callbacks must return the payload, modified or unmodified'
    }
    if (['insert', 'update', 'delete'].includes(typeLower)) {
      (_a = this.bindings.postgres_changes) === null || _a === void 0
        ? void 0
        : _a.filter((bind) => {
          let _a2, _b2, _c
          return ((_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event) === '*' || ((_c = (_b2 = bind.filter) === null || _b2 === void 0 ? void 0 : _b2.event) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === typeLower
        }).map((bind) => bind.callback(handledPayload, ref))
    } else {
      (_b = this.bindings[typeLower]) === null || _b === void 0
        ? void 0
        : _b.filter((bind) => {
          let _a2, _b2, _c, _d, _e, _f
          if (['broadcast', 'presence', 'postgres_changes'].includes(typeLower)) {
            if ('id' in bind) {
              const bindId = bind.id
              const bindEvent = (_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event
              return bindId && ((_b2 = payload.ids) === null || _b2 === void 0 ? void 0 : _b2.includes(bindId)) && (bindEvent === '*' || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.type.toLocaleLowerCase()))
            } else {
              const bindEvent = (_e = (_d = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.toLocaleLowerCase()
              return bindEvent === '*' || bindEvent === ((_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase())
            }
          } else {
            return bind.type.toLocaleLowerCase() === typeLower
          }
        }).map((bind) => {
          if (typeof handledPayload === 'object' && 'ids' in handledPayload) {
            const postgresChanges = handledPayload.data
            const { schema, table, commit_timestamp, type: type2, errors } = postgresChanges
            const enrichedPayload = {
              schema,
              table,
              commit_timestamp,
              eventType: type2,
              new: {},
              old: {},
              errors
            }
            handledPayload = Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges))
          }
          bind.callback(handledPayload, ref)
        })
    }
  }

  /** @internal */
  _isClosed () {
    return this.state === CHANNEL_STATES.closed
  }

  /** @internal */
  _isJoined () {
    return this.state === CHANNEL_STATES.joined
  }

  /** @internal */
  _isJoining () {
    return this.state === CHANNEL_STATES.joining
  }

  /** @internal */
  _isLeaving () {
    return this.state === CHANNEL_STATES.leaving
  }

  /** @internal */
  _replyEventName (ref) {
    return `chan_reply_${ref}`
  }

  /** @internal */
  _on (type, filter, callback) {
    const typeLower = type.toLocaleLowerCase()
    const binding = {
      type: typeLower,
      filter,
      callback
    }
    if (this.bindings[typeLower]) {
      this.bindings[typeLower].push(binding)
    } else {
      this.bindings[typeLower] = [binding]
    }
    return this
  }

  /** @internal */
  _off (type, filter) {
    const typeLower = type.toLocaleLowerCase()
    this.bindings[typeLower] = this.bindings[typeLower].filter((bind) => {
      let _a
      return !(((_a = bind.type) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === typeLower && RealtimeChannel.isEqual(bind.filter, filter))
    })
    return this
  }

  /** @internal */
  static isEqual (obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false
    }
    for (const k in obj1) {
      if (obj1[k] !== obj2[k]) {
        return false
      }
    }
    return true
  }

  /** @internal */
  _rejoinUntilConnected () {
    this.rejoinTimer.scheduleTimeout()
    if (this.socket.isConnected()) {
      this._rejoin()
    }
  }

  /**
   * Registers a callback that will be executed when the channel closes.
   *
   * @internal
   */
  _onClose (callback) {
    this._on(CHANNEL_EVENTS.close, {}, callback)
  }

  /**
   * Registers a callback that will be executed when the channel encounteres an error.
   *
   * @internal
   */
  _onError (callback) {
    this._on(CHANNEL_EVENTS.error, {}, (reason) => callback(reason))
  }

  /**
   * Returns `true` if the socket is connected and the channel has been joined.
   *
   * @internal
   */
  _canPush () {
    return this.socket.isConnected() && this._isJoined()
  }

  /** @internal */
  _rejoin (timeout = this.timeout) {
    if (this._isLeaving()) {
      return
    }
    this.socket._leaveOpenTopic(this.topic)
    this.state = CHANNEL_STATES.joining
    this.joinPush.resend(timeout)
  }

  /** @internal */
  _getPayloadRecords (payload) {
    const records = {
      new: {},
      old: {}
    }
    if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
      records.new = convertChangeData(payload.columns, payload.record)
    }
    if (payload.type === 'UPDATE' || payload.type === 'DELETE') {
      records.old = convertChangeData(payload.columns, payload.old_record)
    }
    return records
  }
}
const __awaiter$a = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
const noop = () => {
}
class RealtimeClient {
  /**
   * Initializes the Socket.
   *
   * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
   * @param options.transport The Websocket Transport, for example WebSocket.
   * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
   * @param options.params The optional params to pass when connecting.
   * @param options.headers The optional headers to pass when connecting.
   * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
   * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
   * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
   * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
   * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
   */
  constructor (endPoint, options) {
    let _a
    this.accessToken = null
    this.channels = []
    this.endPoint = ''
    this.headers = DEFAULT_HEADERS$3
    this.params = {}
    this.timeout = DEFAULT_TIMEOUT
    this.transport = browser.w3cwebsocket
    this.heartbeatIntervalMs = 3e4
    this.heartbeatTimer = void 0
    this.pendingHeartbeatRef = null
    this.ref = 0
    this.logger = noop
    this.conn = null
    this.sendBuffer = []
    this.serializer = new Serializer()
    this.stateChangeCallbacks = {
      open: [],
      close: [],
      error: [],
      message: []
    }
    this.eventsPerSecondLimitMs = 100
    this.inThrottle = false
    this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`
    if (options === null || options === void 0 ? void 0 : options.params) { this.params = options.params }
    if (options === null || options === void 0 ? void 0 : options.headers) { this.headers = Object.assign(Object.assign({}, this.headers), options.headers) }
    if (options === null || options === void 0 ? void 0 : options.timeout) { this.timeout = options.timeout }
    if (options === null || options === void 0 ? void 0 : options.logger) { this.logger = options.logger }
    if (options === null || options === void 0 ? void 0 : options.transport) { this.transport = options.transport }
    if (options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) { this.heartbeatIntervalMs = options.heartbeatIntervalMs }
    const eventsPerSecond = (_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.eventsPerSecond
    if (eventsPerSecond) { this.eventsPerSecondLimitMs = Math.floor(1e3 / eventsPerSecond) }
    this.reconnectAfterMs = (options === null || options === void 0 ? void 0 : options.reconnectAfterMs)
      ? options.reconnectAfterMs
      : (tries) => {
          return [1e3, 2e3, 5e3, 1e4][tries - 1] || 1e4
        }
    this.encode = (options === null || options === void 0 ? void 0 : options.encode)
      ? options.encode
      : (payload, callback) => {
          return callback(JSON.stringify(payload))
        }
    this.decode = (options === null || options === void 0 ? void 0 : options.decode) ? options.decode : this.serializer.decode.bind(this.serializer)
    this.reconnectTimer = new Timer(() => __awaiter$a(this, void 0, void 0, function * () {
      this.disconnect()
      this.connect()
    }), this.reconnectAfterMs)
  }

  /**
   * Connects the socket, unless already connected.
   */
  connect () {
    if (this.conn) {
      return
    }
    this.conn = new this.transport(this._endPointURL(), [], null, this.headers)
    if (this.conn) {
      this.conn.binaryType = 'arraybuffer'
      this.conn.onopen = () => this._onConnOpen()
      this.conn.onerror = (error) => this._onConnError(error)
      this.conn.onmessage = (event) => this._onConnMessage(event)
      this.conn.onclose = (event) => this._onConnClose(event)
    }
  }

  /**
   * Disconnects the socket.
   *
   * @param code A numeric status code to send on disconnect.
   * @param reason A custom reason for the disconnect.
   */
  disconnect (code, reason) {
    if (this.conn) {
      this.conn.onclose = function () {
      }
      if (code) {
        this.conn.close(code, reason !== null && reason !== void 0 ? reason : '')
      } else {
        this.conn.close()
      }
      this.conn = null
      this.heartbeatTimer && clearInterval(this.heartbeatTimer)
      this.reconnectTimer.reset()
    }
  }

  /**
   * Returns all created channels
   */
  getChannels () {
    return this.channels
  }

  /**
   * Unsubscribes and removes a single channel
   * @param channel A RealtimeChannel instance
   */
  removeChannel (channel) {
    return channel.unsubscribe().then((status) => {
      if (this.channels.length === 0) {
        this.disconnect()
      }
      return status
    })
  }

  /**
   * Unsubscribes and removes all channels
   */
  removeAllChannels () {
    return Promise.all(this.channels.map((channel) => channel.unsubscribe())).then((values) => {
      this.disconnect()
      return values
    })
  }

  /**
   * Logs the message.
   *
   * For customized logging, `this.logger` can be overridden.
   */
  log (kind, msg, data) {
    this.logger(kind, msg, data)
  }

  /**
   * Returns the current state of the socket.
   */
  connectionState () {
    switch (this.conn && this.conn.readyState) {
      case SOCKET_STATES.connecting:
        return CONNECTION_STATE.Connecting
      case SOCKET_STATES.open:
        return CONNECTION_STATE.Open
      case SOCKET_STATES.closing:
        return CONNECTION_STATE.Closing
      default:
        return CONNECTION_STATE.Closed
    }
  }

  /**
   * Returns `true` is the connection is open.
   */
  isConnected () {
    return this.connectionState() === CONNECTION_STATE.Open
  }

  channel (topic, params = { config: {} }) {
    if (!this.isConnected()) {
      this.connect()
    }
    const chan = new RealtimeChannel(`realtime:${topic}`, params, this)
    this.channels.push(chan)
    return chan
  }

  /**
   * Push out a message if the socket is connected.
   *
   * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
   */
  push (data) {
    const { topic, event, payload, ref } = data
    const callback = () => {
      this.encode(data, (result) => {
        let _a;
        (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result)
      })
    }
    this.log('push', `${topic} ${event} (${ref})`, payload)
    if (this.isConnected()) {
      if (['broadcast', 'presence', 'postgres_changes'].includes(event)) {
        const isThrottled = this._throttle(callback)()
        if (isThrottled) {
          return 'rate limited'
        }
      } else {
        callback()
      }
    } else {
      this.sendBuffer.push(callback)
    }
  }

  /**
   * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
   *
   * @param token A JWT string.
   */
  setAuth (token) {
    this.accessToken = token
    this.channels.forEach((channel) => {
      token && channel.updateJoinPayload({ access_token: token })
      if (channel.joinedOnce && channel._isJoined()) {
        channel._push(CHANNEL_EVENTS.access_token, { access_token: token })
      }
    })
  }

  /**
   * Return the next message ref, accounting for overflows
   *
   * @internal
   */
  _makeRef () {
    const newRef = this.ref + 1
    if (newRef === this.ref) {
      this.ref = 0
    } else {
      this.ref = newRef
    }
    return this.ref.toString()
  }

  /**
   * Unsubscribe from channels with the specified topic.
   *
   * @internal
   */
  _leaveOpenTopic (topic) {
    const dupChannel = this.channels.find((c) => c.topic === topic && (c._isJoined() || c._isJoining()))
    if (dupChannel) {
      this.log('transport', `leaving duplicate topic "${topic}"`)
      dupChannel.unsubscribe()
    }
  }

  /**
   * Removes a subscription from the socket.
   *
   * @param channel An open subscription.
   *
   * @internal
   */
  _remove (channel) {
    this.channels = this.channels.filter((c) => c._joinRef() !== channel._joinRef())
  }

  /**
   * Returns the URL of the websocket.
   *
   * @internal
   */
  _endPointURL () {
    return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: VSN }))
  }

  /** @internal */
  _onConnMessage (rawMessage) {
    this.decode(rawMessage.data, (msg) => {
      const { topic, event, payload, ref } = msg
      if (ref && ref === this.pendingHeartbeatRef || event === (payload === null || payload === void 0 ? void 0 : payload.type)) {
        this.pendingHeartbeatRef = null
      }
      this.log('receive', `${payload.status || ''} ${topic} ${event} ${ref && '(' + ref + ')' || ''}`, payload)
      this.channels.filter((channel) => channel._isMember(topic)).forEach((channel) => channel._trigger(event, payload, ref))
      this.stateChangeCallbacks.message.forEach((callback) => callback(msg))
    })
  }

  /** @internal */
  _onConnOpen () {
    this.log('transport', `connected to ${this._endPointURL()}`)
    this._flushSendBuffer()
    this.reconnectTimer.reset()
    this.heartbeatTimer && clearInterval(this.heartbeatTimer)
    this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs)
    this.stateChangeCallbacks.open.forEach((callback) => callback())
  }

  /** @internal */
  _onConnClose (event) {
    this.log('transport', 'close', event)
    this._triggerChanError()
    this.heartbeatTimer && clearInterval(this.heartbeatTimer)
    this.reconnectTimer.scheduleTimeout()
    this.stateChangeCallbacks.close.forEach((callback) => callback(event))
  }

  /** @internal */
  _onConnError (error) {
    this.log('transport', error.message)
    this._triggerChanError()
    this.stateChangeCallbacks.error.forEach((callback) => callback(error))
  }

  /** @internal */
  _triggerChanError () {
    this.channels.forEach((channel) => channel._trigger(CHANNEL_EVENTS.error))
  }

  /** @internal */
  _appendParams (url, params) {
    if (Object.keys(params).length === 0) {
      return url
    }
    const prefix = url.match(/\?/) ? '&' : '?'
    const query = new URLSearchParams(params)
    return `${url}${prefix}${query}`
  }

  /** @internal */
  _flushSendBuffer () {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach((callback) => callback())
      this.sendBuffer = []
    }
  }

  /** @internal */
  _sendHeartbeat () {
    let _a
    if (!this.isConnected()) {
      return
    }
    if (this.pendingHeartbeatRef) {
      this.pendingHeartbeatRef = null
      this.log('transport', 'heartbeat timeout. Attempting to re-establish connection');
      (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(WS_CLOSE_NORMAL, 'hearbeat timeout')
      return
    }
    this.pendingHeartbeatRef = this._makeRef()
    this.push({
      topic: 'phoenix',
      event: 'heartbeat',
      payload: {},
      ref: this.pendingHeartbeatRef
    })
    this.setAuth(this.accessToken)
  }

  /** @internal */
  _throttle (callback, eventsPerSecondLimitMs = this.eventsPerSecondLimitMs) {
    return () => {
      if (this.inThrottle) { return true }
      callback()
      if (eventsPerSecondLimitMs > 0) {
        this.inThrottle = true
        setTimeout(() => {
          this.inThrottle = false
        }, eventsPerSecondLimitMs)
      }
      return false
    }
  }
}
class StorageError extends Error {
  constructor (message) {
    super(message)
    this.__isStorageError = true
    this.name = 'StorageError'
  }
}
function isStorageError (error) {
  return typeof error === 'object' && error !== null && '__isStorageError' in error
}
class StorageApiError extends StorageError {
  constructor (message, status) {
    super(message)
    this.name = 'StorageApiError'
    this.status = status
  }

  toJSON () {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    }
  }
}
class StorageUnknownError extends StorageError {
  constructor (message, originalError) {
    super(message)
    this.name = 'StorageUnknownError'
    this.originalError = originalError
  }
}
const __awaiter$9 = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
const resolveFetch$2 = (customFetch) => {
  let _fetch
  if (customFetch) {
    _fetch = customFetch
  } else if (typeof fetch === 'undefined') {
    _fetch = (...args) => __awaiter$9(void 0, void 0, void 0, function * () {
      return yield (yield __vitePreload(() => Promise.resolve().then(() => browserPonyfill), true ? void 0 : void 0, import.meta.url)).fetch(...args)
    })
  } else {
    _fetch = fetch
  }
  return (...args) => _fetch(...args)
}
const resolveResponse = () => __awaiter$9(void 0, void 0, void 0, function * () {
  if (typeof Response === 'undefined') {
    return (yield __vitePreload(() => Promise.resolve().then(() => browserPonyfill), true ? void 0 : void 0, import.meta.url)).Response
  }
  return Response
})
const __awaiter$8 = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
const _getErrorMessage$1 = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err)
const handleError$1 = (error, reject) => __awaiter$8(void 0, void 0, void 0, function * () {
  const Res = yield resolveResponse()
  if (error instanceof Res) {
    error.json().then((err) => {
      reject(new StorageApiError(_getErrorMessage$1(err), error.status || 500))
    })
  } else {
    reject(new StorageUnknownError(_getErrorMessage$1(error), error))
  }
})
const _getRequestParams$1 = (method, options, parameters, body) => {
  const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} }
  if (method === 'GET') {
    return params
  }
  params.headers = Object.assign({ 'Content-Type': 'application/json' }, options === null || options === void 0 ? void 0 : options.headers)
  params.body = JSON.stringify(body)
  return Object.assign(Object.assign({}, params), parameters)
}
function _handleRequest$1 (fetcher, method, url, options, parameters, body) {
  return __awaiter$8(this, void 0, void 0, function * () {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams$1(method, options, parameters, body)).then((result) => {
        if (!result.ok) { throw result }
        if (options === null || options === void 0 ? void 0 : options.noResolveJson) { return result }
        return result.json()
      }).then((data) => resolve(data)).catch((error) => handleError$1(error, reject))
    })
  })
}
function get (fetcher, url, options, parameters) {
  return __awaiter$8(this, void 0, void 0, function * () {
    return _handleRequest$1(fetcher, 'GET', url, options, parameters)
  })
}
function post (fetcher, url, body, options, parameters) {
  return __awaiter$8(this, void 0, void 0, function * () {
    return _handleRequest$1(fetcher, 'POST', url, options, parameters, body)
  })
}
function put (fetcher, url, body, options, parameters) {
  return __awaiter$8(this, void 0, void 0, function * () {
    return _handleRequest$1(fetcher, 'PUT', url, options, parameters, body)
  })
}
function remove (fetcher, url, body, options, parameters) {
  return __awaiter$8(this, void 0, void 0, function * () {
    return _handleRequest$1(fetcher, 'DELETE', url, options, parameters, body)
  })
}
const __awaiter$7 = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
const DEFAULT_SEARCH_OPTIONS = {
  limit: 100,
  offset: 0,
  sortBy: {
    column: 'name',
    order: 'asc'
  }
}
const DEFAULT_FILE_OPTIONS = {
  cacheControl: '3600',
  contentType: 'text/plain;charset=UTF-8',
  upsert: false
}
class StorageFileApi {
  constructor (url, headers = {}, bucketId, fetch2) {
    this.url = url
    this.headers = headers
    this.bucketId = bucketId
    this.fetch = resolveFetch$2(fetch2)
  }

  /**
   * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
   *
   * @param method HTTP method.
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadOrUpdate (method, path, fileBody, fileOptions) {
    return __awaiter$7(this, void 0, void 0, function * () {
      try {
        let body
        const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions)
        const headers = Object.assign(Object.assign({}, this.headers), method === 'POST' && { 'x-upsert': String(options.upsert) })
        if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
          body = new FormData()
          body.append('cacheControl', options.cacheControl)
          body.append('', fileBody)
        } else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
          body = fileBody
          body.append('cacheControl', options.cacheControl)
        } else {
          body = fileBody
          headers['cache-control'] = `max-age=${options.cacheControl}`
          headers['content-type'] = options.contentType
        }
        const cleanPath = this._removeEmptyFolders(path)
        const _path = this._getFinalPath(cleanPath)
        const res = yield this.fetch(`${this.url}/object/${_path}`, {
          method,
          body,
          headers
        })
        if (res.ok) {
          return {
            data: { path: cleanPath },
            error: null
          }
        } else {
          const error = yield res.json()
          return { data: null, error }
        }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Uploads a file to an existing bucket.
   *
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  upload (path, fileBody, fileOptions) {
    return __awaiter$7(this, void 0, void 0, function * () {
      return this.uploadOrUpdate('POST', path, fileBody, fileOptions)
    })
  }

  /**
   * Replaces an existing file at the specified path with a new one.
   *
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  update (path, fileBody, fileOptions) {
    return __awaiter$7(this, void 0, void 0, function * () {
      return this.uploadOrUpdate('PUT', path, fileBody, fileOptions)
    })
  }

  /**
   * Moves an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
   */
  move (fromPath, toPath) {
    return __awaiter$7(this, void 0, void 0, function * () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers })
        return { data, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Copies an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
   */
  copy (fromPath, toPath) {
    return __awaiter$7(this, void 0, void 0, function * () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/copy`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers })
        return { data: { path: data.Key }, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param path The file path, including the current file name. For example `folder/image.png`.
   * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  createSignedUrl (path, expiresIn, options) {
    return __awaiter$7(this, void 0, void 0, function * () {
      try {
        const _path = this._getFinalPath(path)
        let data = yield post(this.fetch, `${this.url}/object/sign/${_path}`, Object.assign({ expiresIn }, (options === null || options === void 0 ? void 0 : options.transform) ? { transform: options.transform } : {}), { headers: this.headers })
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? '' : options.download}` : ''
        const signedUrl = encodeURI(`${this.url}${data.signedURL}${downloadQueryParam}`)
        data = { signedUrl }
        return { data, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
   * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   */
  createSignedUrls (paths, expiresIn, options) {
    return __awaiter$7(this, void 0, void 0, function * () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn, paths }, { headers: this.headers })
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? '' : options.download}` : ''
        return {
          data: data.map((datum) => Object.assign(Object.assign({}, datum), { signedUrl: datum.signedURL ? encodeURI(`${this.url}${datum.signedURL}${downloadQueryParam}`) : null })),
          error: null
        }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
   *
   * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
   * @param options.transform Transform the asset before serving it to the client.
   */
  download (path, options) {
    return __awaiter$7(this, void 0, void 0, function * () {
      const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== 'undefined'
      const renderPath = wantsTransformation ? 'render/image/authenticated' : 'object'
      const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {})
      const queryString = transformationQuery ? `?${transformationQuery}` : ''
      try {
        const _path = this._getFinalPath(path)
        const res = yield get(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
          headers: this.headers,
          noResolveJson: true
        })
        const data = yield res.blob()
        return { data, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
   * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
   *
   * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
   * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  getPublicUrl (path, options) {
    const _path = this._getFinalPath(path)
    const _queryString = []
    const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `download=${options.download === true ? '' : options.download}` : ''
    if (downloadQueryParam !== '') {
      _queryString.push(downloadQueryParam)
    }
    const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== 'undefined'
    const renderPath = wantsTransformation ? 'render/image' : 'object'
    const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {})
    if (transformationQuery !== '') {
      _queryString.push(transformationQuery)
    }
    let queryString = _queryString.join('&')
    if (queryString !== '') {
      queryString = `?${queryString}`
    }
    return {
      data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`) }
    }
  }

  /**
   * Deletes files within the same bucket
   *
   * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
   */
  remove (paths) {
    return __awaiter$7(this, void 0, void 0, function * () {
      try {
        const data = yield remove(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers })
        return { data, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Get file metadata
   * @param id the file id to retrieve metadata
   */
  // async getMetadata(
  //   id: string
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Update file metadata
   * @param id the file id to update metadata
   * @param meta the new file metadata
   */
  // async updateMetadata(
  //   id: string,
  //   meta: Metadata
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await post(
  //       this.fetch,
  //       `${this.url}/metadata/${id}`,
  //       { ...meta },
  //       { headers: this.headers }
  //     )
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Lists all the files within a bucket.
   * @param path The folder path.
   */
  list (path, options, parameters) {
    return __awaiter$7(this, void 0, void 0, function * () {
      try {
        const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path || '' })
        const data = yield post(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters)
        return { data, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  _getFinalPath (path) {
    return `${this.bucketId}/${path}`
  }

  _removeEmptyFolders (path) {
    return path.replace(/^\/|\/$/g, '').replace(/\/+/g, '/')
  }

  transformOptsToQueryString (transform) {
    const params = []
    if (transform.width) {
      params.push(`width=${transform.width}`)
    }
    if (transform.height) {
      params.push(`height=${transform.height}`)
    }
    if (transform.resize) {
      params.push(`resize=${transform.resize}`)
    }
    if (transform.format) {
      params.push(`format=${transform.format}`)
    }
    if (transform.quality) {
      params.push(`quality=${transform.quality}`)
    }
    return params.join('&')
  }
}
const version$2 = '2.3.0'
const DEFAULT_HEADERS$2 = { 'X-Client-Info': `storage-js/${version$2}` }
const __awaiter$6 = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
class StorageBucketApi {
  constructor (url, headers = {}, fetch2) {
    this.url = url
    this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS$2), headers)
    this.fetch = resolveFetch$2(fetch2)
  }

  /**
   * Retrieves the details of all Storage buckets within an existing project.
   */
  listBuckets () {
    return __awaiter$6(this, void 0, void 0, function * () {
      try {
        const data = yield get(this.fetch, `${this.url}/bucket`, { headers: this.headers })
        return { data, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Retrieves the details of an existing Storage bucket.
   *
   * @param id The unique identifier of the bucket you would like to retrieve.
   */
  getBucket (id) {
    return __awaiter$6(this, void 0, void 0, function * () {
      try {
        const data = yield get(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers })
        return { data, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Creates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
   * @returns newly created bucket id
   */
  createBucket (id, options = { public: false }) {
    return __awaiter$6(this, void 0, void 0, function * () {
      try {
        const data = yield post(this.fetch, `${this.url}/bucket`, { id, name: id, public: options.public }, { headers: this.headers })
        return { data, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Updates a Storage bucket
   *
   * @param id A unique identifier for the bucket you are updating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
   */
  updateBucket (id, options) {
    return __awaiter$6(this, void 0, void 0, function * () {
      try {
        const data = yield put(this.fetch, `${this.url}/bucket/${id}`, { id, name: id, public: options.public }, { headers: this.headers })
        return { data, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Removes all objects inside a single bucket.
   *
   * @param id The unique identifier of the bucket you would like to empty.
   */
  emptyBucket (id) {
    return __awaiter$6(this, void 0, void 0, function * () {
      try {
        const data = yield post(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers })
        return { data, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
   * You must first `empty()` the bucket.
   *
   * @param id The unique identifier of the bucket you would like to delete.
   */
  deleteBucket (id) {
    return __awaiter$6(this, void 0, void 0, function * () {
      try {
        const data = yield remove(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers })
        return { data, error: null }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }
}
class StorageClient extends StorageBucketApi {
  constructor (url, headers = {}, fetch2) {
    super(url, headers, fetch2)
  }

  /**
   * Perform file operation in a bucket.
   *
   * @param id The bucket id to operate on.
   */
  from (id) {
    return new StorageFileApi(this.url, this.headers, id, this.fetch)
  }
}
const version$1 = '2.8.0'
const DEFAULT_HEADERS$1 = { 'X-Client-Info': `supabase-js/${version$1}` }
const __awaiter$5 = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
const resolveFetch$1 = (customFetch) => {
  let _fetch
  if (customFetch) {
    _fetch = customFetch
  } else if (typeof fetch === 'undefined') {
    _fetch = crossFetch
  } else {
    _fetch = fetch
  }
  return (...args) => _fetch(...args)
}
const resolveHeadersConstructor = () => {
  if (typeof Headers === 'undefined') {
    return browserPonyfillExports.Headers
  }
  return Headers
}
const fetchWithAuth = (supabaseKey2, getAccessToken, customFetch) => {
  const fetch2 = resolveFetch$1(customFetch)
  const HeadersConstructor = resolveHeadersConstructor()
  return (input, init) => __awaiter$5(void 0, void 0, void 0, function * () {
    let _a
    const accessToken = (_a = yield getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey2
    const headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers)
    if (!headers.has('apikey')) {
      headers.set('apikey', supabaseKey2)
    }
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
    return fetch2(input, Object.assign(Object.assign({}, init), { headers }))
  })
}
function stripTrailingSlash (url) {
  return url.replace(/\/$/, '')
}
function applySettingDefaults (options, defaults) {
  const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options
  const { db: DEFAULT_DB_OPTIONS2, auth: DEFAULT_AUTH_OPTIONS2, realtime: DEFAULT_REALTIME_OPTIONS2, global: DEFAULT_GLOBAL_OPTIONS2 } = defaults
  return {
    db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS2), dbOptions),
    auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS2), authOptions),
    realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS2), realtimeOptions),
    global: Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS2), globalOptions)
  }
}
const __awaiter$4 = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
function expiresAt (expiresIn) {
  const timeNow = Math.round(Date.now() / 1e3)
  return timeNow + expiresIn
}
function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0; const v = c == 'x' ? r : r & 3 | 8
    return v.toString(16)
  })
}
const isBrowser = () => typeof document !== 'undefined'
const localStorageWriteTests = {
  tested: false,
  writable: false
}
const supportsLocalStorage = () => {
  if (!isBrowser()) {
    return false
  }
  try {
    if (typeof globalThis.localStorage !== 'object') {
      return false
    }
  } catch (e) {
    return false
  }
  if (localStorageWriteTests.tested) {
    return localStorageWriteTests.writable
  }
  const randomKey = `lswt-${Math.random()}${Math.random()}`
  try {
    globalThis.localStorage.setItem(randomKey, randomKey)
    globalThis.localStorage.removeItem(randomKey)
    localStorageWriteTests.tested = true
    localStorageWriteTests.writable = true
  } catch (e) {
    localStorageWriteTests.tested = true
    localStorageWriteTests.writable = false
  }
  return localStorageWriteTests.writable
}
function getParameterByName (name2, url) {
  let _a
  if (!url) { url = ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) || '' }
  name2 = name2.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&#]' + name2 + '(=([^&#]*)|&|#|$)'); const results = regex.exec(url)
  if (!results) { return null }
  if (!results[2]) { return '' }
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
const resolveFetch = (customFetch) => {
  let _fetch
  if (customFetch) {
    _fetch = customFetch
  } else if (typeof fetch === 'undefined') {
    _fetch = (...args) => __awaiter$4(void 0, void 0, void 0, function * () {
      return yield (yield __vitePreload(() => Promise.resolve().then(() => browserPonyfill), true ? void 0 : void 0, import.meta.url)).fetch(...args)
    })
  } else {
    _fetch = fetch
  }
  return (...args) => _fetch(...args)
}
const looksLikeFetchResponse = (maybeResponse) => {
  return typeof maybeResponse === 'object' && maybeResponse !== null && 'status' in maybeResponse && 'ok' in maybeResponse && 'json' in maybeResponse && typeof maybeResponse.json === 'function'
}
const setItemAsync = (storage, key, data) => __awaiter$4(void 0, void 0, void 0, function * () {
  yield storage.setItem(key, JSON.stringify(data))
})
const getItemAsync = (storage, key) => __awaiter$4(void 0, void 0, void 0, function * () {
  const value = yield storage.getItem(key)
  if (!value) {
    return null
  }
  try {
    return JSON.parse(value)
  } catch (_a) {
    return value
  }
})
const removeItemAsync = (storage, key) => __awaiter$4(void 0, void 0, void 0, function * () {
  yield storage.removeItem(key)
})
function decodeBase64URL (value) {
  const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let base64 = ''
  let chr1, chr2, chr3
  let enc1, enc2, enc3, enc4
  let i = 0
  value = value.replace('-', '+').replace('_', '/')
  while (i < value.length) {
    enc1 = key.indexOf(value.charAt(i++))
    enc2 = key.indexOf(value.charAt(i++))
    enc3 = key.indexOf(value.charAt(i++))
    enc4 = key.indexOf(value.charAt(i++))
    chr1 = enc1 << 2 | enc2 >> 4
    chr2 = (enc2 & 15) << 4 | enc3 >> 2
    chr3 = (enc3 & 3) << 6 | enc4
    base64 = base64 + String.fromCharCode(chr1)
    if (enc3 != 64 && chr2 != 0) {
      base64 = base64 + String.fromCharCode(chr2)
    }
    if (enc4 != 64 && chr3 != 0) {
      base64 = base64 + String.fromCharCode(chr3)
    }
  }
  return base64
}
class Deferred {
  constructor () {
    this.promise = new Deferred.promiseConstructor((res, rej) => {
      this.resolve = res
      this.reject = rej
    })
  }
}
Deferred.promiseConstructor = Promise
function decodeJWTPayload (token) {
  const base64UrlRegex = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}=?$|[a-z0-9_-]{2}(==)?$)$/i
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('JWT is not valid: not a JWT structure')
  }
  if (!base64UrlRegex.test(parts[1])) {
    throw new Error('JWT is not valid: payload is not in base64url format')
  }
  const base64Url = parts[1]
  return JSON.parse(decodeBase64URL(base64Url))
}
function sleep (time) {
  return new Promise((accept) => {
    setTimeout(() => accept(null), time)
  })
}
function retryable (fn2, isRetryable) {
  const promise = new Promise((accept, reject) => {
    (() => __awaiter$4(this, void 0, void 0, function * () {
      for (let attempt = 0; attempt < Infinity; attempt++) {
        try {
          const result = yield fn2(attempt)
          if (!isRetryable(attempt, null, result)) {
            accept(result)
            return
          }
        } catch (e) {
          if (!isRetryable(attempt, e)) {
            reject(e)
            return
          }
        }
      }
    }))()
  })
  return promise
}
class AuthError extends Error {
  constructor (message, status) {
    super(message)
    this.__isAuthError = true
    this.name = 'AuthError'
    this.status = status
  }
}
function isAuthError (error) {
  return typeof error === 'object' && error !== null && '__isAuthError' in error
}
class AuthApiError extends AuthError {
  constructor (message, status) {
    super(message, status)
    this.name = 'AuthApiError'
    this.status = status
  }

  toJSON () {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    }
  }
}
function isAuthApiError (error) {
  return isAuthError(error) && error.name === 'AuthApiError'
}
class AuthUnknownError extends AuthError {
  constructor (message, originalError) {
    super(message)
    this.name = 'AuthUnknownError'
    this.originalError = originalError
  }
}
class CustomAuthError extends AuthError {
  constructor (message, name2, status) {
    super(message)
    this.name = name2
    this.status = status
  }

  toJSON () {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    }
  }
}
class AuthSessionMissingError extends CustomAuthError {
  constructor () {
    super('Auth session missing!', 'AuthSessionMissingError', 400)
  }
}
class AuthInvalidCredentialsError extends CustomAuthError {
  constructor (message) {
    super(message, 'AuthInvalidCredentialsError', 400)
  }
}
class AuthImplicitGrantRedirectError extends CustomAuthError {
  constructor (message, details = null) {
    super(message, 'AuthImplicitGrantRedirectError', 500)
    this.details = null
    this.details = details
  }

  toJSON () {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    }
  }
}
class AuthRetryableFetchError extends CustomAuthError {
  constructor (message, status) {
    super(message, 'AuthRetryableFetchError', status)
  }
}
const __awaiter$3 = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
const __rest$1 = globalThis && globalThis.__rest || function (s, e) {
  const t = {}
  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) { t[p] = s[p] }
  }
  if (s != null && typeof Object.getOwnPropertySymbols === 'function') {
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) { t[p[i]] = s[p[i]] }
    }
  }
  return t
}
const _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err)
const handleError = (error, reject) => __awaiter$3(void 0, void 0, void 0, function * () {
  const NETWORK_ERROR_CODES = [502, 503, 504]
  if (!looksLikeFetchResponse(error)) {
    reject(new AuthRetryableFetchError(_getErrorMessage(error), 0))
  } else if (NETWORK_ERROR_CODES.includes(error.status)) {
    reject(new AuthRetryableFetchError(_getErrorMessage(error), error.status))
  } else {
    error.json().then((err) => {
      reject(new AuthApiError(_getErrorMessage(err), error.status || 500))
    }).catch((e) => {
      reject(new AuthUnknownError(_getErrorMessage(e), e))
    })
  }
})
const _getRequestParams = (method, options, parameters, body) => {
  const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} }
  if (method === 'GET') {
    return params
  }
  params.headers = Object.assign({ 'Content-Type': 'application/json;charset=UTF-8' }, options === null || options === void 0 ? void 0 : options.headers)
  params.body = JSON.stringify(body)
  return Object.assign(Object.assign({}, params), parameters)
}
function _request (fetcher, method, url, options) {
  let _a
  return __awaiter$3(this, void 0, void 0, function * () {
    const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers)
    if (options === null || options === void 0 ? void 0 : options.jwt) {
      headers.Authorization = `Bearer ${options.jwt}`
    }
    const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {}
    if (options === null || options === void 0 ? void 0 : options.redirectTo) {
      qs.redirect_to = options.redirectTo
    }
    const queryString = Object.keys(qs).length ? '?' + new URLSearchParams(qs).toString() : ''
    const data = yield _handleRequest(fetcher, method, url + queryString, { headers, noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson }, {}, options === null || options === void 0 ? void 0 : options.body)
    return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null }
  })
}
function _handleRequest (fetcher, method, url, options, parameters, body) {
  return __awaiter$3(this, void 0, void 0, function * () {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams(method, options, parameters, body)).then((result) => {
        if (!result.ok) { throw result }
        if (options === null || options === void 0 ? void 0 : options.noResolveJson) { return result }
        return result.json()
      }).then((data) => resolve(data)).catch((error) => handleError(error, reject))
    })
  })
}
function _sessionResponse (data) {
  let _a
  let session = null
  if (hasSession(data)) {
    session = Object.assign({}, data)
    session.expires_at = expiresAt(data.expires_in)
  }
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data
  return { data: { session, user }, error: null }
}
function _userResponse (data) {
  let _a
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data
  return { data: { user }, error: null }
}
function _ssoResponse (data) {
  return { data, error: null }
}
function _generateLinkResponse (data) {
  const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data; const rest = __rest$1(data, ['action_link', 'email_otp', 'hashed_token', 'redirect_to', 'verification_type'])
  const properties = {
    action_link,
    email_otp,
    hashed_token,
    redirect_to,
    verification_type
  }
  const user = Object.assign({}, rest)
  return {
    data: {
      properties,
      user
    },
    error: null
  }
}
function _noResolveJsonResponse (data) {
  return data
}
function hasSession (data) {
  return data.access_token && data.refresh_token && data.expires_in
}
const __awaiter$2 = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
const __rest = globalThis && globalThis.__rest || function (s, e) {
  const t = {}
  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) { t[p] = s[p] }
  }
  if (s != null && typeof Object.getOwnPropertySymbols === 'function') {
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) { t[p[i]] = s[p[i]] }
    }
  }
  return t
}
class GoTrueAdminApi {
  constructor ({ url = '', headers = {}, fetch: fetch2 }) {
    this.url = url
    this.headers = headers
    this.fetch = resolveFetch(fetch2)
    this.mfa = {
      listFactors: this._listFactors.bind(this),
      deleteFactor: this._deleteFactor.bind(this)
    }
  }

  /**
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   */
  signOut (jwt) {
    return __awaiter$2(this, void 0, void 0, function * () {
      try {
        yield _request(this.fetch, 'POST', `${this.url}/logout`, {
          headers: this.headers,
          jwt,
          noResolveJson: true
        })
        return { data: null, error: null }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param options.redirectTo A URL or mobile deeplink to send the user to after they are confirmed.
   * @param options.data Optional user metadata
   */
  inviteUserByEmail (email, options = {}) {
    return __awaiter$2(this, void 0, void 0, function * () {
      try {
        return yield _request(this.fetch, 'POST', `${this.url}/invite`, {
          body: { email, data: options.data },
          headers: this.headers,
          redirectTo: options.redirectTo,
          xform: _userResponse
        })
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Generates email links and OTPs to be sent via a custom email provider.
   * @param email The user's email.
   * @param options.password User password. For signup only.
   * @param options.data Optional user metadata. For signup only.
   * @param options.redirectTo The redirect url which should be appended to the generated link
   */
  generateLink (params) {
    return __awaiter$2(this, void 0, void 0, function * () {
      try {
        const { options } = params; const rest = __rest(params, ['options'])
        const body = Object.assign(Object.assign({}, rest), options)
        if ('newEmail' in rest) {
          body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail
          delete body.newEmail
        }
        return yield _request(this.fetch, 'POST', `${this.url}/admin/generate_link`, {
          body,
          headers: this.headers,
          xform: _generateLinkResponse,
          redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
        })
      } catch (error) {
        if (isAuthError(error)) {
          return {
            data: {
              properties: null,
              user: null
            },
            error
          }
        }
        throw error
      }
    })
  }

  // User Admin API
  /**
   * Creates a new user.
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  createUser (attributes) {
    return __awaiter$2(this, void 0, void 0, function * () {
      try {
        return yield _request(this.fetch, 'POST', `${this.url}/admin/users`, {
          body: attributes,
          headers: this.headers,
          xform: _userResponse
        })
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Get a list of users.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
   */
  listUsers (params) {
    let _a, _b, _c, _d, _e, _f, _g
    return __awaiter$2(this, void 0, void 0, function * () {
      try {
        const pagination = { nextPage: null, lastPage: 0, total: 0 }
        const response = yield _request(this.fetch, 'GET', `${this.url}/admin/users`, {
          headers: this.headers,
          noResolveJson: true,
          query: {
            page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '',
            per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ''
          },
          xform: _noResolveJsonResponse
        })
        if (response.error) { throw response.error }
        const users = yield response.json()
        const total = (_e = response.headers.get('x-total-count')) !== null && _e !== void 0 ? _e : 0
        const links = (_g = (_f = response.headers.get('link')) === null || _f === void 0 ? void 0 : _f.split(',')) !== null && _g !== void 0 ? _g : []
        if (links.length > 0) {
          links.forEach((link) => {
            const page = parseInt(link.split(';')[0].split('=')[1].substring(0, 1))
            const rel = JSON.parse(link.split(';')[1].split('=')[1])
            pagination[`${rel}Page`] = page
          })
          pagination.total = parseInt(total)
        }
        return { data: Object.assign(Object.assign({}, users), pagination), error: null }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { users: [] }, error }
        }
        throw error
      }
    })
  }

  /**
   * Get user by id.
   *
   * @param uid The user's unique identifier
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  getUserById (uid) {
    return __awaiter$2(this, void 0, void 0, function * () {
      try {
        return yield _request(this.fetch, 'GET', `${this.url}/admin/users/${uid}`, {
          headers: this.headers,
          xform: _userResponse
        })
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Updates the user data.
   *
   * @param attributes The data you want to update.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  updateUserById (uid, attributes) {
    return __awaiter$2(this, void 0, void 0, function * () {
      try {
        return yield _request(this.fetch, 'PUT', `${this.url}/admin/users/${uid}`, {
          body: attributes,
          headers: this.headers,
          xform: _userResponse
        })
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Delete a user. Requires a `service_role` key.
   *
   * @param id The user id you want to remove.
   * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema.
   * Defaults to false for backward compatibility.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  deleteUser (id, shouldSoftDelete = false) {
    return __awaiter$2(this, void 0, void 0, function * () {
      try {
        return yield _request(this.fetch, 'DELETE', `${this.url}/admin/users/${id}`, {
          headers: this.headers,
          body: {
            should_soft_delete: shouldSoftDelete
          },
          xform: _userResponse
        })
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error }
        }
        throw error
      }
    })
  }

  _listFactors (params) {
    return __awaiter$2(this, void 0, void 0, function * () {
      try {
        const { data, error } = yield _request(this.fetch, 'GET', `${this.url}/admin/users/${params.userId}/factors`, {
          headers: this.headers,
          xform: (factors) => {
            return { data: { factors }, error: null }
          }
        })
        return { data, error }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  _deleteFactor (params) {
    return __awaiter$2(this, void 0, void 0, function * () {
      try {
        const data = yield _request(this.fetch, 'DELETE', `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
          headers: this.headers
        })
        return { data, error: null }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }
}
const version = '2.12.1'
const GOTRUE_URL = 'http://localhost:9999'
const STORAGE_KEY = 'supabase.auth.token'
const DEFAULT_HEADERS = { 'X-Client-Info': `gotrue-js/${version}` }
const EXPIRY_MARGIN = 10
const localStorageAdapter = {
  getItem: (key) => {
    if (!supportsLocalStorage()) {
      return null
    }
    return globalThis.localStorage.getItem(key)
  },
  setItem: (key, value) => {
    if (!supportsLocalStorage()) {
      return
    }
    globalThis.localStorage.setItem(key, value)
  },
  removeItem: (key) => {
    if (!supportsLocalStorage()) {
      return
    }
    globalThis.localStorage.removeItem(key)
  }
}
function polyfillGlobalThis () {
  if (typeof globalThis === 'object') { return }
  try {
    Object.defineProperty(Object.prototype, '__magic__', {
      get: function () {
        return this
      },
      configurable: true
    })
    __magic__.globalThis = __magic__
    delete Object.prototype.__magic__
  } catch (e) {
    if (typeof self !== 'undefined') {
      self.globalThis = self
    }
  }
}
const __awaiter$1 = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
polyfillGlobalThis()
const DEFAULT_OPTIONS = {
  url: GOTRUE_URL,
  storageKey: STORAGE_KEY,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  headers: DEFAULT_HEADERS
}
const AUTO_REFRESH_TICK_DURATION = 10 * 1e3
const AUTO_REFRESH_TICK_THRESHOLD = 3
class GoTrueClient {
  /**
   * Create a new client for use in the browser.
   */
  constructor (options) {
    this.stateChangeEmitters = /* @__PURE__ */ new Map()
    this.autoRefreshTicker = null
    this.visibilityChangedCallback = null
    this.refreshingDeferred = null
    this.initializePromise = null
    this.detectSessionInUrl = true
    this.broadcastChannel = null
    const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options)
    this.inMemorySession = null
    this.storageKey = settings.storageKey
    this.autoRefreshToken = settings.autoRefreshToken
    this.persistSession = settings.persistSession
    this.storage = settings.storage || localStorageAdapter
    this.admin = new GoTrueAdminApi({
      url: settings.url,
      headers: settings.headers,
      fetch: settings.fetch
    })
    this.url = settings.url
    this.headers = settings.headers
    this.fetch = resolveFetch(settings.fetch)
    this.detectSessionInUrl = settings.detectSessionInUrl
    this.mfa = {
      verify: this._verify.bind(this),
      enroll: this._enroll.bind(this),
      unenroll: this._unenroll.bind(this),
      challenge: this._challenge.bind(this),
      listFactors: this._listFactors.bind(this),
      challengeAndVerify: this._challengeAndVerify.bind(this),
      getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this)
    }
    if (isBrowser() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
      this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey)
      this.broadcastChannel.addEventListener('message', (event) => {
        this._notifyAllSubscribers(event.data.event, event.data.session, false)
      })
    }
    this.initialize()
  }

  /**
   * Initializes the client session either from the url or from storage.
   * This method is automatically called when instantiating the client, but should also be called
   * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
   */
  initialize () {
    if (!this.initializePromise) {
      this.initializePromise = this._initialize()
    }
    return this.initializePromise
  }

  /**
   * IMPORTANT:
   * 1. Never throw in this method, as it is called from the constructor
   * 2. Never return a session from this method as it would be cached over
   *    the whole lifetime of the client
   */
  _initialize () {
    return __awaiter$1(this, void 0, void 0, function * () {
      if (this.initializePromise) {
        return this.initializePromise
      }
      try {
        if (this.detectSessionInUrl && this._isImplicitGrantFlow()) {
          const { data, error } = yield this._getSessionFromUrl()
          if (error) {
            yield this._removeSession()
            return { error }
          }
          const { session, redirectType } = data
          yield this._saveSession(session)
          this._notifyAllSubscribers('SIGNED_IN', session)
          if (redirectType === 'recovery') {
            this._notifyAllSubscribers('PASSWORD_RECOVERY', session)
          }
          return { error: null }
        }
        yield this._recoverAndRefresh()
        return { error: null }
      } catch (error) {
        if (isAuthError(error)) {
          return { error }
        }
        return {
          error: new AuthUnknownError('Unexpected error during initialization', error)
        }
      } finally {
        yield this._handleVisibilityChange()
      }
    })
  }

  /**
   * Creates a new user.
   *
   * Be aware that if a user account exists in the system you may get back an
   * error message that attempts to hide this information from the user.
   *
   * @returns A logged-in session if the server has "autoconfirm" ON
   * @returns A user if the server has "autoconfirm" OFF
   */
  signUp (credentials) {
    let _a, _b
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        yield this._removeSession()
        let res
        if ('email' in credentials) {
          const { email, password, options } = credentials
          res = yield _request(this.fetch, 'POST', `${this.url}/signup`, {
            headers: this.headers,
            redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
            body: {
              email,
              password,
              data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponse
          })
        } else if ('phone' in credentials) {
          const { phone, password, options } = credentials
          res = yield _request(this.fetch, 'POST', `${this.url}/signup`, {
            headers: this.headers,
            body: {
              phone,
              password,
              data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponse
          })
        } else {
          throw new AuthInvalidCredentialsError('You must provide either an email or phone number and a password')
        }
        const { data, error } = res
        if (error || !data) {
          return { data: { user: null, session: null }, error }
        }
        const session = data.session
        const user = data.user
        if (data.session) {
          yield this._saveSession(data.session)
          this._notifyAllSubscribers('SIGNED_IN', session)
        }
        return { data: { user, session }, error: null }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null, session: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Log in an existing user with an email and password or phone and password.
   *
   * Be aware that you may get back an error message that will not distingish
   * between the cases where the account does not exist or that the
   * email/phone and password combination is wrong or that the account can only
   * be accessed via social login.
   */
  signInWithPassword (credentials) {
    let _a, _b
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        yield this._removeSession()
        let res
        if ('email' in credentials) {
          const { email, password, options } = credentials
          res = yield _request(this.fetch, 'POST', `${this.url}/token?grant_type=password`, {
            headers: this.headers,
            body: {
              email,
              password,
              data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponse
          })
        } else if ('phone' in credentials) {
          const { phone, password, options } = credentials
          res = yield _request(this.fetch, 'POST', `${this.url}/token?grant_type=password`, {
            headers: this.headers,
            body: {
              phone,
              password,
              data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponse
          })
        } else {
          throw new AuthInvalidCredentialsError('You must provide either an email or phone number and a password')
        }
        const { data, error } = res
        if (error || !data) { return { data: { user: null, session: null }, error } }
        if (data.session) {
          yield this._saveSession(data.session)
          this._notifyAllSubscribers('SIGNED_IN', data.session)
        }
        return { data, error }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null, session: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Log in an existing user via a third-party provider.
   */
  signInWithOAuth (credentials) {
    let _a, _b, _c, _d
    return __awaiter$1(this, void 0, void 0, function * () {
      yield this._removeSession()
      return this._handleProviderSignIn(credentials.provider, {
        redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
        scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
        queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
        skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
      })
    })
  }

  /**
   * Allows signing in with an ID token issued by certain supported providers.
   * The ID token is verified for validity and a new session is established.
   *
   * @experimental
   */
  signInWithIdToken (credentials) {
    return __awaiter$1(this, void 0, void 0, function * () {
      yield this._removeSession()
      try {
        const { options, provider, token, nonce } = credentials
        const res = yield _request(this.fetch, 'POST', `${this.url}/token?grant_type=id_token`, {
          headers: this.headers,
          body: {
            provider,
            id_token: token,
            nonce,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponse
        })
        const { data, error } = res
        if (error || !data) { return { data: { user: null, session: null }, error } }
        if (data.session) {
          yield this._saveSession(data.session)
          this._notifyAllSubscribers('SIGNED_IN', data.session)
        }
        return { data, error }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null, session: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Log in a user using magiclink or a one-time password (OTP).
   *
   * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
   * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
   * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or, that the account
   * can only be accessed via social login.
   */
  signInWithOtp (credentials) {
    let _a, _b, _c, _d
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        yield this._removeSession()
        if ('email' in credentials) {
          const { email, options } = credentials
          const { error } = yield _request(this.fetch, 'POST', `${this.url}/otp`, {
            headers: this.headers,
            body: {
              email,
              data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
              create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
          })
          return { data: { user: null, session: null }, error }
        }
        if ('phone' in credentials) {
          const { phone, options } = credentials
          const { error } = yield _request(this.fetch, 'POST', `${this.url}/otp`, {
            headers: this.headers,
            body: {
              phone,
              data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
              create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            }
          })
          return { data: { user: null, session: null }, error }
        }
        throw new AuthInvalidCredentialsError('You must provide either an email or phone number.')
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null, session: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Log in a user given a User supplied OTP received via mobile.
   */
  verifyOtp (params) {
    let _a, _b
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        yield this._removeSession()
        const { data, error } = yield _request(this.fetch, 'POST', `${this.url}/verify`, {
          headers: this.headers,
          body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: (_a = params.options) === null || _a === void 0 ? void 0 : _a.captchaToken } }),
          redirectTo: (_b = params.options) === null || _b === void 0 ? void 0 : _b.redirectTo,
          xform: _sessionResponse
        })
        if (error) {
          throw error
        }
        if (!data) {
          throw 'An error occurred on token verification.'
        }
        const session = data.session
        const user = data.user
        if (session === null || session === void 0 ? void 0 : session.access_token) {
          yield this._saveSession(session)
          this._notifyAllSubscribers('SIGNED_IN', session)
        }
        return { data: { user, session }, error: null }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null, session: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Attempts a single-sign on using an enterprise Identity Provider. A
   * successful SSO attempt will redirect the current page to the identity
   * provider authorization page. The redirect URL is implementation and SSO
   * protocol specific.
   *
   * You can use it by providing a SSO domain. Typically you can extract this
   * domain by asking users for their email address. If this domain is
   * registered on the Auth instance the redirect will use that organization's
   * currently active SSO Identity Provider for the login.
   *
   * If you have built an organization-specific login page, you can use the
   * organization's SSO Identity Provider UUID directly instead.
   *
   * This API is experimental and availability is conditional on correct
   * settings on the Auth service.
   *
   * @experimental
   */
  signInWithSSO (params) {
    let _a, _b, _c
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        yield this._removeSession()
        return yield _request(this.fetch, 'POST', `${this.url}/sso`, {
          body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, 'providerId' in params ? { provider_id: params.providerId } : null), 'domain' in params ? { domain: params.domain } : null), { redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : void 0 }), ((_c = params === null || params === void 0 ? void 0 : params.options) === null || _c === void 0 ? void 0 : _c.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), { skip_http_redirect: true }),
          headers: this.headers,
          xform: _ssoResponse
        })
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Returns the session, refreshing it if necessary.
   * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
   */
  getSession () {
    return __awaiter$1(this, void 0, void 0, function * () {
      yield this.initializePromise
      let currentSession = null
      if (this.persistSession) {
        const maybeSession = yield getItemAsync(this.storage, this.storageKey)
        if (maybeSession !== null) {
          if (this._isValidSession(maybeSession)) {
            currentSession = maybeSession
          } else {
            yield this._removeSession()
          }
        }
      } else {
        currentSession = this.inMemorySession
      }
      if (!currentSession) {
        return { data: { session: null }, error: null }
      }
      const hasExpired = currentSession.expires_at ? currentSession.expires_at <= Date.now() / 1e3 : false
      if (!hasExpired) {
        return { data: { session: currentSession }, error: null }
      }
      const { session, error } = yield this._callRefreshToken(currentSession.refresh_token)
      if (error) {
        return { data: { session: null }, error }
      }
      return { data: { session }, error: null }
    })
  }

  /**
   * Gets the current user details if there is an existing session.
   * @param jwt Takes in an optional access token jwt. If no jwt is provided, getUser() will attempt to get the jwt from the current session.
   */
  getUser (jwt) {
    let _a, _b
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        if (!jwt) {
          const { data, error } = yield this.getSession()
          if (error) {
            throw error
          }
          jwt = (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0
        }
        return yield _request(this.fetch, 'GET', `${this.url}/user`, {
          headers: this.headers,
          jwt,
          xform: _userResponse
        })
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Updates user data for a logged in user.
   */
  updateUser (attributes, options = {}) {
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        const { data: sessionData, error: sessionError } = yield this.getSession()
        if (sessionError) {
          throw sessionError
        }
        if (!sessionData.session) {
          throw new AuthSessionMissingError()
        }
        const session = sessionData.session
        const { data, error: userError } = yield _request(this.fetch, 'PUT', `${this.url}/user`, {
          headers: this.headers,
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
          body: attributes,
          jwt: session.access_token,
          xform: _userResponse
        })
        if (userError) { throw userError }
        session.user = data.user
        yield this._saveSession(session)
        this._notifyAllSubscribers('USER_UPDATED', session)
        return { data: { user: session.user }, error: null }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Decodes a JWT (without performing any validation).
   */
  _decodeJWT (jwt) {
    return decodeJWTPayload(jwt)
  }

  /**
   * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
   * If the refresh token or access token in the current session is invalid, an error will be thrown.
   * @param currentSession The current session that minimally contains an access token and refresh token.
   */
  setSession (currentSession) {
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        if (!currentSession.access_token || !currentSession.refresh_token) {
          throw new AuthSessionMissingError()
        }
        const timeNow = Date.now() / 1e3
        let expiresAt2 = timeNow
        let hasExpired = true
        let session = null
        const payload = decodeJWTPayload(currentSession.access_token)
        if (payload.exp) {
          expiresAt2 = payload.exp
          hasExpired = expiresAt2 <= timeNow
        }
        if (hasExpired) {
          const { session: refreshedSession, error } = yield this._callRefreshToken(currentSession.refresh_token)
          if (error) {
            return { data: { user: null, session: null }, error }
          }
          if (!refreshedSession) {
            return { data: { user: null, session: null }, error: null }
          }
          session = refreshedSession
        } else {
          const { data, error } = yield this.getUser(currentSession.access_token)
          if (error) {
            throw error
          }
          session = {
            access_token: currentSession.access_token,
            refresh_token: currentSession.refresh_token,
            user: data.user,
            token_type: 'bearer',
            expires_in: expiresAt2 - timeNow,
            expires_at: expiresAt2
          }
          yield this._saveSession(session)
          this._notifyAllSubscribers('SIGNED_IN', session)
        }
        return { data: { user: session.user, session }, error: null }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { session: null, user: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Returns a new session, regardless of expiry status.
   * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
   * If the current session's refresh token is invalid, an error will be thrown.
   * @param currentSession The current session. If passed in, it must contain a refresh token.
   */
  refreshSession (currentSession) {
    let _a
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        if (!currentSession) {
          const { data, error: error2 } = yield this.getSession()
          if (error2) {
            throw error2
          }
          currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0
        }
        if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
          throw new AuthSessionMissingError()
        }
        const { session, error } = yield this._callRefreshToken(currentSession.refresh_token)
        if (error) {
          return { data: { user: null, session: null }, error }
        }
        if (!session) {
          return { data: { user: null, session: null }, error: null }
        }
        return { data: { user: session.user, session }, error: null }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null, session: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Gets the session data from a URL string
   */
  _getSessionFromUrl () {
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        if (!isBrowser()) { throw new AuthImplicitGrantRedirectError('No browser detected.') }
        if (!this._isImplicitGrantFlow()) {
          throw new AuthImplicitGrantRedirectError('Not a valid implicit grant flow url.')
        }
        const error_description = getParameterByName('error_description')
        if (error_description) {
          const error_code = getParameterByName('error_code')
          if (!error_code) { throw new AuthImplicitGrantRedirectError('No error_code detected.') }
          const error2 = getParameterByName('error')
          if (!error2) { throw new AuthImplicitGrantRedirectError('No error detected.') }
          throw new AuthImplicitGrantRedirectError(error_description, { error: error2, code: error_code })
        }
        const provider_token = getParameterByName('provider_token')
        const provider_refresh_token = getParameterByName('provider_refresh_token')
        const access_token = getParameterByName('access_token')
        if (!access_token) { throw new AuthImplicitGrantRedirectError('No access_token detected.') }
        const expires_in = getParameterByName('expires_in')
        if (!expires_in) { throw new AuthImplicitGrantRedirectError('No expires_in detected.') }
        const refresh_token = getParameterByName('refresh_token')
        if (!refresh_token) { throw new AuthImplicitGrantRedirectError('No refresh_token detected.') }
        const token_type = getParameterByName('token_type')
        if (!token_type) { throw new AuthImplicitGrantRedirectError('No token_type detected.') }
        const timeNow = Math.round(Date.now() / 1e3)
        const expires_at = timeNow + parseInt(expires_in)
        const { data, error } = yield this.getUser(access_token)
        if (error) { throw error }
        const user = data.user
        const session = {
          provider_token,
          provider_refresh_token,
          access_token,
          expires_in: parseInt(expires_in),
          expires_at,
          refresh_token,
          token_type,
          user
        }
        const redirectType = getParameterByName('type')
        window.location.hash = ''
        return { data: { session, redirectType }, error: null }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { session: null, redirectType: null }, error }
        }
        throw error
      }
    })
  }

  /**
   * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
   */
  _isImplicitGrantFlow () {
    return isBrowser() && (Boolean(getParameterByName('access_token')) || Boolean(getParameterByName('error_description')))
  }

  /**
   * Inside a browser context, `signOut()` will remove the logged in user from the browser session
   * and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
   *
   * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
   * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
   */
  signOut () {
    let _a
    return __awaiter$1(this, void 0, void 0, function * () {
      const { data, error: sessionError } = yield this.getSession()
      if (sessionError) {
        return { error: sessionError }
      }
      const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token
      if (accessToken) {
        const { error } = yield this.admin.signOut(accessToken)
        if (error) {
          if (!(isAuthApiError(error) && (error.status === 404 || error.status === 401))) {
            return { error }
          }
        }
      }
      yield this._removeSession()
      this._notifyAllSubscribers('SIGNED_OUT', null)
      return { error: null }
    })
  }

  /**
   * Receive a notification every time an auth event happens.
   * @param callback A callback function to be invoked when an auth event happens.
   */
  onAuthStateChange (callback) {
    const id = uuid()
    const subscription = {
      id,
      callback,
      unsubscribe: () => {
        this.stateChangeEmitters.delete(id)
      }
    }
    this.stateChangeEmitters.set(id, subscription)
    return { data: { subscription } }
  }

  /**
   * Sends a password reset request to an email address.
   * @param email The email address of the user.
   * @param options.redirectTo The URL to send the user to after they click the password reset link.
   * @param options.captchaToken Verification token received when the user completes the captcha on the site.
   */
  resetPasswordForEmail (email, options = {}) {
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        return yield _request(this.fetch, 'POST', `${this.url}/recover`, {
          body: { email, gotrue_meta_security: { captcha_token: options.captchaToken } },
          headers: this.headers,
          redirectTo: options.redirectTo
        })
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * Generates a new JWT.
   * @param refreshToken A valid refresh token that was returned on login.
   */
  _refreshAccessToken (refreshToken) {
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        const startedAt = Date.now()
        return yield retryable((attempt) => __awaiter$1(this, void 0, void 0, function * () {
          yield sleep(attempt * 200)
          return yield _request(this.fetch, 'POST', `${this.url}/token?grant_type=refresh_token`, {
            body: { refresh_token: refreshToken },
            headers: this.headers,
            xform: _sessionResponse
          })
        }), (attempt, _, result) => result && result.error && result.error instanceof AuthRetryableFetchError && // retryable only if the request can be sent before the backoff overflows the tick duration
        Date.now() + (attempt + 1) * 200 - startedAt < AUTO_REFRESH_TICK_DURATION)
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { session: null, user: null }, error }
        }
        throw error
      }
    })
  }

  _isValidSession (maybeSession) {
    const isValidSession = typeof maybeSession === 'object' && maybeSession !== null && 'access_token' in maybeSession && 'refresh_token' in maybeSession && 'expires_at' in maybeSession
    return isValidSession
  }

  _handleProviderSignIn (provider, options = {}) {
    const url = this._getUrlForProvider(provider, {
      redirectTo: options.redirectTo,
      scopes: options.scopes,
      queryParams: options.queryParams
    })
    if (isBrowser() && !options.skipBrowserRedirect) {
      window.location.assign(url)
    }
    return { data: { provider, url }, error: null }
  }

  /**
   * Recovers the session from LocalStorage and refreshes
   * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
   */
  _recoverAndRefresh () {
    let _a
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        const currentSession = yield getItemAsync(this.storage, this.storageKey)
        if (!this._isValidSession(currentSession)) {
          if (currentSession !== null) {
            yield this._removeSession()
          }
          return
        }
        const timeNow = Math.round(Date.now() / 1e3)
        if (((_a = currentSession.expires_at) !== null && _a !== void 0 ? _a : Infinity) < timeNow + EXPIRY_MARGIN) {
          if (this.autoRefreshToken && currentSession.refresh_token) {
            const { error } = yield this._callRefreshToken(currentSession.refresh_token)
            if (error) {
              console.log(error.message)
              yield this._removeSession()
            }
          } else {
            yield this._removeSession()
          }
        } else {
          if (this.persistSession) {
            yield this._saveSession(currentSession)
          }
          this._notifyAllSubscribers('SIGNED_IN', currentSession)
        }
      } catch (err) {
        console.error(err)
      }
    })
  }

  _callRefreshToken (refreshToken) {
    let _a, _b
    return __awaiter$1(this, void 0, void 0, function * () {
      if (this.refreshingDeferred) {
        return this.refreshingDeferred.promise
      }
      try {
        this.refreshingDeferred = new Deferred()
        if (!refreshToken) {
          throw new AuthSessionMissingError()
        }
        const { data, error } = yield this._refreshAccessToken(refreshToken)
        if (error) { throw error }
        if (!data.session) { throw new AuthSessionMissingError() }
        yield this._saveSession(data.session)
        this._notifyAllSubscribers('TOKEN_REFRESHED', data.session)
        const result = { session: data.session, error: null }
        this.refreshingDeferred.resolve(result)
        return result
      } catch (error) {
        if (isAuthError(error)) {
          const result = { session: null, error };
          (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result)
          return result
        }
        (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error)
        throw error
      } finally {
        this.refreshingDeferred = null
      }
    })
  }

  _notifyAllSubscribers (event, session, broadcast = true) {
    if (this.broadcastChannel && broadcast) {
      this.broadcastChannel.postMessage({ event, session })
    }
    this.stateChangeEmitters.forEach((x) => x.callback(event, session))
  }

  /**
   * set currentSession and currentUser
   * process to _startAutoRefreshToken if possible
   */
  _saveSession (session) {
    return __awaiter$1(this, void 0, void 0, function * () {
      if (!this.persistSession) {
        this.inMemorySession = session
      }
      if (this.persistSession && session.expires_at) {
        yield this._persistSession(session)
      }
    })
  }

  _persistSession (currentSession) {
    return setItemAsync(this.storage, this.storageKey, currentSession)
  }

  _removeSession () {
    return __awaiter$1(this, void 0, void 0, function * () {
      if (this.persistSession) {
        yield removeItemAsync(this.storage, this.storageKey)
      } else {
        this.inMemorySession = null
      }
    })
  }

  /**
   * Removes any registered visibilitychange callback.
   *
   * {@see #startAutoRefresh}
   * {@see #stopAutoRefresh}
   */
  _removeVisibilityChangedCallback () {
    const callback = this.visibilityChangedCallback
    this.visibilityChangedCallback = null
    try {
      if (callback && isBrowser() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
        window.removeEventListener('visibilitychange', callback)
      }
    } catch (e) {
      console.error('removing visibilitychange callback failed', e)
    }
  }

  /**
   * This is the private implementation of {@link #startAutoRefresh}. Use this
   * within the library.
   */
  _startAutoRefresh () {
    return __awaiter$1(this, void 0, void 0, function * () {
      yield this._stopAutoRefresh()
      const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION)
      this.autoRefreshTicker = ticker
      if (ticker && typeof ticker === 'object' && typeof ticker.unref === 'function') {
        ticker.unref()
      }
      yield this._autoRefreshTokenTick()
    })
  }

  /**
   * This is the private implementation of {@link #stopAutoRefresh}. Use this
   * within the library.
   */
  _stopAutoRefresh () {
    return __awaiter$1(this, void 0, void 0, function * () {
      const ticker = this.autoRefreshTicker
      this.autoRefreshTicker = null
      if (ticker) {
        clearInterval(ticker)
      }
    })
  }

  /**
   * Starts an auto-refresh process in the background. The session is checked
   * every few seconds. Close to the time of expiration a process is started to
   * refresh the session. If refreshing fails it will be retried for as long as
   * necessary.
   *
   * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
   * to call this function, it will be called for you.
   *
   * On browsers the refresh process works only when the tab/window is in the
   * foreground to conserve resources as well as prevent race conditions and
   * flooding auth with requests. If you call this method any managed
   * visibility change callback will be removed and you must manage visibility
   * changes on your own.
   *
   * On non-browser platforms the refresh process works *continuously* in the
   * background, which may not be desireable. You should hook into your
   * platform's foreground indication mechanism and call these methods
   * appropriately to conserve resources.
   *
   * {@see #stopAutoRefresh}
   */
  startAutoRefresh () {
    return __awaiter$1(this, void 0, void 0, function * () {
      this._removeVisibilityChangedCallback()
      yield this._startAutoRefresh()
    })
  }

  /**
   * Stops an active auto refresh process running in the background (if any).
   *
   * If you call this method any managed visibility change callback will be
   * removed and you must manage visibility changes on your own.
   *
   * See {@link #startAutoRefresh} for more details.
   */
  stopAutoRefresh () {
    return __awaiter$1(this, void 0, void 0, function * () {
      this._removeVisibilityChangedCallback()
      yield this._stopAutoRefresh()
    })
  }

  /**
   * Runs the auto refresh token tick.
   */
  _autoRefreshTokenTick () {
    return __awaiter$1(this, void 0, void 0, function * () {
      const now = Date.now()
      try {
        const { data: { session } } = yield this.getSession()
        if (!session || !session.refresh_token || !session.expires_at) {
          return
        }
        const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION)
        if (expiresInTicks < AUTO_REFRESH_TICK_THRESHOLD) {
          yield this._callRefreshToken(session.refresh_token)
        }
      } catch (e) {
        console.error('Auto refresh tick failed with error. This is likely a transient error.', e)
      }
    })
  }

  /**
   * Registers callbacks on the browser / platform, which in-turn run
   * algorithms when the browser window/tab are in foreground. On non-browser
   * platforms it assumes always foreground.
   */
  _handleVisibilityChange () {
    return __awaiter$1(this, void 0, void 0, function * () {
      if (!isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
        if (this.autoRefreshToken) {
          this.startAutoRefresh()
        }
        return false
      }
      try {
        this.visibilityChangedCallback = () => __awaiter$1(this, void 0, void 0, function * () {
          return yield this._onVisibilityChanged(false)
        })
        window === null || window === void 0 ? void 0 : window.addEventListener('visibilitychange', this.visibilityChangedCallback)
        yield this._onVisibilityChanged(true)
      } catch (error) {
        console.error('_handleVisibilityChange', error)
      }
    })
  }

  /**
   * Callback registered with `window.addEventListener('visibilitychange')`.
   */
  _onVisibilityChanged (isInitial) {
    return __awaiter$1(this, void 0, void 0, function * () {
      if (document.visibilityState === 'visible') {
        if (!isInitial) {
          yield this.initializePromise
          yield this._recoverAndRefresh()
        }
        if (this.autoRefreshToken) {
          this._startAutoRefresh()
        }
      } else if (document.visibilityState === 'hidden') {
        if (this.autoRefreshToken) {
          this._stopAutoRefresh()
        }
      }
    })
  }

  /**
   * Generates the relevant login URL for a third-party provider.
   * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param options.scopes A space-separated list of scopes granted to the OAuth application.
   * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
   */
  _getUrlForProvider (provider, options) {
    const urlParams = [`provider=${encodeURIComponent(provider)}`]
    if (options === null || options === void 0 ? void 0 : options.redirectTo) {
      urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`)
    }
    if (options === null || options === void 0 ? void 0 : options.scopes) {
      urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`)
    }
    if (options === null || options === void 0 ? void 0 : options.queryParams) {
      const query = new URLSearchParams(options.queryParams)
      urlParams.push(query.toString())
    }
    return `${this.url}/authorize?${urlParams.join('&')}`
  }

  _unenroll (params) {
    let _a
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        const { data: sessionData, error: sessionError } = yield this.getSession()
        if (sessionError) {
          return { data: null, error: sessionError }
        }
        return yield _request(this.fetch, 'DELETE', `${this.url}/factors/${params.factorId}`, {
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        })
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * {@see GoTrueMFAApi#enroll}
   */
  _enroll (params) {
    let _a, _b
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        const { data: sessionData, error: sessionError } = yield this.getSession()
        if (sessionError) {
          return { data: null, error: sessionError }
        }
        const { data, error } = yield _request(this.fetch, 'POST', `${this.url}/factors`, {
          body: {
            friendly_name: params.friendlyName,
            factor_type: params.factorType,
            issuer: params.issuer
          },
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        })
        if (error) {
          return { data: null, error }
        }
        if ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code) {
          data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`
        }
        return { data, error: null }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * {@see GoTrueMFAApi#verify}
   */
  _verify (params) {
    let _a
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        const { data: sessionData, error: sessionError } = yield this.getSession()
        if (sessionError) {
          return { data: null, error: sessionError }
        }
        const { data, error } = yield _request(this.fetch, 'POST', `${this.url}/factors/${params.factorId}/verify`, {
          body: { code: params.code, challenge_id: params.challengeId },
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        })
        if (error) {
          return { data: null, error }
        }
        yield this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data))
        this._notifyAllSubscribers('MFA_CHALLENGE_VERIFIED', data)
        return { data, error }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * {@see GoTrueMFAApi#challenge}
   */
  _challenge (params) {
    let _a
    return __awaiter$1(this, void 0, void 0, function * () {
      try {
        const { data: sessionData, error: sessionError } = yield this.getSession()
        if (sessionError) {
          return { data: null, error: sessionError }
        }
        return yield _request(this.fetch, 'POST', `${this.url}/factors/${params.factorId}/challenge`, {
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        })
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error }
        }
        throw error
      }
    })
  }

  /**
   * {@see GoTrueMFAApi#challengeAndVerify}
   */
  _challengeAndVerify (params) {
    return __awaiter$1(this, void 0, void 0, function * () {
      const { data: challengeData, error: challengeError } = yield this._challenge({
        factorId: params.factorId
      })
      if (challengeError) {
        return { data: null, error: challengeError }
      }
      return yield this._verify({
        factorId: params.factorId,
        challengeId: challengeData.id,
        code: params.code
      })
    })
  }

  /**
   * {@see GoTrueMFAApi#listFactors}
   */
  _listFactors () {
    return __awaiter$1(this, void 0, void 0, function * () {
      const { data: { user }, error: userError } = yield this.getUser()
      if (userError) {
        return { data: null, error: userError }
      }
      const factors = (user === null || user === void 0 ? void 0 : user.factors) || []
      const totp = factors.filter((factor) => factor.factor_type === 'totp' && factor.status === 'verified')
      return {
        data: {
          all: factors,
          totp
        },
        error: null
      }
    })
  }

  /**
   * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
   */
  _getAuthenticatorAssuranceLevel () {
    let _a, _b
    return __awaiter$1(this, void 0, void 0, function * () {
      const { data: { session }, error: sessionError } = yield this.getSession()
      if (sessionError) {
        return { data: null, error: sessionError }
      }
      if (!session) {
        return {
          data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
          error: null
        }
      }
      const payload = this._decodeJWT(session.access_token)
      let currentLevel = null
      if (payload.aal) {
        currentLevel = payload.aal
      }
      let nextLevel = currentLevel
      const verifiedFactors = (_b = (_a = session.user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === 'verified')) !== null && _b !== void 0 ? _b : []
      if (verifiedFactors.length > 0) {
        nextLevel = 'aal2'
      }
      const currentAuthenticationMethods = payload.amr || []
      return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null }
    })
  }
}
class SupabaseAuthClient extends GoTrueClient {
  constructor (options) {
    super(options)
  }
}
const __awaiter = globalThis && globalThis.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt (value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value)
      })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected (value) {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    function step (result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
const DEFAULT_GLOBAL_OPTIONS = {
  headers: DEFAULT_HEADERS$1
}
const DEFAULT_DB_OPTIONS = {
  schema: 'public'
}
const DEFAULT_AUTH_OPTIONS = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true
}
const DEFAULT_REALTIME_OPTIONS = {}
class SupabaseClient {
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
   */
  constructor (supabaseUrl2, supabaseKey2, options) {
    let _a, _b, _c, _d, _e, _f, _g, _h
    this.supabaseUrl = supabaseUrl2
    this.supabaseKey = supabaseKey2
    if (!supabaseUrl2) { throw new Error('supabaseUrl is required.') }
    if (!supabaseKey2) { throw new Error('supabaseKey is required.') }
    const _supabaseUrl = stripTrailingSlash(supabaseUrl2)
    this.realtimeUrl = `${_supabaseUrl}/realtime/v1`.replace(/^http/i, 'ws')
    this.authUrl = `${_supabaseUrl}/auth/v1`
    this.storageUrl = `${_supabaseUrl}/storage/v1`
    const isPlatform = _supabaseUrl.match(/(supabase\.co)|(supabase\.in)/)
    if (isPlatform) {
      const urlParts = _supabaseUrl.split('.')
      this.functionsUrl = `${urlParts[0]}.functions.${urlParts[1]}.${urlParts[2]}`
    } else {
      this.functionsUrl = `${_supabaseUrl}/functions/v1`
    }
    const defaultStorageKey = `sb-${new URL(this.authUrl).hostname.split('.')[0]}-auth-token`
    const DEFAULTS = {
      db: DEFAULT_DB_OPTIONS,
      realtime: DEFAULT_REALTIME_OPTIONS,
      auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
      global: DEFAULT_GLOBAL_OPTIONS
    }
    const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS)
    this.storageKey = (_b = (_a = settings.auth) === null || _a === void 0 ? void 0 : _a.storageKey) !== null && _b !== void 0 ? _b : ''
    this.headers = (_d = (_c = settings.global) === null || _c === void 0 ? void 0 : _c.headers) !== null && _d !== void 0 ? _d : {}
    this.auth = this._initSupabaseAuthClient((_e = settings.auth) !== null && _e !== void 0 ? _e : {}, this.headers, (_f = settings.global) === null || _f === void 0 ? void 0 : _f.fetch)
    this.fetch = fetchWithAuth(supabaseKey2, this._getAccessToken.bind(this), (_g = settings.global) === null || _g === void 0 ? void 0 : _g.fetch)
    this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers }, settings.realtime))
    this.rest = new PostgrestClient(`${_supabaseUrl}/rest/v1`, {
      headers: this.headers,
      schema: (_h = settings.db) === null || _h === void 0 ? void 0 : _h.schema,
      fetch: this.fetch
    })
    this._listenForAuthEvents()
  }

  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */
  get functions () {
    return new FunctionsClient(this.functionsUrl, {
      headers: this.headers,
      customFetch: this.fetch
    })
  }

  /**
   * Supabase Storage allows you to manage user-generated content, such as photos or videos.
   */
  get storage () {
    return new StorageClient(this.storageUrl, this.headers, this.fetch)
  }

  from (relation) {
    return this.rest.from(relation)
  }

  /**
   * Perform a function call.
   *
   * @param fn  The function name to call.
   * @param args  The parameters to pass to the function call.
   * @param options.head   When set to true, no data will be returned.
   * @param options.count  Count algorithm to use to count rows in a table.
   *
   */
  rpc (fn2, args = {}, options) {
    return this.rest.rpc(fn2, args, options)
  }

  /**
   * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
   *
   * @param {string} name - The name of the Realtime channel.
   * @param {Object} opts - The options to pass to the Realtime channel.
   *
   */
  channel (name2, opts = { config: {} }) {
    return this.realtime.channel(name2, opts)
  }

  /**
   * Returns all Realtime channels.
   */
  getChannels () {
    return this.realtime.getChannels()
  }

  /**
   * Unsubscribes and removes Realtime channel from Realtime client.
   *
   * @param {RealtimeChannel} channel - The name of the Realtime channel.
   *
   */
  removeChannel (channel) {
    return this.realtime.removeChannel(channel)
  }

  /**
   * Unsubscribes and removes all Realtime channels from Realtime client.
   */
  removeAllChannels () {
    return this.realtime.removeAllChannels()
  }

  _getAccessToken () {
    let _a, _b
    return __awaiter(this, void 0, void 0, function * () {
      const { data } = yield this.auth.getSession()
      return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : null
    })
  }

  _initSupabaseAuthClient ({ autoRefreshToken, persistSession, detectSessionInUrl, storage, storageKey }, headers, fetch2) {
    const authHeaders = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    }
    return new SupabaseAuthClient({
      url: this.authUrl,
      headers: Object.assign(Object.assign({}, authHeaders), headers),
      storageKey,
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      storage,
      fetch: fetch2
    })
  }

  _initRealtimeClient (options) {
    return new RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }))
  }

  _listenForAuthEvents () {
    const data = this.auth.onAuthStateChange((event, session) => {
      this._handleTokenChanged(event, session === null || session === void 0 ? void 0 : session.access_token, 'CLIENT')
    })
    return data
  }

  _handleTokenChanged (event, token, source) {
    if ((event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') && this.changedAccessToken !== token) {
      this.realtime.setAuth(token !== null && token !== void 0 ? token : null)
      this.changedAccessToken = token
    } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      this.realtime.setAuth(this.supabaseKey)
      if (source == 'STORAGE') { this.auth.signOut() }
      this.changedAccessToken = void 0
    }
  }
}
const createClient = (supabaseUrl2, supabaseKey2, options) => {
  return new SupabaseClient(supabaseUrl2, supabaseKey2, options)
}
const supabaseUrl = 'https://rlqaxmojclaftjfkcwuo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWF4bW9qY2xhZnRqZmtjd3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNzY2MzQsImV4cCI6MTk5Mjc1MjYzNH0.GOUBrDRENYfYkdttQP4ugS1PyQR49a8rPhPq-E77RsY'
const supabase = createClient(supabaseUrl, supabaseKey)
class Perfil {
  // Mapping de propiedades de la tabla perfiles
  constructor (id = null, created_at = null, nombre = null, apellidos = null, user_id = null, estado = null, rol = null, avatar = null, email = null) {
    this.id = id
    this.created_at = created_at
    this.nombre = nombre
    this.apellidos = apellidos
    this.user_id = user_id
    this.estado = estado
    this.rol = rol
    this.avatar = avatar
    this.email = email
  }

  // leer todos
  static async getAll () {
    const { data: perfiles, error } = await supabase.from('perfiles').select('*')
    if (error) {
      throw new Error(error.message)
    }
    return perfiles.map(({ id, created_at, nombre, apellidos, user_id, estado, rol, avatar, email }) => {
      return new Perfil(id, created_at, nombre, apellidos, user_id, estado, rol, avatar, email)
    })
  }

  // leer registro por id (método static que se puede leer desde la clase sin necesidad de crear una instancia)
  static async getById (id) {
    const { data: perfil, error } = await supabase.from('perfiles').select('*').eq('id', id).single()
    if (error) {
      throw new Error(error.message)
    }
    return new Perfil(perfil.id, perfil.created_at, perfil.nombre, perfil.apellidos, perfil.user_id, perfil.estado, perfil.rol, perfil.avatar, perfil.email)
  }

  static async getByUserId (id) {
    const { data: perfil, error } = await supabase.from('perfiles').select('*').eq('user_id', id).single()
    if (error) {
      console.log(error.message)
      throw new Error(error.message)
    }
    return new Perfil(perfil.id, perfil.created_at, perfil.nombre, perfil.apellidos, perfil.user_id, perfil.estado, perfil.rol, perfil.avatar, perfil.email)
  }

  // crear registro (método static que se puede leer desde la clase sin necesidad de crear una instancia)
  static async create (perfilData) {
    const { error } = await supabase.from('perfiles').insert(perfilData).select()
    if (error) {
      throw new Error(error.message)
    }
    return true
  }

  // actualizar
  async update () {
    const { error } = await supabase.from('perfiles').update({
      nombre: this.nombre,
      apellidos: this.apellidos,
      avatar: this.avatar
    }).eq('id', this.id).single()
    if (error) {
      throw new Error(error.message)
    }
    return true
  }

  // borrar
  static async delete (id) {
    const { error } = await supabase.from('perfiles').delete().eq('id', id)
    if (error) {
      throw new Error(error.message)
    }
    return true
  }
}
class User {
  // Mapping de propiedades de la tabla perfiles
  constructor (id = null, email = null, password = null) {
    this.id = id
    this.email = email
    this.password = password
  }

  // crear registro (método static que se puede leer desde la clase sin necesidad de crear una instancia)
  static async create (userData) {
    const { data, error } = await supabase.auth.signUp(userData)
    if (error) {
      throw new Error(error.message)
    }
    console.log('usuario creado correctamente ', data)
    return new User(data.user.id, data.user.email)
  }

  // login
  static async login (userData) {
    const { data, error } = await supabase.auth.signInWithPassword(userData)
    if (error) {
      throw new Error(error.message)
    }
    console.log('usuario logeado', data.user)
    return new User(data.user.id, data.user.email)
  }

  // logout
  static async logout () {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
    return true
  }

  // leer user logeado
  static async getUser () {
    const { data: { user }, error } = await supabase.auth.getUser()
    console.log('Ususario logeado desde getuser', user)
    if (error) {
      throw new Error(error.message)
    }
    return new User(user.id, user.email)
  }
}
const formEditarPerfil = {
  template: `
      
  <!-- Modal -->
  <div class="modal fade" id="editar">
  <div class="modal-dialog" role="document">
      <div class="modal-content">
      <div class="modal-header">
          <h5 class="modal-title">Editar usuario</h5>
          <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          >
          <span aria-hidden="true"></span>
          </button>
      </div>
      <div class="modal-body">
          <form class="p-3">
          <label class="mt-3 form-label" for="nick">Nombre: </label>
          <input id="nombre" type="text" class="form-control" value="" />
  
          <label class="mt-3 form-label" for="apellidos">Apellidos: </label>
          <input id="apellidos" type="text" class="form-control" value="" />
  
          <label class="mt-3 form-label" for="email">Email</label>
          <input
              id="email"
              type="email"
              class="form-control"
              value="email@gmail.com"
          />
  
          <label class="mt-3 form-label" for="contraseña">Contraseña: </label>
          <input id="contraseña" type="password" class="form-control" value="123456" />
          </form>
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="actuailizar">
          Guardar cambios
          </button>
          <button
          type="button"
          class="btn btn-secondary"
          data-bs-dismiss="modal"
          >
          Cerrar
          </button>
      </div>
      </div>
  </div>
  </div>
    `,
  script: async () => {
    document.querySelector('#formEditarUsuario')
    const usuarioLogueado = await User.getUser()
    if (usuarioLogueado) {
      const userId = usuarioLogueado.id
      const datosUsuario = await Perfil.getByUserId(userId)
      const FormNombre = document.querySelector('#nombre')
      const FormApellidos = document.querySelector('#apellidos')
      const FormEmail = document.querySelector('#email')
      FormNombre.value = datosUsuario.nombre
      FormApellidos.value = datosUsuario.apellidos
      FormEmail.value = datosUsuario.email
    }
    document.querySelector('#actuailizar').addEventListener('click', async (e) => {
      console.log('Actualizando')
      const userId = usuarioLogueado.id
      const datosUsuario = await Perfil.getByUserId(userId)
      const FormNombre = document.querySelector('#nombre').value
      const FormApellidos = document.querySelector('#apellidos').value
      const FormEmail = document.querySelector('#email').value
      datosUsuario.nombre = FormNombre
      datosUsuario.apellidos = FormApellidos
      datosUsuario.email = FormEmail
      datosUsuario.update()
    })
  }
}
const menuSuperior = {
  template: `
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul id="menuSuperior" class="navbar-nav">
          <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
          </li>
          
        </ul>
      </div>
    `,
  script: (perfilLogueado) => {
    const items = {
      anonimo: `
        <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/recursos">Recursos</a>
        </li>
        `,
      registrado: `
        <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/recursos">Recursos</a>
        </li>
        <li><hr /></li>
        <li class="nav-item">
          <a class="nav-link" href="#/adminUsuarios">Admin</a>
        </li>
        `,
      alumno: `
        <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/recursos">Recursos</a>
        </li>
        <li><hr /></li>
        <li class="nav-item">
          <a class="nav-link" href="#/adminUsuarios">Admin</a>
        </li>
        `,
      profesor: `
        <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/recursos">Recursos</a>
        </li>
        <li><hr /></li>
        <li class="nav-item">
          <a class="nav-link" href="#/adminUsuarios">Admin</a>
        </li>
        `,
      admin: `
        <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/recursos">Recursos</a>
        </li>
        <li><hr /></li>
        <li class="nav-item">
          <a class="nav-link" href="#/adminUsuarios">Admin</a>
        </li>
        `
    }
    if (perfilLogueado !== 'anonimo') {
      const rol = perfilLogueado.rol
      document.querySelector('#menuSuperior').innerHTML = items[rol]
    } else {
      document.querySelector('#menuSuperior').innerHTML = items.anonimo
    }
  }
}
const menuUsuario = {
  template: `
  <ul class="navbar nav me-5">
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"        
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <div class="avatarLogin d-inline-block">
          <span id="emailUsuarioLogueado" class="pe-3 text-dark"></span>
            <img
              id="imgAvatar"
              src="./imagenes/avatar.svg"
              alt="Logo"
              width="30"
              height="30"
              class="d-inline-block align-text-top"
            />
          </div>
        </a>
        
        <!-- Menú usuario -->
        <ul id="menuUsuario" class="dropdown-menu">
          <li class="text-center" id="rolUsuarioLogueado">
            anónimo
          </li>
          <li>
            <a class="liLogin dropdown-item" href="#/login">Login</a>
          </li>
          
          <li>
            <a class="liRegistro dropdown-item" href="#/registro">Registrate</a>
          </li>
        </ul>
      </li>
    </ul>
  `,
  script: (perfilLogueado) => {
    const items = {
      anonimo: `
        <li class="text-center" id="rolUsuarioLogueado">
            anónimo
        </li>
        <li>
        <a class="liLogin dropdown-item" href="#/login">Login</a>
        </li>
        <li>
          <a class="liRegistro dropdown-item" href="#/registro">Registrate</a>
        </li>
        
      `,
      registrado: `
      <li class="text-center" id="rolUsuarioLogueado">
        anónimo
      </li>
      <li>
        <a
          id="editarPerfil"
          data-bs-toggle="modal"
          data-bs-target="#editar"
          class="dropdown-item"
          href="#/editarPerfil"
          >Editar perfil</a
        >
      </li>      
      <li><a class="liLogout dropdown-item" href="">Logout</a></li>
      `,
      alumno: `
      <li class="text-center" id="rolUsuarioLogueado">
        anónimo
      </li>
      <li>
        <a
          id="editarPerfil"
          data-bs-toggle="modal"
          data-bs-target="#editar"
          class="dropdown-item"
          href="#/editarPerfil"
          >Editar perfil</a
        >
      </li>
      <li>
        <a class="liMisProyectos dropdown-item d-none" href="#/misProyectos">Mis Proyectos</a>
      </li>
      <div class="dropdown-divider"></div>
      <li><a class="liLogout d-none dropdown-item" href="">Logout</a></li>
      `,
      profesor: `
      <li class="text-center" id="rolUsuarioLogueado">
        anónimo
      </li>
      <li>
        <a class="liRegistro dropdown-item" href="#/registro">Registrate</a>
      </li>
      <li>
        <a
          id="editarPerfil"
          data-bs-toggle="modal"
          data-bs-target="#editar"
          class="dropdown-item"
          href="#/editarPerfil"
          >Editar perfil</a
        >
      </li>
      <div class="dropdown-divider"></div>
      <li>
        <a class="liMisProyectos dropdown-item d-none" href="#/misProyectos">Mis Proyectos</a>
      </li>
      <li>
        <a class="dropdown-item" href="#/adminUsuarios">Admin Usuarios</a>
      </li>
      <li>
        <a class="dropdown-item" href="#/enunciados">Enunciados</a>
      </li>
      <li>
        <a class="dropdown-item" href="#/rubricas">Rubricas</a>
      </li>
      <li><a class="liLogout d-none dropdown-item" href="">Logout</a></li>
      `,
      admin: `
      <li class="text-center" id="rolUsuarioLogueado">
        anónimo
      </li>
      <li>
        <a
          id="editarPerfil"
          data-bs-toggle="modal"
          data-bs-target="#editar"
          class="dropdown-item"
          href="#/editarPerfil"
          >Editar perfil</a
        >
      </li>
      <div class="dropdown-divider"></div>
      <li>
        <a class="dropdown-item" href="#/adminUsuarios">Admin Usuarios</a>
      </li>
      <li>
        <a class="dropdown-item" href="#/enunciados">Enunciados</a>
      </li>
      <li>
        <a class="dropdown-item" href="#/rubricas">Rubricas</a>
      </li>
      <li><a class="liLogout dropdown-item" href="">Logout</a></li>
      `
    }
    console.log(perfilLogueado)
    let rol = 'anonimo'
    if (perfilLogueado.rol) { rol = perfilLogueado.rol }
    console.log('cargando menu', rol)
    document.querySelector('#menuUsuario').innerHTML = items[rol]
    if (rol !== 'anonimo') {
      const imgAvatar = perfilLogueado.avatar
      document.querySelector('#imgAvatar').src = imgAvatar
      document.querySelector('#emailUsuarioLogueado').innerHTML = perfilLogueado.email
      document.querySelector('#rolUsuarioLogueado').innerHTML = perfilLogueado.rol
      document.querySelector('.liLogout').addEventListener('click', async (e) => {
        e.preventDefault()
        await User.logout()
        header.script()
        window.location.href = '/trabajos_alumnos/#/home'
      })
    } else {
      const imgAvatar = './imagenes/avatar.svg'
      document.querySelector('#imgAvatar').src = imgAvatar
      document.querySelector('#emailUsuarioLogueado').innerHTML = ''
    }
    document.querySelector('#editarPerfil').addEventListener('click', (e) => {
      e.preventDefault()
    })
  }
}
const header = {
  template: `
  
<!-- Navbar  -->
<nav class="navbar navbar-expand-sm bg-light fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand d-flex align-items-center" href="#/home">
      <img
        src="./imagenes/logo_vanilla.svg"
        alt="Logo"
        width="30"
        height="30"
        class="d-inline-block align-text-top me-2"
      />
      <span class=""></span>
      Vanilla Games
    </a>
    
    <button
      class="navbar-toggler ms-auto
      "
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNavDropdown"
      aria-controls="navbarNavDropdown"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
    <span class="navbar-toggler-icon"></span>
    </button>
    <!-- Menú superior -->
    ${menuSuperior.template}
    <!-- Menu usuario -->
    ${menuUsuario.template}
  </div>
</nav>

//Modals
${formEditarPerfil.template}
  `,
  script: async () => {
    formEditarPerfil.script()
    try {
      const usuarioLogueado = await User.getUser()
      if (usuarioLogueado) {
        const perfilLogueado = await Perfil.getByUserId(usuarioLogueado.id)
        menuSuperior.script(perfilLogueado)
        menuUsuario.script(perfilLogueado)
      } else {
        menuSuperior.script('anonimo')
        menuUsuario.script('anonimo')
      }
    } catch (error) {
    }
  }
}
const footer = {
  template: ''
}
const enrutador = {
  // Objeto (diccionario) con todas las rutas y su vista asociada
  rutas: {
    home: __vitePreload(() => import('./homeVista-b4349d90.js'), true ? [] : void 0, import.meta.url),
    // Usuarios
    adminUsuarios: __vitePreload(() => import('./adminVista-2c9f5837.js'), true ? [] : void 0, import.meta.url),
    registro: __vitePreload(() => import('./registroVista-34b20bf5.js'), true ? [] : void 0, import.meta.url),
    login: __vitePreload(() => import('./loginVista-84c9078a.js'), true ? [] : void 0, import.meta.url),
    // Proyectos
    proyectos: __vitePreload(() => import('./proyectosVistas-2f932060.js'), true ? ['./proyectosVistas-2f932060.js', './proyecto-6d4d2673.js'] : void 0, import.meta.url),
    nuevoProyecto: __vitePreload(() => import('./nuevoProyectoVista-b1d4b7a5.js'), true ? ['./nuevoProyectoVista-b1d4b7a5.js', './proyecto-6d4d2673.js'] : void 0, import.meta.url),
    editarProyecto: __vitePreload(() => import('./editarProyectoVista-4b384c2c.js'), true ? ['./editarProyectoVista-4b384c2c.js', './proyecto-6d4d2673.js'] : void 0, import.meta.url),
    detalleProyecto: __vitePreload(() => import('./detalleProyectoVista-31b49d27.js'), true ? ['./detalleProyectoVista-31b49d27.js', './proyecto-6d4d2673.js'] : void 0, import.meta.url)
    // misProyectos: import('../vistas/proyectos/misProyectosVista.js'),
    // // Enunciados
    // enunciados: import('../vistas/enunciados/enunciadosVista.js'),
    // nuevoEnunciado: import('../vistas/enunciados/nuevoEnunciadoVista.js'),
    // editarEnunciado: import('../vistas/enunciados/editarEnunciadoVista.js'),
    // detalleEnunciado: import('../vistas/enunciados/detalleEnunciadoVista.js'),
    // misEnunciados: import('../vistas/enunciados/misEnunciadosVista.js')
    // Rubricas
    // rubricas: import('../vistas/rubricas/rubricasVista.js'),
    // nuevoRubrica: import('../vistas/rubricas/nuevoRubricaVista.js'),
    // editarRubrica: import('../vistas/rubricas/editarRubricaVista.js'),
    // detalleRubrica: import('../vistas/rubricas/detalleRubricaVista.js'),
    // misRubricas: import('../vistas/rubricas/misRubricasVista.js')
  },
  // Método que obtiene la ruta del navegador
  router: async () => {
    const pathCompleto = window.location.hash
    const path = pathCompleto.split('/')[1]
    const parametro = pathCompleto.split('/')[2]
    const componenteVista = await enrutador.rutas[path]
    if (componenteVista) {
      try {
        const vista = await componenteVista.default
        document.querySelector('main').innerHTML = vista.template
        vista.script(parametro)
      } catch (error) {
        console.log(error)
      }
    }
  },
  // Capturamos los eventos
  observadorRutas: () => {
    document.body.addEventListener('click', (event) => {
      const link = event.target
      if (link.tagName === 'A') {
        const href = link.getAttribute('href')
        window.history.pushState({ path: href }, '', href)
        enrutador.router()
      }
    })
    window.addEventListener('popstate', (e) => {
      console.log('evento popstate - Te estás moviendo por el historial')
      enrutador.router()
    })
  }
}
document.querySelector('#header').innerHTML = header.template
header.script()
document.querySelector('#footer').innerHTML = footer.template
enrutador.observadorRutas()
window.location = '/trabajos_alumnos/#/home'
export {
  Perfil as P,
  User as U,
  supabase as s
}
