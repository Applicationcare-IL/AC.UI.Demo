<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="service-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t('new', ['service']) }}</h1>
      <h2 class="h2 my-0">{{ $t('general-details') }}</h2>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput name="owner" type="info" :highlighted="true" :label="$t('owner') + ':'" value="שרוליק כהן" />
          <WMInput name="id" type="info" :highlighted="true" :label="$t('team') + ':'" value="שיפור פני העיר" />
        </div>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <div class="flex flex-row gap-1 align-items-end">
          <WMInputSearch name="contact" :required="true" :placeholder="$t('select', ['contact'])" type="input-search"
                         :label="$t('contact') + ':'" width="160" :options="contacts" :highlighted="true"
                         :searchFunction="searchContact" />
          <WMButton class="small" name="new" icon="new" @click="">{{ $t('new') }}</WMButton>
        </div>
        <WMInputSearch name="customer" :required="true" :placeholder="$t('select', ['customer'])" type="input-search"
                       :label="$t('customer') + ':'" width="160" :options="customers" :highlighted="true"
                       :searchFunction="searchCustomer" />
      </div>
      <div class="wm-form-row gap-5">
        <WMInput name="direction" type="input-select" :highlighted="true" :label="$t('direction') + ':'"
                 width="80" :options="directions" />
        <WMInput name="channel" type="input-select" :highlighted="true" :label="$t('channel') + ':'"
                 :options="channels" width="104" />
        <WMInput name="priority" type="input-select" :highlighted="true" :label="$t('priority') + ':'"
                 :options="urgencies" width="104" />
      </div>

      <Divider class="" layout="horizontal" />
      <div class="service-classification flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t('classification') }}</h2>

        <div class="wm-form-row gap-5">
          <WMInputSearch name="short-classification" :highlighted="true" :label="$t('short-classification') + ':'"
                         :options="quickCodes" width="336" :placeholder="$t('select', ['short-classification'])" />

        </div>
        <div class="wm-form-row gap-5">
          <WMInputSearch name="classification-1" :highlighted="true" :required="true"
                         :label="$t('classification-1') + ':'" type="input-search" :options="areas" width="152"
                         :placeholder="$t('select', ['classification-1'])" />

          <WMInputSearch name="classification-2" :highlighted="true" :required="true"
                         :label="$t('classification-2') + ':'" :options="types" width="152"
                         :placeholder="$t('select', ['classification-2'])" />
          <WMInputSearch name="classification-3" :highlighted="true" :required="true"
                         :label="$t('classification-3') + ':'" :options="requests1" width="152"
                         :placeholder="$t('select', ['classification-3'])" />
        </div>

        <div class="wm-form-row gap-5">
          <WMInputSearch name="classification-4" :highlighted="true" :label="$t('classification-4') + ':'"
                         :options="requests2" width="152" :placeholder="$t('select', ['classification-4'])"
                         :value="selectedCustomer" />
          <WMInputSearch name="classification-5" :highlighted="true" :label="$t('classification-5') + ':'"
                         :options="requests3" width="152" :placeholder="$t('select', ['classification-5'])"
                         :value="selectedContact" />
        </div>
      </div>
      <Divider class="mb-0" layout="horizontal" />
      <div class="service-description flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t('description') }}</h2>
        <div class="wm-form-row gap-5">
          <Textarea id="description" name="description" v-model="description" autoResize rows="8" cols="100" />
        </div>

      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" />
      <div class="service-address flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t('address.address') }}</h2>

        <div class="wm-form-row gap-5">
          <WMInputSearch name="city" :highlighted="true" :required="true" :label="$t('address.city') + ':'"
                         :options="customers" width="152" :placeholder="$t('select', ['addres.city'])" />
          <WMInputSearch name="street" :required="true" :highlighted="true" :label="$t('address.street') + ':'"
                         :options="customers" width="152" :placeholder="$t('select', ['address.street'])" />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput name="house-number" type="input-text" :highlighted="true" :label="$t('address.house-number') + ':'"
                   width="48" />
          <WMInput name="apartment" type="input-text" :highlighted="true" :label="$t('address.apartment') + ':'"
                   width="48" />
          <WMInput name="entrance" type="input-select" :highlighted="true" :label="$t('address.entrance') + ':'"
                   :options="alphabetWithDash" width="48" />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput name="zip" :highlighted="true" type="input-text" :label="$t('address.zip') + ':'" width="80" />
        </div>

      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" />
      <div class="service-site-details flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t('site.site') }}</h2>
        <div class="wm-form-row gap-5">
          <WMInput name="site-name" :required="true" :highlighted="true" type="input-text" :label="$t('site.name') + ':'"
                   width="152" />
          <WMInput name="site-type" type="input-select" :highlighted="true" :label="$t('site.type') + ':'"
                   :options="alphabetWithDash" width="88" />

        </div>
        <div class="wm-form-row gap-5">
          <div class="wm-form-row align-items-end gap-5">
            <div class="flex flex-row gap-1 align-items-end">
              <WMInputSearch name="site-contact" :required="true" :placeholder="$t('select', ['contact'])"
                             type="input-search" :label="$t('site.contact') + ':'" :multiple="true" width="152"
                             :options="customers" :highlighted="true" />
              <WMButton class="small" name="new" icon="new" @click="">{{ $t('new') }}</WMButton>
            </div>
            <WMInputSearch name="site-contact-role" :placeholder="$t('select', ['role'])" type="input-search"
                           :label="$t('site.contact-role') + ':'" :multiple="true" width="152" :options="customers"
                           :highlighted="true" />
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import WMInput from '@/components/forms/WMInput.vue';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';
import { useFormUtilsStore } from '@/stores/formUtils';
import { useForm } from 'vee-validate';
import { CustomerService } from '@/service/CustomerService';
import { ContactsService } from '@/service/ContactsService';
import { useOptionSetsStore } from '@/stores/optionSets';
import { useToast } from '@/stores/toast';
import { useDialog } from '@/stores/dialog';
import { ServicesService } from '@/service/ServicesService';

