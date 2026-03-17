import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const DONUT_COLORS = ['#54AB91', '#438974', '#92C9B9']
const SWATCH_CLASSES = ['bg-viz', 'bg-viz-dark', 'bg-viz-subtle']

function fmt(val) {
  return `$${val.toLocaleString()}`
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-white border border-border rounded-card px-3 py-2 shadow-card font-crm text-body-3">
      <p className="font-bold text-content">{payload[0].payload.name}</p>
      <p className="text-content-subtlest">{fmt(payload[0].value)}</p>
    </div>
  )
}

export default function BidWonLostCard({ data, dateLabel = 'Past 90 days' }) {
  const donutData = [
    { name: 'Awarded', value: data.awarded },
    { name: 'Lost', value: data.lost },
    { name: 'Pending', value: data.pending },
  ]

  return (
    <div className="bg-surface-elevated rounded-card p-4 flex flex-col gap-9 w-full">
      {/* Header */}
      <div className="flex items-center gap-1 w-full shrink-0">
        <p className="font-crm font-bold text-body-2 text-content whitespace-nowrap shrink-0">
          Bid won/lost ratio
        </p>
        <p className="font-crm text-body-3 text-content-subtlest shrink-0">·</p>
        <p className="font-crm text-body-3 text-content-subtlest shrink-0">{dateLabel}</p>
      </div>

      {/* Content */}
      <div className="flex items-center gap-4 w-full shrink-0">
        {/* Donut chart — 220×220px per Figma */}
        <div className="shrink-0 w-[220px] h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={98}
                dataKey="value"
                paddingAngle={2}
                cornerRadius={4}
              >
                {donutData.map((entry, index) => (
                  <Cell key={entry.name} fill={DONUT_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right: stats + legend */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 max-w-[300px]">
          {/* Stats row */}
          <div className="flex items-start justify-between w-full whitespace-nowrap">
            <div>
              <p className="font-crm text-body-3 text-content">Total bid</p>
              <p className="font-crm font-bold text-body-2 text-content">{fmt(data.totalBid)}</p>
            </div>
            <div>
              <p className="font-crm text-body-3 text-content">Win rate</p>
              <p className="font-crm font-bold text-body-2 text-content">{data.winRate}%</p>
            </div>
            <div>
              <p className="font-crm text-body-3 text-content">Total bids</p>
              <p className="font-crm font-bold text-body-2 text-content">{data.totalBids}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 w-full">
            {donutData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <div className={`shrink-0 w-4 h-4 rounded-[3px] ${SWATCH_CLASSES[i]}`} />
                  <p className="font-crm text-[16px] leading-[1.4] text-content whitespace-nowrap">
                    {d.name}
                  </p>
                </div>
                <p className="font-crm text-[16px] leading-[1.4] text-content text-right whitespace-nowrap">
                  {fmt(d.value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
