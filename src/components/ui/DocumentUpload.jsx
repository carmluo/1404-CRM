// Figma node 1478:11018 — file upload dropzone
// Container: border border-dashed border-border rounded-card flex gap-4 items-center px-4 py-3 w-full
// Icon: FilePlus2 size-[32px] text-content-subtlest shrink-0
// Labels: "Upload documents" font-crm text-body-3 font-bold text-content-subtlest
//         "Drag & drop or click to browse" font-crm text-[12px] font-medium text-content-subtlest
// Hover: border-border-hover bg-surface
// Behavior: click triggers hidden file input; drag & drop supported; onUpload(files) called immediately

import { useRef, useState } from 'react'
import { FilePlus2 } from 'lucide-react'

export default function DocumentUpload({ onUpload }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFiles(files) {
    if (!files || files.length === 0) return
    onUpload?.(Array.from(files))
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full flex items-center gap-4 px-4 py-3 rounded-card
        border border-dashed transition-colors text-left
        ${isDragging
          ? 'border-border-hover bg-surface'
          : 'border-border hover:border-border-hover hover:bg-surface'}
      `}
    >
      <FilePlus2 className="w-[28.667px] h-[31.833px] text-content-subtlest shrink-0" />
      <div className="flex flex-col gap-1 min-w-0">
        <span className="font-crm text-body-3 font-bold text-content-subtlest">
          Upload documents
        </span>
        <span className="font-crm text-[12px] font-medium text-content-subtlest">
          Drag &amp; drop or click to browse
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={e => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </button>
  )
}
