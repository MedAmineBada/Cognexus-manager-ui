import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getFlags, toggleEndpoint, toggleService } from "../api/flagsApi.js";
import {
  countFlags,
  enrichCatalog,
  findFlags,
  normalizeCatalog,
} from "../utils/flagUtils.js";
import { useTheme } from "../hooks/useTheme.js";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { TopBar } from "../components/layout/TopBar.jsx";
import { FlagToolbar } from "../components/flags/FlagToolbar.jsx";
import { FlagRow } from "../components/flags/FlagRow.jsx";

function useMediaQuery(query) {
  const getMatches = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQueryList.matches);

    updateMatch();
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", updateMatch);
    } else {
      mediaQueryList.addListener(updateMatch);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", updateMatch);
      } else {
        mediaQueryList.removeListener(updateMatch);
      }
    };
  }, [query]);

  return matches;
}

function catalogStats(catalog, apiMeta) {
  if (apiMeta?.total_flags != null) {
    return {
      total: apiMeta.total_flags,
      enabled: apiMeta.enabled_count ?? 0,
      disabled: apiMeta.disabled_count ?? 0,
    };
  }
  return countFlags(catalog);
}

export default function FeatureFlagsPage() {
  const [catalog, setCatalog] = useState(() =>
    normalizeCatalog({ services: {} }),
  );
  const [apiMeta, setApiMeta] = useState(null);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(() => new Set());
  const { theme, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState(null);
  const previousQueryRef = useRef(query);
  const isMobileNav = useMediaQuery("(max-width: 920px)");

  const applyFlagsResponse = useCallback((data) => {
    setCatalog(normalizeCatalog(data));
    setApiMeta({
      total_flags: data.total_flags,
      enabled_count: data.enabled_count,
      disabled_count: data.disabled_count,
    });
  }, []);

  const loadFlags = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await getFlags();
      applyFlagsResponse(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load feature flags.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [applyFlagsResponse]);

  useEffect(() => {
    loadFlags();
  }, [loadFlags]);

  const stats = useMemo(
    () => catalogStats(catalog, apiMeta),
    [catalog, apiMeta],
  );
  const services = useMemo(() => {
    const list = query.trim()
      ? findFlags(catalog, query)
      : enrichCatalog(catalog);
    return list;
  }, [catalog, query]);

  useEffect(() => {
    if (!isMobileNav) setMobileNavOpen(false);
  }, [isMobileNav]);

  useEffect(() => {
    if (!isMobileNav) return undefined;
    const previousOverflow = document.body.style.overflow;
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNav, mobileNavOpen]);

  useEffect(() => {
    const queryChanged = previousQueryRef.current !== query;
    previousQueryRef.current = query;

    if (!queryChanged) return;

    if (!query.trim()) {
      setExpanded(new Set());
      return;
    }

    setExpanded(new Set(services.map((service) => service.serviceKey)));
  }, [query, services]);

  const handleToggleExpanded = (serviceKey) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(serviceKey)) next.delete(serviceKey);
      else next.add(serviceKey);
      return next;
    });
  };

  const handleServiceToggle = async (serviceKey) => {
    setError(null);
    setIsToggling(true);
    try {
      const data = await toggleService(serviceKey);
      applyFlagsResponse(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle service.",
      );
    } finally {
      setIsToggling(false);
    }
  };

  const handleEndpointToggle = async (endpoint) => {
    setError(null);
    setIsToggling(true);
    try {
      const data = await toggleEndpoint(endpoint.flag_name);
      applyFlagsResponse(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle endpoint.",
      );
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      className={`app-shell app-shell--controls ${mobileNavOpen ? "app-shell--nav-open" : ""}`}
    >
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        isMobileNav={isMobileNav}
      />
      <div className="app-shell__main">
        <TopBar
          theme={theme}
          onToggleTheme={toggleTheme}
          isMobileNav={isMobileNav}
          onToggleMobileNav={() => setMobileNavOpen((current) => !current)}
        />

        <main className="page">
          <FlagToolbar query={query} onQueryChange={setQuery} />

          {error ? (
            <div className="page-banner page-banner--error" role="alert">
              <p>{error}</p>
              <button
                type="button"
                className="secondary-btn"
                onClick={loadFlags}
                disabled={isLoading || isToggling}
              >
                Retry
              </button>
            </div>
          ) : null}

          <div className="stats-row" aria-label="Flag summary">
            <div className="stat-card">
              <span className="stat-card__label">Total flags</span>
              <span className="stat-card__value">{stats.total}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Enabled</span>
              <span className="stat-card__value">{stats.enabled}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Disabled</span>
              <span className="stat-card__value">{stats.disabled}</span>
            </div>
          </div>

          <section
            className="table-shell"
            aria-label="Feature flags list"
            aria-busy={isLoading || isToggling}
          >
            <div className="table-shell__header">
              <div className="table-shell__col table-shell__col--service">
                Service / Endpoint
              </div>
              <div className="table-shell__col table-shell__col--deps">
                Dependencies
              </div>
              <div className="table-shell__col table-shell__col--status">
                Status
              </div>
            </div>

            <div className="table-shell__body">
              {isLoading ? (
                <p className="table-shell__message">Loading feature flags…</p>
              ) : services.length === 0 ? (
                <p className="table-shell__message">No feature flags found.</p>
              ) : (
                services.map((service) => (
                  <FlagRow
                    key={service.serviceKey}
                    service={service}
                    expanded={expanded.has(service.serviceKey)}
                    disabled={isToggling}
                    onToggleExpanded={() =>
                      handleToggleExpanded(service.serviceKey)
                    }
                    onServiceToggle={() =>
                      handleServiceToggle(service.serviceKey)
                    }
                    onEndpointToggle={(endpoint) =>
                      handleEndpointToggle(endpoint)
                    }
                  />
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
