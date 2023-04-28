<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api'
import { setCookie } from '@/utils/functions'

export interface FormState {
  username: string
  password: string
}
const formRef = ref()
const message = useMessage()
const loading = ref(false)
const formInline = reactive({
  username: '',
  password: '',
})
const rules = {
  username: { required: true, message: '', trigger: 'blur' },
  password: { required: true, message: '', trigger: 'blur' },
}
const router = useRouter()
const handleSubmit = (e: MouseEvent | KeyboardEvent) => {
  e.preventDefault()
  formRef.value.validate(async (errors: any) => {
    if (!errors) {
      const { username, password } = formInline
      message.loading('登录中...')
      loading.value = true
      const params: FormState = {
        username,
        password,
      }
      try {
        const { code, message: msg, data } = await login(params.username, params.password)
        message.destroyAll()
        if (code === 200) {
          message.success('登录成功，欢迎进入系统')
          setCookie('token', data.token, 8)
          router.replace('/chat')
        }
        else {
          message.error(msg || '登录失败')
        }
      }
      catch {
        message.error('登录失败')
      }
      finally {
        loading.value = false
      }
    }
    else {
      message.error(errors.message || '请正确填写用户名与密码')
    }
  })
}
</script>

<template>
  <div class="background" />
  <NForm
    ref="formRef"
    class="login-form"
    label-placement="left"
    label-align="left"
    size="medium"
    :model="formInline"
    :rules="rules"
  >
    <h2 style="color:azure; text-align: center;">
      账户登录
    </h2>
    <NFormItem path="username">
      <NInput
        v-model:value="formInline.username"
        placeholder="请输入用户名"
        class="custom-placeholder"
      />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="formInline.password"
        type="password"
        show-password-on="click"
        placeholder="请输入密码"
        @keydown.enter.native="handleSubmit"
      />
    </NFormItem>
    <NFormItem>
      <NButton class="nbutton" type="primary" size="large" :loading="loading" block style="color:cornsilk;" @click="handleSubmit">
        登录
      </NButton>
    </NFormItem>
  </NForm>
</template>

<style scoped>
.login-page {
  position: relative;
  height: 100vh;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #c4fc7a, #e484ff, rgb(92, 208, 158), #49abf6);
  background-size: 400% 400%;
  animation: gradient 20s ease infinite;
}

.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 24px;
  border-radius: 15px;
  box-shadow: 0px 4px 16px hsla(197, 100%, 50%, 0.042);
  background-color: rgba(255, 255, 255, 0);
  text-align: left;
  width: 330px;
}

.login-form h2 {
  margin-top: 5px;
  margin-bottom: 20px;
  /* font: normal normal normal 30px "Yuanti SC", cursive, sans-serif; */
  font: 30px "Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","Heiti SC","WenQuanYi Micro Hei",sans-serif;
}
.nbutton{
  font: 15px "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