const props = defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
});

const customers = ref();
const contacts = ref();
const optionSetsStore = useOptionSetsStore();

const toast = useToast();
const dialog = useDialog();
const formUtilsStore = useFormUtilsStore();

const directions = ref();
const channels = ref();
const urgencies = ref();

const quickCodes = ref([]);
const areas = ref([]);
const types = ref([]);
const requests1 = ref([]);
const requests2 = ref([]);
const requests3 = ref([]);

onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApi('service_direction').then((data) => (directions.value = data));
  optionSetsStore.getOptionSetValuesFromApi('service_channel').then((data) => (channels.value = data));
  optionSetsStore.getOptionSetValuesFromApi('service_urgent').then((data) => (urgencies.value = data));
  optionSetsStore.getOptionSetValuesFromApi('service_area').then((data) => (areas.value = data));
  optionSetsStore.getOptionSetValuesFromApi('service_type').then((data) => (types.value = data));
  optionSetsStore.getOptionSetValuesFromApi('service_request_1').then((data) => (requests1.value = data));
  optionSetsStore.getOptionSetValuesFromApi('service_request_2').then((data) => (requests2.value = data));
  optionSetsStore.getOptionSetValuesFromApi('service_request_3').then((data) => (requests3.value = data));

});

const selectedContact = ref();
const selectedCustomer = ref();

const searchCustomer = (query) => {
  return CustomerService.getCustomersFromApi({ search: query, contact_id: values.contact.id });
}

const searchContact = (query) => {
  return ContactsService.getContactsFromApi({ search: query, customer_id: values.customer.id });
}

const { errors, handleSubmit, setFieldError, meta, values } = useForm({
  validationSchema: formUtilsStore.getServiceFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  ServicesService.createService(ServicesService.parseService(values)).then((data) => {
    dialog.confirmNewContact(data.data.id);
    toast.successAction('service', 'created');
  }).catch((error) => {
    console.log(error);
    toast.error('service', 'not-created');
  });
});

const onCancel = () => {
  if (formUtilsStore.formMeta.dirty)
    dialog.discardNewService();
  else {
    formUtilsStore.closeForm();
  }
};

formUtilsStore.save = onSave;
formUtilsStore.cancel = onCancel;
formUtilsStore.formEntity = "service";

watch(() => meta.value, (value) => {
  formUtilsStore.formMeta = value;
});

</script>

<style scoped lang="scss"></style>
