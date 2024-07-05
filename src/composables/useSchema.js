import { useSchemaStore } from "@/stores/schemaStore";

export function useSchema() {
  const schemaStore = useSchemaStore();

  const { getEasymazeEntitiesList } = useAdminSystem();

  const fetchAvailableEntities = async () => {
    const entities = await getEasymazeEntitiesList();
    return entities.data.map((entity) => entity.name);
  };

  const getSchemaFields = async (entity_type, deep = false) => {
    // get the schema
    let fullSchema = await schemaStore.getSchema();
    fullSchema = Object.keys(fullSchema).map((key) => fullSchema[key])[0];

    // get the schema of the selected entity
    let entitySchema = fullSchema.filter((item) => {
      return item.entity === entity_type;
    })[0].schema;

    // option set schema
    let optionSetSchema = fullSchema.filter((item) => {
      return item.entity === "option_set_value";
    })[0].schema;

    // filter the fields that are not of type relationship
    let result = Object.keys(entitySchema).filter(
      (key) => entitySchema[key].type !== "relationship"
    );

    // remove "id" from result
    result = result.filter((field) => field !== "id");

    // add the fields of type option_set_value
    Object.keys(entitySchema).forEach((key) => {
      if (entitySchema[key].entity === "option_set_value") {
        let optionSetValueFields = getOptionSetValueFields(key, optionSetSchema);
        result = result.concat(optionSetValueFields);
      }
    });

    // add the fields of type relationship but entity not "option_set_value"
    if (deep) {
      await Promise.all(
        Object.keys(entitySchema).map(async (key) => {
          if (
            entitySchema[key].type === "relationship" &&
            entitySchema[key].entity !== "option_set_value"
          ) {
            let relatedEntityFields = await getEntityFields(key, fullSchema);
            result = result.concat(relatedEntityFields);
          }
        })
      );
    }

    return result;
  };

  const getOptionSetValueFields = (key, optionSetSchema) => {
    let result = Object.keys(optionSetSchema).map((field) => {
      return `${key}.${field}`;
    });

    return result;
  };

  const getEntityFields = async (key) => {
    let result = await getSchemaFields(key);

    result = result.map((field) => {
      return `${key}.${field}`;
    });

    return result;
  };

  // const mapSchema = async (schemaObject) => {
  //   let availableEntites = await fetchAvailableEntities();
  //   let schema = Object.keys(schemaObject);

  //   console.log("schema", schema);

  //   // const result = Object.keys(schema).filter(
  //   //   (key) => !availableEntites.includes(schema[key].type)
  //   // );

  //   return schema;
  // };

  return {
    // ACTIONS
    getSchemaFields,
  };
}
