import React, { useMemo, useState } from 'react';
import { Icon } from '../ui/Icons.jsx';
import { createServiceKeyFromName } from '../../utils/flagUtils.js';
const initialForm = { serviceKey: '', serviceDescription: '', endpointKey: '', description: '', dependsOn: '', enabled: true };
export function NewFlagModal({ open, services, onClose, onCreate }) {
  const [form, setForm] = useState(initialForm);
  const serviceOptions = useMemo(() => services.map((service) => service.serviceKey), [services]);
  if (!open) return null;
  const submit = (e) => {
    e.preventDefault();
    const serviceKey = createServiceKeyFromName(form.serviceKey);
    if (!serviceKey || !form.endpointKey.trim() || !form.description.trim()) return;
    onCreate({
      serviceKey,
      serviceDescription: form.serviceDescription || form.serviceKey,
      endpointKey: form.endpointKey.trim(),
      flagSlug: form.endpointKey.trim(),
      description: form.description.trim(),
      dependsOn: form.dependsOn.split(',').map((item) => item.trim()).filter(Boolean),
      enabled: Boolean(form.enabled),
    });
    setForm(initialForm);
    onClose?.();
  };
  return (<div className="modal-backdrop" role="presentation" onMouseDown={onClose}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="new-flag-title" onMouseDown={(e) => e.stopPropagation()}><div className="modal__header"><div><h2 id="new-flag-title" className="modal__title">Create Flag</h2><p className="modal__subtitle">This is local state for now. Wire the API later.</p></div><button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal"><Icon name="close" className="icon-btn__svg" /></button></div><form className="modal__form" onSubmit={submit}><div className="form-grid"><label className="field"><span className="field__label">Service key</span><input value={form.serviceKey} onChange={(e) => setForm((prev) => ({ ...prev, serviceKey: e.target.value }))} list="service-keys" className="field__input" placeholder="exam_orchestrator" /><datalist id="service-keys">{serviceOptions.map((serviceKey) => (<option key={serviceKey} value={serviceKey} />))}</datalist></label><label className="field"><span className="field__label">Service description</span><input value={form.serviceDescription} onChange={(e) => setForm((prev) => ({ ...prev, serviceDescription: e.target.value }))} className="field__input" placeholder="Exam orchestration service" /></label><label className="field"><span className="field__label">Endpoint key</span><input value={form.endpointKey} onChange={(e) => setForm((prev) => ({ ...prev, endpointKey: e.target.value }))} className="field__input" placeholder="create_exam" /></label><label className="field"><span className="field__label">Depends on</span><input value={form.dependsOn} onChange={(e) => setForm((prev) => ({ ...prev, dependsOn: e.target.value }))} className="field__input" placeholder="service.flag, other.flag" /></label><label className="field field--full"><span className="field__label">Description</span><textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} className="field__textarea" placeholder="Describe what this flag does" rows="4" /></label></div><label className="checkbox-row"><input type="checkbox" checked={form.enabled} onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))} /><span>Enabled by default</span></label><div className="modal__actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button type="submit" className="primary-btn">Create flag</button></div></form></div></div>);
}
