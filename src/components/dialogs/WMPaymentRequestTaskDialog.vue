<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :header="$t('task.payment-request-task-title')"
    :style="{ minWidth: '30vw' }"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex flex-column gap-4">
      <div class="flex flex-column gap-2 mb-3">
        <WMInput
          :value="selectedProject"
          name="payment-request-project"
          type="input-select"
          :highlighted="true"
          :label="$t('project.project') + ':'"
          :options="contactProjects"
          custom-option-label="project_name"
          width="350"
          required
          @update:selected-item="onProjectChange"
        />

        <WMInput
          :value="selectedRole"
          name="payment-request-role"
          type="input-select"
          :highlighted="true"
          :label="$t('project.role_in_project') + ':'"
          :options="contactRolesInProject"
          width="350"
          option-set
          required
          @update:selected-item="onRoleChange"
        />
      </div>

      <div class="flex flex-row gap-6">
        <WMInputCurrency
          v-model="remainsToBePaid"
          :label="$t('payments.remains-to-be-paid') + ':'"
          :read-only="true"
          name="remains-to-be-paid"
          :small="true"
        />

        <WMInputCurrency
          v-model="paidSoFar"
          :label="$t('payments.paid-so-far') + ':'"
          :read-only="true"
          name="paid-so-far"
          :small="true"
        />
      </div>

      <div class="flex flex-row gap-2">
        <WMInput
          name="invoice_type"
          type="input-select-button"
          :highlighted="true"
          :label="$t('payments.invoice-type') + ':'"
          :options="invoiceTypeOptions"
          :value="selectedInvoiceType"
          width="80"
          required
          @update:selected-item="onInvoiceTypeChange"
        />
      </div>

      <div class="flex flex-row gap-2">
        <WMInput
          v-model="invoiceNumber"
          type="input-text"
          name="invoice_number"
          width="200"
          :label="$t('payments.invoice-number') + ':'"
          @change="onInvoiceNumberChange"
        />

        <WMInputCurrency
          v-model="amount"
          :label="$t('payments.amount') + ':'"
          required
          name="amount"
        />

        <WMInput
          v-model="paymentDate"
          :value="paymentDate"
          name="payment_date"
          type="date"
          :label="$t('payments.invoice-date') + ':'"
          required
        />
      </div>

      <div class="flex-row gap-2" :class="file ? 'hidden' : 'flex'">
        <input
          ref="fileInput"
          type="file"
          style="display: none"
          multiple
          @change="handleFileChange"
        />

        <WMTempButton
          :text="$t('buttons.upload-file')"
          type="type-3"
          size="small"
          @click="openUploadAttachment"
        >
          <template #customIcon>
            <div class="flex" v-html="AttachIcon" />
          </template>
        </WMTempButton>
      </div>

      <div v-if="file" class="flex flex-column gap-2">
        <div class="flex w-full gap-3 flex-column">
          <div
            class="attachment flex w-full justify-content-between pl-3 align-items-center justify-content-center"
          >
            <span class="font-semibold">
              {{ file.name }}
            </span>
            <Button link @click="removeFile()"
              ><svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="p-icon p-dialog-header-close-icon"
                aria-hidden="true"
                data-pc-section="closebuttonicon"
              >
                <path
                  d="M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z"
                  fill="black"
                ></path></svg
            ></Button>
          </div>
        </div>
      </div>

      <div class="flex gap-2 mt-5 justify-content-end">
        <WMTempButton
          :text="$t('buttons.cancel')"
          type="type-3"
          :is-active="false"
          @click="modelValue = false"
        />
        <WMTempButton
          :text="$t('task.create-payment-request')"
          type="type-4"
          :is-active="false"
          @click="handleCreatePaymentRequestTask"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import AttachIcon from "/icons/attach_file_default.svg?raw";
import { useLayout } from "@/layout/composables/layout";
import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const { getProjectsFromApi, getProjectTeamRoles } = useProjects();
const { layoutConfig } = useLayout();
const { createTask, parseTask, getPaymentTaskInfo } = useTasks();
const { t } = useI18n();
const { uploadAttachment } = useAttachments();
const { formatDate } = useDates();
const formUtilsStore = useFormUtilsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  task: Object,
});

