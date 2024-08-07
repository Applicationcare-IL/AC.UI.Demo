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
          :label="$t('contact.contact') + ':'"
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
          <template v-if="can('contacts.create')">
            <WMNewEntityFormHeader entity="contact" name="newContact" />
            <WMNewContactForm
              :is-sidebar="true"
              :show-confirm-dialog="false"
              @close-sidebar="closeNewContactSidebar"
              @contact-created="handleContactCreated"
            />
          </template>
          <template v-else>
            <div class="m-5">
              {{ $t("permissions.you-dont-have-permission") }}
            </div>
          </template>
        </WMSidebar>

        <WMInputSearch
          name="customer"
          :required="true"
          :placeholder="$t('select', ['customer'])"
          type="input-search"
          :label="$t('customer.customer') + ':'"
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
          v-model="selectedDirection"
          name="direction"
          type="input-select"
          :highlighted="true"
          :label="$t('service.direction') + ':'"
          width="80"
          :options="directions"
          option-set
        />
        <WMInput
          v-model="selectedChannel"
          name="channel"
          type="input-select"
          :highlighted="true"
          :label="$t('channel') + ':'"
          :options="channels"
          option-set
          width="104"
        />
        <WMInput
          v-model="selectedUrgency"
          name="priority"
          type="input-select"
          :highlighted="true"
          :label="$t('priority') + ':'"
          :options="urgencies"
          width="104"
          option-set
        />
      </div>

      <template v-if="isRelatedService">
        <Divider layout="horizontal" />
        <div class="flex flex-auto flex-column gap-5">
          <h2 class="h2 mb-0">{{ $t("service.relation-type") }}</h2>
          <div class="wm-form-row gap-5">
            <WMInput
              v-model="selectedRelationType"
              :value="selectedRelationType"
              name="relation-type"
              type="input-select"
              :highlighted="true"
              :options="relationTypes"
              option-set
              width="200"
              @update:selected-item="onRelationTypeChange"
            />
          </div>
        </div>
      </template>

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
            option-set
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
            option-set
            @change="updateDropdown('service_request_1', $event.value.id, 'requests1')"
          />
          <WMInputSearch
            v-model="selectedRequest1"
            name="request1"
            :highlighted="true"
            :label="$t('classification-3') + ':'"
            :options="requests1"
            width="152"
            option-set
            :placeholder="$t('select', ['classification-3'])"
            required
            @change="updateDropdown('service_request_2', $event.value.id, 'requests2')"
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
            option-set
            :placeholder="$t('select', ['classification-4'])"
            @change="updateDropdown('service_request_3', $event.value.id, 'requests3')"
          />
          <WMInputSearch
            v-model="selectedRequest3"
            name="request_3"
            :highlighted="true"
            :label="$t('classification-5') + ':'"
            :options="requests3"
            width="152"
            option-set
            :placeholder="$t('select', ['classification-5'])"
          />
        </div>
      </div>
      <Divider class="mb-0" layout="horizontal" />
      <div class="service-description flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t("description") }}</h2>
        <div class="wm-form-row gap-5">
          <WMInput id="description" type="text-area" name="description" size="full" />
        </div>
      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" />
      <WMNewFormAddress :required-fields="['city', 'street']" />
      <Divider class="mt-5 mb-0" layout="horizontal" />
      <WMNewServiceFormSite />
    </div>
    <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
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
const { can } = usePermissions();

// INJECT
const isFormDirty = inject("isFormDirty");
const closeSidebar = inject("closeSidebar");
const preselectedContact = inject("preselectedContact", null);
const preselectedCustomer = inject("preselectedCustomer", null);
const preselectedRelationType = inject("preselectedRelationType", null);

// PROPS, EMITS
const props = defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
  relatedEntity: {
    type: String,
    default: "",
  },
  relatedEntityId: {
    type: Number,
    default: null,
  },
  isRelatedService: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["closeSidebar", "newServiceCreated"]);

