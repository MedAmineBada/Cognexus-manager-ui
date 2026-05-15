import { useEffect, useState } from "react";
import { Icon } from "./icons";

const defaultForm = {
  serviceId: "",
  mode: "existing",
  serviceName: "",
  flagName: "",
  description: "",
  dependencies: "",
  enabled: true,
};

export default function FeatureModal({ open, services, onClose, onCreate }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) setForm(defaultForm);
  }, [open]);

  if (!open) return null;

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.name,
  }));

  const submit = (event) => {
    event.preventDefault();
    onCreate({
      ...form,
      dependencies: form.dependencies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-flag-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title" id="create-flag-title">
            New Flag
          </h2>
          <button className="modal__close" type="button" aria-label="Close" onClick={onClose}>
            <Icon name="chevron-right" />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="modal__body">
            <div className="field">
              <span className="field__label">Target</span>
              <select
                value={form.mode}
                onChange={(e) => setForm((prev) => ({ ...prev, mode: e.target.value }))}
              >
                <option value="existing">Add to existing service</option>
                <option value="new">Create new service</option>
              </select>
            </div>

            {form.mode === "existing" ? (
              <div className="field">
                <span className="field__label">Service</span>
                <select
                  value={form.serviceId}
                  onChange={(e) => setForm((prev) => ({ ...prev, serviceId: e.target.value }))}
                  required
                >
                  <option value="" disabled>
                    Choose a service
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="field">
                <span className="field__label">New service name</span>
                <input
                  value={form.serviceName}
                  onChange={(e) => setForm((prev) => ({ ...prev, serviceName: e.target.value }))}
                  placeholder="example-service"
                  required
                />
              </div>
            )}

            <div className="form-grid">
              <label className="field">
                <span className="field__label">Flag name</span>
                <input
                  value={form.flagName}
                  onChange={(e) => setForm((prev) => ({ ...prev, flagName: e.target.value }))}
                  placeholder="ENABLE_NEW_FLOW"
                  required
                />
              </label>

              <label className="field">
                <span className="field__label">Dependencies</span>
                <input
                  value={form.dependencies}
                  onChange={(e) => setForm((prev) => ({ ...prev, dependencies: e.target.value }))}
                  placeholder="svc-a, svc-b"
                />
              </label>

              <label className="field field--full">
                <span className="field__label">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this flag does..."
                />
              </label>
            </div>

            <label className="field">
              <span className="field__label">Enabled by default</span>
              <select
                value={String(form.enabled)}
                onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.value === "true" }))}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>

            <div className="field__help">
              This creates a new local flag in the mock UI. Hook this up to your API later.
            </div>
          </div>

          <div className="modal__footer">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              <span className="toolbar__icon">
                <Icon name="plus" />
              </span>
              Create Flag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
