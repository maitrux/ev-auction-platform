"use client";

import { createVehicleAction } from "@/lib/server/vehicle-actions";
import {
  hasFormErrors,
  validateVehicleForm,
  type VehicleFormErrors,
} from "@/lib/vehicle-form-validation";
import {
  toCreateVehicleInput,
  type VehicleFormState,
} from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddVehicleDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialForm: VehicleFormState = {
  vin: "",
  make: "",
  model: "",
  year: "",
  mileage: "",
  batteryCapacityKwh: "",
  batterySoH: "",
  rangeKm: "",
  registrationDate: "",
  condition: "GOOD",
  conditionNotes: "",
  photos: "",
  city: "",
  country: "",
};

export function AddVehicleDialog({ open, onClose }: AddVehicleDialogProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<VehicleFormErrors>({});

  if (!open) {
    return null;
  }

  function clearFieldError(name: keyof VehicleFormState) {
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    clearFieldError(name as keyof VehicleFormState);
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationErrors = validateVehicleForm(form);

    if (hasFormErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      setError("Please fix the highlighted fields.");
      return;
    }

    setFieldErrors({});

    const result = await createVehicleAction(toCreateVehicleInput(form));

    if (!result.success) {
      setFieldErrors(result.fieldErrors ?? {});
      setError(result.message);
      return;
    }

    setForm(initialForm);
    setFieldErrors({});
    onClose();
    router.refresh();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
        noValidate
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Add vehicle</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="VIN"
            name="vin"
            value={form.vin}
            onChange={handleChange}
            error={fieldErrors.vin}
          />

          <Input
            label="Make"
            name="make"
            value={form.make}
            onChange={handleChange}
            error={fieldErrors.make}
          />

          <Input
            label="Model"
            name="model"
            value={form.model}
            onChange={handleChange}
            error={fieldErrors.model}
          />

          <Input
            label="Year"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            error={fieldErrors.year}
          />

          <Input
            label="Mileage"
            name="mileage"
            type="number"
            value={form.mileage}
            onChange={handleChange}
            error={fieldErrors.mileage}
          />

          <Input
            label="Battery capacity (kWh)"
            name="batteryCapacityKwh"
            type="number"
            value={form.batteryCapacityKwh}
            onChange={handleChange}
            error={fieldErrors.batteryCapacityKwh}
          />

          <Input
            label="Battery SoH (%)"
            name="batterySoH"
            type="number"
            value={form.batterySoH}
            onChange={handleChange}
            error={fieldErrors.batterySoH}
          />

          <Input
            label="Range (km)"
            name="rangeKm"
            type="number"
            value={form.rangeKm}
            onChange={handleChange}
            error={fieldErrors.rangeKm}
          />

          <Input
            label="Registration date"
            name="registrationDate"
            type="date"
            value={form.registrationDate}
            onChange={handleChange}
            error={fieldErrors.registrationDate}
          />

          <Input
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            error={fieldErrors.city}
          />

          <Input
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            error={fieldErrors.country}
          />

          <SelectField
            label="Condition"
            name="condition"
            value={form.condition}
            onChange={handleChange}
            error={fieldErrors.condition}
          >
            <option value="EXCELLENT">Excellent</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
          </SelectField>
        </div>

        <div className="mt-4">
          <TextareaField
            label="Condition notes"
            name="conditionNotes"
            value={form.conditionNotes}
            onChange={handleChange}
            error={fieldErrors.conditionNotes}
          />
        </div>

        <div className="mt-4">
          <Input
            label="Photos (comma separated URLs)"
            name="photos"
            value={form.photos}
            onChange={handleChange}
            error={fieldErrors.photos}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add vehicle
          </button>
        </div>
      </form>
    </div>
  );
}

function fieldClassName(hasError: boolean) {
  return hasError
    ? "w-full rounded border border-red-500 px-3 py-2 focus:border-red-500 focus:outline-none"
    : "w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none";
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p
      id={id}
      className="mt-1 text-sm text-red-600"
    >
      {message}
    </p>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
}) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={fieldClassName(Boolean(error))}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />

      <FieldError
        id={errorId}
        message={error}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  children,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  children: React.ReactNode;
}) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={fieldClassName(Boolean(error))}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      >
        {children}
      </select>

      <FieldError
        id={errorId}
        message={error}
      />
    </div>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={fieldClassName(Boolean(error))}
        rows={3}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />

      <FieldError
        id={errorId}
        message={error}
      />
    </div>
  );
}
