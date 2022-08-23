<template>
    <section class="template-layout">
    	<transition name="slide-right" mode="out-in">
    		<keep-alive>
    			<router-view :key="key" />
    		</keep-alive>
    	</transition>
    </section>
</template>

<script>
	export default {
		name: 'template-admin-content',
		computed: {
			key() {
				return this.$route.fullPath + new Date();
			}
		}
	}
</script>

<style lang="scss" scoped>
    .template-layout{
        height: 100%;
    }
</style>
