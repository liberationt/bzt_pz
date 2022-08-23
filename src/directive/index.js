import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'

import dialogDrag from './dialog/drag'
import dialogDragWidth from './dialog/dragWidth'
import dialogDragHeight from './dialog/dragHeight'

import scrollSelect from './el-scroll-select/scrollSelect'


const install = function(Vue) {
    Vue.directive('hasRole', hasRole)
    Vue.directive('hasPermi', hasPermi)
    Vue.directive('dialogDrag', dialogDrag)
    Vue.directive('dialogDragWidth', dialogDragWidth)
    Vue.directive('dialogDragHeight', dialogDragHeight)
    Vue.directive('scroll-select', scrollSelect)
}
console.log(hasPermi)
if (window.Vue) {
    window['hasRole'] = hasRole
    window['hasPermi'] = hasPermi
    window['scroll-select'] = scrollSelect;
    Vue.use(install); // eslint-disable-line
}
scrollSelect.install = install
export default install