const emit = defineEmits("requestPaymentTaskCreated");

// REFS
const modelValue = defineModel();

const selectedProject = ref("");
const selectedRole = ref("");
const selectedProjectTeam = ref("");
const contactProjects = ref([]);
const contactRolesInProject = ref([]);
const invoiceNumber = ref("");
const amount = ref(0);
const paymentDate = ref(new Date());

const fileInput = ref(null);
const file = ref();
const taskInfo = ref();

const invoiceTypeOptions = [
  { value: "invoice", name: t("payments.invoice") },
  { value: "proforma_invoice", name: t("payments.proforma-invoice") },
];
const selectedInvoiceType = ref(invoiceTypeOptions[0]);

const remainsToBePaid = ref(0);
const paidSoFar = ref(0);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit } = useForm({
  validationSchema: formUtilsStore.getPaymentRequestTaskFormValidationSchema,
});

const handleCreatePaymentRequestTask = () => {
  const payment = {
    project_team: selectedProjectTeam.value,
  };

  if (selectedInvoiceType.value.value === "invoice") {
    payment.invoice_number = invoiceNumber.value;
    payment.amount_paid = amount.value;
    payment.invoice_date = formatDate(paymentDate.value);
  } else {
    payment.proforma_invoice_number = invoiceNumber.value;
    payment.proforma_invoice_amount = amount.value;
    payment.proforma_invoice_date = formatDate(paymentDate.value);
  }

  const task = {
    ...props.task,
    payment,
  };

  taskInfo.value = task;

  onSave();
};

const onSave = handleSubmit((values) => {
  console.log("values", values);

  createTask(parseTask(taskInfo.value))
    .then(async (response) => {
      modelValue.value = false;

      await uploadPaymentAttachment(response.data.payment_id);

      emit("requestPaymentTaskCreated", response.data.id);
    })
    .catch((error) => {
      console.error(error);
    });
});

const uploadPaymentAttachment = async (paymentId) => {
  const formData = new FormData();

  formData.append("file", file.value);
  formData.append("entity_type", "payment");
  formData.append("entity_id", paymentId);
  formData.append("field", selectedInvoiceType.value.value);

  await uploadAttachment(formData);
};

const loadContactProjects = () => {
  let params = {
    project_team: `${props.task.customer.id},${props.task.contact.id}`,
  };

  getProjectsFromApi(params).then((projects) => {
    contactProjects.value = projects.projects;
    selectedProject.value = projects.projects[0];

    loadContactRolesInProject(selectedProject.value.id);
  });
};

const loadContactRolesInProject = () => {
  let params = {
    contact: props.task.contact.id,
    customer: props.task.customer.id,
    project: selectedProject.value.id,
  };

  getProjectTeamRoles(selectedProject.value.id, params).then((roles) => {
    contactRolesInProject.value = roles;
    selectedRole.value = roles[0];
    loadPaymentTaskInfo();
  });
};

const refreshData = () => {
  loadContactProjects();
};

const onProjectChange = (project) => {
  selectedProject.value = project;
  loadContactRolesInProject(project.id);
};

const onRoleChange = (role) => {
  selectedRole.value = role;

  loadPaymentTaskInfo();
};

const loadPaymentTaskInfo = () => {
  let params = {
    project_id: selectedProject.value.id,
    contact_id: props.task.contact.id,
    customer_id: props.task.customer.id,
    role_project_id: selectedRole.value.id,
  };

  getPaymentTaskInfo(params).then((info) => {
    remainsToBePaid.value = info.contract_amount_remaining;
    paidSoFar.value = info.contract_amount_paid;
    selectedProjectTeam.value = info.project_team_id;
  });
};

const onInvoiceTypeChange = (invoiceType) => {
  selectedInvoiceType.value = invoiceType;
};

const onInvoiceNumberChange = (event) => {
  invoiceNumber.value = event.target.value;
};

const handleFileChange = (event) => {
  file.value = event.target.files[0];
};

const removeFile = () => {
  file.value = null;
};

const openUploadAttachment = () => {
  fileInput.value.click();
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => modelValue.value,
  (boolean) => {
    if (boolean) {
      refreshData();
    }
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
