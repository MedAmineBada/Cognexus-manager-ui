export function deepClone(value) {
  return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

export function normalizeCatalog(catalog) {
  const next = deepClone(catalog ?? { services: {} });

  for (const service of Object.values(next.services ?? {})) {
    for (const endpoint of Object.values(service.endpoints ?? {})) {
      if (typeof endpoint.desiredEnabled !== 'boolean') {
        endpoint.desiredEnabled = Boolean(endpoint.enabled);
      }
      if (typeof endpoint.enabled !== 'boolean') {
        endpoint.enabled = Boolean(endpoint.desiredEnabled);
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
    endpoints: Object.entries(service.endpoints ?? {}).map(([endpointKey, endpoint]) => ({
      endpointKey,
      ...endpoint,
    })),
  }));
}

export function countFlags(catalog) {
  const endpoints = enrichCatalog(catalog).flatMap((service) => service.endpoints);
  const total = endpoints.length;
  const enabled = endpoints.filter((flag) => flag.enabled).length;
  return { total, enabled, disabled: total - enabled };
}

export function setServiceEnabled(catalog, serviceKey, enabled) {
  const next = deepClone(catalog);
  const service = next.services?.[serviceKey];
  if (!service) return next;

  Object.values(service.endpoints ?? {}).forEach((endpoint) => {
    endpoint.desiredEnabled = enabled;
  });

  return next;
}

export function setEndpointEnabled(catalog, serviceKey, endpointKey, enabled) {
  const next = deepClone(catalog);
  const endpoint = next.services?.[serviceKey]?.endpoints?.[endpointKey];
  if (!endpoint) return next;

  endpoint.desiredEnabled = enabled;
  return next;
}

export function createServiceKeyFromName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
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
    desiredEnabled: Boolean(payload.enabled),
    depends_on: payload.dependsOn.filter(Boolean),
  };

  return next;
}

function buildFlagMaps(catalog) {
  const normalized = normalizeCatalog(catalog);
  const flagMap = new Map();
  const parentMap = new Map();

  for (const [serviceKey, service] of Object.entries(normalized?.services ?? {})) {
    for (const [endpointKey, endpoint] of Object.entries(service.endpoints ?? {})) {
      const flagName = endpoint.flag_name;
      flagMap.set(flagName, {
        serviceKey,
        endpointKey,
        ...endpoint,
      });
      for (const dep of endpoint.depends_on ?? []) {
        if (!parentMap.has(dep)) parentMap.set(dep, new Set());
        parentMap.get(dep).add(flagName);
      }
    }
  }

  return { flagMap, parentMap };
}

function resolveEffectiveEnabled(flagName, flagMap, memo, trail = new Set()) {
  if (memo.has(flagName)) return memo.get(flagName);
  const flag = flagMap.get(flagName);
  if (!flag) {
    memo.set(flagName, false);
    return false;
  }

  if (trail.has(flagName)) {
    memo.set(flagName, false);
    return false;
  }

  const desiredEnabled = typeof flag.desiredEnabled === 'boolean' ? flag.desiredEnabled : Boolean(flag.enabled);
  if (!desiredEnabled) {
    memo.set(flagName, false);
    return false;
  }

  trail.add(flagName);
  const deps = flag.depends_on ?? [];
  const effective = deps.every((dep) => resolveEffectiveEnabled(dep, flagMap, memo, trail));
  trail.delete(flagName);

  memo.set(flagName, effective);
  return effective;
}

export function enrichCatalog(catalog) {
  const services = flattenCatalog(catalog);
  const { flagMap } = buildFlagMaps(catalog);
  const memo = new Map();

  const servicesWithState = services.map((service) => {
    const endpoints = service.endpoints.map((endpoint) => {
      const enabled = resolveEffectiveEnabled(endpoint.flag_name, flagMap, memo);
      const desiredEnabled = typeof endpoint.desiredEnabled === 'boolean' ? endpoint.desiredEnabled : Boolean(endpoint.enabled);
      const dependencyStates = (endpoint.depends_on ?? []).map((depName) => {
        const dependency = flagMap.get(depName);
        const dependencyEnabled = resolveEffectiveEnabled(depName, flagMap, memo);
        return {
          name: depName,
          enabled: dependencyEnabled,
          exists: Boolean(dependency),
          serviceKey: dependency?.serviceKey ?? null,
        };
      });

      return {
        ...endpoint,
        enabled,
        desiredEnabled,
        rawEnabled: desiredEnabled,
        dependencyStates,
        hasDisabledDependencies: dependencyStates.some((dep) => !dep.enabled),
        isDependencyBlocked: desiredEnabled && !enabled,
      };
    });

    const enabledCount = endpoints.filter((endpoint) => endpoint.enabled).length;
    const totalCount = endpoints.length;
    const status = enabledCount === 0 ? 'INACTIVE' : enabledCount === totalCount ? 'ACTIVE' : 'PARTIAL';

    return {
      ...service,
      endpoints,
      enabledCount,
      totalCount,
      status,
      hasDisabledDependencies: endpoints.some((endpoint) => endpoint.hasDisabledDependencies),
    };
  });

  return servicesWithState;
}

export function findFlags(catalog, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return enrichCatalog(catalog);

  return enrichCatalog(catalog)
    .map((service) => {
      const serviceMatch = service.serviceKey.toLowerCase().includes(needle) || service.description.toLowerCase().includes(needle);
      const endpoints = service.endpoints.filter((endpoint) => {
        const haystack = [endpoint.endpointKey, endpoint.flag_name, endpoint.description, ...(endpoint.depends_on ?? [])].join(' ').toLowerCase();
        return haystack.includes(needle) || serviceMatch;
      });
      return { ...service, endpoints };
    })
    .filter((service) => service.endpoints.length > 0 || service.serviceKey.toLowerCase().includes(needle) || service.description.toLowerCase().includes(needle));
}

export function getDependencyStatus(catalog, depName) {
  const { flagMap, parentMap } = buildFlagMaps(catalog);
  const memo = new Map();
  const enabled = resolveEffectiveEnabled(depName, flagMap, memo);
  return {
    enabled,
    exists: flagMap.has(depName),
    dependents: Array.from(parentMap.get(depName) ?? []),
  };
}
