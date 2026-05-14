import React, { useState } from 'react'

const pageTitles = {
  dashboard: { title: 'Analytics Dashboard', crumb: 'Analytics' },
  analytics: { title: 'Analytics Dashboard', crumb: 'Analytics' },
  regions:   { title: 'Regions Overview',    crumb: 'Regions' },
  sectors:   { title: 'Sectors Overview',    crumb: 'Sectors' },
  sources:   { title: 'Sources Overview',    crumb: 'Sources' },
  pestle:    { title: 'PESTLE Analysis',     crumb: 'PESTLE' },
  settings:  { title: 'Settings',            crumb: 'Settings' },
  help:      { title: 'Help & Support',      crumb: 'Help' },
}

const notifications = [
  { id: 1, icon: '📊', text: 'New data imported successfully', time: '2 min ago', unread: true },
  { id: 2, icon: '⚡', text: 'High intensity spike in Energy sector', time: '1 hr ago', unread: true },
  { id: 3, icon: '🌍', text: 'New region data available', time: '3 hrs ago', unread: false },
  { id: 4, icon: '📰', text: 'Bloomberg source updated', time: '5 hrs ago', unread: false },
]

const messages = [
  { id: 1, name: 'Prem Chandra', avatar: 'PC', text: 'Please submit the assignment ASAP', time: '10 min ago', unread: true, color: '#7c6fcd' },
  { id: 2, name: 'Blackcoffer HR', avatar: 'BH', text: 'Interview scheduled for next week', time: '2 hrs ago', unread: true, color: '#16b1ff' },
  { id: 3, name: 'Tech Team', avatar: 'TT', text: 'Dashboard looks great!', time: '1 day ago', unread: false, color: '#56ca00' },
]

