export default {
    bind(el, binding, vnode) {
        const SELECTWARP_DOM = el.querySelector(
            '.el-select-dropdown .el-select-dropdown_wrap');
        SELECTWARP_DOM.addEventListener('scroll', function() {
            const condition = this.scrollHeight <= this.clinetHeight;
            if (condition) {
                binding.value();
            }
        })
    }
}