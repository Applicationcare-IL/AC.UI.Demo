<template>
  <AuthLayout>
    <div class="form-container">
      <div class="h1 w-full">{{ $t("login.hello") }}</div>
      <div class="w-full text-gray-600">{{ $t("login.instructions") }}</div>
      <div class="mt-6 flex flex-column">
        <WMInput
          name="email"
          type="input-text"
          :highlighted="true"
          :label="$t('login.email') + ':'"
        />
        <WMInput
          name="password"
          type="input-password"
          :highlighted="true"
          :label="$t('login.password') + ':'"
          style="margin-top: 32px"
        />
        <router-link to="/forgot-password" class="align-self-end mb-4">{{
          $t("login.forgot_password")
        }}</router-link>

        <div v-if="error != ''" class="bg-red-100 text-red-700 p-2">
          <template v-if="error === 'login.password_expired'">
            {{ $t("login.password-expired") }}
            <span class="underline" @click="handleResetExpiredPassword">
              {{ $t("login.send-email-reset-password") }}
            </span>
          </template>
          <template v-else>
            {{ $t(error) }}
          </template>
        </div>

        <WMButton
          class="w-full mt-4"
          name="new"
          type="submit"
          @click="handleLogin"
        >
          <span v-if="loading"> Loading... </span>
          <span v-else>
            {{ $t("login.submit") }}
          </span>
        </WMButton>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";

import AuthLayout from "./AuthLayout.vue";

const { handleSubmit, values, resetForm } = useForm();

const toast = useToast();
const i18n = useI18n();

const { fetchLicensing } = useLicensing();

const router = useRouter();
const error = ref("");

const loading = ref(false);

const handleLogin = handleSubmit((values) => {
  loading.value = true;

  useAuthStore()
    .login(values.email, values.password)
    .then((response) => {
      if (useAuthStore().isAuthenticated == true) {
        useAuthStore()
          .userData()
          .then(async () => {
            loading.value = false;
            await fetchLicensing();
            router.push("/dashboard");
          })
          .catch(() => {
            loading.value = false;
            error.value = "User Data not found";
          });
      } else {
        error.value = `login.${response.data.message}`;
      }
    })
    .catch((error) => {
      error.value = `login.${error.data.message}`;
    });
});

const handleResetExpiredPassword = () => {
  useAuthStore()
    .forgotPassword(values.email)
    .then(() => {
      toast.success(i18n.t("login.expired-password-reset-email-sent"));
      resetForm();
    })
    .catch((error) => {
      console.error(error);
    });
};
</script>
