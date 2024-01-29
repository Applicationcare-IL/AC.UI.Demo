<template>
  <div
    class="flex flex-row"
    :class="{ 'layout-rtl': layoutConfig.isRTL.value }"
  >
    <div class="flex-1 p-6">
      <div class="login-header flex flex-row gap-3 align-items-center">
        <img src="@/assets/images/logo.png" alt="logo" />
        <img
          src="@/assets/images/easymaze-title.png"
          style="padding-top: 10px; padding-bottom: 5px"
          alt="title"
        />
      </div>
      <div
        class="login-container flex flex-column justify-content-center align-items-center h-full pb-6"
      >
        <div class="login-form">
          <div class="h1 w-full">{{ $t("login.forgot-password-title") }}</div>
          <div class="w-full text-gray-600">
            {{ $t("login.forgot-password-instructions") }}
          </div>
          <div class="mt-6 flex flex-column">
            <WMInput
              name="email"
              type="input-text"
              :highlighted="true"
              :label="$t('login.email') + ':'"
            />

            <div v-if="error != ''" class="bg-red-100 text-red-700 p-2">
              {{ $t(error) }}
            </div>

            <WMButton
              class="w-full mt-4"
              name="new"
              type="submit"
              @click="handleForgotPassword"
              >{{ $t("login.send-reset-link") }}
            </WMButton>
          </div>
        </div>
      </div>
    </div>
    <div class="side-design flex-1"></div>
  </div>
  <ConfirmDialog group="templating">
    <template #message="slotProps">
      <div
        class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border"
      >
        <i
          :class="slotProps.message.icon"
          class="text-6xl text-primary-500"
        ></i>
        <p>{{ slotProps.message.message }}</p>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useLayout } from "@/layout/composables/layout";
import { useAuthStore } from "@/stores/auth";

const { layoutConfig } = useLayout();

const { handleSubmit } = useForm();

const error = ref("");

const handleForgotPassword = handleSubmit((values) => {
  useAuthStore()
    .forgotPassword(values.email)
    .then(() => {
      confirm.require({
        header: "We sent you an email!",
        message:
          "Click on the link in your email to reset your password and login to EasyMaze",
        acceptLabel: "Confirm",
        accept: () => {},
      });
    })
    .catch(() => {
      error.value = "login.invalid_credentials";
    });
});
</script>

<style scoped>
.side-design {
  background: url("@/assets/images/login-side-design.svg");
  height: 100vh;
}

.login-form {
  width: 400px;
}
</style>