// REFS
const directions = ref();
const channels = ref();
const urgencies = ref();

const selectedContact = ref();
const selectedCustomer = ref();

const relationTypes = ref();
const selectedRelationType = ref();

const ACTIVE_STATE_ID = ref();

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

const selectedDirection = ref();
const selectedChannel = ref();
const selectedUrgency = ref();

const optionRefs = {
  areas: areas,
  types: types,
  requests1: requests1,
  requests2: requests2,
  requests3: requests3,
};

const isNewContactSidebarVisible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC AND LOGIC
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
    state: ACTIVE_STATE_ID.value,
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
  const service = {
    ...values,
  };

  if (props.relatedEntity == "asset") {
    service.asset_id = props.relatedEntityId;
  }

  createService(parseService(service))
    .then((data) => {
      dialog.confirmNewService({ id: data.data.id, emit });

      emitNewServiceCreated(data.data.id);
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

const emitNewServiceCreated = (newServiceId) => {
  if (props.isRelatedService) {
    const data = {
      id: newServiceId,
      relationType: selectedRelationType.value,
    };

    emit("newServiceCreated", data);
    return;
  }

  emit("newServiceCreated", { id: newServiceId });
};

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
      return updateDropdown("service_request_1", quickCode.value.type.id, "requests1");
    })
    .then(() => {
      return setRequest1(quickCode);
    })
    .then(() => {
      return updateDropdown("service_request_2", quickCode.value.request_1.id, "requests2");
    })
    .then(() => {
      return setRequest2(quickCode);
    })
    .then(() => {
      return updateDropdown("service_request_3", quickCode.value.request_2.id, "requests3");
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

const onRelationTypeChange = (value) => {
  selectedRelationType.value = value;
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
  if (preselectedContact) {
    selectedContact.value = preselectedContact.value;
  }

  if (preselectedCustomer) {
    selectedCustomer.value = preselectedCustomer.value;
  }

  if (preselectedRelationType) {
    selectedRelationType.value = preselectedRelationType.value;
  }

  optionSetsStore.getOptionSetValuesFromApi("state").then((data) => {
    ACTIVE_STATE_ID.value = data.find((state) => state.value === "active").id;
  });

  const serviceDirectionOptionSets = optionSetsStore
    .getOptionSetValuesFromApi("service_direction")
    .then((data) => {
      directions.value = data;
      selectedDirection.value = data[0];
      isFormDirty.value = false;
    });

  const serviceChannelOptionSets = optionSetsStore
    .getOptionSetValuesFromApi("service_channel")
    .then((data) => {
      channels.value = data;
      selectedChannel.value = data[0];
      isFormDirty.value = false;
    });

  const serviceUrgencyOptionSets = optionSetsStore
    .getOptionSetValuesFromApi("service_urgent")
    .then((data) => {
      urgencies.value = data;
      selectedUrgency.value = data[0];
      isFormDirty.value = false;
    });

  const serviceAreaOptions = optionSetsStore
    .getOptionSetValuesFromApiRaw("service_area")
    .then((data) => (areas.value = data));

  const quickCodesPromise = getQuickCodes().then((data) => {
    quickCodes.value = data.data;
  });

  Promise.all([
    serviceDirectionOptionSets,
    serviceChannelOptionSets,
    serviceUrgencyOptionSets,
    serviceAreaOptions,
    quickCodesPromise,
  ]).then(() => {
    // let the components that depends of this data to be mounted first and do their stuff
    // this is only for the onMounted so I think it's ok to use a timeout here
    setTimeout(() => {
      isFormDirty.value = false;
    }, 1000);
  });

  if (props.isRelatedService) {
    optionSetsStore.getOptionSetValuesFromApi("service_related_relationship").then((data) => {
      relationTypes.value = data;

      if (!preselectedRelationType) {
        selectedRelationType.value = data[0];
      }
    });
  }
});
</script>

<style scoped lang="scss"></style>
