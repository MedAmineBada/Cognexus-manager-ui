import ToggleSwitch from "./ToggleSwitch";
import StatusPill from "./StatusPill";
import { Icon } from "./icons";

function getStatus(endpoints) {
  const total = endpoints.length;
  const enabled = endpoints.filter((endpoint) => endpoint.enabled).length;

  if (enabled === 0) return "INACTIVE";
  if (enabled === total) return "ACTIVE";
  return "PARTIAL";
}

function rowMatches(service, query) {
  if (!query) return true;
  const q = query.toLowerCase();

  const serviceMatch =
    service.name.toLowerCase().includes(q) ||
    service.version.toLowerCase().includes(q);

  const endpointMatch = service.endpoints.some((endpoint) => {
    const haystack = [
      endpoint.name,
      endpoint.description,
      ...(endpoint.dependencies || []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });

  return serviceMatch || endpointMatch;
}

function filteredEndpoints(service, query) {
  if (!query) return service.endpoints;

  const q = query.toLowerCase();
  const serviceMatch =
    service.name.toLowerCase().includes(q) ||
    service.version.toLowerCase().includes(q);

  if (serviceMatch) return service.endpoints;

  return service.endpoints.filter((endpoint) => {
    const haystack = [
      endpoint.name,
      endpoint.description,
      ...(endpoint.dependencies || []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export default function FeatureTable({
  services,
  query,
  onToggleService,
  onToggleEndpoint,
  onToggleExpand,
}) {
  const visible = services.filter((service) => rowMatches(service, query));

  if (visible.length === 0) {
    return (
      <section className="panel">
        <div className="empty-state">No matching services or flags found.</div>
      </section>
    );
  }

  return (
    <section className="panel" aria-label="Feature flags table">
      <div className="table-head">
        <div />
        <div className="table-head__label">Service / Endpoint</div>
        <div className="table-head__label table-head__label--right">Dependencies</div>
        <div className="table-head__label table-head__label--center">Status</div>
        <div className="table-head__label table-head__label--right">Master</div>
      </div>

      {visible.map((service) => {
        const status = getStatus(service.endpoints);
        const expanded = query ? true : service.expanded;
        const statusLabel = status;
        const endpoints = filteredEndpoints(service, query);
        const serviceIsOn = status !== "INACTIVE";

        return (
          <article className="service" key={service.id}>
            <div className="service__row">
              <div className="service__caret">
                <button
                  type="button"
                  aria-label={expanded ? "Collapse service" : "Expand service"}
                  onClick={() => onToggleExpand(service.id)}
                >
                  <Icon name={expanded ? "chevron-down" : "chevron-right"} />
                </button>
              </div>

              <div className="service__meta">
                <span className="service__icon">
                  <Icon name={service.icon} />
                </span>
                <span className={`service__name ${service.endpoints.length ? "" : "is-muted"}`}>
                  {service.name}
                </span>
                {service.version ? (
                  <span className="service__version">{service.version}</span>
                ) : null}
              </div>

              <div className="service__toggle" />

              <div className="service__status">
                <StatusPill status={statusLabel} />
              </div>

              <div className="service__master">
                <ToggleSwitch
                  checked={serviceIsOn}
                  ariaLabel={`Toggle all flags for ${service.name}`}
                  onChange={() => onToggleService(service.id)}
                />
              </div>
            </div>

            {expanded ? (
              <div className="endpoints">
                {endpoints.map((endpoint) => (
                  <div className="endpoint" key={endpoint.id}>
                    <div />
                    <div className="endpoint__content">
                      <div className="endpoint__title-line">
                        <span className="endpoint__link">
                          <Icon name="link" size={14} />
                        </span>
                        <span className={`endpoint__name ${endpoint.enabled ? "" : "is-off"}`}>
                          {endpoint.name}
                        </span>
                      </div>
                      <div className="endpoint__description">{endpoint.description}</div>
                    </div>

                    <div className="chips">
                      {(endpoint.dependencies || []).map((dependency) => (
                        <span
                          key={dependency}
                          className={`chip ${dependency.includes("crypto") ? "chip--danger" : ""}`}
                        >
                          {dependency}
                        </span>
                      ))}
                    </div>

                    <div className="endpoint__status">
                      <span
                        className={`endpoint__status-dot ${endpoint.enabled ? "" : "is-off"}`}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="endpoint__toggle">
                      <ToggleSwitch
                        checked={endpoint.enabled}
                        ariaLabel={`Toggle ${endpoint.name}`}
                        onChange={() => onToggleEndpoint(service.id, endpoint.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
