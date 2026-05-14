import React, { useState, useEffect } from 'react'
import { Scatter } from 'react-chartjs-2'
import axios from 'axios'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

const SECTOR_COLORS = {
  'Energy':               '#7c6fcd',
  'Manufacturing':        '#16b1ff',
  'Financial services':   '#56ca00',
  'Retail':               '#ffb400',
  'Aerospace & defence':  '#ff4c51',
  'Government':           '#9e7de6',
  'Support services':     '#00cfe8',
  'Information Technology': '#ff9f43',
  'Environment':          '#28c76f',
  'Food & agriculture':   '#ea5455',
  'Healthcare':           '#1e9ff2',
  'Other':                '#ff6b6b',
}

const getColor = (sector) => SECTOR_COLORS[sector] || '#9e9ab4'

function ScatterChart({ filters }) {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([k, v]) => {
          if (v && v !== 'all') params.append(k, v)
        })
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/data/likelihood-vs-intensity?${params}`)

        if (res.data.success && res.data.data.length > 0) {
          const items = res.data.data

          // Group by sector
          const grouped = {}
          items.forEach(d => {
            const sector = d.sector || 'Other'
            if (!grouped[sector]) grouped[sector] = []
            grouped[sector].push({ x: d.likelihood, y: d.intensity })
          })

          const datasets = Object.entries(grouped).map(([sector, points]) => ({
            label: sector,
            data: points,
            backgroundColor: getColor(sector) + 'cc',
            pointRadius: 7,
            pointHoverRadius: 10,
            pointBorderWidth: 0,
          }))

          setChartData({ datasets })
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
      legend: {
        position: 'top',
        labels: {
          color: '#9e9ab4',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: { size: 11 },
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
          title: (ctx) => ctx[0].dataset.label,
          label: (ctx) =>
            ` Likelihood: ${ctx.parsed.x}  |  Intensity: ${ctx.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Likelihood',
          color: '#9e9ab4',
          font: { size: 12, weight: '600' }
        },
        grid: { color: 'rgba(58,53,65,0.08)' },
        ticks: { color: '#9e9ab4', font: { size: 11 } }
      },
      y: {
        title: {
          display: true,
          text: 'Intensity',
          color: '#9e9ab4',
          font: { size: 12, weight: '600' }
        },
        grid: { color: 'rgba(58,53,65,0.08)' },
        ticks: { color: '#9e9ab4', font: { size: 11 } }
      }
    }
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"></div> Loading...</div>
  if (!chartData) return <div className="no-data">No data available</div>

  return <div style={{ height: '420px' }}><Scatter data={chartData} options={options} /></div>
}

export default ScatterChart