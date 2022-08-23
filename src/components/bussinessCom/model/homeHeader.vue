<template>
  <div class="home-header">
    <img class="logo" src="@assets/images/logo.png" @click="toIndex" />
    <User />
  </div>
</template>
<script>
import User from "./user";
export default {
  components: { User },
  methods: {
    toIndex() {
      this.$router.push("/");
    },
  },
};
</script>
<style lang="scss" scoped>
.home-header {
  height: 70px;
  margin: 0px 50px;
  padding-top: 15px; // display: flex;
  // flex-direction: row;
  // justify-content: space-between;
  // align-content: center;
  // align-items: center;
  .logo {
    height: 40px;
    float: left;
    cursor: pointer;
  }
  .user {
    float: right;
  }
}
</style>