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
            <span class="underline cursor-pointer" @click="handleResetExpiredPassword">
              {{ $t("login.send-email-reset-password") }}
            </span>
          </template>
          <template v-else>
            {{ $t(error) }}
          </template>
        </div>

        <div v-if="message != ''" class="bg-green-100 text-green-700 p-2">
          {{ message }}
        </div>

        <WMTempButton
          :text="loginTextButton"
          type="new"
          :disabled="loading"
          class="w-full"
          @click="handleLogin"
        />
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { useFormUtilsStore } from "@/stores/formUtils";

import AuthLayout from "./AuthLayout.vue";

// DEPENDENCIES
const { t } = useI18n();
const formUtilsStore = useFormUtilsStore();
const { fetchLicensing } = useLicensing();
const router = useRouter();

// INJECT

// PROPS, EMITS

// REFS
const error = ref("");
const message = ref("");
const loading = ref(false);

// COMPUTED
const loginTextButton = computed(() => {
  return loading.value ? t("login.loading") : t("login.submit");
});

// COMPONENT METHODS AND LOGIC
const { handleSubmit, values, resetForm } = useForm({
  validationSchema: formUtilsStore.getLoginFormValidationSchema,
});

const handleLogin = handleSubmit((values) => {
  if (loading.value) return;

  loading.value = true;

  useAuthStore()
    .login(values.email, values.password)
    .then((response) => {
      if (useAuthStore().isAuthenticated == true) {
        useAuthStore()
          .userData()
          .then(async () => {
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
      error.value = "";
      message.value = t("login.expired-password-reset-email-sent");
      resetForm();
    })
    .catch((error) => {
      console.error(error);
    });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
