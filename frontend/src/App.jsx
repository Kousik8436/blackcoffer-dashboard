import React, { useState, useEffect } from 'react'
import './App.css'
import api from './api'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import WelcomeBanner from './components/WelcomeBanner'
import FilterBar from './components/FilterBar'
import StatsCards from './components/StatsCards'
import IntensityByTopic from './components/IntensityByTopic'
import LineChartByYear from './components/LineChartByYear'
import SectorPieChart from './components/SectorPieChart'
import PestleChart from './components/PestleChart'
import CountryChart from './components/CountryChart'
import SourceChart from './components/SourceChart'
import ScatterChart from './components/ScatterChart'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.setAttribute('data-theme', 'light')
    }
  }, [darkMode])

  const [filters, setFilters] = useState({
    end_year: 'all', topic: 'all', sector: 'all',
    region: 'all', pestle: 'all', source: 'all', country: 'all', swot: 'all',
  })

  const [filterOptions, setFilterOptions] = useState({
    endYears: [], topics: [], sectors: [],
    regions: [], pestles: [], sources: [], countries: [], swots: [],
  })

  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const buildQuery = (filterObj) => {
    const params = new URLSearchParams()
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value && value !== 'all') params.append(key, value)
    })
    return params.toString()
  }

  useEffect(() => {
    api.get('/api/data/filters').then(res => {
      if (res.data.success) setFilterOptions(res.data.filters)
    }).catch(err => console.error(err))
  }, [])

  useEffect(() => {
    setStatsLoading(true)
    const query = buildQuery(filters)
    api.get(`/api/data/stats?${query}`).then(res => {
      if (res.data.success) setStats(res.data.stats)
      setStatsLoading(false)
    }).catch(() => setStatsLoading(false))
  }, [filters])

  const handlePageChange = (page) => {
    setActivePage(page)
    const reset = {
      end_year: 'all', topic: 'all', sector: 'all',
      region: 'all', pestle: 'all', source: 'all', country: 'all', swot: 'all',
    }
    switch (page) {
      case 'regions': setFilters({ ...reset }); break
      case 'sectors': setFilters({ ...reset }); break
      case 'sources': setFilters({ ...reset }); break
      case 'pestle':  setFilters({ ...reset }); break
      default:        setFilters(reset)
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    setFilters({
      end_year: 'all', topic: 'all', sector: 'all',
      region: 'all', pestle: 'all', source: 'all', country: 'all', swot: 'all',
    })
    setActivePage('dashboard')
  }

  const showAll     = activePage === 'dashboard' || activePage === 'analytics'
  const showRegions = showAll || activePage === 'regions'
  const showSectors = showAll || activePage === 'sectors'
  const showSources = showAll || activePage === 'sources'
  const showPestle  = showAll || activePage === 'pestle'

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
      />
      <div className="main-wrapper" style={{
        marginLeft: sidebarOpen ? '255px' : '0px',
        width: sidebarOpen ? 'calc(100% - 255px)' : '100%',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
      }}>
        <Topbar
          activePage={activePage}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode(prev => !prev)}
        />
        <div className="page-content">
          <WelcomeBanner activePage={activePage} />

          {activePage === 'settings' ? (
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <h2 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '20px' }}>Dashboard Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '15px' }}>Dark Mode</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Toggle dark theme for the dashboard</div>
                  </div>
                  <button onClick={() => setDarkMode(prev => !prev)} style={{
                    padding: '8px 16px', borderRadius: '8px', border: 'none',
                    background: darkMode ? '#7c6fcd' : 'rgba(124,111,205,0.15)',
                    color: darkMode ? 'white' : '#7c6fcd', cursor: 'pointer', fontWeight: 'bold'
                  }}>
                    {darkMode ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '15px' }}>Email Notifications</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Receive weekly analytics reports</div>
                  </div>
                  <button style={{
                    padding: '8px 16px', borderRadius: '8px', border: 'none',
                    background: '#56ca00', color: 'white', cursor: 'pointer', fontWeight: 'bold'
                  }}>
                    Enabled
                  </button>
                </div>
              </div>
            </div>
          ) : activePage === 'help' ? (
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '20px' }}>Help & Support (Connect with Me)</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
                If you have any questions or need assistance, feel free to reach out.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
                <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                <input type="email" placeholder="Your Email" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                <textarea rows="5" placeholder="How can we help you?" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                <button style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#16b1ff', color: 'white', cursor: 'pointer', fontWeight: 'bold', alignSelf: 'flex-start', fontSize: '14px', fontFamily: 'inherit' }}>
                  Send Message
                </button>
              </div>
            </div>
          ) : (
            <>
              <FilterBar
                filters={filters}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                activePage={activePage}
              />

              <StatsCards stats={stats} loading={statsLoading} filters={filters} />
              <div className="charts-grid">

            <div className="chart-card chart-full">
              <div className="chart-header">
                <div className="chart-title-group">
                  <div className="chart-title">📈 Trend Evolution: Intensity vs. Likelihood</div>
                  <div className="chart-subtitle">Trend over time across all metrics</div>
                </div>
                <span className="chart-badge">By Year</span>
              </div>
              <LineChartByYear filters={filters} />
            </div>

            {showAll && (
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title-group">
                    <div className="chart-title">⚡ High-Impact Topics by Intensity</div>
                    <div className="chart-subtitle">Top 15 topics ranked</div>
                  </div>
                  <span className="chart-badge">Topics</span>
                </div>
                <IntensityByTopic filters={filters} />
              </div>
            )}

            {showSectors && (
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title-group">
                    <div className="chart-title">🏭 Sector Distribution of Global Trends</div>
                    <div className="chart-subtitle">Distribution across sectors</div>
                  </div>
                  <span className="chart-badge">Sectors</span>
                </div>
                <SectorPieChart filters={filters} />
              </div>
            )}

            {showRegions && (
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title-group">
                    <div className="chart-title">🌍 Countries Generating Highest Global Activity</div>
                    <div className="chart-subtitle">Top 15 countries</div>
                  </div>
                  <span className="chart-badge">Regions</span>
                </div>
                <CountryChart filters={filters} />
              </div>
            )}

            {showSources && (
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title-group">
                    <div className="chart-title">📰 Primary Sources of Market Intelligence</div>
                    <div className="chart-subtitle">By number of records</div>
                  </div>
                  <span className="chart-badge">Sources</span>
                </div>
                <SourceChart filters={filters} />
              </div>
            )}

            {showPestle && (
              <div className="chart-card chart-full">
                <div className="chart-header">
                  <div className="chart-title-group">
                    <div className="chart-title">🔬 PESTLE Risk & Opportunity Breakdown</div>
                    <div className="chart-subtitle">Count & avg intensity per PESTLE category</div>
                  </div>
                  <span className="chart-badge">PESTLE</span>
                </div>
                <PestleChart filters={filters} />
              </div>
            )}

            <div className="chart-card chart-full">
              <div className="chart-header">
                <div className="chart-title-group">
                  <div className="chart-title">🎯 Risk Matrix: Likelihood vs. Intensity</div>
                  <div className="chart-subtitle">Scatter plot — up to 300 data points</div>
                </div>
                <span className="chart-badge">Risk</span>
              </div>
              <ScatterChart filters={filters} />
            </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
