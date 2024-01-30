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
  <Dialog
    v-model:visible="visible"
    modal
    :header="$t('login.forgot-password-dialog-title')"
    :style="{ width: '25rem' }"
  >
    <span class="p-text-secondary block mb-5">
      {{ $t("login.forgot-password-dialog-instructions") }}
    </span>

    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        :label="$t('login.confirm')"
        @click="visible = false"
      ></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useLayout } from "@/layout/composables/layout";
import { useAuthStore } from "@/stores/auth";
import { useFormUtilsStore } from "@/stores/formUtils";

const formUtilsStore = useFormUtilsStore();

const { layoutConfig } = useLayout();

const { handleSubmit, resetForm } = useForm({
  validationSchema: formUtilsStore.getForgotPasswordFormValidationSchema,
});

const visible = ref(false);

const error = ref("");

const handleForgotPassword = handleSubmit((values) => {
  useAuthStore()
    .forgotPassword(values.email)
    .then(() => {
      visible.value = true;
      resetForm();
    })
    .catch(() => {
      alert("entro al catch");
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
