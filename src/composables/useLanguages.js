import { useI18n } from "vue-i18n";
import { computed } from "vue";

export function useLanguages() {
  const { locale } = useI18n();

  const optionLabelWithLang = computed(() => {
    return `value_${locale.value}`;
  });

  return {
    optionLabelWithLang,
  };
}
