import React from 'react'

const pageContent = {
  dashboard: {
    title: 'Welcome to Blackcoffer Analytics 👋',
    subtitle: 'Track intensity, likelihood & relevance across sectors, regions and topics.',
    color: 'linear-gradient(135deg, #7c6fcd 0%, #9e7de6 60%, #b39ddb 100%)',
  },
  analytics: {
    title: 'Deep Analytics View 📊',
    subtitle: 'Explore all data metrics in detail across every dimension.',
    color: 'linear-gradient(135deg, #7c6fcd 0%, #9e7de6 60%, #b39ddb 100%)',
  },
  regions: {
    title: 'Regional Intelligence 🌍',
    subtitle: 'Discover which countries and regions are driving global trends.',
    color: 'linear-gradient(135deg, #16b1ff 0%, #56b0f8 60%, #90caf9 100%)',
  },
  sectors: {
    title: 'Sector Breakdown 🏭',
    subtitle: 'Analyze intensity and activity levels across all industry sectors.',
    color: 'linear-gradient(135deg, #56ca00 0%, #72e128 60%, #a5d6a7 100%)',
  },
  sources: {
    title: 'Market Intelligence Sources 📰',
    subtitle: 'See which sources contribute the most data and insights.',
    color: 'linear-gradient(135deg, #ffb400 0%, #ffd666 60%, #ffe082 100%)',
  },
  pestle: {
    title: 'PESTLE Risk Analysis 🔬',
    subtitle: 'Political, Economic, Social, Technological, Legal & Environmental breakdown.',
    color: 'linear-gradient(135deg, #ff4c51 0%, #ff7b7e 60%, #ef9a9a 100%)',
  },
  settings: {
    title: 'Settings ⚙️',
    subtitle: 'Configure your dashboard preferences and account settings.',
    color: 'linear-gradient(135deg, #7c6fcd 0%, #9e7de6 60%, #b39ddb 100%)',
  },
  help: {
    title: 'Help & Support ❓',
    subtitle: 'Find answers, documentation and contact support.',
    color: 'linear-gradient(135deg, #16b1ff 0%, #56b0f8 60%, #90caf9 100%)',
  },
}

function WelcomeBanner({ activePage }) {
  const content = pageContent[activePage] || pageContent.dashboard

  return (
    <div style={{
      background: content.color,
      borderRadius: '16px',
      padding: '40px 48px',
      marginBottom: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      minHeight: '160px',
    }}>

      {/* Background circles decoration */}
      <div style={{
        position: 'absolute', right: '180px', top: '-30px',
        width: '150px', height: '150px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
      }} />
      <div style={{
        position: 'absolute', right: '80px', bottom: '-40px',
        width: '180px', height: '180px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
      }} />

      {/* Text */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '8px',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          {content.title}
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.85)',
          maxWidth: '500px',
          lineHeight: '1.5',
        }}>
          {content.subtitle}
        </p>
      </div>

      {/* Right illustration */}
      <div style={{
        position: 'relative', zIndex: 1,
        fontSize: '80px',
        opacity: 0.9,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
        userSelect: 'none',
      }}>
        {activePage === 'dashboard' || activePage === 'analytics' ? '📊' :
         activePage === 'regions'  ? '🗺️' :
         activePage === 'sectors'  ? '🏗️' :
         activePage === 'sources'  ? '📡' :
         activePage === 'pestle'   ? '⚗️' :
         activePage === 'settings' ? '🛠️' : '💡'}
      </div>

    </div>
  )
}

export default WelcomeBanner