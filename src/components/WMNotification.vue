<template>
  <div class="flex flex-column gap-2">
    <div class="flex align-items-center gap-2">
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="6" cy="6" r="6" fill="#1EA2CE" />
      </svg>

      <span class="h5 text-xl">{{ notification.topic }} title</span>
      <WMImportantState v-if="notification.important === 1" :important="1" />
    </div>
    <p class="secondary-typography text-base">{{ notification.message }} message</p>
    <WMButton text="Mark as read" type="type-5" size="small" @click="closeNotification" />
    <div class="text-gray-500 font-bold">Read <i class="pi pi-check"></i></div>
  </div>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  notification: Object,
});

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
