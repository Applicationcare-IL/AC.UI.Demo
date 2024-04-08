<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-5">
      <div class="flex flex-row gap-3 align-items-center">
        <div class="label h5">בחירaaaת צוותים:</div>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="searchValue"
            class="input-search"
            placeholder="Search"
          />
        </span>
        <WMButton class="m-1 col-6 small" name="basic-primary"
          >בחר הכל
        </WMButton>
        <WMButton class="m-1 col-6 small" name="basic-secondary">{{
          $t("buttons.clear-all")
        }}</WMButton>
      </div>
      <div class="flex flex-row gap-3">
        <Tag>
          <div class="flex align-items-center gap-2">
            <span class="">מוקד 106</span>
            <i class="pi pi-times"></i>
          </div>
        </Tag>
        <Tag>
          <div class="flex align-items-center gap-2">
            <span class="">אגף רישוי ופיקוח (הנדסה)</span>
            <i class="pi pi-times"></i>
          </div>
        </Tag>
        <Tag>
          <div class="flex align-items-center gap-2">
            <span class="">GIS</span>
            <i class="pi pi-times"></i>
          </div>
        </Tag>
        <Tag>
          <div class="flex align-items-center gap-2">
            <span class="">גביה</span>
            <i class="pi pi-times"></i>
          </div>
        </Tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const searchValue = ref("");
</script>

<style scoped lang="scss"></style>
