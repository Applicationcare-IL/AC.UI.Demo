<template>
  <AuthLayout>
    <div class="reset-password-form">
      <div class="h1 w-full">{{ $t("login.reset-password-title") }}</div>
      <div class="w-full text-gray-600">
        {{ $t("login.reset-password-instructions") }}
      </div>
      <div class="mt-6 flex flex-column">
        <WMInput
          name="email"
          type="input-text"
          :highlighted="true"
          :label="$t('login.email') + ':'"
          :value="email"
        />
        <WMInput
          v-model="password"
          name="password"
          type="input-password"
          :highlighted="true"
          :label="$t('login.new-password') + ':'"
          style="margin-top: 32px"
        />

        <WMInput
          v-model="passwordConfirm"
          name="password-confirm"
          type="input-password"
          :highlighted="true"
          :label="$t('login.confirm-password') + ':'"
          style="margin-top: 32px"
        />

        <div v-if="error" class="bg-red-100 text-red-700 p-2">
          {{ $t(firstError) }}
        </div>

        <WMButton
          :text="$t('login.save-new-password')"
          type="new"
          class="w-full mt-3"
          @click="handleLogin"
        />
      </div>
    </div>
  </AuthLayout>
  <Dialog
    v-model:visible="visible"
    modal
    :header="$t('login.reset-password-dialog-title')"
    :style="{ width: '25rem' }"
  >
    <span class="p-text-secondary block mb-5">
      {{ $t("login.reset-password-dialog-instructions") }}
    </span>

    <div class="flex justify-content-end gap-2">
      <Button type="button" :label="$t('login.confirm')" @click="handleConfirm"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { useFormUtilsStore } from "@/stores/formUtils";

import AuthLayout from "./AuthLayout.vue";

const formUtilsStore = useFormUtilsStore();

const password = ref("");
const passwordConfirm = ref("");

const { handleSubmit, resetForm } = useForm({
  validationSchema: formUtilsStore.getResetPasswordFormValidationSchema,
});

const router = useRouter();

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

// redirect to home if props are not passed
if (!props.token || !props.email) {
  router.push("/");
}

const error = ref(false);
const errors = ref(false);
const visible = ref(false);

const firstError = computed(() => {
  if (errors.value) {
    return Object.values(errors.value)[0][0];
  }
  return "";
});

const handleLogin = handleSubmit((values) => {
  useAuthStore()
    .resetPassword(props.email, props.token, values.password, values["password-confirm"])
    .then((response) => {
      if (response.errors) {
        error.value = response.message;
        errors.value = response.errors;
        return;
      }

      visible.value = true;
      resetForm();
      error.value = false;
    })
    .catch((error) => {
      console.error("ERROR", error);
    });
});

const handleConfirm = () => {
  router.push("/login");
};
</script>

<style scoped>
.reset-password-form {
  width: 400px;
}
</style>
