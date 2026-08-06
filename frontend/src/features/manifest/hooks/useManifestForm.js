import { useState } from "react";
import { MANIFEST_DEFAULT_FORM, MANIFEST_STATUS_OPTIONS } from "../constants";

function cloneDefaultForm() {
  return { ...MANIFEST_DEFAULT_FORM };
}

function validateManifestForm(form) {
  const errors = [];
  const labels = {
    manifestNo: "Manifest No",
    date: "Tanggal",
    driver: "Driver",
    nopol: "Nopol",
    status: "Status",
  };

  Object.keys(labels).forEach((field) => {
    if (String(form[field] ?? "").trim() === "") {
      errors.push(`${labels[field]} wajib diisi`);
    }
  });

  if (form.date && Number.isNaN(new Date(`${form.date}T00:00:00`).getTime())) {
    errors.push("Tanggal tidak valid");
  }

  if (
    form.status &&
    !MANIFEST_STATUS_OPTIONS.some((option) => option.value === form.status)
  ) {
    errors.push("Status tidak valid");
  }

  return errors;
}

export default function useManifestForm({ onSubmit } = {}) {
  const [form, setForm] = useState(cloneDefaultForm);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setForm(cloneDefaultForm());
    setErrors([]);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event?.preventDefault?.();

    const nextErrors = validateManifestForm(form);
    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return false;
    }

    setSubmitting(true);
    try {
      await onSubmit?.({ ...form });
      resetForm();
      return true;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    form,
    errors,
    submitting,
    setForm,
    setErrors,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
