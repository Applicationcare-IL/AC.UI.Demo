<template>
    <div class="flex flex-row" :class="{ 'layout-rtl': layoutConfig.isRTL.value }">
        <div class="flex-1 p-6">

            <div class="login-header flex flex-row gap-3 align-items-center">
                <img src="@/assets/images/logo.png" alt="logo" />
                <img src="@/assets/images/easymaze-title.png" style="padding-top: 10px; padding-bottom:5px" alt="title" />
            </div>
            <div class="login-container flex flex-column justify-content-center align-items-center h-full pb-6">
                <div class="login-form">

                    <div class="h1 w-full">{{ $t("login.hello") }}</div>
                    <div class="w-full text-gray-600">{{ $t("login.instructions") }}</div>
                    <div class="mt-6 flex flex-column">
                        <WMInput name="email" type="input-text" :highlighted="true" :label="$t('login.email') + ':'" />
                        <WMInput name="password" type="input-password" :highlighted="true"
                                 :label="$t('login.password') + ':'" style="margin-top:32px" />
                        <router-link to="/login" class="align-self-end mb-4">{{ $t('login.forgot_password') }}</router-link>

                        <div v-if="error != ''" class="bg-red-100 text-red-700 p-2">
                            {{ $t(error) }}
                        </div>

                        <WMButton class="w-full mt-4" name="new" type="submit" @click="handleLogin">{{ $t("login.submit") }}
                        </WMButton>
                    </div>

                </div>
            </div>

        </div>
        <div class="side-design flex-1">

        </div>
    </div>
</template>

  
<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import WMInput from '@/components/forms/WMInput.vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';

import { useLayout } from '@/layout/composables/layout';

const { layoutConfig } = useLayout();

const { errors, handleSubmit, setFieldError } = useForm();

const router = useRouter();
const error = ref('');

const handleLogin = handleSubmit((values) => {
    console.log(useAuthStore());
    useAuthStore().login(values.email, values.password).then(() => {
        console.log(useAuthStore());
        if (useAuthStore().isAuthenticated == true) {
            
            
            useAuthStore().userData().then((data) => {
                console.log(data);
                router.push('/dashboard');
            }).catch(() => {
                error.value = 'User Data not found';
                
            });
        }
        else {
            console.log("ERROR")
            error.value = 'login.invalid_credentials';
        }
    })
        .catch(() => {
            error.value = 'login.invalid_credentials';

        });
});

</script >

<style scoped>
.side-design {
    background: url('@/assets/images/login-side-design.svg');
    height: 100vh;
}

.login-form {
    width: 400px;
}
</style>