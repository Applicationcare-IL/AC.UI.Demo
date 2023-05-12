<template>
  <div class="wm-form-container flex flex-auto flex-column overflow-auto">
    <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t('customer.new') }}</h1>
      {{  formUtilsStore.formErrors }}
      <div class="wm-form-row gap-5">
        <WMInput name="owner" type="info" :highlighted="true" :label="$t('customer.in-charge') + ':'"
                 value="Israel Israeli"></WMInput>
        <WMInput name="id" type="info" :highlighted="true" :label="$t('customer.id') + ':'"
                 value="000012"></WMInput>
      </div>
      <div class="wm-form-row gap-5">
        <WMInput name="name"
                 :required="true"
                 type="input-text"
                 :label="$t('customer.name') + ':'" />
        <WMInput name="number"
                 :required="true"
                 type="input-text"
                 :label="$t('customer.number') + ':'" />
      </div>
      <div class="wm-form-row gap-5">
        <WMInput name="type" type="input-select" :highlighted="true" :label="$t('customer.type') + ':'" :options="alphabetWithDash" width="48" />
        <WMInput name="rating" type="input-select" :highlighted="true" :label="$t('customer.rating') + ':'" :options="alphabetWithDash" width="48" />
      </div>

      <div class="wm-form-row gap-5">
        <WMInputSearch name="area" :placeholder="$t('customer.select_area')" :required="true" type="input-search" :label="$t('customer.area') + ':'" :multiple="true" width="248" :options="customers" :highlighted="true" />
      </div>
      <Divider class="my-5" layout="horizontal" style="height: 4px;" />

      <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
        <h2 class="h2 mb-0">{{ $t('contact.address') }}</h2>

        <div class="wm-form-row gap-5">
          <WMInputSearch name="city" :highlighted="true" :label="$t('contact.city') + ':'" :options="customers"
                         width="152" :placeholder="$t('contact.select_city')" />
          <WMInputSearch name="street" :highlighted="true" :label="$t('contact.street') + ':'" :options="customers"
                         width="152" :placeholder="$t('contact.select_street')" />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput name="house-number" type="input-text" :label="$t('contact.house-number') + ':'" width="48" />
          <WMInput name="apartment" type="input-text" :label="$t('contact.apartment') + ':'" width="48" />
          <WMInput name="entrance" type="input-select" :highlighted="true" :label="$t('contact.entrance') + ':'"
                   :options="alphabetWithDash" width="48" />
        </div>

        <div class="wm-form-row gap-5">
          <WMInput name="zip" type="input-text" :label="$t('contact.zip') + ':'" width="80" />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import WMInput from '@/components/forms/WMInput.vue';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';
import { useFormUtilsStore } from '@/stores/formUtils';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

import { CustomerService } from '@/service/CustomerService';

const customers = ref();

onMounted(() => {
  CustomerService.getCustomers().then((data) => (customers.value = data));
});

const formUtilsStore = useFormUtilsStore();

const schema = yup.object({
  'name': yup.string().min(9).required(),
  'number': yup.string().required(),
  'area': yup.array().min(1),
});

const { errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit((values) => {
  console.log(values);
});

formUtilsStore.submit = onSubmit;
formUtilsStore.formErrors = errors;


</script>

<style scoped lang="scss"></style>
