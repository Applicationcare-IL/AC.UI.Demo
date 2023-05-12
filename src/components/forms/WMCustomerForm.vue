<template>
  <div class="wm-form-container flex flex-auto flex-column overflow-auto">
    <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t('customer.new') }}</h1>
      <div class="wm-form-row gap-5">
        <WMInput name="first-name"
                 :required="true"
                 type="input-text"
                 :label="$t('contact.first-name') + ':'"
                 />
        <WMInput name="last-name"
                 :required="true"
                 type="input-text"
                 :label="$t('contact.last-name') + ':'"
                 />
      </div>
    </div>
  </div>
</template>

<script setup>
import WMInput from '@/components/forms/WMInput.vue';

import { useFormUtilsStore } from '@/stores/formUtils';
import { useCustomerFormStore } from '@/stores/customerForm';
import * as yup from 'yup';
import { useForm } from 'vee-validate';


const formUtilsStore = useFormUtilsStore();
const formStore = useCustomerFormStore();

const schema = yup.object({
  'first-name': yup.string().min(9).required(),
  'last-name': yup.string().min(9).required(),
});

const { errors, useFieldModel, handleSubmit } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit((values) => {
  console.log(values);
});

formStore.submit = onSubmit;

</script>

<style scoped lang="scss"></style>
