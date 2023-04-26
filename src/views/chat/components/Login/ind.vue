<script setup lang="ts">
import { NForm, NFormItem, NIcon, NInput, useMessage } from 'naive-ui'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const username = ref('')
const password = ref('')

interface FormState {
  username: string
  password: string
}
const formRef = ref()
const message = useMessage()
const loading = ref(false)
const formInline = reactive({
  username: 'admin',
  password: '123456',
  isCaptcha: true,
})
const rules = {
  username: { required: true, message: '请输入用户名', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
}
const userStore = useUserStore()
const router = useRouter()
const handleSubmit = (e: MouseEvent) => {
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
        const { code, message: msg } = await userStore.login(params)
        message.destroyAll()
        if (code === 200) {
          message.success('登录成功，即将进入系统')
          router.replace('/')
        }
        else {
          message.info(msg || '登录失败')
        }
      }
      finally {
        loading.value = false
      }
    }
    else {
      message.error('请填写完整信息，并且进行验证码校验')
    }
  })
}
</script>

<template>
  <div class="background">
    <div class="view-account">
      <div class="view-account-header" />
      <div class="view-account-container">
        <div class="view-account-top">
          <div class="view-account-top-logo">
            <img src="https://i.imgur.com/e92dbex.png">
          </div>
          <div class="view-account-top-desc">
            Naive Ui Admin中台前端/设计解决方案
          </div>
          <div class="view-account-form">
            <NForm
              ref="formRef"
              label-placement="left"
              size="large"
              :model="formInline"
              :rules="rules"
            >
              <NFormItem path="username">
                <NInput v-model:value="formInline.username" placeholder="请输入用户名">
                  <template #prefix>
                    <NIcon size="18" color="#808695">
                      <PersonOutline />
                    </NIcon>
                  </template>
                </NInput>
              </NFormItem>

              <NFormItem path="password">
                <NInput
                  v-model:value="formInline.password"
                  placeholder="请输入密码"
                  type="password"
                  show-password-toggle
                >
                  <template #prefix>
                    <NIcon size="18" color="#808695">
                      <LockClosedOutline />
                    </NIcon>
                  </template>
                </NInput>
              </NFormItem>

              <NFormItem>
                <NButton
                  type="primary"
                  size="large"
                  :loading="loading"
                  block
                  @click="handleSubmit"
                >
                  登录
                </NButton>
              </NFormItem>
            </NForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
    &-container {
      flex: 1;
      padding: 32px 0;
      width: 384px;
      margin: 0 auto;
    }
    &-top {
      padding: 32px 0;
      text-align: center;
      &-desc {
        font-size: 14px;
        color: #808695;
      }
    }
    &-other {
      width: 100%;
    }
    .default-color {
      color: #515a6e;
      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
  }
  @media (min-width: 768px) {
    .view-account {
      background-image: url('../../assets/images/login.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 100%;
    }
    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }
	.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #c4fc7a, #e484ff, #85f8c7, #49abf6);
  background-size: 400% 400%;
  animation: gradient 20s ease infinite;
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
