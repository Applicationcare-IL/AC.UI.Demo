<template>
  <div class="mobile-topbar p-2">
    <div class="lang">
      <div class="flex flex-row gap-2">
        <i-button
          @click="
            loadLocaleMessages(i18n.global, 'en');
            setI18nLanguage(i18n.global, 'en');
            layoutConfig.isRTL.value = false;
          "
        >
          <span class="flag flag-gb"></span
        ></i-button>
        <i-button
          @click="
            loadLocaleMessages(i18n.global, 'he');
            setI18nLanguage(i18n.global, 'he');
            layoutConfig.isRTL.value = true;
          "
        >
          <span class="flag flag-il"></span
        ></i-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { i18n } from "@/i18n";
import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();
</script>

<style lang="scss" scoped>
.mobile-topbar {
  background: whitesmoke;
}

span.flag {
  width: 30px;
  height: 21px;
}
</style>
