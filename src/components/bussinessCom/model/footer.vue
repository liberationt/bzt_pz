<template>
  <div class="footer">
    中车南京浦镇车辆有限公司 版权所有 ©2019-2024
    <img src="@assets/images/footer.jpg" alt="" />
  </div>
</template>
<script>
export default {
  name: "footerBottom",
};
</script>
<style lang="scss" scoped>
.footer {
  // position: absolute;
  background-color: rgba(24, 144, 255, 0.9);
  background-size: cover;
  width: 100%;
  min-width: 1206px;
  height: 115px;
  color: #ffffff !important;
  text-align: center;
  line-height: 115px;
  font-size: 14px;
  margin-top: 25px;
  bottom: 0;
  img {
    z-index: -1;
    position: absolute;
    display: none;
    bottom: 0;
    width: 100%;
    left: 0;
  }
}
</style>