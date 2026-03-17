import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, ArrowRight, Phone, Mail } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Badge from './Badge'
import Accordion from './Accordion'

function formatCurrency(val) {
  if (!val && val !== 0) return '—'
  if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
  return `$${val}`
}

export default function AccountDrawer({ account, onClose }) {
  const navigate = useNavigate()

  if (!account) return null

  const contacts = account.contacts || []

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/20 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        className="fixed right-0 bottom-0 w-96 bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
        style={{ top: 64 }}
        initial={{ x: 384 }}
        animate={{ x: 0 }}
        exit={{ x: 384 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold"
                style={{ backgroundColor: '#2B6B52' }}
              >
                {account.name.charAt(0)}
              </div>
              <h2 className="text-sm font-semibold text-[#21272a] leading-tight truncate">{account.name}</h2>
            </div>
            <button onClick={onClose} className="p-1 text-content-disabled hover:text-content-subtlest shrink-0">
              <X size={16} />
            </button>
          </div>
          <button
            onClick={() => { navigate(`/accounts/${account.id}`); onClose() }}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-content-primary hover:underline"
          >
            View details <ArrowRight size={12} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* About */}
          <div className="border-b border-border">
            <Accordion label="About" defaultOpen={true}>
              <div className="grid grid-cols-2 gap-3 px-2 pb-1">
                <div>
                  <p className="text-xs text-content-disabled mb-0.5">Type</p>
                  <p className="text-sm font-medium text-content">{account.type || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-content-disabled mb-0.5">Status</p>
                  {account.status ? (
                    <Badge variant="status" value={account.status.toLowerCase()} label={account.status} />
                  ) : <p className="text-sm text-content">—</p>}
                </div>
                <div>
                  <p className="text-xs text-content-disabled mb-0.5">Industry</p>
                  <p className="text-sm font-medium text-content">{account.industry || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-content-disabled mb-0.5">Annual revenue</p>
                  <p className="text-sm font-bold text-content">{formatCurrency(account.annualRevenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-content-disabled mb-0.5">Account owner</p>
                  <p className="text-sm font-medium text-content">{account.accountOwner || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-content-disabled mb-0.5">Last activity</p>
                  <p className="text-sm font-medium text-content">
                    {account.lastActivity ? format(parseISO(account.lastActivity), 'MMM d, yyyy') : '—'}
                  </p>
                </div>
              </div>
            </Accordion>
          </div>

          {/* Pipeline */}
          <div className="border-b border-border">
            <Accordion label="Pipeline" defaultOpen={false}>
              <div className="grid grid-cols-2 gap-3 px-2 pb-1">
                <div>
                  <p className="text-xs text-content-disabled mb-0.5">Active opps</p>
                  <p className="text-2xl font-bold text-content">{account.activeOpportunities ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-content-disabled mb-0.5">Pipeline value</p>
                  <p className="text-2xl font-bold text-content">{formatCurrency(account.pipelineValue)}</p>
                </div>
              </div>
            </Accordion>
          </div>

          {/* Contacts */}
          <div>
            <Accordion label={`Contacts${contacts.length > 0 ? ` (${contacts.length})` : ''}`} defaultOpen={true}>
              <div className="flex flex-col gap-3 px-2 pb-1">
                {contacts.length === 0 ? (
                  <p className="text-xs text-content-disabled">No contacts linked.</p>
                ) : (
                  contacts.map(c => (
                    <div key={c.id || c.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                          style={{ backgroundColor: '#438974' }}
                        >
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-content truncate">{c.name}</p>
                          {c.title && <p className="text-xs text-content-disabled truncate">{c.title}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {c.phone && (
                          <a href={`tel:${c.phone}`} className="p-1 rounded hover:bg-surface text-content-disabled">
                            <Phone size={12} />
                          </a>
                        )}
                        {c.email && (
                          <a href={`mailto:${c.email}`} className="p-1 rounded hover:bg-surface text-content-disabled">
                            <Mail size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Accordion>
          </div>
        </div>
      </motion.div>
    </>
  )
}
