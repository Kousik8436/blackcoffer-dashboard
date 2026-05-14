import React, { useState, useEffect } from 'react'
import { Radar } from 'react-chartjs-2'
import axios from 'axios'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

function IntensityByTopic({ filters }) {
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
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/data/intensity-by-topic?${params}`)
        if (res.data.success && res.data.data.length > 0) {
          const items = res.data.data.slice(0, 10)
          setChartData({
            labels: items.map(d => d._id),
            datasets: [
              {
                label: 'Avg Intensity',
                data: items.map(d => Math.round(d.avgIntensity * 10) / 10),
                backgroundColor: 'rgba(124,111,205,0.35)',
                borderColor: '#9e7de6',
                borderWidth: 3,
                pointBackgroundColor: '#9e7de6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#9e7de6',
                pointHoverBorderWidth: 3,
                fill: true,
              },
              {
                label: 'Count',
                data: items.map(d => d.count),
                backgroundColor: 'rgba(22,177,255,0.2)',
                borderColor: '#16b1ff',
                borderWidth: 3,
                pointBackgroundColor: '#16b1ff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#16b1ff',
                pointHoverBorderWidth: 3,
                fill: true,
              }
            ]
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
      duration: 1400,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        labels: {
          color: '#9e9ab4',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 24,
          font: { size: 13, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30,27,60,0.97)',
        titleColor: '#e7e3fc',
        bodyColor: '#c8c4e0',
        borderColor: 'rgba(158,125,230,0.5)',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 12,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.r}`
        }
      }
    },
    scales: {
      r: {
        min: 0,
        grid: {
          color: 'rgba(124,111,205,0.2)',
          lineWidth: 1,
        },
        angleLines: {
          color: 'rgba(124,111,205,0.25)',
          lineWidth: 1.5,
        },
        pointLabels: {
          color: (ctx) => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
            return isDark ? '#e7e3fc' : '#3a3541'
          },
          font: { size: 12, weight: '700' },
          padding: 12,
        },
        ticks: {
          color: '#7c6fcd',
          backdropColor: (ctx) => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
            return isDark ? 'rgba(49,45,75,0.85)' : 'rgba(255,255,255,0.85)'
          },
        }
      }
    }
  }

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner"></div> Loading...
    </div>
  )

  if (!chartData) return (
    <div className="no-data">No data available</div>
  )

  return (
    <div style={{ height: '420px' }}>
      <Radar data={chartData} options={options} />
    </div>
  )
}

export default IntensityByTopic