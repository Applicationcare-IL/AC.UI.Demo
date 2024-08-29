<template>
  <div class="flex flex-column gap-5">
    <div class="wm-form-row gap-5">
      <WMInput
        name="id"
        type="info"
        :highlighted="true"
        :label="$t('id') + ':'"
        :value="product.id"
      />
    </div>
    <div class="wm-form-row gap-5">
      <WMInput
        name="name"
        required
        type="input-text"
        :label="$t('product.name') + ':'"
        size="md"
        :value="product.name"
      />
      <WMInput
        name="information_page"
        required
        type="input-text"
        :label="$t('product.information-page') + ':'"
        size="md"
        :value="product.information_page"
      />
    </div>
    <div class="wm-form-row gap-5">
      <WMInput
        id="description"
        type="text-area"
        :label="$t('description') + ':'"
        name="description"
        size="lg"
        required
        :value="product.description"
      />
    </div>
    <div class="wm-form-row flex flex-wrap gap-5">
      <WMInput
        v-if="units"
        name="units"
        :highlighted="true"
        type="input-select"
        :label="$t('product.units') + ':'"
        :options="units"
        :placeholder="$t('select', ['unit'])"
        size="sm"
        option-set
        data-testid="product.form.units"
        required
      />

      <WMInput
        v-if="manufacturerTypes"
        name="manufacturer_type"
        :highlighted="true"
        type="input-select"
        :label="$t('product.manufacturer-type') + ':'"
        :options="manufacturerTypes"
        :placeholder="$t('select', ['product.manufacturer-type'])"
        size="sm"
        option-set
        data-testid="product.form.manufacturer-type"
        required
      />

      <WMInput
        v-if="customers"
        name="manufacturer"
        :highlighted="true"
        type="input-select"
        :label="$t('product.manufacturer') + ':'"
        :options="customers"
        :placeholder="$t('select', ['product.manufacturer'])"
        size="sm"
        data-testid="product.form.manufacturer"
        required
      />

      <WMInput
        name="existing_product"
        type="input-select-button"
        :highlighted="true"
        :label="$t('product.existing-product') + ':'"
        :options="yesNoOptions"
        :value="yesNoOptions[1]"
        width="80"
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
