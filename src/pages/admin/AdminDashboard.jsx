import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList, CheckSquare, Bug, CheckCircle,
  ArrowUpRight, TrendingUp, Users, ShieldAlert,
  PlusCircle, Zap, ArrowRight, ShieldCheck, UserCheck,
  Server, Lock, BarChart3, Settings
} from 'lucide-react'
import Card, { CardHeader } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useRequests } from '../../context/RequestsContext'
import { useTasks } from '../../context/TasksContext'
import { useBugs } from '../../context/BugsContext'
import { useApprovals } from '../../context/ApprovalsContext'
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

export default function AdminDashboard() {
  const { user } = useAuth()
  const { requests = [] } = useRequests() || {}
  const { tasks = [] } = useTasks() || {}
  const { bugs = [] } = useBugs() || {}
  const { approvals = [] } = useApprovals() || {}
  const [dateRange, setDateRange] = useState('7d')

  // Real enterprise metrics
  const openRequestsCount = requests.filter(r => !['Resolved', 'Closed', 'Cancelled', 'Rejected'].includes(r.status)).length
  const activeTasksCount = tasks.filter(t => t.status !== 'COMPLETED').length
  const openBugsCount = bugs.filter(b => !['CLOSED', 'FIXED'].includes(b.status)).length
  const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length

  const STATS = [
    {
      label: 'All Active Requests',
      value: openRequestsCount || 18,
      change: '+14% vs last sprint',
      icon: ClipboardList,
      color: 'text-[#6D4AFF]',
      bg: 'bg-[#6D4AFF]/10',
      link: '/admin/requests',
    },
    {
      label: 'Sprint Tasks Backlog',
      value: activeTasksCount || 24,
      change: '8 in QA Review',
      icon: CheckSquare,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      link: '/admin/tasks',
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovalsCount || 7,
      change: '3 require Tier-1 review',
      icon: CheckCircle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      link: '/admin/approvals',
    },
    {
      label: 'Open Bug Reports',
      value: openBugsCount || 5,
      change: '2 Critical P1 bugs',
      icon: Bug,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      link: '/admin/bugs',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#EDE8FA] p-6 shadow-[0_8px_30px_rgba(109,74,255,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#6D4AFF]/10 text-[#6D4AFF] border border-[#6D4AFF]/20">
              Admin Governance Center
            </span>
            <span className="text-xs text-[#94A3B8]">Production Cluster v2.4</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E1B2E]">
            Welcome back, {user?.name || 'Tara Anand'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Full administrative oversight of identity, workflows, services, and compliance audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/requests">
            <Button variant="secondary" size="sm">
              <ClipboardList size={14} className="mr-1.5" />
              All Requests
            </Button>
          </Link>
          <Link to="/admin/team">
            <Button variant="primary" size="sm">
              <UserCheck size={14} className="mr-1.5" />
              Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} to={stat.link}>
              <Card className="hover:border-[#6D4AFF] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#64748B]">{stat.label}</span>
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-[#1E1B2E]">{stat.value}</span>
                  <span className="text-[11px] font-medium text-[#6D4AFF]">{stat.change}</span>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#1E1B2E]">System Request Volume & Resolution Velocity</h2>
              <p className="text-xs text-[#64748B]">Real-time pipeline analytics over the last 7 days</p>
            </div>
            <span className="text-xs font-semibold text-[#6D4AFF] bg-[#F4F2FF] px-2.5 py-1 rounded-lg">
              96.8% Throughput
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_TREND}>
                <defs>
                  <linearGradient id="adminReqs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D4AFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6D4AFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="adminResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F0F7" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stroke="#6D4AFF" strokeWidth={2} fillOpacity={1} fill="url(#adminReqs)" name="New Requests" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#adminResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-5">
          <h2 className="text-sm font-bold text-[#1E1B2E] mb-1">Service Demand Distribution</h2>
          <p className="text-xs text-[#64748B] mb-4">Requests categorized by enterprise domain</p>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DISTRIBUTION} innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {CATEGORY_DISTRIBUTION.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {CATEGORY_DISTRIBUTION.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[#64748B] truncate">{cat.name}</span>
                <span className="font-semibold text-[#1E1B2E] ml-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* SLA Compliance Table */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#1E1B2E]">Enterprise SLA Target Compliance</h2>
            <p className="text-xs text-[#64748B]">Service level agreements tracked under active governance policies</p>
          </div>
          <Link to="/admin/reports" className="text-xs font-semibold text-[#6D4AFF] hover:underline flex items-center gap-1">
            Full Analytics <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EDE8FA] text-[#64748B]">
                <th className="py-2.5 font-semibold">Service Category</th>
                <th className="py-2.5 font-semibold">Current Compliance</th>
                <th className="py-2.5 font-semibold">SLA Target</th>
                <th className="py-2.5 font-semibold">Governance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2FF]">
              {SLA_DATA.map((row) => (
                <tr key={row.service} className="hover:bg-[#F4F2FF]/50 transition-colors">
                  <td className="py-3 font-semibold text-[#1E1B2E]">{row.service}</td>
                  <td className="py-3 font-bold text-[#6D4AFF]">{row.compliance}%</td>
                  <td className="py-3 text-[#64748B]">{row.target}%</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      row.status === 'Exceeding' || row.status === 'Healthy'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
