<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t('new', ['contact.contact']) }}</h1>

      <div class="wm-form-row">
        <WMInput name="owner" type="info" :highlighted="true" :label="$t('in-charge') + ':'"
                 value="Israel Israeli"></WMInput>
      </div>
      <div class="wm-form-row gap-5">
        <WMInput name="first-name"
                 :required="true"
                 type="input-text"
                 :label="$t('first-name') + ':'" />
        <WMInput name="last-name"
                 :required="true"
                 validationMessage="Validation Message"
                 type="input-text"
                 :label="$t('last-name') + ':'" />
      </div>

      <div class="wm-form-row gap-4">
        <WMInput name="contactid"
                 :required="true"
                 type="input-text"
                 :label="$t('id') + ':'" />

        <WMInput name="gender"
                 :highlighted="true"
                 type="input-select"
                 :label="$t('gender') + ':'"
                 :options="genders"
                 :placeholder="$t('select', ['gender'])" 
                 width="130" />
      </div>

      <div class="wm-form-row gap-5">
        <WMInput name="mobile-phone" :required="true" type="input-text" :label="$t('mobilephone') + ':'"
                 width="88" />
        <WMInput name="landline" type="input-text" :label="$t('landline') + ':'" width="88" />
      </div>

      <div class="wm-form-row gap-5">
        <WMInput name="email" :required="true" type="input-text" :label="$t('email') + ':'" width="240" />
        <WMInput name="fax" type="input-text" :label="$t('fax') + ':'" width="88" />
      </div>

      <div class="wm-form-row align-items-end gap-2">
        <WMInputSearch name="customer" :placeholder="$t('select', ['customer'])"  :required="true" type="input-search"
                       :label="$t('customer') + ':'" :multiple="true" width="248" :options="customers"
                       :highlighted="true" />
        <WMButton class="small" name="new" icon="new" @click="">{{ $t('new') }}</WMButton>
      </div>
    </div>

    <Divider class="my-5" layout="horizontal" style="height: 4px;" />

    <div class="contact-address flex flex-auto flex-column gap-5 mb-5">
      <h2 class="h2 mb-0">{{ $t('address.address') }}</h2>

      <div class="wm-form-row gap-5">
        <WMInputSearch name="city" :highlighted="true" :label="$t('address.city') + ':'" :options="customers" width="152"
        :placeholder="$t('select', ['address.city'])" />
        <WMInputSearch name="street" :highlighted="true" :label="$t('address.street') + ':'" :options="customers"
                       width="152" :placeholder="$t('select', ['address.street'])" />
      </div>
      <div class="wm-form-row gap-5">
        <WMInput name="house-number" type="input-text" :label="$t('address.house-number') + ':'" width="48" />
        <WMInput name="apartment" type="input-text" :label="$t('address.apartment') + ':'" width="48" />
        <WMInput name="entrance" type="input-select" :highlighted="true" :label="$t('address.entrance') + ':'"
                 :options="alphabetWithDash" width="48" />
      </div>

      <div class="wm-form-row gap-5">
        <WMInput name="zip" type="input-text" :label="$t('address.zip') + ':'" width="80" />
      </div>

    </div>

    <Divider class="my-5" layout="horizontal" style="height: 4px;" />

    <div class="contact-notes flex flex-auto flex-column gap-5 mb-5">
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
import { useFormUtilsStore } from '@/stores/formUtils';

const formUtilsStore = useFormUtilsStore();


const customers = ref();

onMounted(() => {
  CustomerService.getCustomers().then((data) => (customers.value = data));
});

const { errors, handleSubmit, setFieldError } = useForm({
  validationSchema: formUtilsStore.getContactFormValidationSchema,
});

const genders = formUtilsStore.getGenders;
const alphabetWithDash = formUtilsStore.getAlphabetWithDash;

const onSubmit = handleSubmit((values) => {
  setFieldError('mobile-phone', 'Customer already exists');

  console.log(values);
});

formUtilsStore.submit = onSubmit;
formUtilsStore.formErrors = errors;

</script>

<style scoped lang="scss"></style>
