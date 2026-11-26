import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList, CheckSquare, Bug, CheckCircle,
  ArrowUpRight, TrendingUp,
  PlusCircle, Zap, ArrowRight, ShieldCheck, UserCheck
} from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { useRequests } from '../context/RequestsContext'
import { useTasks } from '../context/TasksContext'
import { useBugs } from '../context/BugsContext'
import { useApprovals } from '../context/ApprovalsContext'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const SLA_DATA = [
  { service: 'Critical Incidents (P1)', compliance: 98.4, target: 99.0, status: 'Near Target' },
  { service: 'Hardware Provisioning', compliance: 96.2, target: 95.0, status: 'Healthy' },
  { service: 'Access & IAM Approvals', compliance: 99.1, target: 98.0, status: 'Exceeding' },
  { service: 'General IT Inquiries', compliance: 94.8, target: 95.0, status: 'Needs Attention' },
]

const WEEKLY_TREND = [
  { day: 'Mon', requests: 12, resolved: 10, tasks: 14 },
  { day: 'Tue', requests: 19, resolved: 15, tasks: 18 },
  { day: 'Wed', requests: 15, resolved: 14, tasks: 12 },
  { day: 'Thu', requests: 22, resolved: 18, tasks: 20 },
  { day: 'Fri', requests: 18, resolved: 19, tasks: 16 },
  { day: 'Sat', requests: 6, resolved: 7, tasks: 5 },
  { day: 'Sun', requests: 4, resolved: 4, tasks: 3 },
]

const CATEGORY_DISTRIBUTION = [
  { name: 'Hardware', value: 35, color: '#6D4AFF' },
  { name: 'Software', value: 30, color: '#A78BFA' },
  { name: 'Access & Permissions', value: 20, color: '#8B5CF6' },
  { name: 'Network', value: 10, color: '#10B981' },
  { name: 'General IT', value: 5, color: '#64748B' },
]

