<template>
  <div class="flex flex-column gap-3">

    <WMInput
        name="service_area"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-service-area')"
        :label="$t('message.service-area') + ':'"
        :options="[]"
        custom-option-label=""
        size="md"
    />

    <WMInput
        name="service_type"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-service-detail')"
        :label="$t('message.service-detail') + ':'"
        :options="[]"
        custom-option-label=""
        size="md"
    />

    <WMInput
        name="service_request_1"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-request') + ' 1'"
        :label="$t('message.request') + ' 1:'"
        :options="[]"
        custom-option-label=""
        size="md"
    />

    <WMInput
        name="service_request_2"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-request') + ' 2'"
        :label="$t('message.request') + ' 2:'"
        :options="[]"
        custom-option-label=""
        size="md"
    />

    <WMInput
        name="service_request_3"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-request') + ' 3'"
        :label="$t('message.request') + ' 3:'"
        :options="[]"
        custom-option-label=""
        size="md"
    />

  </div>

  <Divider/>

  <div class="flex flex-column gap-3">

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
</template>

<script setup>
// IMPORTS
import {ref} from "vue";
import {useOptionSetsStore} from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS

// REFS
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


// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
