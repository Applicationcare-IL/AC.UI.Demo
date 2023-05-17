<template>
  <div v-if="contact" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t('contact.contact') }}: {{ contact.name }}</h1>
      <div class=" flex flex-row gap-5">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t('general-details') }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">

                <div class="wm-form-row gap-5">
                  <WMInput name="owner"
                           type="info"
                           :highlighted="true"
                           :label="$t('in-charge') + ':'"
                           :value="contact.in_charge"></WMInput>
                  <WMInput name="id" type="info"
                           :highlighted="true"
                           :label="$t('id') + ':'"
                           :value="contact.contact_id" />
                  <WMInput name="system-id" type="info"
                           :highlighted="true"
                           :label="$t('system-id') + ':'"
                           :value="contact.contact_id" />
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
                <div class="wm-form-row gap-5">
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
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t('communication-details') }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-5">
                    <WMInput name="mobile-phone"
                             :required="true"
                             type="input-text"
                             :label="$t('mobilephone') + ':'"
                             width="88" />
                    <WMInput name="landline"
                             type="input-text"
                             :label="$t('landline') + ':'"
                             width="88" />
                    <WMInput name="fax"
                             type="input-text"
                             :label="$t('fax') + ':'"
                             width="88" />
                  </div>
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput name="facebook"
                           :required="true"
                           type="input-text"
                           :label="$t('facebook') + ':'"
                           width="88" />
                  <WMInput name="email"
                           :required="true"
                           type="input-text"
                           :label="$t('email') + ':'"
                           width="240" />

                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t('address.address') }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInputSearch name="city" :highlighted="true" :label="$t('address.city') + ':'" :options="customers"
                                 width="152"
                                 :placeholder="$t('select', ['address.city'])" />
                  <WMInputSearch name="street" :highlighted="true" :label="$t('address.street') + ':'"
                                 :options="customers"
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
            </template>
          </Card>
        </div>
      </div>
      <div class=" flex flex-row gap-5">
        <div class=" card-container top-info-card" style="flex: 2">
          <Card>
            <template #title> {{ $t('contact.notes') }} </template>
            <template #content>
              <div class="contact-notes flex flex-auto flex-column gap-5 mb-5">

                <div class="wm-form-row gap-5">
                  <Textarea v-model="value" autoResize rows="8" cols="100" />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container top-info-card flex-1">
          <Card>
            <template #title> {{ $t('communication-details') }} </template>
            <template #content>

            </template>
          </Card>
        </div>
        <div class=" card-container top-info-card flex-1">
          <Card>
            <template #title> {{ $t('address.address') }} </template>
            <template #content>

            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ContactsService } from '@/service/ContactsService';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';
import WMInput from '@/components/forms/WMInput.vue';
import { useForm } from 'vee-validate';
import { useFormUtilsStore } from '@/stores/formUtils';
import { useRoute } from 'vue-router'

const formUtilsStore = useFormUtilsStore();
const contact = ref();
const route = useRoute();

onMounted(() => {
  setTimeout(function () {
    ContactsService.getContact(route.params.id).then((data) => (contact.value = data));
  }, 1000);
});

const { errors, handleSubmit, setFieldError } = useForm({
  validationSchema: formUtilsStore.getContactFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  setFieldError('mobile-phone', 'Customer already exists');

  console.log(values);
});

formUtilsStore.submit = onSubmit;
formUtilsStore.formErrors = errors;

</script>

<style scoped lang="scss"></style>
