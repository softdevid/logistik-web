export function makeForm(config, row) {
  const form = { ...config.emptyForm };
  if (!row) return form;

  config.fields.forEach((field) => {
    form[field.key] = row[field.key] ?? form[field.key];
  });

  return form;
}