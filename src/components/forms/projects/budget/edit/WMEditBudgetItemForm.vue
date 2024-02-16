<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">
        {{ $t("new", ["budget.budget-item"]) }}
      </h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <!-- <WMInput
            name="contractor"
            type="info-link"
            :highlighted="true"
            :label="$t('budget.budget') + ':'"
            :value="project.contractor?.name"
            :to="'/customer/' + project.contractor?.id"
          /> -->
        </div>
      </div>
      <Divider />
      <h2 class="h2 my-0">
        {{ $t("budget.budget-items-components-details") }}
      </h2>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMHighlightedBlock
            size="small"
            background-color="blue-200"
            :label="$t('budget.total') + ':'"
          />
        </div>
      </div>
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
import { computed, inject, onMounted, ref, watch } from "vue";
</script>

<style scoped lang="scss"></style>