export default function DashboardPage() {
  const { user, switchRole } = useAuth()
  const { requests = [] } = useRequests() || {}
  const { tasks = [] } = useTasks() || {}
  const { bugs = [] } = useBugs() || {}
  const { approvals = [] } = useApprovals() || {}
  const [dateRange, setDateRange] = useState('7d')

  // Current persona detection
  const currentRole = user?.role || 'Admin'
  const isTeamLead = currentRole === 'Team Lead'
  const isEmployee = currentRole === 'Employee'

  // Real KPI calculations
  const openRequestsCount = requests.filter(r => !['Resolved', 'Closed', 'Cancelled', 'Rejected'].includes(r.status)).length
  const activeTasksCount = tasks.filter(t => t.status !== 'COMPLETED').length
  const openBugsCount = bugs.filter(b => !['CLOSED', 'FIXED'].includes(b.status)).length
  const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length

  // Stats tailored across the 3 dashboards
  const STATS = useMemo(() => {
    if (isEmployee) {
      return [
        {
          label: 'My Open Requests',
          value: requests.filter(r => r.createdBy === user?.name && !['Resolved', 'Closed'].includes(r.status)).length || 2,
          change: 'In service pipeline',
          icon: ClipboardList,
          color: 'text-[#6D4AFF]',
          bg: 'bg-[#F4F2FF]',
          link: '/requests',
        },
        {
          label: 'My Active Tasks',
          value: tasks.filter(t => t.assignee === user?.name && t.status !== 'COMPLETED').length || 3,
          change: 'Assigned to sprint',
          icon: CheckSquare,
          color: 'text-[#6D4AFF]',
          bg: 'bg-[#F4F2FF]',
          link: '/tasks',
        },
        {
          label: 'Pending Approvals',
          value: approvals.filter(a => a.requestor === user?.name && a.status === 'PENDING').length || 1,
          change: 'Under manager review',
          icon: CheckCircle,
          color: 'text-amber-500',
          bg: 'bg-amber-50',
          link: '/approvals',
        },
        {
          label: 'Resolved This Month',
          value: requests.filter(r => r.createdBy === user?.name && r.status === 'Closed').length || 4,
          change: 'Completed requests',
          icon: ShieldCheck,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50',
          link: '/requests',
        },
      ]
    }

    if (isTeamLead) {
      return [
        {
          label: 'Team Requests',
          value: openRequestsCount,
          change: '+3 assigned to dept',
          icon: ClipboardList,
          color: 'text-[#6D4AFF]',
          bg: 'bg-[#F4F2FF]',
          link: '/requests',
        },
        {
          label: 'Sprint Work Orders',
          value: activeTasksCount,
          change: `${tasks.filter(t => t.priority === 'Urgent').length} urgent items`,
          icon: CheckSquare,
          color: 'text-[#6D4AFF]',
          bg: 'bg-[#F4F2FF]',
          link: '/tasks',
        },
        {
          label: 'Department Approvals',
          value: pendingApprovalsCount,
          change: 'Sign-off required',
          icon: CheckCircle,
          color: 'text-amber-500',
          bg: 'bg-amber-50',
          link: '/approvals',
        },
        {
          label: 'Escalated Bugs',
          value: openBugsCount,
          change: 'Under investigation',
          icon: Bug,
          color: 'text-rose-500',
          bg: 'bg-rose-50',
          link: '/bugs',
        },
      ]
    }

    // Default Admin Dashboard
    return [
      {
        label: 'Open Service Requests',
        value: openRequestsCount,
        change: '+4 new today',
        icon: ClipboardList,
        color: 'text-[#6D4AFF]',
        bg: 'bg-[#F4F2FF]',
        link: '/requests',
      },
      {
        label: 'Active Work Tasks',
        value: activeTasksCount,
        change: `${tasks.filter(t => t.priority === 'Urgent').length} high priority`,
        icon: CheckSquare,
        color: 'text-[#6D4AFF]',
        bg: 'bg-[#F4F2FF]',
        link: '/tasks',
      },
      {
        label: 'Open System Defects',
        value: openBugsCount,
        change: `${bugs.filter(b => b.severity === 'Critical').length} critical escalations`,
        icon: Bug,
        color: 'text-rose-500',
        bg: 'bg-rose-50',
        link: '/bugs',
      },
      {
        label: 'Pending Governance',
        value: pendingApprovalsCount,
        change: 'Authorization required',
        icon: CheckCircle,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        link: '/approvals',
      },
    ]
  }, [isEmployee, isTeamLead, openRequestsCount, activeTasksCount, openBugsCount, pendingApprovalsCount, requests, tasks, bugs, approvals, user])

  // Dynamic Recent Activity compiled from context entities
  const recentActivities = useMemo(() => {
    const list = []
    requests.slice(0, 3).forEach(r => {
      list.push({
        id: `act-req-${r.id}`,
        entityId: r.id,
        type: 'request',
        title: `Service Request: ${r.title}`,
        actor: r.createdBy || 'Sarah Jenkins',
        time: '15m ago',
        status: r.status,
        color: 'purple',
        icon: ClipboardList,
        link: '/requests',
      })
    })
    tasks.slice(0, 2).forEach(t => {
      list.push({
        id: `act-tsk-${t.id}`,
        entityId: t.id,
        type: 'task',
        title: `Work Task: ${t.title}`,
        actor: t.assignee || 'James Wilson',
        time: '1h ago',
        status: t.status,
        color: 'indigo',
        icon: CheckSquare,
        link: '/tasks',
      })
    })
    bugs.slice(0, 2).forEach(b => {
      list.push({
        id: `act-bug-${b.id}`,
        entityId: b.id,
        type: 'bug',
        title: `Defect Logged: ${b.title}`,
        actor: b.reportedBy || 'Tara Anand',
        time: '3h ago',
        status: b.severity,
        color: b.severity === 'Critical' ? 'red' : 'amber',
        icon: Bug,
        link: '/bugs',
      })
    })
    return list.slice(0, 5)
  }, [requests, tasks, bugs])

  const QUICK_ACTIONS = useMemo(() => {
    if (isEmployee) {
      return [
        {
          title: 'New Service Request',
          description: 'Request hardware, software access, or workspace setup',
          icon: PlusCircle,
          link: '/requests',
          badge: 'Fast Track',
          color: 'from-[#F4F2FF] to-transparent border-[#EDE8FA]',
          iconColor: 'text-[#6D4AFF]',
        },
        {
          title: 'My Work Tasks',
          description: 'Review assigned tickets and daily sprint tasks',
          icon: CheckSquare,
          link: '/tasks',
          badge: 'Assigned',
          color: 'from-[#FFFFFF] to-transparent border-[#EDE8FA]',
          iconColor: 'text-[#6D4AFF]',
        },
        {
          title: 'Report Incident',
          description: 'Log an application glitch or IT equipment issue',
          icon: Bug,
          link: '/bugs',
          badge: 'IT Support',
          color: 'from-rose-50/60 to-transparent border-rose-100',
          iconColor: 'text-rose-600',
        },
        {
          title: 'My Approvals Status',
          description: 'Check status of pending equipment and access sign-offs',
          icon: CheckCircle,
          link: '/approvals',
          badge: 'Status',
          color: 'from-amber-50/60 to-transparent border-amber-100',
          iconColor: 'text-amber-600',
        },
      ]
    }

    if (isTeamLead) {
      return [
        {
          title: 'Dispatch Team Request',
          description: 'Allocate incoming requests to department members',
          icon: PlusCircle,
          link: '/requests',
          badge: 'Dispatch',
          color: 'from-[#F4F2FF] to-transparent border-[#EDE8FA]',
          iconColor: 'text-[#6D4AFF]',
        },
        {
          title: 'Sprint Board',
          description: 'Manage departmental tasks across Kanban lanes',
          icon: CheckSquare,
          link: '/tasks',
          badge: 'Sprint 24',
          color: 'from-[#FFFFFF] to-transparent border-[#EDE8FA]',
          iconColor: 'text-[#6D4AFF]',
        },
        {
          title: 'Review Approvals',
          description: 'Sign off on employee hardware & permission requests',
          icon: CheckCircle,
          link: '/approvals',
          badge: `${pendingApprovalsCount} Action Required`,
          color: 'from-amber-50/60 to-transparent border-amber-100',
          iconColor: 'text-amber-600',
        },
        {
          title: 'Team Directory',
          description: 'Oversee team members, skills, and workload distribution',
          icon: UserCheck,
          link: '/team',
          badge: '6 Members',
          color: 'from-[#F4F2FF] to-transparent border-[#EDE8FA]',
          iconColor: 'text-[#6D4AFF]',
        },
      ]
    }

    // Admin Quick Actions
    return [
      {
        title: 'Submit IT Request',
        description: 'Workplace gear, software license, or permissions',
        icon: PlusCircle,
        link: '/requests',
        badge: 'Fast Track',
        color: 'from-[#F4F2FF] to-transparent border-[#EDE8FA]',
        iconColor: 'text-[#6D4AFF]',
      },
      {
        title: 'Work Orders & Tasks',
        description: 'Sprint backlogs, tickets, and team board',
        icon: CheckSquare,
        link: '/tasks',
        badge: 'Sprint 24',
        color: 'from-[#FFFFFF] to-transparent border-[#EDE8FA]',
        iconColor: 'text-[#6D4AFF]',
      },
      {
        title: 'Report Incident or Bug',
        description: 'Log production defect or system outage',
        icon: Bug,
        link: '/bugs',
        badge: 'SLA Guard',
        color: 'from-rose-50/60 to-transparent border-rose-100',
        iconColor: 'text-rose-600',
      },
      {
        title: 'Review Governance',
        description: 'Sign off on pending departmental approvals',
        icon: CheckCircle,
        link: '/approvals',
        badge: `${pendingApprovalsCount} Pending`,
        color: 'from-amber-50/60 to-transparent border-amber-100',
        iconColor: 'text-amber-600',
      },
    ]
  }, [isEmployee, isTeamLead, pendingApprovalsCount])

  return (
    <div className="space-y-6 pb-10">
      {/* Welcome Banner with Role View Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D4AFF] bg-[#F4F2FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full">
              {isEmployee ? 'Employee Self-Service' : isTeamLead ? 'Team Lead Oversight' : 'SaaS Operations'}
            </span>
            <span className="text-xs text-[#64748B] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1E1B2E] tracking-tight mt-1">
            {isEmployee ? 'Service & Task Launchpad' : isTeamLead ? 'Operations & Approvals Hub' : 'Enterprise Command Center'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            {isEmployee
              ? `Active requests, work tickets & equipment access for ${user?.name || 'James Wilson'}`
              : isTeamLead
              ? `Departmental dispatch, sprint oversight & sign-offs for ${user?.name || 'Sarah Chen'}`
              : `Real-time telemetry, service dispatch & workflow governance for ${user?.name || 'Tara Anand'}`}
          </p>
        </div>

        {/* Action Controls & Role Verification Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Dashboard Role Selector */}
          <div className="flex items-center rounded-xl border border-[#EDE8FA] bg-[#FFFFFF] p-1 text-xs shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-2 hidden sm:inline">Role View:</span>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                currentRole === 'Admin'
                  ? 'bg-[#6D4AFF] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#6D4AFF]'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => switchRole('teamLead')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                currentRole === 'Team Lead'
                  ? 'bg-[#6D4AFF] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#6D4AFF]'
              }`}
            >
              Team Lead
            </button>
            <button
              onClick={() => switchRole('employee')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                currentRole === 'Employee'
                  ? 'bg-[#6D4AFF] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#6D4AFF]'
              }`}
            >
              Employee
            </button>
          </div>

          {/* Date Filter selector */}
          <div className="flex items-center rounded-xl border border-[#EDE8FA] bg-[#FFFFFF] p-1 text-xs shadow-2xs">
            {['Today', '7d', '30d', 'Quarter'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  dateRange === range
                    ? 'bg-[#6D4AFF] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#6D4AFF]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Link to="/requests">
            <Button variant="primary" size="sm" iconRight={<ArrowUpRight size={13} />}>
              Create Request
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Clean White KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, icon: Icon, color, bg, link }) => (
          <Link key={label} to={link} className="group">
            <Card hover className="h-full border border-[#EDE8FA] bg-[#FFFFFF] rounded-2xl shadow-xs transition-all duration-200 hover:shadow-md hover:border-[#A78BFA]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#64748B]">{label}</p>
                  <p className="text-3xl font-extrabold text-[#1E1B2E] mt-1 tracking-tight">{value}</p>
                  <span className="text-[11px] text-[#64748B] flex items-center gap-1 mt-2 font-medium">
                    <TrendingUp size={12} className="text-emerald-500" /> {change}
                  </span>
                </div>
                <div className={`flex items-center justify-center h-12 w-12 rounded-2xl shrink-0 ${bg} group-hover:scale-105 transition-transform`}>
                  <Icon size={22} className={color} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Action Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#6D4AFF] flex items-center gap-1.5">
            <Zap size={14} /> Quick Workflow Actions
          </h2>
          <span className="text-[11px] text-[#64748B]">One-click enterprise dispatch</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {QUICK_ACTIONS.map(({ title, description, icon: ActionIcon, link, badge, color, iconColor }) => (
            <Link key={title} to={link} className="block group">
              <div className={`p-4 rounded-2xl bg-[#FFFFFF] border border-[#EDE8FA] bg-gradient-to-br ${color} shadow-xs hover:shadow-md hover:border-[#6D4AFF] transition-all duration-150 relative h-full flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-[#F4F2FF]">
                      <ActionIcon size={18} className={iconColor} />
                    </div>
                    <span className="text-[10px] font-bold text-[#64748B] bg-[#FFFFFF] px-2 py-0.5 rounded-full border border-[#EDE8FA]">
                      {badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1E1B2E] group-hover:text-[#6D4AFF] transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                    {description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#6D4AFF] pt-1">
                  <span>Open workspace</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Section: Velocity AreaChart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Activity Volume Chart */}
        <Card className="lg:col-span-2 rounded-2xl border border-[#EDE8FA] bg-[#FFFFFF] shadow-xs">
          <CardHeader
            title="Weekly Request & Task Velocity"
            subtitle="Comparing incoming requests vs resolved service items over the past 7 days"
            action={
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-[#6D4AFF] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6D4AFF]" /> Incoming
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Resolved
                </span>
              </div>
            }
          />
          <div className="h-[270px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D4AFF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6D4AFF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE8FA" opacity={0.7} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#EDE8FA',
                    borderRadius: '10px',
                    color: '#1E1B2E',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(109,74,255,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="#6D4AFF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReq)" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown Pie */}
        <Card className="rounded-2xl border border-[#EDE8FA] bg-[#FFFFFF] shadow-xs">
          <CardHeader
            title="Service Domain Distribution"
            subtitle="Request classification breakdown"
          />
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#EDE8FA',
                    borderRadius: '10px',
                    color: '#1E1B2E',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(109,74,255,0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {CATEGORY_DISTRIBUTION.slice(0, 4).map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#64748B]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="font-bold text-[#1E1B2E]">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Grid: Recent Activity Feed & SLA Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2 rounded-2xl border border-[#EDE8FA] bg-[#FFFFFF] shadow-xs">
          <CardHeader
            title="Recent Activity Ledger"
            subtitle="Live operational stream across requests, tasks, bugs and approvals"
            action={<Link to="/reports" className="text-xs text-[#6D4AFF] hover:text-[#5B3CE6] font-semibold flex items-center gap-1">Full Ledger <ArrowRight size={12} /></Link>}
          />
          <div className="divide-y divide-[#EDE8FA]">
            {recentActivities.map(act => {
              const ActIcon = act.icon
              return (
                <div key={act.id} className="py-3 flex items-center justify-between gap-3 group hover:bg-[#F4F2FF]/50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-[#F4F2FF] flex items-center justify-center shrink-0 text-[#6D4AFF]">
                      <ActIcon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link to={act.link} className="font-mono text-xs font-bold text-[#6D4AFF] hover:underline">
                          {act.entityId}
                        </Link>
                        <span className="text-xs font-semibold text-[#1E1B2E] truncate">
                          {act.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Initiated by <span className="font-medium text-[#1E1B2E]">{act.actor}</span> &bull; {act.time}
                      </p>
                    </div>
                  </div>
                  <Badge color={act.color} className="shrink-0">{act.status}</Badge>
                </div>
              )
            })}
          </div>
        </Card>

        {/* SLA Health Monitor & Priority Queue */}
        <Card className="rounded-2xl border border-[#EDE8FA] bg-[#FFFFFF] shadow-xs flex flex-col justify-between">
          <div>
            <CardHeader
              title="SLA Compliance Status"
              subtitle="Performance against target service level commitments"
            />
            <div className="space-y-4">
              {SLA_DATA.map(item => (
                <div key={item.service} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1E1B2E]">{item.service}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748B]">Target: {item.target}%</span>
                      <span className={`font-bold ${item.compliance >= item.target ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {item.compliance}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F4F2FF] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.compliance >= item.target ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, item.compliance)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Approvals footer pill */}
          <div className="mt-5 p-3 rounded-xl bg-[#FFFFFF] border border-[#EDE8FA] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#1E1B2E]">Pending Approvals</p>
              <p className="text-[11px] text-[#64748B]">{pendingApprovalsCount} authorization requests</p>
            </div>
            <Link to="/approvals">
              <Button size="xs" variant="primary">Review</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
