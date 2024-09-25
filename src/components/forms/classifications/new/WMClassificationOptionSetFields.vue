<template>
  <div class="wm-form-column flex flex-column gap-5">
    <div class="wm-form-row gap-5">
      <WMInput
        name="value"
        :required="true"
        type="input-text"
        size="md"
        :label="$t('classification.value') + ':'"
      />
    </div>
    <div class="wm-form-row gap-5">
      <WMInput
        name="value_he"
        :required="true"
        type="input-text"
        size="md"
        :label="$t('classification.value-he') + ':'"
      />
      <WMInput
        name="value_en"
        :required="true"
        type="input-text"
        size="md"
        :label="$t('classification.value-en') + ':'"
      />
    </div>
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
