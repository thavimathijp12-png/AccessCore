import { useState } from 'react'
import {
  Download, TrendingUp,
  ShieldCheck, CheckCircle2, AlertTriangle, Layers
} from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useRequests } from '../context/RequestsContext'
import { useTasks } from '../context/TasksContext'
import { useBugs } from '../context/BugsContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ui/Toast'
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const MONTHLY_VOLUME = [
  { month: 'Jun', requests: 45, tasks: 52, bugs: 12 },
  { month: 'Jul', requests: 58, tasks: 64, bugs: 18 },
  { month: 'Aug', requests: 62, tasks: 70, bugs: 14 },
  { month: 'Sep', requests: 75, tasks: 82, bugs: 22 },
  { month: 'Oct', requests: 88, tasks: 94, bugs: 16 },
  { month: 'Nov', requests: 92, tasks: 105, bugs: 11 },
]

const TEAM_PERFORMANCE = [
  { name: 'James Wilson', completed: 28, open: 4, efficiency: 94 },
  { name: 'Sarah Chen', completed: 25, open: 5, efficiency: 91 },
  { name: 'Mike Torres', completed: 22, open: 3, efficiency: 96 },
  { name: 'Elena Rostova', completed: 18, open: 2, efficiency: 98 },
  { name: 'Tara Anand', completed: 32, open: 6, efficiency: 92 },
]

const BUG_SEVERITY_DATA = [
  { name: 'Critical', count: 3, fill: '#EF4444' },
  { name: 'High', count: 8, fill: '#F59E0B' },
  { name: 'Medium', count: 14, fill: '#6D4AFF' },
  { name: 'Low', count: 9, fill: '#10B981' },
]

export default function ReportsPage() {
  const { requests = [] } = useRequests() || {}
  const { tasks = [] } = useTasks() || {}
  const { bugs = [] } = useBugs() || {}
  const { toasts, toast, dismiss } = useToast()

  const [dateRange, setDateRange] = useState('Quarter')

  // Export CSV Functionality
  const handleExportCSV = (datasetName) => {
    let rows = []
    let filename = `AccessCore_${datasetName}_${new Date().toISOString().split('T')[0]}.csv`

    if (datasetName === 'Requests') {
      rows = requests.map(r => ({
        ID: r.id,
        Title: `"${r.title.replace(/"/g, '""')}"`,
        Category: r.category,
        Priority: r.priority,
        Status: r.status,
        Department: r.department,
        AssignedTo: r.assignedTo || 'Unassigned',
        CreatedDate: r.createdAt,
      }))
    } else if (datasetName === 'Tasks') {
      rows = tasks.map(t => ({
        ID: t.id,
        Title: `"${t.title.replace(/"/g, '""')}"`,
        Status: t.status,
        Priority: t.priority,
        Assignee: t.assignee,
        Department: t.department,
        DueDate: t.dueDate,
      }))
    } else {
      rows = bugs.map(b => ({
        ID: b.id,
        Title: `"${b.title.replace(/"/g, '""')}"`,
        Severity: b.severity,
        Status: b.status,
        Environment: b.environment,
        AssignedDev: b.assignedTo || 'Unassigned',
        ReportedBy: b.reportedBy,
      }))
    }

    if (rows.length === 0) {
      toast.error('No rows to export')
      return
    }

    const headers = Object.keys(rows[0]).join(',')
    const csvContent = [headers, ...rows.map(r => Object.values(r).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    toast.success(`Exported ${rows.length} rows to ${filename}`)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">
            Executive Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cross-module velocity charts, service SLA compliance metrics and dataset CSV exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range picker */}
          <div className="flex items-center rounded-lg border border-[#EDE8FA] bg-white p-1 text-xs">
            {['Past 30d', 'Quarter', 'Past Year'].map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${dateRange === r
                    ? 'bg-[#6D4AFF] text-white shadow-xs'
                    : 'text-slate-600  hover:text-slate-900'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            iconLeft={<Download size={14} />}
            onClick={() => handleExportCSV('Requests')}
          >
            Export Requests CSV
          </Button>
        </div>
      </div>

      {/* High-level Metric Stat Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center justify-between p-4">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Total Workflows Logged</span>
            <span className="text-2xl font-bold text-[#1E293B] mt-0.5 block">
              {requests.length + tasks.length + bugs.length}
            </span>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp size={12} /> +14.2% YoY Velocity
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#6D4AFF]">
            <Layers size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Mean Time to Resolution (MTTR)</span>
            <span className="text-2xl font-bold text-[#1E293B] mt-0.5 block">
              4.2 hrs
            </span>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp size={12} /> -18m vs target
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Overall SLA Adherence</span>
            <span className="text-2xl font-bold text-[#1E293B] mt-0.5 block">
              98.1%
            </span>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 size={12} /> Exceeding 95% SLA
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <CheckCircle2 size={20} />
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Open Engineering Defect Ratio</span>
            <span className="text-2xl font-bold text-[#1E293B] mt-0.5 block">
              {bugs.filter(b => b.status !== 'CLOSED').length}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
              {bugs.filter(b => b.severity === 'Critical').length} Critical Escalations
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <AlertTriangle size={20} />
          </div>
        </Card>
      </div>

      {/* Main Multi-Series Area Chart */}
      <Card>
        <CardHeader
          title="Monthly Workload & Defect Inflow"
          subtitle="Enterprise throughput across service requests, engineering tasks and discovered bugs"
          action={
            <div className="flex items-center gap-2">
              <Button size="xs" variant="ghost" onClick={() => handleExportCSV('Tasks')}>
                Export Tasks
              </Button>
              <Button size="xs" variant="ghost" onClick={() => handleExportCSV('Bugs')}>
                Export Bugs
              </Button>
            </div>
          }
        />
        <div className="h-[280px] w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_VOLUME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6D4AFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6D4AFF" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE8FA" opacity={0.5} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderColor: '#6D4AFF',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" name="Requests" dataKey="requests" stroke="#6D4AFF" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
              <Area type="monotone" name="Tasks" dataKey="tasks" stroke="#A78BFA" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
              <Area type="monotone" name="Bugs" dataKey="bugs" stroke="#EF4444" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Grid: Team Productivity & Bug Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Team Productivity Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Team Throughput & Efficiency Rate"
            subtitle="Completed assignments and task turnaround efficiency by specialist"
          />
          <div className="h-[250px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEAM_PERFORMANCE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE8FA" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#6D4AFF',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar name="Resolved Items" dataKey="completed" fill="#6D4AFF" radius={[4, 4, 0, 0]} />
                <Bar name="Open In-Flight" dataKey="open" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bug Severity Breakdown */}
        <Card>
          <CardHeader
            title="Defects by Severity"
            subtitle="Active engineering bug impact distribution"
          />
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={BUG_SEVERITY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {BUG_SEVERITY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#6D4AFF',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {BUG_SEVERITY_DATA.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.fill }} />
                  {s.name} Severity
                </span>
                <span className="font-semibold text-slate-800">{s.count} defects</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
