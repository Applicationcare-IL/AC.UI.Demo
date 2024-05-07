<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :header="$t('task.payment-request-task-title')"
    :style="{ minWidth: '30vw' }"
  >
    <!-- <pre>    {{ task }}</pre> -->

    <div class="flex flex-column gap-2 align-items-end mb-3">
      <WMInput
        :value="selectedProject"
        name="frecuency"
        type="input-select"
        :highlighted="true"
        :label="$t('project.project') + ':'"
        :options="contactProjects"
        custom-option-label="project_name"
        width="350"
        @update:selected-item="onProjectChange"
      />

      <WMInput
        :value="selectedRole"
        name="frecuency"
        type="input-select"
        :highlighted="true"
        :label="$t('project.role_in_project') + ':'"
        :options="contactRolesInProject"
        custom-option-label="project_name"
        width="350"
        @update:selected-item="onProjectChange"
      />
    </div>

    <div class="flex flex-row gap-2 justify-content-end">
      <WMInput
        name="id"
        type="info"
        :highlighted="true"
        :label="$t('payments.remains-to-be-paid') + ':'"
        :value="remainsToBePaid"
      />
      <WMInput
        name="id"
        type="info"
        :highlighted="true"
        :label="$t('payments.paid-so-far') + ':'"
        :value="paidSoFar"
      />
    </div>

    <div class="flex flex-row gap-2 justify-content-end">
      <WMInput
        name="invoice_type"
        type="input-select-button"
        :highlighted="true"
        :label="$t('payments.invoice-type') + ':'"
        :options="invoiceTypeOptions"
        :value="selectedInvoiceType"
        width="80"
        @update:selected-item="onInvoiceTypeChange"
      />
    </div>

    <div class="flex flex-row gap-2 justify-content-end">
      <WMInput
        v-model="invoiceNumber"
        type="input-text"
        name="invoice_number"
        :label="$t('payments.invoice-number') + ':'"
        @change="onInvoiceNumberChange"
      />

      <WMInputCurrency
        v-model="amount"
        :label="$t('payments.amount') + ':'"
        required
        name="amount"
      />
    </div>

    <div class="flex justify-content-end gap-2 mt-5">
      <Button
        type="button"
        :label="$t('buttons.cancel')"
        severity="secondary"
        @click="modelValue = false"
      />
      <Button
        type="button"
        :label="$t('task.create-payment-request')"
        @click="handleCreatePaymentRequestTask"
      />
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const modelValue = defineModel();

const selectedProject = ref("");
const selectedRole = ref("");
const contactProjects = ref([]);
const contactRolesInProject = ref([]);
const invoiceNumber = ref("");
const amount = ref(0);

const invoiceTypeOptions = [
  { id: 1, name: "Factura" },
  { id: 2, name: "Recibo" },
];

const selectedInvoiceType = ref(invoiceTypeOptions[0]);

const remainsToBePaid = ref(0);
const paidSoFar = ref(0);

const emit = defineEmits("requestPaymentTaskCreated");

const props = defineProps({
  task: Object,
});

const { getProjectsFromApi, getProjectTeamRoles } = useProjects();

const handleCreatePaymentRequestTask = () => {
  console.log("Create payment request task");
  modelValue.value = false;
  emit("requestPaymentTaskCreated", 1);
};

const loadContactProjects = () => {
  getProjectsFromApi({ contact: props.task.contact.id }).then((projects) => {
    contactProjects.value = projects.projects;
    selectedProject.value = projects.projects[0];

    loadContactRolesInProject();
  });
};

const loadContactRolesInProject = () => {
  let params = {
    contact: props.task.contact.id,
    project: selectedProject.value.id,
  };

  getProjectTeamRoles(selectedProject.value.id, params).then((roles) => {
    contactRolesInProject.value = roles.roles;
    selectedRole.value = roles.roles[0];
  });
};

const refreshData = () => {
  loadContactProjects();
};

const onProjectChange = (project) => {
  selectedProject.value = project;
};

const onInvoiceTypeChange = (invoiceType) => {
  selectedInvoiceType.value = invoiceType;
};

const onInvoiceNumberChange = (event) => {
  invoiceNumber.value = event.target.value;
};

watch(
  () => modelValue.value,
  (boolean) => {
    if (boolean) {
      refreshData();
    }
  }
);
</script>
