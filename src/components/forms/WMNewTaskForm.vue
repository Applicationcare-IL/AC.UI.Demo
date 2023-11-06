<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t("new", ["task.task"]) }}</h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            name="owner"
            type="info"
            :highlighted="true"
            :label="$t('owner') + ':'"
            value="שרוליק כהן"
          />
          <WMInput
            name="id"
            type="info"
            :highlighted="true"
            :label="$t('team') + ':'"
            value="שיפור פני העיר"
          />
        </div>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <div class="flex flex-row gap-2 align-items-end">
          <WMInputSearch
            name="contact"
            :required="true"
            :placeholder="$t('select', ['contact'])"
            type="input-search"
            :label="$t('contact') + ':'"
            width="152"
            :options="customers"
            :highlighted="true"
          />
          <WMButton class="small" name="new" icon="new" @click=""
            >{{ $t("new") }} / NEW</WMButton
          >
        </div>
        <WMInputSearch
          name="customer"
          :required="true"
          :placeholder="$t('select', ['customer'])"
          type="input-search"
          :label="$t('customer') + ':'"
          width="200"
          :options="customers"
          :highlighted="true"
        />
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <WMInputSearch
          name="task-type"
          :required="true"
          :placeholder="$t('select', ['task.type'])"
          type="input-search"
          :label="$t('task.type') + ':'"
          width="200"
          :options="customers"
          :highlighted="true"
        />
        <WMInputSearch
          name="task-family"
          :required="true"
          :placeholder="$t('select', ['task.family'])"
          type="input-search"
          :label="$t('task.family') + ':'"
          width="200"
          :options="customers"
          :highlighted="true"
        />
      </div>
      <Divider class="mb-0" layout="horizontal" />
      <div class="task-description flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t("description") }}</h2>
        <div class="wm-form-row gap-5">
          <Textarea v-model="value" autoResize rows="8" cols="100" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import WMInput from "@/components/forms/WMInput.vue";
import WMInputSearch from "@/components/forms/WMInputSearch.vue";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useForm } from "vee-validate";
import { CustomerService } from "@/service/CustomerService";

const customers = ref();

onMounted(() => {
  CustomerService.getCustomers().then((data) => (customers.value = data));
});

const formUtilsStore = useFormUtilsStore();

const { errors, handleSubmit } = useForm({
  validationSchema: formUtilsStore.getTaskFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  console.log(values);
});

formUtilsStore.submit = onSubmit;
</script>

<style scoped lang="scss"></style>
