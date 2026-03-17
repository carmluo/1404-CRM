import React from 'react'
import { Phone, X } from 'lucide-react'

export default function PhoneModal({ isOpen, onClose, contact, phone, company }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-8 w-80 flex flex-col items-center gap-4"
        style={{ zIndex: 51 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ backgroundColor: '#2B6B52' }}
        >
          {contact ? contact.charAt(0) : 'C'}
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#21272a]">{contact || 'Contact'}</h3>
          {company && <p className="text-sm text-[#838383] mt-0.5">{company}</p>}
        </div>

        <div className="text-2xl font-bold text-[#21272a] tracking-wide">
          {phone || 'N/A'}
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-[#e5e5e5] text-[#565656] text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <a
            href={`tel:${phone}`}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 text-white text-sm font-medium transition-colors"
            style={{ backgroundColor: '#2B6B52' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E5240'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2B6B52'}
          >
            <Phone size={16} />
            Call
          </a>
        </div>
      </div>
    </div>
  )
}
