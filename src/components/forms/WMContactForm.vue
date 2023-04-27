<template>
    <div class="wm-form-container flex flex-auto flex-column overflow-auto gap-5">
        <h1 class="h1 mb-5">איש קשר חדש</h1>

        <div class="wm-form-row">
            <WMInput name="owner" type="info" :highlighted="true" label="אחראי:" value="Israel Israeli"></WMInput>
        </div>
        <div class="wm-form-row gap-5">
            <WMInput name="first-name" :required="true" type="input-text" label="שם פרטי:"/>
            <WMInput name="last-name" :required="true" validationMessage="Validation Message" type="input-text" label="שם משפחה:"/>
        </div>

        <div class="wm-form-row gap-4">
            <WMInput name="contact-id" :required="true" type="input-text" label="תעודת זהות:"/>
            <WMInput name="gender" :highlighted="true" type="input-select" label="מגדר:" :options="genders" placeholder="בחירת מגדר"/>
        </div>

        <div class="wm-form-row gap-5">
            <WMInput  name="mobile-phone" :required="true" type="input-text" label="טלפון נייד:" width="88"/>
            <WMInput  name="landline" type="input-text" label="טלפון נייח:" width="88"/>
        </div>
        
        <div class="wm-form-row gap-5">
            <WMInput  name="email" :required="true" type="input-text" label="דוא”ל:" width="240"/>
            <WMInput  name="fax" type="input-text" label="פקס:" width="88"/>
        </div>

        <div class="wm-form-row align-items-end gap-2">
            <WMInputSearch  name="customer" :required="true" type="input-search" label="לקוח:" width="248"  :options="customers"/>
            <WMButton class="small" name="new" icon="new" @click="">חדש</WMButton>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CustomerService } from '@/service/CustomerService';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';
import WMInput from '@/components/forms/WMInput.vue';

const genders= [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
]

const customers = ref();

onMounted(() => {
    CustomerService.getCustomers().then((data) => (customers.value = data));
});

</script>