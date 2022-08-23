<template>
    <section class="empty-layout">
    	<transition name="slide-right" mode="out-in">
    		<keep-alive>
    			<router-view :key="key" />
    		</keep-alive>
    	</transition>
    </section>
</template>

<script>
    export default {
    	name: 'empty-layout',
    	computed: {
    		key() {
    			return this.$route.fullPath + new Date();
    		}
    	}
    }
</script>

<style lang="scss" scoped>
    .empty-layout{
        height: 100%;
    }
</style>
