import React from 'react'

function FilterBar({ filters, filterOptions, onFilterChange, onReset }) {
  const selects = [
    { key: 'end_year', label: 'End Year',  icon: '📅', options: filterOptions.endYears || [],  placeholder: 'All Years' },
    { key: 'topic',    label: 'Topic',     icon: '💡', options: filterOptions.topics || [],     placeholder: 'All Topics' },
    { key: 'sector',   label: 'Sector',    icon: '🏭', options: filterOptions.sectors || [],    placeholder: 'All Sectors' },
    { key: 'region',   label: 'Region',    icon: '🌍', options: filterOptions.regions || [],    placeholder: 'All Regions' },
    { key: 'pestle',   label: 'PESTLE',    icon: '🔬', options: filterOptions.pestles || [],    placeholder: 'All PESTLE' },
    { key: 'source',   label: 'Source',    icon: '📰', options: filterOptions.sources || [],    placeholder: 'All Sources' },
    { key: 'country',  label: 'Country',   icon: '🗺️', options: filterOptions.countries || [],  placeholder: 'All Countries' },
    { key: 'swot',     label: 'SWOT',      icon: '🎯', options: filterOptions.swots || [],      placeholder: 'All SWOT' },
  ]

  const activeCount = Object.values(filters).filter(v => v && v !== 'all').length

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '20px 24px',
      marginBottom: '24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          {/* Icon */}
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c6fcd, #9e7de6)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 4px 12px rgba(124,111,205,0.35)',
          }}>🎚️</div>

          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}>Filter Dashboard</div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}>Refine your data view</div>
          </div>
        </div>

        {/* Active filters badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeCount > 0 && (
            <div style={{
              background: 'rgba(124,111,205,0.15)',
              border: '1px solid rgba(124,111,205,0.3)',
              color: '#7c6fcd',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: '700',
            }}>
              {activeCount} Active Filter{activeCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: 'var(--border-color)',
        marginBottom: '18px',
      }} />

      {/* Filter Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '14px',
        alignItems: 'end',
      }}>
        {selects.map(s => {
          const isActive = filters[s.key] && filters[s.key] !== 'all'
          return (
            <div key={s.key} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              {/* Label with icon */}
              <label style={{
                fontSize: '11px',
                fontWeight: '700',
                color: isActive ? '#7c6fcd' : 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'color 0.2s',
              }}>
                <span>{s.icon}</span>
                {s.label}
                {isActive && (
                  <span style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: '#7c6fcd',
                    display: 'inline-block',
                    marginLeft: '2px',
                  }} />
                )}
              </label>

              {/* Select */}
              <select
                value={filters[s.key]}
                onChange={e => onFilterChange(s.key, e.target.value)}
                style={{
                  background: isActive
                    ? 'rgba(124,111,205,0.08)'
                    : 'var(--bg-card)',
                  border: `1px solid ${isActive ? 'rgba(124,111,205,0.5)' : 'var(--border-color)'}`,
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: isActive ? '#7c6fcd' : 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '400',
                  cursor: 'pointer',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%239e9ab4' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  paddingRight: '28px',
                }}
              >
                <option value="all">{s.placeholder}</option>
                {s.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )
        })}

        {/* Reset Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            fontSize: '11px',
            fontWeight: '700',
            color: 'transparent',
            letterSpacing: '0.6px',
          }}>RESET</label>
          <button
            onClick={onReset}
            style={{
              background: activeCount > 0
                ? 'rgba(255,76,81,0.12)'
                : 'var(--bg-card)',
              color: activeCount > 0 ? '#ff4c51' : 'var(--text-secondary)',
              border: `1px solid ${activeCount > 0 ? 'rgba(255,76,81,0.3)' : 'var(--border-color)'}`,
              borderRadius: '10px',
              padding: '9px 16px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700',
              width: '100%',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => {
              if (activeCount > 0) {
                e.currentTarget.style.background = 'rgba(255,76,81,0.2)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = activeCount > 0
                ? 'rgba(255,76,81,0.12)'
                : 'var(--bg-card)'
            }}
          >
            ↺ Reset All
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar