import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, ArrowRight, Phone, Mail, MapPin, MessageSquare, Building2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Badge from './Badge'
import Accordion from './Accordion'

export default function ContactDrawer({ contact, onClose }) {
  const navigate = useNavigate()

  if (!contact) return null

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
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold"
                style={{ backgroundColor: '#438974' }}
              >
                {contact.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-[#21272a] leading-tight truncate">{contact.name}</h2>
                {contact.title && (
                  <p className="text-xs text-[#838383] truncate">{contact.title}</p>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-content-disabled hover:text-content-subtlest shrink-0">
              <X size={16} />
            </button>
          </div>

          {/* Quick actions */}
          <div className="mt-3 flex items-center gap-2">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs text-content-subtlest hover:bg-surface"
              >
                <Phone size={12} />
                Call
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs text-content-subtlest hover:bg-surface"
              >
                <Mail size={12} />
                Email
              </a>
            )}
          </div>

          <button
            onClick={() => { navigate(`/contacts/${contact.id}`); onClose() }}
            className="mt-2 flex items-center gap-1 text-xs font-medium hover:underline"
            className="text-content-primary"
          >
            View details <ArrowRight size={12} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* About */}
          <div className="border-b border-border">
            <Accordion label="About" defaultOpen={true}>
              <div className="flex flex-col gap-3 px-2 pb-1">
                {contact.account && (
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-content-disabled shrink-0" />
                    <button
                      onClick={() => { navigate(`/accounts/${contact.accountId}`); onClose() }}
                      className="text-sm text-content-primary font-medium hover:underline"
                    >
                      {contact.account}
                    </button>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-content-disabled shrink-0" />
                    <span className="text-sm text-content">{contact.phone}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-content-disabled shrink-0" />
                    <span className="text-sm text-content">{contact.email}</span>
                  </div>
                )}
                {contact.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-content-disabled shrink-0" />
                    <span className="text-sm text-content">{contact.location}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div>
                    <p className="text-xs text-content-disabled mb-0.5">Engagement</p>
                    <Badge variant="engagement" value={contact.engagement} />
                  </div>
                  <div>
                    <p className="text-xs text-content-disabled mb-0.5">Last contacted</p>
                    <p className="text-sm font-medium text-content">
                      {contact.lastContacted ? format(parseISO(contact.lastContacted), 'MMM d, yyyy') : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-content-disabled mb-0.5">Account owner</p>
                    <p className="text-sm font-medium text-content">{contact.accountOwner || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-content-disabled mb-0.5">Preferred comm.</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MessageSquare size={12} className="text-content-disabled" />
                      <span className="text-sm text-content">{contact.preferredCommunication || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Accordion>
          </div>
        </div>
      </motion.div>
    </>
  )
}
