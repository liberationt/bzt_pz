<template>
  <div class="login">
    <img class="logo" src="@assets/images/logoNew.png" @click="toIndex" />
    <div class="login-content">
      <div class="title">中车南京浦镇公司标准化管理系统</div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <!-- <div class="form-title">登录</div> -->
        <el-form-item label="用户名">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="工号"
          >
            <!-- <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            /> -->
          </el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <!-- <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            /> -->
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item> -->
        <el-checkbox
          class="el-form-item__label"
          v-model="loginForm.rememberMe"
          style="margin: 0px 0px 25px 0px; float: right"
          >记住密码</el-checkbox
        >
        <el-form-item style="width: 100%">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <!-- <div style="float: right" v-if="register">
          <router-link class="link-type" :to="'/register'"
            >立即注册</router-link
          >
        </div> -->
        </el-form-item>
      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer"></div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        uuid: "",
        code: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: true,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCookie();
  },
  methods: {
    toIndex() {
      this.$router.push("/");
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then((res) => {
              this.loading = false;
              if (res.code == 200) {
                this.$router.push("/");
              } else {
                this.$message.error(res.msg);
              }
              // const url = this.$router.resolve({
              //   path: "/",
              // });
              // window.open(url.href, "_blank");
              // this.$router.push("/");
              // location.href = url.href;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // flex-direction: column;
  max-width: 2190px;
  min-width: 1206px;
  height: 100%;
  background-image: url("~@assets/images/login_bg.png");
  background-size: 100% auto;
  margin: auto;
  background-repeat: no-repeat;
  .logo {
    // height: 40px;
    float: left;
    // margin: 45px;
    cursor: pointer;
  }
  .login-content {
    float: right;
    height: 100%;
    background: rgba(242, 242, 242, 0.44);
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 480px;
    .title {
      margin: 0px auto 15px auto;
      text-align: center;
      font-size: 22px;
      font-family: "SimSun";
      font-weight: 900;
      color: #333333;
      width: 240px;
      // text-shadow: -1px -1px #ffffff;
    }

    .login-form {
      // border-radius: 8px;
      // background: #ffffff;
      width: 280px;
      // padding: 25px;
      // padding-bottom: 10px;
      // padding-top: 25px;
      // box-shadow: 2px 2px 5px rgba(255, 255, 255, 67%);
      margin: 35px auto;
      .form-title {
        // color: #1890ff;
        font-size: 18px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 25px;
        letter-spacing: 10px;
      }
      .el-input {
        height: 38px;
        input {
          height: 38px;
        }
      }
      .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
      }
    }
  }
  ::v-deep .el-form-item {
    margin-bottom: 5px;
    color: #333333 !important;
    font-family: "Microsoft YaHei" !important;
    font-size: 14px;
    font-weight: 400;
    .el-form-item__label {
      color: #333333 !important;
      font-family: "Microsoft YaHei" !important;
      font-size: 14px;
      font-weight: inherit !important;
    }
  }
  .el-form-item__label {
    color: #333333 !important;
    font-family: "Microsoft YaHei" !important;
    font-size: 14px;
    font-weight: inherit !important;
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }
  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }
  .login-code-img {
    height: 38px;
  }
}
</style>
