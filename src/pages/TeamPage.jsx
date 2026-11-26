import { useState, useMemo } from 'react'
import {
  Plus, Search, Mail, Phone, MapPin,
  Edit, Trash2,
  Calendar
} from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import { useTeam } from '../context/TeamContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ui/Toast'
import { ROLES, ROLE_COLORS, TEAM_DEPARTMENTS } from '../data/teamData'
import { formatDate } from '../utils/helpers'

export default function TeamPage() {
  const { members, addMember, updateMember, toggleMemberStatus, deleteMember } = useTeam()
  const { toasts, toast, dismiss } = useToast()

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [selectedProfile, setSelectedProfile] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    department: 'Engineering',
    title: 'Senior Engineer',
    phone: '+1 (555) 000-0000',
    location: 'Remote',
    bio: '',
  })

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.title.toLowerCase().includes(search.toLowerCase())
      const matchRole = roleFilter ? m.role === roleFilter : true
      const matchDept = deptFilter ? m.department === deptFilter : true
      return matchSearch && matchRole && matchDept
    })
  }, [members, search, roleFilter, deptFilter])

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and Email are required')
      return
    }
    const newEmp = addMember(formData)
    toast.success(`Employee ${newEmp.name} added to directory`)
    setAddModalOpen(false)
    setFormData({
      name: '',
      email: '',
      role: 'Employee',
      department: 'Engineering',
      title: 'Senior Engineer',
      phone: '+1 (555) 000-0000',
      location: 'Remote',
      bio: '',
    })
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    updateMember(editingMember.id, editingMember)
    toast.success('Employee credentials updated')
    setEditingMember(null)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">
            Team & Access Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Administer employee accounts, organizational departments and role-based permissions
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          iconLeft={<Plus size={14} />}
          onClick={() => setAddModalOpen(true)}
        >
          Add Team Member
        </Button>
      </div>

      {/* Role Counts Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ROLES.map(role => {
          const count = members.filter(m => m.role === role).length
          return (
            <div
              key={role}
              onClick={() => setRoleFilter(r => r === role ? '' : role)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${roleFilter === role
                  ? 'border-blue-500 bg-[#F4F2FF]/50 '
                  : 'border-[#EDE8FA]  bg-white '
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">{role}</span>
                <Badge color={ROLE_COLORS[role]} dot>{count}</Badge>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-1">{count}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {role === 'Admin' ? 'Full system administration' : role === 'Team Lead' ? 'Department approvals & oversight' : 'Standard employee access'}
              </p>
            </div>
          )
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#EDE8FA] shadow-xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee by name, email, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-[#EDE8FA] bg-slate-50 text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6D4AFF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-[#EDE8FA] bg-white text-slate-700 focus:outline-none"
          >
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-[#EDE8FA] bg-white text-slate-700 focus:outline-none"
          >
            <option value="">All Departments</option>
            {TEAM_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {(search || roleFilter || deptFilter) && (
            <button
              onClick={() => { setSearch(''); setRoleFilter(''); setDeptFilter('') }}
              className="text-xs text-[#6D4AFF] hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Team Roster Table */}
      <div className="rounded-xl border border-[#EDE8FA] overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#EDE8FA] text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Department & Title</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Tenure</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map(member => (
                <tr
                  key={member.id}
                  onClick={() => setSelectedProfile(member)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={member.name} size="sm" />
                      <div>
                        <p className="font-semibold text-slate-800">{member.name}</p>
                        <p className="text-[11px] text-slate-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-800">{member.title}</p>
                    <p className="text-[11px] text-slate-400">{member.department}</p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge color={ROLE_COLORS[member.role]}>
                      {member.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleMemberStatus(member.id)
                        toast.info(`Status toggled for ${member.name}`)
                      }}
                      className="cursor-pointer"
                    >
                      <Badge color={member.status === 'Active' ? 'green' : 'slate'} dot>
                        {member.status}
                      </Badge>
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                    {member.location}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                    {formatDate(member.joinDate)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="p-1 rounded text-slate-400 hover:text-[#6D4AFF] transition-colors"
                        title="Edit Details"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          deleteMember(member.id)
                          toast.info(`Employee removed from directory`)
                        }}
                        className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Profile Modal */}
      {selectedProfile && (
        <Modal
          open={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          title="Enterprise Profile Dossier"
          size="md"
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedProfile(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <Avatar name={selectedProfile.name} size="lg" />
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">{selectedProfile.name}</h3>
                <p className="text-xs text-slate-500">{selectedProfile.title} • {selectedProfile.department}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge color={ROLE_COLORS[selectedProfile.role]}>{selectedProfile.role}</Badge>
                  <Badge color={selectedProfile.status === 'Active' ? 'green' : 'slate'} dot>{selectedProfile.status}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Work Email</span>
                <span className="font-medium flex items-center gap-1 mt-0.5"><Mail size={12} /> {selectedProfile.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Phone Number</span>
                <span className="font-medium flex items-center gap-1 mt-0.5"><Phone size={12} /> {selectedProfile.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Assigned Office</span>
                <span className="font-medium flex items-center gap-1 mt-0.5"><MapPin size={12} /> {selectedProfile.location}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Tenure Date</span>
                <span className="font-medium flex items-center gap-1 mt-0.5"><Calendar size={12} /> {formatDate(selectedProfile.joinDate)}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase mb-1">Executive Summary</span>
              <p className="p-2.5 rounded bg-slate-50 text-slate-600 leading-relaxed">
                {selectedProfile.bio}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase mb-1.5">Core Competencies & Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedProfile.skills || []).map(skill => (
                  <span key={skill} className="px-2 py-0.5 rounded-md bg-blue-100 text-[#6D4AFF] font-medium text-[11px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Member Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Enterprise Team Member"
        size="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-3.5">
          <Input
            label="Full Legal Name *"
            placeholder="e.g. Rachel Adams"
            value={formData.name}
            onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
            fullWidth
          />
          <Input
            label="Corporate Email Address *"
            type="email"
            placeholder="rachel.adams@accesscore.io"
            value={formData.email}
            onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
            fullWidth
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(f => ({ ...f, role: e.target.value }))}
                className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(f => ({ ...f, department: e.target.value }))}
                className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
              >
                {TEAM_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <Input
            label="Job Title"
            placeholder="e.g. Infrastructure Engineer"
            value={formData.title}
            onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
            fullWidth
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Member Modal */}
      {editingMember && (
        <Modal
          open={!!editingMember}
          onClose={() => setEditingMember(null)}
          title={`Edit Profile — ${editingMember.name}`}
          size="md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              value={editingMember.name}
              onChange={(e) => setEditingMember(m => ({ ...m, name: e.target.value }))}
              fullWidth
            />
            <Input
              label="Work Email"
              value={editingMember.email}
              onChange={(e) => setEditingMember(m => ({ ...m, email: e.target.value }))}
              fullWidth
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Role</label>
                <select
                  value={editingMember.role}
                  onChange={(e) => setEditingMember(m => ({ ...m, role: e.target.value }))}
                  className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Department</label>
                <select
                  value={editingMember.department}
                  onChange={(e) => setEditingMember(m => ({ ...m, department: e.target.value }))}
                  className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
                >
                  {TEAM_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <Input
              label="Job Title"
              value={editingMember.title}
              onChange={(e) => setEditingMember(m => ({ ...m, title: e.target.value }))}
              fullWidth
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingMember(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Update Record
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
