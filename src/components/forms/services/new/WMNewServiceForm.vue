<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="service-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!props.isSidebar" class="h1 mb-0">
        {{ $t("new", ["service.service"]) }}
      </h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMTeamOwnerFields />
        </div>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <WMInputSearch
          name="contact"
          :required="true"
          :placeholder="$t('select', ['contact'])"
          type="input-search"
          :label="$t('contact') + ':'"
          width="160"
          :highlighted="true"
          :search-function="searchContact"
          :new="true"
          related-sidebar="newContact"
          :model-value="selectedContact"
        />

        <WMSidebar
          :visible="isNewContactSidebarVisible"
          name="newContact"
          @close-sidebar="closeNewContactSidebar"
          @open-sidebar="openNewContactSidebar"
        >
          <WMNewEntityFormHeader entity="contact" name="newContact" />
          <WMNewContactForm
            :is-sidebar="true"
            :show-confirm-dialog="false"
            @close-sidebar="closeNewContactSidebar"
            @contact-created="handleContactCreated"
          />
        </WMSidebar>

        <WMInputSearch
          name="customer"
          :required="true"
          :placeholder="$t('select', ['customer'])"
          type="input-search"
          :label="$t('customer') + ':'"
          width="160"
          :highlighted="true"
          :search-function="searchCustomer"
          :new="true"
          related-sidebar="newCustomer"
          :model-value="selectedCustomer"
        />

        <WMSidebar
          :visible="isNewCustomerSidebarVisible"
          name="newCustomer"
          @close-sidebar="closeNewCustomerSidebar"
          @open-sidebar="openNewCustomerSidebar"
        >
          <WMNewEntityFormHeader entity="customer" name="newCustomer" />
          <WMNewCustomerForm
            :is-sidebar="true"
            :show-confirm-dialog="false"
            @close-sidebar="closeNewCustomerSidebar"
            @customer-created="handleCustomerCreated"
          />
        </WMSidebar>
      </div>
      <div class="wm-form-row gap-5">
        <WMInput
          name="direction"
          type="input-select"
          :highlighted="true"
          :label="$t('direction') + ':'"
          width="80"
          :options="directions"
          option-set
        />
        <WMInput
          name="channel"
          type="input-select"
          :highlighted="true"
          :label="$t('channel') + ':'"
          :options="channels"
          option-set
          width="104"
        />
        <WMInput
          name="priority"
          type="input-select"
          :highlighted="true"
          :label="$t('priority') + ':'"
          :options="urgencies"
          width="104"
          option-set
        />
      </div>

      <Divider class="" layout="horizontal" />
      <div class="service-classification flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t("classification") }}</h2>

        <div class="wm-form-row gap-5">
          <WMInputSearch
            name="short-classification"
            :highlighted="true"
            :label="$t('short-classification') + ':'"
            :options="quickCodes"
            width="336"
            :placeholder="$t('select', ['short-classification'])"
            @change="handleQuickCodeChange"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInputSearch
            v-model="selectedArea"
            name="area"
            :highlighted="true"
            :label="$t('classification-1') + ':'"
            type="input-search"
            :options="areas"
            width="152"
            :placeholder="$t('select', ['classification-1'])"
            required
            @change="updateDropdown('service_type', $event.value.id, 'types')"
          />

          <WMInputSearch
            v-model="selectedType"
            name="type"
            :highlighted="true"
            :label="$t('classification-2') + ':'"
            :options="types"
            width="152"
            :placeholder="$t('select', ['classification-2'])"
            required
            @change="
              updateDropdown('service_request_1', $event.value.id, 'requests1')
            "
          />
          <WMInputSearch
            v-model="selectedRequest1"
            name="request1"
            :highlighted="true"
            :label="$t('classification-3') + ':'"
            :options="requests1"
            width="152"
            :placeholder="$t('select', ['classification-3'])"
            required
            @change="
              updateDropdown('service_request_2', $event.value.id, 'requests2')
            "
          />
        </div>

        <div class="wm-form-row gap-5">
          <WMInputSearch
            v-model="selectedRequest2"
            name="request2"
            :highlighted="true"
            :label="$t('classification-4') + ':'"
            :options="requests2"
            width="152"
            :placeholder="$t('select', ['classification-4'])"
            @change="
              updateDropdown('service_request_3', $event.value.id, 'requests3')
            "
          />
          <WMInputSearch
            v-model="selectedRequest3"
            name="request_3"
            :highlighted="true"
            :label="$t('classification-5') + ':'"
            :options="requests3"
            width="152"
            :placeholder="$t('select', ['classification-5'])"
          />
        </div>
      </div>
      <Divider class="mb-0" layout="horizontal" />
      <div class="service-description flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t("description") }}</h2>
        <div class="wm-form-row gap-5">
          <WMInput id="description" type="text-area" name="description" />
        </div>
      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" />
      <WMNewFormAddress />
      <Divider class="mt-5 mb-0" layout="horizontal" />
      <WMNewServiceFormSite />
    </div>
    <WMFormButtons
      v-if="isSidebar"
      @save-form="onSubmit()"
      @cancel-form="onCancel()"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject, onMounted, ref, watch } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const toast = useToast();
const dialog = useDialog();
const formUtilsStore = useFormUtilsStore();
const { getCustomersFromApi, getCustomerFromApi } = useCustomers();
const { getContactsFromApi, getContactFromApi } = useContacts();
const { createService, parseService, getQuickCodes } = useServices();

// INJECT
const isFormDirty = inject("isFormDirty");
const closeSidebar = inject("closeSidebar");

// PROPS, EMITS
const props = defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
});

// REFS
const directions = ref();
const channels = ref();
const urgencies = ref();

