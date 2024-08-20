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
        name="service_type_id"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-service-detail')"
        :label="$t('message.service-detail') + ':'"
        :options="[]"
        custom-option-label=""
        size="md"
    />

    <WMInput
        name="service_request_1_id"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-request') + ' 1'"
        :label="$t('message.request') + ' 1:'"
        :options="[]"
        custom-option-label=""
        size="md"
    />

    <WMInput
        name="service_request_2_id"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-request') + ' 2'"
        :label="$t('message.request') + ' 2:'"
        :options="[]"
        custom-option-label=""
        size="md"
    />

    <WMInput
        name="service_request_3_id"
        type="input-select"
        :highlighted="true"
        :placeholder="$t('message.select-request') + ' 3'"
        :label="$t('message.request') + ' 3:'"
        :options="[]"
        custom-option-label=""
        size="md"
    />

  </div>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
