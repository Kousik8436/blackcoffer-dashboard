import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import axios from 'axios'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

function CountryChart({ filters }) {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([k, v]) => {
          if (v && v !== 'all') params.append(k, v)
        })
        const res = await axios.get(`/api/data/by-country?${params}`)
        if (res.data.success && res.data.data.length > 0) {
          const items = res.data.data.slice(0, 8)
          setTableData(res.data.data.slice(0, 10))
          setChartData({
            labels: items.map(d => d._id),
            datasets: [{
              data: items.map(d => d.count),
              backgroundColor: [
                '#7c6fcd',
                '#16b1ff',
                '#56ca00',
                '#ffb400',
                '#ff4c51',
                '#9e7de6',
                '#00cfe8',
                '#ff9f43',
              ],
              borderWidth: 0,
              hoverOffset: 10,
            }]
          })
        } else setChartData(null)
      } catch { setChartData(null) }
      setLoading(false)
    }
    fetchData()
  }, [filters])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(49,45,75,0.95)',
        titleColor: '#e7e3fc',
        bodyColor: '#9e9ab4',
        borderColor: 'rgba(124,111,205,0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: ctx => ` ${ctx.label}: ${ctx.parsed} records`
        }
      }
    }
  }

  const colors = [
    '#7c6fcd','#16b1ff','#56ca00','#ffb400',
    '#ff4c51','#9e7de6','#00cfe8','#ff9f43',
    '#28c76f','#ea5455',
  ]

  if (loading) return <div className="loading-spinner"><div className="spinner"></div> Loading...</div>
  if (!chartData) return <div className="no-data">No data available</div>

  return (
    <div style={{ display: 'flex', gap: '24px', height: '380px', alignItems: 'center' }}>

      {/* Doughnut Chart */}
      <div style={{ width: '260px', height: '260px', flexShrink: 0, position: 'relative' }}>
        <Doughnut data={chartData} options={options} />
        {/* Center text */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {tableData.length}
          </div>
          <div style={{ fontSize: '11px', color: '#9e9ab4' }}>Countries</div>
        </div>
      </div>

      {/* Country List */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tableData.map((item, i) => {
          const max = tableData[0]?.count || 1
          const pct = Math.round((item.count / max) * 100)
          return (
            <div key={i}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '4px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: colors[i % colors.length], flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: '12px', color: 'var(--text-primary)',
                    fontWeight: '500',
                    whiteSpace: 'nowrap', overflow: 'hidden',
                    textOverflow: 'ellipsis', maxWidth: '160px',
                  }}>{item._id || 'Unknown'}</span>
                </div>
                <span style={{
                  fontSize: '12px', fontWeight: '700',
                  color: colors[i % colors.length],
                }}>{item.count}</span>
              </div>
              {/* Progress bar */}
              <div style={{
                height: '4px', background: 'rgba(58,53,65,0.1)',
                borderRadius: '4px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: colors[i % colors.length],
                  borderRadius: '4px',
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default CountryChart