import React from 'react'

const menuItems = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'regions',   icon: '🌍', label: 'Regions' },
  { id: 'sectors',   icon: '🏭', label: 'Sectors' },
  { id: 'sources',   icon: '📰', label: 'Sources' },
  { id: 'pestle',    icon: '🔬', label: 'PESTLE' },
]

const supportItems = [
  { id: 'settings', icon: '⚙️', label: 'Settings' },
  { id: 'help',     icon: '❓', label: 'Help' },
]

const BlackcofferLogo = () => (
  <svg viewBox="0 0 100 100" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c6fcd" />
        <stop offset="100%" stopColor="#9e7de6" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="18" fill="url(#logoGrad)" />
    <rect x="22" y="20" width="10" height="60" rx="3" fill="white" />
    <path d="M32 20 Q58 20 58 35 Q58 50 32 50" fill="none" stroke="white" strokeWidth="10" strokeLinecap="round" />
    <path d="M32 50 Q62 50 62 65 Q62 80 32 80" fill="none" stroke="white" strokeWidth="10" strokeLinecap="round" />
  </svg>
)

function Sidebar({ activePage, onPageChange, sidebarOpen, onToggleSidebar }) {
  return (
    <div
      className="sidebar"
      style={{
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* ── Logo + Toggle Button ── */}
      <div className="sidebar-logo" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '8px',
      }}>
        {/* Logo left side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BlackcofferLogo />
          <div>
            <div className="logo-text">Blackcoffer</div>
            <div className="logo-sub">Analytics Platform</div>
          </div>
        </div>

        {/* Toggle button INSIDE sidebar */}
        <button
          onClick={onToggleSidebar}
          title="Close Sidebar"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '8px',
            width: '30px', height: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: '#9e9ab4',
            fontSize: '16px',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          ‹
        </button>
      </div>

      {/* ── Main Menu ── */}
      <div className="sidebar-section-title">Main Menu</div>
      {menuItems.map(item => (
        <div
          key={item.id}
          className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
          onClick={() => onPageChange(item.id)}
        >
          <span className="sidebar-item-icon">{item.icon}</span>
          <span>{item.label}</span>
          {activePage === item.id && (
            <span style={{
              marginLeft: 'auto',
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: 'white',
              flexShrink: 0,
            }} />
          )}
        </div>
      ))}

      {/* ── Support ── */}
      <div className="sidebar-section-title" style={{ marginTop: '16px' }}>
        Support
      </div>
      {supportItems.map(item => (
        <div
          key={item.id}
          className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
          onClick={() => onPageChange(item.id)}
        >
          <span className="sidebar-item-icon">{item.icon}</span>
          <span>{item.label}</span>
          {item.id === 'help' && (
            <span style={{
              marginLeft: 'auto',
              background: '#ff4c51',
              color: 'white',
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '10px',
              flexShrink: 0,
            }}>2</span>
          )}
        </div>
      ))}

      {/* ── User Profile ── */}
      <div style={{
        marginTop: 'auto',
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c6fcd, #9e7de6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '700', color: 'white',
          }}>KM</div>
          <div style={{
            position: 'absolute', bottom: '1px', right: '1px',
            width: '9px', height: '9px',
            background: '#56ca00', borderRadius: '50%',
            border: '2px solid #312d4b',
          }} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#e7e3fc' }}>Kousik Maity</div>
          <div style={{ fontSize: '11px', color: '#9e9ab4' }}>Admin</div>
        </div>
      </div>

    </div>
  )
}

export default Sidebar