export default function parseTask(task) {
  return {
    task_type: task["task-type"].id,
    description: task.description,
    due_date: task.due_date,
    started_at: task.started_at,
    customer_id: task.customer.id,
    contact_id: task.contact.id,
    entity_type: task.entity_type ? task.entity_type.type : null,
    entity_id: task.entity_id ? task.entity_id.id : null,
  };
}
