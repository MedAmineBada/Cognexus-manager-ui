export function deepClone(value) {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

export function normalizeCatalog(catalog) {
  const next = deepClone(catalog ?? { services: {} });

  for (const service of Object.values(next.services ?? {})) {
    for (const endpoint of Object.values(service.endpoints ?? {})) {
      if (typeof endpoint.enabled !== "boolean") {
        endpoint.enabled = false;
      }
    }
  }

  return next;
}

export function flattenCatalog(catalog) {
  const normalized = normalizeCatalog(catalog);
  const services = normalized?.services ?? {};

  return Object.entries(services).map(([serviceKey, service]) => ({
    serviceKey,
    description: service.description,
    endpoints: Object.entries(service.endpoints ?? {}).map(
      ([endpointKey, endpoint]) => ({
        endpointKey,
        ...endpoint,
      }),
    ),
  }));
}

export function countFlags(catalog) {
  const endpoints = enrichCatalog(catalog).flatMap(
    (service) => service.endpoints,
  );
  const total = endpoints.length;
  const enabled = endpoints.filter((flag) => flag.enabled).length;
  return { total, enabled, disabled: total - enabled };
}

export function setServiceEnabled(catalog, serviceKey, enabled) {
  const next = deepClone(catalog);
  const service = next.services?.[serviceKey];
  if (!service) return next;

  Object.values(service.endpoints ?? {}).forEach((endpoint) => {
    endpoint.enabled = enabled;
  });

  return next;
}

export function setEndpointEnabled(catalog, serviceKey, endpointKey, enabled) {
  const next = deepClone(catalog);
  const endpoint = next.services?.[serviceKey]?.endpoints?.[endpointKey];
  if (!endpoint) return next;

  endpoint.enabled = enabled;

  return next;
}

export function createServiceKeyFromName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function upsertFlag(catalog, payload) {
  const next = deepClone(catalog);
  const serviceKey = payload.serviceKey;

  if (!next.services[serviceKey]) {
    next.services[serviceKey] = {
      description: payload.serviceDescription.trim() || payload.serviceKey,
      endpoints: {},
    };
  } else if (payload.serviceDescription?.trim()) {
    next.services[serviceKey].description = payload.serviceDescription.trim();
  }

  next.services[serviceKey].endpoints[payload.endpointKey] = {
    flag_name: `${serviceKey}.${payload.flagSlug}`,
    description: payload.description.trim(),
    enabled: Boolean(payload.enabled),
    depends_on: payload.dependsOn.filter(Boolean),
  };

  return next;
}

export function enrichCatalog(catalog) {
  const services = flattenCatalog(catalog);

  const servicesWithState = services.map((service) => {
    const endpoints = service.endpoints.map((endpoint) => {
      const dependencyStates = (endpoint.depends_on ?? []).map((depName) => {
        // Find the service that this dependency refers to
        const depService = services.find((s) => s.serviceKey === depName);
        return {
          name: depName,
          enabled: depService ? depService.status !== "INACTIVE" : false,
        };
      });

      return {
        ...endpoint,
        desiredEnabled: endpoint.enabled,
        dependencyStates,
      };
    });

    const enabledCount = endpoints.filter(
      (endpoint) => endpoint.enabled,
    ).length;
    const totalCount = endpoints.length;
    const status =
      enabledCount === 0
        ? "INACTIVE"
        : enabledCount === totalCount
          ? "ACTIVE"
          : "PARTIAL";

    return {
      ...service,
      endpoints,
      enabledCount,
      totalCount,
      status,
    };
  });

  return servicesWithState;
}

export function findFlags(catalog, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return enrichCatalog(catalog);

  return enrichCatalog(catalog)
    .map((service) => {
      const serviceMatch =
        service.serviceKey.toLowerCase().includes(needle) ||
        service.description.toLowerCase().includes(needle);
      const endpoints = service.endpoints.filter((endpoint) => {
        const haystack = [
          endpoint.endpointKey,
          endpoint.flag_name,
          endpoint.description,
          ...(endpoint.depends_on ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle) || serviceMatch;
      });
      return { ...service, endpoints };
    })
    .filter(
      (service) =>
        service.endpoints.length > 0 ||
        service.serviceKey.toLowerCase().includes(needle) ||
        service.description.toLowerCase().includes(needle),
    );
}

export function getDependencyStatus() {
  return {
    exists: false,
    dependents: [],
  };
}