const selectedContact = ref();
const selectedCustomer = ref();

const quickCodes = ref([]);
const areas = ref([]);
const types = ref([]);
const requests1 = ref([]);
const requests2 = ref([]);
const requests3 = ref([]);

const selectedArea = ref();
const selectedType = ref();
const selectedRequest1 = ref();
const selectedRequest2 = ref();
const selectedRequest3 = ref();

const optionRefs = {
  areas: areas,
  types: types,
  requests1: requests1,
  requests2: requests2,
  requests3: requests3,
};

const isNewContactSidebarVisible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const updateDropdown = (dropdown, selectedId, dropdownOptions) => {
  return new Promise((resolve, reject) => {
    optionSetsStore
      .getOptionSetValuesFromApiRaw(dropdown, selectedId)
      .then((data) => {
        optionRefs[dropdownOptions].value = data;
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const searchCustomer = (query) => {
  return getCustomersFromApi({
    search: query,
    contact_id: values.contact?.id,
  });
};

const searchContact = (query) => {
  return getContactsFromApi({
    search: query,
    customer_id: values.customer?.id,
  });
};

const { handleSubmit, meta, values, resetForm } = useForm({
  validationSchema: formUtilsStore.getServiceFormValidationSchema,
});

formUtilsStore.formEntity = "service";

// new contact sidebar
function openNewContactSidebar() {
  isNewContactSidebarVisible.value = true;
}

function closeNewContactSidebar() {
  isNewContactSidebarVisible.value = false;
}

// new customer sidebar
const isNewCustomerSidebarVisible = ref(false);

function openNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = true;
}

function closeNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = false;
}

const onSubmit = handleSubmit((values) => {
  createService(parseService(values))
    .then((data) => {
      dialog.confirmNewService(data.data.id);

      resetForm();
      isFormDirty.value = false;

      closeSidebar();

      toast.successAction("service", "created");
    })
    .catch((error) => {
      console.error(error);
      toast.error("service", "not-created");
    });
});

const onCancel = () => {
  closeSidebar();
};

function handleContactCreated(contactId) {
  if (!contactId) {
    return;
  }

  getContactFromApi(contactId).then((response) => {
    selectedContact.value = response;

    closeNewContactSidebar();
  });
}

function handleCustomerCreated(customerId) {
  if (!customerId) {
    return;
  }

  getCustomerFromApi(customerId).then((response) => {
    selectedCustomer.value = response;

    closeNewCustomerSidebar();
  });
}

function handleQuickCodeChange(quickCode) {
  if (!quickCode) {
    return;
  }

  setArea(quickCode)
    .then(() => {
      return updateDropdown("service_type", quickCode.value.area.id, "types");
    })
    .then(() => {
      return setType(quickCode);
    })
    .then(() => {
      return updateDropdown(
        "service_request_1",
        quickCode.value.type.id,
        "requests1"
      );
    })
    .then(() => {
      return setRequest1(quickCode);
    })
    .then(() => {
      return updateDropdown(
        "service_request_2",
        quickCode.value.request_1.id,
        "requests2"
      );
    })
    .then(() => {
      return setRequest2(quickCode);
    })
    .then(() => {
      return updateDropdown(
        "service_request_3",
        quickCode.value.request_2.id,
        "requests3"
      );
    })
    .then(() => {
      return setRequest3(quickCode);
    });
}

const setArea = (quickCode) => {
  return new Promise((resolve, reject) => {
    if (!quickCode) {
      reject();
    }

    if (quickCode.value.area) {
      selectedArea.value = areas.value.find((area) => {
        return area.id == quickCode.value.area.id;
      });
      resolve();
    }
  });
};

const setType = (quickCode) => {
  return new Promise((resolve, reject) => {
    if (!quickCode) {
      reject();
    }

    if (quickCode.value.type) {
      selectedType.value = types.value.find((type) => {
        return type.id == quickCode.value.type.id;
      });
      resolve();
    }
  });
};

const setRequest1 = (quickCode) => {
  return new Promise((resolve, reject) => {
    if (!quickCode) {
      reject();
    }

    if (quickCode.value.request_1) {
      selectedRequest1.value = requests1.value.find((request1) => {
        return request1.id == quickCode.value.request_1.id;
      });
      resolve();
    }
  });
};

const setRequest2 = (quickCode) => {
  return new Promise((resolve, reject) => {
    if (!quickCode) {
      reject();
    }

    if (quickCode.value.request_2) {
      selectedRequest2.value = requests2.value.find((request2) => {
        return request2.id == quickCode.value.request_2.id;
      });
      resolve();
    }
  });
};

const setRequest3 = (quickCode) => {
  return new Promise((resolve, reject) => {
    if (!quickCode) {
      reject();
    }

    if (quickCode.value.request_3) {
      selectedRequest3.value = requests3.value.find((request3) => {
        return request3.id == quickCode.value.request_3.id;
      });
      resolve();
    }
  });
};

// EXPOSE
defineExpose({
  onSubmit,
  onCancel,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    isFormDirty.value = value.dirty;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  optionSetsStore
    .getOptionSetValuesFromApi("service_direction")
    .then((data) => {
      directions.value = data;
    });
  optionSetsStore
    .getOptionSetValuesFromApi("service_channel")
    .then((data) => (channels.value = data));
  optionSetsStore
    .getOptionSetValuesFromApi("service_urgent")
    .then((data) => (urgencies.value = data));
  optionSetsStore
    .getOptionSetValuesFromApiRaw("service_area")
    .then((data) => (areas.value = data));

  getQuickCodes().then((data) => {
    quickCodes.value = data.data;
  });
});
</script>

<style scoped lang="scss"></style>
