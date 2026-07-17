import { getMaxDateInputValue } from "@/lib/format";
import type { VehicleFormErrors } from "@/lib/vehicle-form-validation";
import type { VehicleFormState } from "@/types";

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
  min,
  max,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  min?: string | number;
  max?: string | number;
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
        min={min}
        max={max}
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

interface VehicleFormFieldsProps {
  form: VehicleFormState;
  fieldErrors: VehicleFormErrors;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export function VehicleFormFields({
  form,
  fieldErrors,
  onChange,
}: VehicleFormFieldsProps) {
  const maxYear = new Date().getFullYear();
  const maxRegistrationDate = getMaxDateInputValue();

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="VIN"
          name="vin"
          value={form.vin}
          onChange={onChange}
          error={fieldErrors.vin}
        />

        <Input
          label="Make"
          name="make"
          value={form.make}
          onChange={onChange}
          error={fieldErrors.make}
        />

        <Input
          label="Model"
          name="model"
          value={form.model}
          onChange={onChange}
          error={fieldErrors.model}
        />

        <Input
          label="Year"
          name="year"
          type="number"
          value={form.year}
          onChange={onChange}
          max={maxYear}
          error={fieldErrors.year}
        />

        <Input
          label="Mileage (km)"
          name="mileage"
          type="number"
          value={form.mileage}
          onChange={onChange}
          error={fieldErrors.mileage}
        />

        <Input
          label="Battery capacity (kWh)"
          name="batteryCapacityKwh"
          type="number"
          value={form.batteryCapacityKwh}
          onChange={onChange}
          error={fieldErrors.batteryCapacityKwh}
        />

        <Input
          label="Battery SoH (%)"
          name="batterySoH"
          type="number"
          value={form.batterySoH}
          onChange={onChange}
          error={fieldErrors.batterySoH}
        />

        <Input
          label="Range (km)"
          name="rangeKm"
          type="number"
          value={form.rangeKm}
          onChange={onChange}
          error={fieldErrors.rangeKm}
        />

        <Input
          label="Registration date"
          name="registrationDate"
          type="date"
          value={form.registrationDate}
          onChange={onChange}
          max={maxRegistrationDate}
          error={fieldErrors.registrationDate}
        />

        <Input
          label="City"
          name="city"
          value={form.city}
          onChange={onChange}
          error={fieldErrors.city}
        />

        <Input
          label="Country"
          name="country"
          value={form.country}
          onChange={onChange}
          error={fieldErrors.country}
        />

        <SelectField
          label="Condition"
          name="condition"
          value={form.condition}
          onChange={onChange}
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
          onChange={onChange}
          error={fieldErrors.conditionNotes}
        />
      </div>

      <div className="mt-4">
        <Input
          label="Photos (comma separated URLs)"
          name="photos"
          value={form.photos}
          onChange={onChange}
          error={fieldErrors.photos}
        />
      </div>
    </>
  );
}
