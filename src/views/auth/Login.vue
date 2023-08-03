<template>
    <div class="flex flex-row">
        <div class="flex-1 p-6">

            <div class="login-header flex flex-row gap-3 align-items-center">
                <img src="@/assets/images/logo.png" alt="logo" />
                <img src="@/assets/images/easymaze-title.png" style="padding-top: 10px; padding-bottom:5px" alt="title" />
            </div>
            <div class="login-container flex flex-column justify-content-center align-items-center h-full pb-6">
                <div class="login-form">

                    <div class="h1 w-full">Hello!</div>
                    <div class="w-full text-gray-600">Enter an Email address and password to log in</div>
                    <div class="mt-6 flex flex-column">
                        <WMInput name="email" type="input-text" :highlighted="true" :label="$t('email') + ':'" />
                        <WMInput name="password" type="input-text" :highlighted="true" :label="$t('password') + ':'" style="margin-top:32px" />
                        <router-link to="/login" class="align-self-end">Forgot your password?</router-link>
                        <WMButton class="w-full" name="new" type="submit" style="margin-top:120px" @click="handleLogin">Login</WMButton> 
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

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = () => {
    console.log('handleLogin');
    console.log(email + password)
    useAuthStore().login("admin@mazemateapp.com", "12345678" );
    router.push('/dashboard');
};

</script >

<style scoped>
.side-design {
    background: url('@/assets/images/login-side-design.svg');
    height: 100vh;
}

.login-form{
    width: 400px;
}
</style>