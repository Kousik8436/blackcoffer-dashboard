import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

function LineChartByYear({ filters }) {
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
        const res = await axios.get(`/api/data/by-year?${params}`)
        if (res.data.success && res.data.data.length > 0) {
          const items = res.data.data
          setChartData({
            labels: items.map(d => d._id),
            datasets: [
              {
                label: 'Avg Intensity',
                data: items.map(d => Math.round(d.avgIntensity * 10) / 10),
                borderColor: '#7c6fcd',
                backgroundColor: 'rgba(124,111,205,0.15)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#7c6fcd',
                pointRadius: 4,
                pointHoverRadius: 7,
                borderWidth: 2.5,
              },
              {
                label: 'Avg Likelihood',
                data: items.map(d => Math.round(d.avgLikelihood * 10) / 10),
                borderColor: '#16b1ff',
                backgroundColor: 'rgba(22,177,255,0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#16b1ff',
                pointRadius: 4,
                pointHoverRadius: 7,
                borderWidth: 2.5,
              },
              {
                label: 'Avg Relevance',
                data: items.map(d => Math.round(d.avgRelevance * 10) / 10),
                borderColor: '#ffb400',
                backgroundColor: 'rgba(255,180,0,0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ffb400',
                pointRadius: 4,
                pointHoverRadius: 7,
                borderWidth: 2.5,
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
    animation: { duration: 1000, easing: 'easeInOutQuart' },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: {
          color: '#9e9ab4',
          usePointStyle: true,
          pointStyleWidth: 8,
          padding: 20,
          font: { size: 12 }
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
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(58,53,65,0.08)' },
        ticks: { color: '#9e9ab4', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(58,53,65,0.08)' },
        ticks: { color: '#9e9ab4', font: { size: 11 } }
      }
    }
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"></div> Loading...</div>
  if (!chartData) return <div className="no-data">No data available</div>

  return <div style={{ height: '380px' }}><Line data={chartData} options={options} /></div>
}

export default LineChartByYear