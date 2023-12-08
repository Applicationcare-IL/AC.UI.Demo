<template>
  <div class="flex-1 card-container top-info-card">
    <Card>
      {{ "site" }}
      {{ site }}
      <template #title>
        {{ $t("site.details") }}
      </template>
      <template #content>
        <div class="flex flex-auto flex-row gap-6">
          <div class="wm-form-column gap-5">
            <WMInput
              name="site-name"
              type="info"
              :highlighted="true"
              :label="$t('site.name') + ':'"
              :value="site.name"
            />
            <WMInput
              name="site-contact"
              type="info-link"
              :highlighted="true"
              :label="$t('site.contact') + ':'"
              :value="site.contact"
              :to="'/contact/' + site.contact_id"
            />
            <WMInput
              name="site-phone"
              type="info"
              :highlighted="true"
              :label="$t('site.phone') + ':'"
              :value="site.phone"
            />
          </div>
          <div class="wm-form-column gap-5">
            <WMInput
              name="site-type"
              type="info"
              :label="$t('site.type') + ':'"
              :value="site.type"
            >
            </WMInput>
            <WMInput
              name="site-contact-role"
              type="info"
              :label="$t('site.contact_role') + ':'"
              :value="site.contact_role"
            />
            <WMInput
              name="site-email"
              type="info"
              :highlighted="true"
              :label="$t('site.email') + ':'"
              :value="site.email"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
const { site } = defineProps({
  site: {
    type: Object,
    required: true,
  },
});
</script>
