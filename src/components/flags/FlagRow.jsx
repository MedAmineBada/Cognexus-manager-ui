import React from 'react';
import { Badge } from '../ui/Badge.jsx';
import { Icon } from '../ui/Icons.jsx';
import { ToggleSwitch } from '../ui/ToggleSwitch.jsx';

function statusTone(status) {
  if (status === 'ACTIVE') return 'blue';
  if (status === 'PARTIAL') return 'soft';
  return 'muted';
}

function dependencyTone(dep) {
  if (!dep.exists) return 'muted';
  return dep.enabled ? 'neutral' : 'danger';
}

export function FlagRow({ service, expanded, onToggleExpanded, onServiceToggle, onEndpointToggle }) {
  const total = service.totalCount || 0;
  const summary = total ? `${service.enabledCount}/${total} enabled` : 'No flags';
  const masterChecked = service.status === 'ACTIVE';
  const servicePanelId = `service-panel-${service.serviceKey}`;

  return (
    <section className={`service-card ${service.hasDisabledDependencies ? 'service-card--dependency-warning' : ''}`}>
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

          <span className="service-row__main">
            <span className="service-row__title-line">
              <span className="service-row__service-key">{service.serviceKey}</span>
            </span>
            <span className="service-row__description">{service.description}</span>
            <span className="service-row__summary">{summary}</span>
          </span>

          <span className="service-row__status">
            <Badge tone={statusTone(service.status)}>{service.status}</Badge>
          </span>
        </button>

        <div className="service-row__toggle" onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch
            checked={masterChecked}
            onChange={(checked) => onServiceToggle(checked)}
            label={`Toggle ${service.serviceKey}`}
          />
        </div>
      </div>

      {expanded ? (
        <div id={servicePanelId} className="endpoint-list">
          {service.endpoints.map((endpoint) => (
            <div key={endpoint.flag_name} className={`endpoint-row ${endpoint.isDependencyBlocked ? 'endpoint-row--blocked' : ''}`}>
              <button
                type="button"
                className="endpoint-row__trigger"
                onClick={() => onEndpointToggle(endpoint, !endpoint.desiredEnabled)}
                aria-label={`${endpoint.desiredEnabled ? 'Disable' : 'Enable'} ${endpoint.flag_name}`}
              >
                <span className="endpoint-row__main">
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
                        tone={dependencyTone(dep)}
                        className={`dependency-chip ${!dep.enabled ? 'dependency-chip--disabled' : ''}`}
                      >
                        {dep.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="dependency-chip dependency-chip--empty">—</span>
                  )}
                </span>

                <span className="endpoint-row__status" aria-hidden="true">
                  <span className={`status-dot ${endpoint.enabled ? 'status-dot--on' : 'status-dot--off'}`} />
                </span>
              </button>

              <div className="endpoint-row__toggle" onClick={(e) => e.stopPropagation()}>
                <ToggleSwitch
                  checked={endpoint.enabled}
                  onChange={(checked) => onEndpointToggle(endpoint, checked)}
                  label={`Toggle ${endpoint.flag_name}`}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
