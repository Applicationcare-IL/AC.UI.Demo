<template>
  <Column
    v-for="column in columns"
    :key="column.name"
    :field="column.name"
    :header="$t(column.header)"
    :class="column.class"
    :style="column.width ? { width: column.width } : {}"
  >
    <template #body="{ data }">
      <WMRenderTableFieldBody v-model="data[column.field]" :column-data="column" />
    </template>
    <template #editor="{ data }">
      <WMRenderTableFieldEditor
        v-if="column.editable"
        v-model="data[column.field]"
        :column-data="column"
      />
      <WMRenderTableFieldBody v-else v-model="data[column.field]" :column-data="column" />
    </template>
  </Column>
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
