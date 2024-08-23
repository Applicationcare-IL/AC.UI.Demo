<template>
  <div class="flex flex-column gap-3">

    <WMInputSearch
        v-model="selectedArea"
        name="service_area"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-service-area')"
        :label="$t('message.service-area') + ':'"
        :options="areas"
        :value="props.message.service_area"
        size="md"
        @change="handleAreasChange"
    />
    <pre>{{ props.message.service_area }}</pre>
    <WMInputSearch
        v-model="selectedType"
        name="service_type"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-service-detail')"
        :label="$t('message.service-detail') + ':'"
        :options="types"
        size="md"
        :disabled="isTypeEmpty"
        @change="handleTypesChange"
    />

    <WMInputSearch
        v-model="selectedRequest1"
        name="service_request_1"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-request') + ' 1'"
        :label="$t('message.request') + ' 1:'"
        :options="requests1"
        size="md"
        :disabled="isRequest1Empty"
        @change="handleRequest1Change"
    />

    <WMInputSearch
        v-model="selectedRequest2"
        name="service_request_2"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-request') + ' 2'"
        :label="$t('message.request') + ' 2:'"
        :options="requests2"
        size="md"
        :disabled="isRequest2Empty"
        @change="handleRequest2Change"
    />

    <WMInputSearch
        v-model="selectedRequest3"
        name="service_request_3"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-request') + ' 3'"
        :label="$t('message.request') + ' 3:'"
        :options="requests3"
        :disabled="isRequest3Empty"
        size="md"
    />

  </div>
</template>

<script setup>
// IMPORTS
import {onMounted, ref} from "vue";

import {useOptionSetsStore} from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  message: {
    type: Object,
    default: null,
  }
});

// REFS
const areas = ref([]);
const types = ref([]);
const requests1 = ref([]);
const requests2 = ref([]);
const requests3 = ref([]);

const selectedArea = ref(null);
const selectedType = ref(null);
const selectedRequest1 = ref(null);
const selectedRequest2 = ref(null);
const selectedRequest3 = ref(null);

const isTypeEmpty = ref(true);
const isRequest1Empty = ref(true);
const isRequest2Empty = ref(true);
const isRequest3Empty = ref(true);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = () => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("service_area")
      .then((data) => (areas.value = data));
}

const filterTypes = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("service_type", value)
      .then((data) => (types.value = data));
  isTypeEmpty.value = false;
};

const filterRequests1 = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("service_request_1", value)
      .then((data) => (requests1.value = data));
  isRequest1Empty.value = false;
};

const filterRequests2 = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("service_request_2", value)
      .then((data) => (requests2.value = data));
  isRequest2Empty.value = false;
};

const filterRequests3 = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("service_request_3", value)
      .then((data) => (requests3.value = data));
  isRequest3Empty.value = false;
};

const clearTypes = () => {
  types.value = [];
  selectedType.value = null;
  isTypeEmpty.value = true;
}

const clearRequest1 = () => {
  requests1.value = [];
  selectedRequest1.value = null;
  isRequest1Empty.value = true;
}

const clearRequest2 = () => {
  requests2.value = [];
  selectedRequest2.value = null;
  isRequest2Empty.value = true;
}

const clearRequest3 = () => {
  requests3.value = [];
  selectedRequest3.value = null;
  isRequest3Empty.value = true;
}

const handleAreasChange = (option) => {
  if (!option) {
    clearTypes();
    clearRequest1();
    clearRequest2();
    clearRequest3();
    return;
  }
  filterTypes(option.value.id);
};

const handleTypesChange = (option) => {
  if (!option) {
    clearRequest1();
    clearRequest2();
    clearRequest3();
    return;
  }
  filterRequests1(option.value.id);
};

const handleRequest1Change = (option) => {
  if (!option) {
    clearRequest2();
    clearRequest3();
    return;
  }
  filterRequests2(option.value.id);
};

const handleRequest2Change = (option) => {
  if (!option) {
    clearRequest3();
    return;
  }
  filterRequests3(option.value.id);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});

</script>

<style scoped></style>
