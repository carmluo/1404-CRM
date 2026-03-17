import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'

function fmtRevenue(val) {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`
  return `$${val.toLocaleString()}`
}

function getColor(ratio) {
  if (ratio > 0.5) return '#438974'   // viz-dark — top 3
  if (ratio > 0.2) return '#54AB91'  // viz — mid tier
  return '#92C9B9'                    // viz-subtle — bottom tier
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { fullName, value } = payload[0].payload
  return (
    <div className="bg-surface-white border border-border rounded-card px-3 py-2 shadow-card font-crm text-body-3">
      <p className="font-bold text-content">{fullName}</p>
      <p className="text-content-subtlest">{fmtRevenue(value)}</p>
    </div>
  )
}

export default function TopAccountsCard({ accounts }) {
  const navigate = useNavigate()

  const sorted = [...accounts].sort((a, b) => b.revenue - a.revenue)
  const maxRevenue = sorted[0]?.revenue || 1

  const chartData = sorted.map(a => ({
    name: a.name.length > 13 ? a.name.slice(0, 12) + '…' : a.name,
    fullName: a.name,
    value: a.revenue,
    accountId: a.accountId,
    color: getColor(a.revenue / maxRevenue),
  }))

  return (
    <div className="bg-surface-elevated rounded-card p-4 flex flex-col gap-4 w-full">
      <p className="font-crm font-bold text-body-2 text-content whitespace-nowrap shrink-0">
        Top 10 accounts by revenue
      </p>

      <div className="w-full" style={{ height: 310 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 56, left: 0, bottom: 0 }}
            barSize={20}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: '#838383', fontFamily: 'Helvetica Neue, Helvetica, sans-serif' }}
              tickFormatter={fmtRevenue}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 14, fill: '#565656', fontFamily: 'Helvetica Neue, Helvetica, sans-serif' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Bar
              dataKey="value"
              shape={(props) => {
                const { x, y, width, height, index } = props
                const isHatched = index % 2 === 1
                const color = chartData[index]?.color || '#438974'
                const patternId = `top-acct-hatch-${index}`
                return (
                  <g>
                    {isHatched && (
                      <defs>
                        <pattern
                          id={patternId}
                          width="6"
                          height="6"
                          patternUnits="userSpaceOnUse"
                          patternTransform="rotate(45)"
                        >
                          <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="3" />
                          <line x1="3" y1="0" x2="3" y2="6" stroke="white" strokeWidth="3" />
                        </pattern>
                      </defs>
                    )}
                    <rect
                      x={x}
                      y={y}
                      width={Math.max(0, width)}
                      height={height}
                      fill={isHatched ? `url(#${patternId})` : color}
                      rx={4}
                    />
                  </g>
                )
              }}
              onClick={(data) => navigate(`/accounts/${data.accountId}`)}
              cursor="pointer"
            >
              <LabelList
                dataKey="value"
                position="right"
                formatter={fmtRevenue}
                style={{ fontSize: 12, fill: '#838383', fontFamily: 'Helvetica Neue, Helvetica, sans-serif' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