function Topbar({ activePage, sidebarOpen, onToggleSidebar, darkMode, onToggleTheme }) {
  const page = pageTitles[activePage] || pageTitles.dashboard
  const [showNotif, setShowNotif]   = useState(false)
  const [showMsg, setShowMsg]       = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const closeAll = () => {
    setShowNotif(false)
    setShowMsg(false)
    setShowProfile(false)
  }

  const toggleNotif = () => {
    setShowMsg(false); setShowProfile(false)
    setShowNotif(p => !p)
  }
  const toggleMsg = () => {
    setShowNotif(false); setShowProfile(false)
    setShowMsg(p => !p)
  }
  const toggleProfile = () => {
    setShowNotif(false); setShowMsg(false)
    setShowProfile(p => !p)
  }

  // Dropdown base style
  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    zIndex: 999,
    minWidth: '300px',
    overflow: 'hidden',
  }

  return (
    <>
      {/* Backdrop to close dropdowns */}
      {(showNotif || showMsg || showProfile) && (
        <div
          onClick={closeAll}
          style={{
            position: 'fixed', inset: 0, zIndex: 998,
          }}
        />
      )}

      <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      height: '80px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(58,53,65,0.08)',
      gap: '20px',
      width: '100%',
      boxSizing: 'border-box',
    }}>

        {/* ── LEFT ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>

          {/* Hamburger when sidebar closed */}
          {!sidebarOpen && (
            <button onClick={onToggleSidebar} style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              width: '36px', height: '36px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '4px', cursor: 'pointer', flexShrink: 0,
            }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: '16px', height: '2px',
                  background: 'var(--text-secondary)',
                  borderRadius: '2px', display: 'block',
                }} />
              ))}
            </button>
          )}

          <div>
            <h1 style={{
              fontSize: '20px', fontWeight: '700',
              color: 'var(--text-primary)', whiteSpace: 'nowrap',
            }}>{page.title}</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '1px' }}>
              <span style={{ color: '#7c6fcd', cursor: 'pointer' }}>Home</span>
              <span style={{ margin: '0 5px', color: 'var(--text-secondary)' }}>/</span>
              <span>{page.crumb}</span>
            </p>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '10px', flexShrink: 0,
          marginLeft: 'auto',
        }}>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '8px 14px',
            width: '200px',
          }}>
            <span style={{ fontSize: '13px', flexShrink: 0 }}>🔍</span>
            <input type="text" placeholder="Search..."
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontSize: '13px', width: '100%',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          {/* Theme Toggle */}
          <button onClick={onToggleTheme} title="Toggle Theme"
            style={{
              background: darkMode ? 'rgba(124,111,205,0.15)' : 'var(--bg-card)',
              border: `1px solid ${darkMode ? 'rgba(124,111,205,0.4)' : 'var(--border-color)'}`,
              borderRadius: '10px',
              width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '18px', flexShrink: 0,
              transition: 'all 0.3s',
            }}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button onClick={toggleNotif} title="Notifications"
              style={{
                background: showNotif ? 'rgba(124,111,205,0.15)' : 'var(--bg-card)',
                border: `1px solid ${showNotif ? 'rgba(124,111,205,0.4)' : 'var(--border-color)'}`,
                borderRadius: '10px',
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '18px', position: 'relative', flexShrink: 0,
              }}>
              🔔
              <span style={{
                position: 'absolute', top: '8px', right: '8px',
                width: '8px', height: '8px',
                background: '#ff4c51', borderRadius: '50%',
                border: '2px solid var(--bg-secondary)',
              }} />
            </button>

            {showNotif && (
              <div style={{ ...dropdownStyle, minWidth: '320px' }}>
                <div style={{
                  padding: '16px 18px',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                    🔔 Notifications
                  </span>
                  <span style={{
                    background: 'rgba(255,76,81,0.15)', color: '#ff4c51',
                    fontSize: '11px', fontWeight: '700',
                    padding: '2px 8px', borderRadius: '10px',
                  }}>2 new</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                    padding: '14px 18px',
                    background: n.unread ? 'rgba(124,111,205,0.05)' : 'transparent',
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: 'rgba(124,111,205,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', flexShrink: 0,
                    }}>{n.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px', color: 'var(--text-primary)',
                        fontWeight: n.unread ? '600' : '400',
                      }}>{n.text}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                        {n.time}
                      </div>
                    </div>
                    {n.unread && (
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#7c6fcd', flexShrink: 0, marginTop: '4px',
                      }} />
                    )}
                  </div>
                ))}
                <div style={{
                  padding: '12px', textAlign: 'center',
                  color: '#7c6fcd', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}>View all notifications</div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div style={{ position: 'relative' }}>
            <button onClick={toggleMsg} title="Messages"
              style={{
                background: showMsg ? 'rgba(124,111,205,0.15)' : 'var(--bg-card)',
                border: `1px solid ${showMsg ? 'rgba(124,111,205,0.4)' : 'var(--border-color)'}`,
                borderRadius: '10px',
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '18px', position: 'relative', flexShrink: 0,
              }}>
              💬
              <span style={{
                position: 'absolute', top: '8px', right: '8px',
                width: '8px', height: '8px',
                background: '#16b1ff', borderRadius: '50%',
                border: '2px solid var(--bg-secondary)',
              }} />
            </button>

            {showMsg && (
              <div style={{ ...dropdownStyle, minWidth: '320px' }}>
                <div style={{
                  padding: '16px 18px',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                    💬 Messages
                  </span>
                  <span style={{
                    background: 'rgba(22,177,255,0.15)', color: '#16b1ff',
                    fontSize: '11px', fontWeight: '700',
                    padding: '2px 8px', borderRadius: '10px',
                  }}>2 unread</span>
                </div>
                {messages.map(m => (
                  <div key={m.id} style={{
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                    padding: '14px 18px',
                    background: m.unread ? 'rgba(22,177,255,0.04)' : 'transparent',
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: m.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: '700', color: 'white', flexShrink: 0,
                    }}>{m.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px', fontWeight: '600',
                        color: 'var(--text-primary)',
                      }}>{m.name}</div>
                      <div style={{
                        fontSize: '12px', color: 'var(--text-secondary)',
                        marginTop: '2px', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{m.text}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                        {m.time}
                      </div>
                    </div>
                    {m.unread && (
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#16b1ff', flexShrink: 0, marginTop: '6px',
                      }} />
                    )}
                  </div>
                ))}
                <div style={{
                  padding: '12px', textAlign: 'center',
                  color: '#7c6fcd', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}>View all messages</div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div style={{ position: 'relative' }}>
            <div onClick={toggleProfile} style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c6fcd, #9e7de6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: 'white',
              cursor: 'pointer', flexShrink: 0,
              boxShadow: showProfile
                ? '0 0 0 3px rgba(124,111,205,0.4)'
                : '0 2px 8px rgba(124,111,205,0.4)',
              transition: 'box-shadow 0.2s',
              border: '2px solid rgba(124,111,205,0.3)',
            }}>KM</div>

            {showProfile && (
              <div style={{ ...dropdownStyle, minWidth: '240px' }}>
                {/* Profile Header */}
                <div style={{
                  padding: '18px',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex', gap: '12px', alignItems: 'center',
                }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c6fcd, #9e7de6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: '700', color: 'white', flexShrink: 0,
                  }}>KM</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      Kousik Maity
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Admin</div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px',
                    }}>
                      <div style={{
                        width: '7px', height: '7px', borderRadius: '50%', background: '#56ca00',
                      }} />
                      <span style={{ fontSize: '11px', color: '#56ca00' }}>Online</span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                {[
                  { icon: '👤', label: 'My Profile' },
                  { icon: '⚙️', label: 'Settings' },
                  { icon: '📊', label: 'My Dashboard' },
                  { icon: '🔒', label: 'Privacy' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '11px 18px',
                    cursor: 'pointer', fontSize: '13px',
                    color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,111,205,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    {item.label}
                  </div>
                ))}

                {/* Logout */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 18px', cursor: 'pointer',
                  color: '#ff4c51', fontSize: '13px', fontWeight: '600',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,76,81,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '16px' }}>🚪</span>
                  Logout
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default Topbar