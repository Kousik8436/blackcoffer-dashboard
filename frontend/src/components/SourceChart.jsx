import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import api from '../api'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function SourceChart({ filters }) {
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
        const res = await api.get(`/api/data/by-source?${params}`)
        if (res.data.success && res.data.data.length > 0) {
          const items = res.data.data
          setChartData({
            labels: items.map(d => d._id),
            datasets: [{
              label: 'Articles',
              data: items.map(d => d.count),
              backgroundColor: items.map((_, i) => {
                const colors = [
                  'rgba(255,180,0,0.85)',
                  'rgba(124,111,205,0.85)',
                  'rgba(22,177,255,0.85)',
                  'rgba(86,202,0,0.85)',
                  'rgba(255,76,81,0.85)',
                  'rgba(158,125,230,0.85)',
                  'rgba(0,207,232,0.85)',
                  'rgba(255,159,67,0.85)',
                  'rgba(40,199,111,0.85)',
                  'rgba(234,84,85,0.85)',
                ]
                return colors[i % colors.length]
              }),
              borderRadius: 6,
              borderSkipped: false,
              barThickness: 28,
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
      duration: 1000,
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
          label: ctx => ` Articles: ${ctx.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#9e9ab4',
          font: { size: 11 },
          maxRotation: 45,
        },
        border: { display: false }
      },
      y: {
        grid: { color: 'rgba(58,53,65,0.08)' },
        ticks: { color: '#9e9ab4', font: { size: 11 } },
        border: { display: false }
      }
    }
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"></div> Loading...</div>
  if (!chartData) return <div className="no-data">No data available</div>

  return <div style={{ height: '380px' }}><Bar data={chartData} options={options} /></div>
}

export default SourceChart
