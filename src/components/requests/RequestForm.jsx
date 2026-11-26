import { useState } from 'react'
import { X, Upload, Paperclip } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { SelectField, TextareaField } from './RequestShared'
import { CATEGORIES, PRIORITIES, DEPARTMENTS } from '../../data/requestsData'
import { cn } from '../../utils/helpers'

const EMPTY_FORM = {
  title: '',
  category: '',
  description: '',
  priority: 'Medium',
  department: '',
  attachments: [],
}

function validate(form) {
  const errs = {}
  if (!form.title.trim()) errs.title = 'Title is required'
  else if (form.title.trim().length < 5) errs.title = 'Title must be at least 5 characters'
  if (!form.category) errs.category = 'Please select a category'
  if (!form.description.trim()) errs.description = 'Description is required'
  else if (form.description.trim().length < 10) errs.description = 'Description must be at least 10 characters'
  if (!form.department) errs.department = 'Please select a department'
  return errs
}

export default function RequestForm({ onSubmit, onCancel, initialData = null }) {
  const isEdit = !!initialData
  const [form, setForm] = useState(initialData ? {
    title: initialData.title,
    category: initialData.category,
    description: initialData.description,
    priority: initialData.priority,
    department: initialData.department,
    attachments: initialData.attachments || [],
  } : EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleAttachment = (files) => {
    const names = Array.from(files).map(f => f.name)
    setForm(f => ({ ...f, attachments: [...new Set([...f.attachments, ...names])] }))
  }

  const removeAttachment = (name) =>
    setForm(f => ({ ...f, attachments: f.attachments.filter(a => a !== name) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    onSubmit(form)
    setLoading(false)
    if (!isEdit) setForm(EMPTY_FORM)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title — full width */}
        <div className="md:col-span-2">
          <Input
            id="req-title"
            label="Request Title"
            placeholder="Briefly describe what you need"
            fullWidth
            value={form.title}
            onChange={set('title')}
            error={errors.title}
          />
          {!errors.title && (
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-red-500">*</span> required
            </p>
          )}
        </div>

        {/* Category */}
        <SelectField
          id="req-category"
          label="Category"
          required
          value={form.category}
          onChange={set('category')}
          options={CATEGORIES}
          placeholder="Select a category…"
          error={errors.category}
        />

        {/* Priority */}
        <SelectField
          id="req-priority"
          label="Priority"
          value={form.priority}
          onChange={set('priority')}
          options={PRIORITIES}
        />

        {/* Department */}
        <SelectField
          id="req-dept"
          label="Department"
          required
          value={form.department}
          onChange={set('department')}
          options={DEPARTMENTS}
          placeholder="Select department…"
          error={errors.department}
        />

        {/* Description — full width */}
        <div className="md:col-span-2">
          <TextareaField
            id="req-desc"
            label="Description"
            required
            value={form.description}
            onChange={set('description')}
            placeholder="Provide full details about your request, including any relevant context…"
            rows={5}
            error={errors.description}
          />
        </div>

        {/* Attachment upload — full width */}
        <div className="md:col-span-2">
          <p className="text-xs font-medium text-slate-600 mb-1">
            Attachments <span className="text-slate-400 font-normal">(optional)</span>
          </p>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleAttachment(e.dataTransfer.files) }}
            className={cn( 'relative border-2 border-dashed rounded-xl p-5 text-center transition-colors duration-150', dragOver ? 'border-purple-400 bg-[#F4F2FF] ' : 'border-[#EDE8FA] hover:border-[#A78BFA] ' )}
          >
            <input
              type="file"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleAttachment(e.target.files)}
            />
            <Upload size={20} className="mx-auto mb-2 text-[#6D4AFF]" />
            <p className="text-xs text-slate-500">
              Drag & drop files here, or <span className="text-[#6D4AFF] font-semibold">browse</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">PDF, PNG, JPG, DOCX — max 10MB each</p>
          </div>

          {/* File list */}
          {form.attachments.length > 0 && (
            <ul className="mt-2 space-y-1">
              {form.attachments.map(name => (
                <li key={name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <Paperclip size={13} className="text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-700 flex-1 truncate">{name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(name)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Remove"
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
        <Button type="button" variant="ghost" size="md" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" loading={loading}>
          {isEdit ? 'Save Changes' : 'Submit Request'}
        </Button>
      </div>
    </form>
  )
}
