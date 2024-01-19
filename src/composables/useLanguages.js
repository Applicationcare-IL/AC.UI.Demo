import { computed } from "vue";
import { useI18n } from "vue-i18n";

export function useLanguages() {
  const { locale } = useI18n();

  const optionLabelWithLang = computed(() => {
    return `value_${locale.value}`;
  });

  return {
    optionLabelWithLang,
  };
}
