<template>
  <AuthLayout>
    <div class="forgot-password-form">
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
  </AuthLayout>

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
      />
    </div>
  </Dialog>
</template>

<script setup>
import { useForm } from "vee-validate";
import { ref } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useFormUtilsStore } from "@/stores/formUtils";

import AuthLayout from "./AuthLayout.vue";

const formUtilsStore = useFormUtilsStore();

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
      error.value = "login.invalid_credentials";
    });
});
</script>

<style scoped>
.forgot-password-form {
  width: 400px;
}
</style>
