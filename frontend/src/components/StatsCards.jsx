import React, { useState, useEffect } from 'react'
import axios from 'axios'

function StatsCards({ stats, loading, filters }) {

  const [extraStats, setExtraStats] = useState({
    topTopic: 'Oil',
    topCountry: 'United States',
    topRegion: 'N. America',
    totalSectors: 18,
  })

  useEffect(() => {
    const fetchExtra = async () => {
      try {
        const params = new URLSearchParams()
        Object.entries(filters || {}).forEach(([k, v]) => {
          if (v && v !== 'all') params.append(k, v)
        })

        const [topicRes, countryRes, sectorRes, regionRes] = await Promise.all([
          axios.get(`/api/data/intensity-by-topic?${params}`),
          axios.get(`/api/data/by-country?${params}`),
          axios.get(`/api/data/by-sector?${params}`),
          axios.get(`/api/data/intensity-by-region?${params}`),
        ])

        setExtraStats({
          topTopic: topicRes.data.data?.[0]?._id || 'N/A',
          topCountry: countryRes.data.data?.[0]?._id || 'N/A',
          totalSectors: sectorRes.data.data?.length || 0,
          topRegion: regionRes.data.data?.[0]?._id || 'N/A',
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchExtra()
  }, [filters])

  const data = stats || {
    totalRecords: 0,
    avgIntensity: 0,
    avgLikelihood: 0,
    avgRelevance: 0,
    maxIntensity: 0,
  }

  const cards = [
    {
      icon: '🔥',
      label: 'Top Intensity Topic',
      value: extraStats.topTopic,
      sub: 'Highest impact area',
      color: '#ff4c51',
      gradient: 'linear-gradient(135deg, rgba(255,76,81,0.15), rgba(255,76,81,0.05))',
      border: 'rgba(255,76,81,0.3)',
      bar: 85,
    },
    {
      icon: '🌍',
      label: 'Most Active Country',
      value: extraStats.topCountry,
      sub: 'Top contributor',
      color: '#16b1ff',
      gradient: 'linear-gradient(135deg, rgba(22,177,255,0.15), rgba(22,177,255,0.05))',
      border: 'rgba(22,177,255,0.3)',
      bar: 75,
    },
    {
      icon: '⚡',
      label: 'Avg Relevance',
      value: data.avgRelevance,
      sub: 'Score (1-7 scale)',
      color: '#7c6fcd',
      gradient: 'linear-gradient(135deg, rgba(124,111,205,0.15), rgba(124,111,205,0.05))',
      border: 'rgba(124,111,205,0.3)',
      bar: (data.avgRelevance / 7) * 100,
    },
    {
      icon: '🏭',
      label: 'Total Sectors',
      value: extraStats.totalSectors,
      sub: 'Involved industries',
      color: '#56ca00',
      gradient: 'linear-gradient(135deg, rgba(86,202,0,0.15), rgba(86,202,0,0.05))',
      border: 'rgba(86,202,0,0.3)',
      bar: (extraStats.totalSectors / 18) * 100,
    },
    {
      icon: '🗺️',
      label: 'Top Region',
      value: extraStats.topRegion,
      sub: 'Highest volume',
      color: '#ffb400',
      gradient: 'linear-gradient(135deg, rgba(255,180,0,0.15), rgba(255,180,0,0.05))',
      border: 'rgba(255,180,0,0.3)',
      bar: 65,
    },
  ]

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            height: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div className="spinner"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          background: card.gradient,
          border: `1px solid ${card.border}`,
          borderRadius: '16px',
          padding: '22px 20px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = `0 12px 32px ${card.border}`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {/* Background circle decoration */}
          <div style={{
            position: 'absolute',
            top: '-20px', right: '-20px',
            width: '80px', height: '80px',
            borderRadius: '50%',
            background: card.color,
            opacity: 0.08,
          }} />

          {/* Top row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '48px', height: '48px',
              borderRadius: '14px',
              background: `${card.color}22`,
              border: `1px solid ${card.color}44`,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}>
              {card.icon}
            </div>
            <div style={{
              background: `${card.color}20`,
              color: card.color,
              border: `1px solid ${card.color}40`,
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: '700',
            }}>↑ Live</div>
          </div>

          {/* Value */}
          <div style={{
            fontSize: '20px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            marginBottom: '4px',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {card.value}
          </div>

          {/* Label */}
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            color: card.color,
            marginBottom: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {card.label}
          </div>

          {/* Sub */}
          <div style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
          }}>
            {card.sub}
          </div>

          {/* Progress bar */}
          <div style={{
            marginTop: '14px',
            height: '4px',
            background: 'rgba(58,53,65,0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, card.bar || 50)}%`,
              background: `linear-gradient(90deg, ${card.color}, ${card.color}88)`,
              borderRadius: '4px',
              transition: 'width 1s ease',
            }} />
          </div>

        </div>
      ))}
    </div>
  )
}

export default StatsCards