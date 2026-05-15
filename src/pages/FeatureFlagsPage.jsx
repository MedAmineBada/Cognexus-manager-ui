import React, { useEffect, useMemo, useState } from 'react';
import flagsData from '../data/flagsData.json';
import { countFlags, enrichCatalog, findFlags, normalizeCatalog, setEndpointEnabled, setServiceEnabled, upsertFlag } from '../utils/flagUtils.js';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { TopBar } from '../components/layout/TopBar.jsx';
import { FlagToolbar } from '../components/flags/FlagToolbar.jsx';
import { FlagRow } from '../components/flags/FlagRow.jsx';
import { NewFlagModal } from '../components/flags/NewFlagModal.jsx';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem('feature-flags-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function useMediaQuery(query) {
  const getMatches = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQueryList.matches);

    updateMatch();
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', updateMatch);
    } else {
      mediaQueryList.addListener(updateMatch);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', updateMatch);
      } else {
        mediaQueryList.removeListener(updateMatch);
      }
    };
  }, [query]);

  return matches;
}

export default function FeatureFlagsPage() {
  const [catalog, setCatalog] = useState(() => normalizeCatalog(flagsData));
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(() => new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobileNav = useMediaQuery('(max-width: 919px)');

  const stats = useMemo(() => countFlags(catalog), [catalog]);
  const services = useMemo(() => {
    const list = query.trim() ? findFlags(catalog, query) : enrichCatalog(catalog);
    return list;
  }, [catalog, query]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;
    window.localStorage.setItem('feature-flags-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!isMobileNav) setMobileNavOpen(false);
  }, [isMobileNav]);

  useEffect(() => {
    if (!isMobileNav) return undefined;
    const previousOverflow = document.body.style.overflow;
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNav, mobileNavOpen]);

  useEffect(() => {
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

  const handleServiceToggle = (serviceKey, enabled) => {
    setCatalog((prev) => setServiceEnabled(prev, serviceKey, enabled));
  };

  const handleEndpointToggle = (serviceKey, endpointKey, enabled) => {
    setCatalog((prev) => setEndpointEnabled(prev, serviceKey, endpointKey, enabled));
  };

  const handleCreateFlag = (payload) => {
    setCatalog((prev) => upsertFlag(prev, payload));
    setExpanded((prev) => new Set(prev).add(payload.serviceKey));
  };

  return (
    <div className={`app-shell ${mobileNavOpen ? 'app-shell--nav-open' : ''}`}>
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} isMobileNav={isMobileNav} />
      <div className="app-shell__main">
        <TopBar
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          isMobileNav={isMobileNav}
          onToggleMobileNav={() => setMobileNavOpen((current) => !current)}
        />

        <main className="page">
          <FlagToolbar query={query} onQueryChange={setQuery} onNewFlag={() => setModalOpen(true)} />

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

          <section className="table-shell" aria-label="Feature flags list">
            <div className="table-shell__header">
              <div className="table-shell__col table-shell__col--service">Service / Endpoint</div>
              <div className="table-shell__col table-shell__col--deps">Dependencies</div>
              <div className="table-shell__col table-shell__col--status">Status</div>
              <div className="table-shell__col table-shell__col--toggle">Master</div>
            </div>

            <div className="table-shell__body">
              {services.map((service) => (
                <FlagRow
                  key={service.serviceKey}
                  service={service}
                  expanded={expanded.has(service.serviceKey)}
                  onToggleExpanded={() => handleToggleExpanded(service.serviceKey)}
                  onServiceToggle={(enabled) => handleServiceToggle(service.serviceKey, enabled)}
                  onEndpointToggle={(endpoint, enabled) => handleEndpointToggle(service.serviceKey, endpoint.endpointKey, enabled)}
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      <NewFlagModal
        open={modalOpen}
        services={enrichCatalog(catalog)}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateFlag}
      />
    </div>
  );
}
