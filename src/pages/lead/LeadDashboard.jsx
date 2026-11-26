import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, CheckSquare, ClipboardList, Bug, CheckCircle,
  TrendingUp, PlusCircle, ArrowRight, UserCheck, ShieldCheck
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useRequests } from '../../context/RequestsContext'
import { useTasks } from '../../context/TasksContext'
import { useBugs } from '../../context/BugsContext'
import { useApprovals } from '../../context/ApprovalsContext'
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const TEAM_VELOCITY = [
  { day: 'Mon', completed: 8, assigned: 10 },
  { day: 'Tue', completed: 12, assigned: 14 },
  { day: 'Wed', completed: 10, assigned: 11 },
  { day: 'Thu', completed: 15, assigned: 16 },
  { day: 'Fri', completed: 14, assigned: 12 },
]

export default function LeadDashboard() {
  const { user } = useAuth()
  const { requests = [] } = useRequests() || {}
  const { tasks = [] } = useTasks() || {}
  const { bugs = [] } = useBugs() || {}
  const { approvals = [] } = useApprovals() || {}

  const activeTeamTasks = tasks.filter(t => t.status !== 'COMPLETED').length
  const pendingApprovals = approvals.filter(a => a.status === 'PENDING').length
  const teamBugs = bugs.filter(b => !['CLOSED', 'FIXED'].includes(b.status)).length

  const STATS = [
    {
      label: 'Team Active Tasks',
      value: activeTeamTasks || 16,
      change: '8 currently in progress',
      icon: CheckSquare,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      link: '/lead/tasks',
    },
    {
      label: 'Pending Team Approvals',
      value: pendingApprovals || 5,
      change: 'Action required',
      icon: CheckCircle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      link: '/lead/approvals',
    },
    {
      label: 'Active Service Requests',
      value: requests.length || 12,
      change: '4 high priority',
      icon: ClipboardList,
      color: 'text-[#6D4AFF]',
      bg: 'bg-[#6D4AFF]/10',
      link: '/lead/requests',
    },
    {
      label: 'Unresolved Bugs',
      value: teamBugs || 4,
      change: '1 assigned to sprint',
      icon: Bug,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      link: '/lead/bugs',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Lead Header Banner */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#EDE8FA] p-6 shadow-[0_8px_30px_rgba(109,74,255,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Operations & Team Supervision
            </span>
            <span className="text-xs text-[#94A3B8]">Sprint 42 Operations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E1B2E]">
            Team Portal — {user?.name || 'Sarah Chen'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Monitor sprint velocity, distribute workload, manage service tickets, and decide approvals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/lead/assign-task">
            <Button variant="secondary" size="sm">
              <PlusCircle size={14} className="mr-1.5" />
              Assign Task
            </Button>
          </Link>
          <Link to="/lead/approvals">
            <Button variant="primary" size="sm">
              <CheckCircle size={14} className="mr-1.5" />
              Decide Approvals
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} to={stat.link}>
              <Card className="hover:border-emerald-500 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#64748B]">{stat.label}</span>
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-[#1E1B2E]">{stat.value}</span>
                  <span className="text-[11px] font-medium text-emerald-600">{stat.change}</span>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Team Velocity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#1E1B2E]">Team Sprint Delivery Velocity</h2>
              <p className="text-xs text-[#64748B]">Assigned vs completed tasks by sprint day</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              92% Completion Rate
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEAM_VELOCITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F0F7" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="assigned" fill="#A78BFA" radius={[4, 4, 0, 0]} name="Assigned Tasks" />
                <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Delegation Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#1E1B2E] mb-1">Supervisor Quick Delegation</h2>
            <p className="text-xs text-[#64748B] mb-4">Immediate operational actions for your team</p>

            <div className="space-y-3">
              <Link to="/lead/members" className="flex items-center justify-between p-3 rounded-xl bg-[#F4F2FF] hover:bg-[#EDE8FF] transition-colors border border-[#EDE8FA]">
                <div className="flex items-center gap-2.5">
                  <UserCheck size={18} className="text-[#6D4AFF]" />
                  <div>
                    <p className="text-xs font-bold text-[#1E1B2E]">Team Roster</p>
                    <p className="text-[11px] text-[#64748B]">View active operators & workloads</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#6D4AFF]" />
              </Link>

              <Link to="/lead/tasks" className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/60 transition-colors border border-emerald-100">
                <div className="flex items-center gap-2.5">
                  <CheckSquare size={18} className="text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-[#1E1B2E]">Sprint Board</p>
                    <p className="text-[11px] text-[#64748B]">Kanban workflow lanes</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-emerald-600" />
              </Link>

              <Link to="/lead/performance" className="flex items-center justify-between p-3 rounded-xl bg-amber-50 hover:bg-amber-100/60 transition-colors border border-amber-100">
                <div className="flex items-center gap-2.5">
                  <TrendingUp size={18} className="text-amber-600" />
                  <div>
                    <p className="text-xs font-bold text-[#1E1B2E]">Performance Metrics</p>
                    <p className="text-[11px] text-[#64748B]">SLA times and resolution rates</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-amber-600" />
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EDE8FA]">
            <Link to="/lead/approvals">
              <Button variant="primary" fullWidth size="sm">
                Review Pending Approvals ({pendingApprovals})
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
