import { Badge } from '../ui/Badge.jsx';
import { Icon } from '../ui/Icons.jsx';
import { ToggleSwitch } from '../ui/ToggleSwitch.jsx';

function statusTone(status) {
  if (status === 'ACTIVE') return 'blue';
  if (status === 'PARTIAL') return 'soft';
  return 'muted';
}

function dependencyTone() {
  return 'neutral';
}

export function FlagRow({ service, expanded, disabled = false, onToggleExpanded, onServiceToggle, onEndpointToggle }) {
  const total = service.totalCount || 0;
  const summary = total ? `${service.enabledCount}/${total} enabled` : 'No flags';
  const masterChecked = service.status === 'ACTIVE';
  const servicePanelId = `service-panel-${service.serviceKey}`;

  return (
    <section className="service-card">
      <div className="service-row">
        <button
          type="button"
          className="service-row__trigger"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          aria-controls={servicePanelId}
        >
          <span className="service-row__expand" aria-hidden="true">
            <Icon name={expanded ? 'chevron-down' : 'chevron-right'} className="row-icon" />
          </span>

          <span className="service-row__lead">
            <span className="service-row__service-key">{service.serviceKey}</span>
            <span className="service-row__description">{service.description}</span>
            <span className="service-row__summary service-row__summary--inline">{summary}</span>
          </span>
        </button>

        <div className="service-row__aside" onClick={(e) => e.stopPropagation()}>
          <span className="service-row__summary service-row__summary--aside">{summary}</span>
          <Badge tone={statusTone(service.status)}>{service.status}</Badge>
          <ToggleSwitch
            checked={masterChecked}
            disabled={disabled}
            onChange={() => onServiceToggle()}
            label={`Toggle ${service.serviceKey}`}
          />
        </div>
      </div>

      {expanded ? (
        <div id={servicePanelId} className="endpoint-list">
          {service.endpoints.map((endpoint) => (
            <div key={endpoint.flag_name} className="endpoint-row">
              <button
                type="button"
                className="endpoint-row__trigger"
                onClick={() => !disabled && onEndpointToggle(endpoint)}
                aria-label={`${endpoint.enabled ? 'Disable' : 'Enable'} ${endpoint.flag_name}`}
              >
                <span className="endpoint-row__lead">
                  <span className="endpoint-row__key-line">
                    <Icon name="link" className="row-icon row-icon--small" />
                    <span className={`endpoint-row__flag ${endpoint.enabled ? 'is-on' : ''}`}>{endpoint.flag_name}</span>
                  </span>
                  <span className="endpoint-row__description">{endpoint.description}</span>
                </span>

                <span className="endpoint-row__deps" aria-label="Dependencies">
                  {endpoint.depends_on?.length ? (
                    endpoint.dependencyStates.map((dep) => (
                      <Badge
                        key={dep.name}
                        tone={dependencyTone()}
                        className="dependency-chip"
                      >
                        {dep.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="dependency-chip dependency-chip--empty">—</span>
                  )}
                </span>
              </button>

              <div className="endpoint-row__controls" onClick={(e) => e.stopPropagation()}>
                <ToggleSwitch
                  checked={endpoint.enabled}
                  disabled={disabled}
                  onChange={() => onEndpointToggle(endpoint)}
                  label={`Toggle ${endpoint.flag_name}`}
                />
                <span className="endpoint-row__status" aria-hidden="true">
                  <span className={`status-dot ${endpoint.enabled ? 'status-dot--on' : 'status-dot--off'}`} />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
