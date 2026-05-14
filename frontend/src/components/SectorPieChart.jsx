import React, { useState, useEffect } from 'react'
import { Pie } from 'react-chartjs-2'
import api from '../api'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

function SectorPieChart({ filters }) {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([k, v]) => {
          if (v && v !== 'all') params.append(k, v)
        })
        const res = await api.get(`/api/data/by-sector?${params}`)
        if (res.data.success && res.data.data.length > 0) {
          const items = res.data.data
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
                '#ea5455',
                '#28c76f',
                '#1e9ff2',
                '#ff6b6b',
              ],
              borderWidth: 3,
              borderColor: '#ffffff',
              hoverBorderWidth: 4,
              hoverOffset: 12,
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
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#9e9ab4',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: { size: 12 },
          generateLabels: (chart) => {
            const data = chart.data
            return data.labels.map((label, i) => ({
              text: label.length > 18 ? label.slice(0, 18) + '…' : label,
              fillStyle: data.datasets[0].backgroundColor[i],
              strokeStyle: data.datasets[0].backgroundColor[i],
              pointStyle: 'circle',
              index: i,
            }))
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(49,45,75,0.95)',
        titleColor: '#e7e3fc',
        bodyColor: '#9e9ab4',
        borderColor: 'rgba(124,111,205,0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const pct = ((ctx.parsed / total) * 100).toFixed(1)
            return ` ${ctx.label}: ${ctx.parsed} records (${pct}%)`
          }
        }
      }
    },
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"></div> Loading...</div>
  if (!chartData) return <div className="no-data">No data available</div>

  return <div style={{ height: '380px' }}><Pie data={chartData} options={options} /></div>
}

export default SectorPieChart
