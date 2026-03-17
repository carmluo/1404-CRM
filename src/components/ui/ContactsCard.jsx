/**
 * ContactsCard — Figma node 1296:86068
 *
 * Card wrapper around ContactsContainer with section headers.
 *
 * Card:     bg-surface-elevated rounded-card p-[16px] flex flex-col gap-[20px]
 * Section 1 header: "Contacts" (body-2 bold text-black) + "Edit contacts" button
 *   Button: transparent h-[40px] px-[12px] py-[8px] rounded-[12px] text-body-3 font-bold text-content-primary
 * Section 2 header: "Suggested contacts" (body-2 bold text-content-subtlest) + AI pill
 *   AI pill: bg-brand border border-border-primary rounded-[100px] pl-[10px] pr-[12px] py-[4px] gap-[4px]
 *            Sparkles 16px text-content-primary + "AI" bold text-body-3 text-content-primary
 */
import { Sparkles } from 'lucide-react'
import ContactsContainer from './ContactsContainer'

function AIPill() {
  return (
    <div className="flex items-center gap-[4px] bg-brand border border-border-primary pl-[10px] pr-[12px] py-[4px] rounded-[100px] shrink-0">
      <Sparkles size={16} strokeWidth={1.75} className="text-content-primary shrink-0" />
      <span className="font-crm text-body-3 font-bold text-content-primary whitespace-nowrap">
        AI
      </span>
    </div>
  )
}

export default function ContactsCard({
  contacts = [],
  suggestedContacts = [],
  dismissedSuggested = [],
  acceptedSuggested = [],
  onContactClick,
  onEmail,
  onPhone,
  onAcceptSuggested,
  onDismissSuggested,
  onEditContacts,
}) {
  const visibleSuggested = suggestedContacts.filter(
    s => !dismissedSuggested.includes(s.name) && !acceptedSuggested.includes(s.name)
  )

  return (
    <div className="bg-surface-elevated rounded-card px-[8px] py-[12px] flex flex-col gap-[20px] overflow-x-clip">

      {/* ── Default contacts section ──────────────────────────── */}
      {contacts.length > 0 && (
        <div className="flex flex-col gap-[8px] px-[8px] w-full">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <p className="font-crm text-body-2 font-bold text-black leading-none">
              Contacts
            </p>
            <button
              onClick={onEditContacts}
              className="flex items-center justify-center h-[40px] px-[12px] py-[8px] rounded-[12px] font-crm text-body-3 font-bold text-content-primary hover:bg-brand transition-colors shrink-0"
            >
              Edit contacts
            </button>
          </div>
          {/* Table */}
          <ContactsContainer
            contacts={contacts}
            onContactClick={onContactClick}
            onEmail={onEmail}
            onPhone={onPhone}
          />
        </div>
      )}

      {/* ── Suggested contacts section ────────────────────────── */}
      {visibleSuggested.length > 0 && (
        <div className="flex flex-col gap-[8px] px-[8px] w-full">
          {/* Section header */}
          <div className="flex items-center gap-[12px]">
            <p className="font-crm text-body-2 font-bold text-content-subtlest leading-none whitespace-nowrap">
              Suggested contacts
            </p>
            <AIPill />
          </div>
          {/* Table */}
          <ContactsContainer
            suggestedContacts={suggestedContacts}
            dismissedSuggested={dismissedSuggested}
            acceptedSuggested={acceptedSuggested}
            onAcceptSuggested={onAcceptSuggested}
            onDismissSuggested={onDismissSuggested}
          />
        </div>
      )}

    </div>
  )
}
