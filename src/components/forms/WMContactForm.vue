<template>
    <div class="wm-form-container flex flex-auto flex-column overflow-auto">
      <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
        <h1 class="h1 mb-0">{{ $t('contact.new')}}</h1>
  
        <div class="wm-form-row">
          <WMInput name="owner" type="info" :highlighted="true" :label="$t('contact.in-charge') + ':'" value="Israel Israeli"></WMInput>
        </div>
        <div class="wm-form-row gap-5">
          <WMInput name="first-name" :required="true" type="input-text" :label="$t('contact.first-name') + ':'" />
          <WMInput name="last-name" :required="true" validationMessage="Validation Message" type="input-text"
                   :label="$t('contact.last-name')+ ':'" />
        </div>
  
        <div class="wm-form-row gap-4">
          <WMInput name="contactid" :required="true" type="input-text" :label="$t('contact.id')+ ':'" />
  
          <WMInput name="gender" :highlighted="true" type="input-select" :label="$t('contact.gender')+ ':'" :options="genders"
                   :placeholder="$t('contact.select_gender')" width="130"/>
        </div>
  
        <div class="wm-form-row gap-5">
          <WMInput name="mobile-phone" :required="true" type="input-text" :label="$t('contact.mobilephone')+ ':'" width="88" />
          <WMInput name="landline" type="input-text" :label="$t('contact.landline')+ ':'" width="88" />
        </div>
  
        <div class="wm-form-row gap-5">
          <WMInput name="email" :required="true" type="input-text" :label="$t('contact.email')+ ':'" width="240" />
          <WMInput name="fax" type="input-text" :label="$t('contact.fax')+ ':'" width="88" />
        </div>
  
        <div class="wm-form-row align-items-end gap-2">
          <WMInputSearch name="customer"  :placeholder="$t('contact.select_customer')" :required="true" type="input-search" :label="$t('contact.customer')+ ':'"
                         :multiple="true"
                         width="248" :options="customers" :highlighted="true" />
          <WMButton class="small" name="new" icon="new" @click="">{{ $t('new') }}</WMButton>
        </div>
      </div>
  
      <Divider class="my-5" layout="horizontal" style="height: 4px;" />
  
      <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
        <h2 class="h2 mb-0">{{ $t('contact.address') }}</h2>
  
        <div class="wm-form-row gap-5">
          <WMInputSearch name="city" :highlighted="true" :label="$t('contact.city')+ ':'" :options="customers" width="152"
                         :placeholder="$t('contact.select_city')" />
          <WMInputSearch name="street" :highlighted="true" :label="$t('contact.street')+ ':'" :options="customers" width="152"
                         :placeholder="$t('contact.select_street')" />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput name="house-number" type="input-text" :label="$t('contact.house-number')+ ':'" width="48" />
            <WMInput name="apartment" type="input-text" :label="$t('contact.apartment')+ ':'" width="48" />
            <WMInput name="entrance" type="input-select" :highlighted="true" :label="$t('contact.entrance')+ ':'" :options="alphabetWithDash"
                     width="48" />
        </div>
              
            <div class="wm-form-row gap-5">
                <WMInput name="zip" type="input-text" :label="$t('contact.zip')+ ':'" width="80" />
            </div>

        </div>

        <Divider class="my-5" layout="horizontal" style="height: 4px;" />

        <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
            <h2 class="h2 mb-0">{{ $t('contact.notes') }}</h2>

            <div class="wm-form-row gap-5">
                <Textarea v-model="value" autoResize rows="8" cols="100" />
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CustomerService } from '@/service/CustomerService';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';
import WMInput from '@/components/forms/WMInput.vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useFormUtilsStore } from '@/stores/formUtils';

const formUtilsStore = useFormUtilsStore();
const genders = formUtilsStore.getGenders;
const alphabetWithDash = formUtilsStore.getAlphabetWithDash;

const customers = ref();

onMounted(() => {
    CustomerService.getCustomers().then((data) => (customers.value = data));
});

const schema = yup.object({
    'contactid': yup.string().min(9, 'validation.contactid').required(),
    'mobile-phone': yup.string().trim().matches(formUtilsStore.getIsraeliPhoneRegex, 'validation.phone').required(),
    'landline': yup.string().trim().matches(formUtilsStore.getIsraeliLandlineRegex, 'validation.phone').required(),
    'email': yup.string().trim().email('validation.email').required(),
});

const { errors } = useForm({
    validationSchema: schema,
});

</script>

<style scoped lang="scss">

</style>
