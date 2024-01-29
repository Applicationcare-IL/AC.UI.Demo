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
              {{ $t(error) }}
            </div>

            <WMButton
              class="w-full mt-4"
              name="new"
              type="submit"
              @click="handleLogin"
              >{{ $t("login.submit") }}
            </WMButton>
          </div>
        </div>
      </div>
    </div>
    <div class="side-design flex-1"></div>
  </div>
</template>

<script setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useLayout } from "@/layout/composables/layout";
import { useAuthStore } from "@/stores/auth";

const { layoutConfig } = useLayout();

const { errors, handleSubmit, setFieldError } = useForm();

const { fetchLicensing } = useLicensing();

const router = useRouter();
const error = ref("");

const handleLogin = handleSubmit((values) => {
  useAuthStore()
    .login(values.email, values.password)
    .then(() => {
      if (useAuthStore().isAuthenticated == true) {
        useAuthStore()
          .userData()
          .then(async (data) => {
            await fetchLicensing();
            router.push("/dashboard");
          })
          .catch(() => {
            error.value = "User Data not found";
          });
      } else {
        console.error("ERROR");
        error.value = "login.invalid_credentials";
      }
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
