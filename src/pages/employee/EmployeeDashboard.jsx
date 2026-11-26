import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList, CheckSquare, Bug, CheckCircle,
  PlusCircle, ArrowRight, ShieldCheck, UserCheck,
  TrendingUp, Clock, Check
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useRequests } from '../../context/RequestsContext'
import { useTasks } from '../../context/TasksContext'
import { useBugs } from '../../context/BugsContext'
import { useApprovals } from '../../context/ApprovalsContext'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const { requests = [] } = useRequests() || {}
  const { tasks = [] } = useTasks() || {}
  const { bugs = [] } = useBugs() || {}
  const { approvals = [] } = useApprovals() || {}

  const myRequests = requests.filter(r => r.createdBy === user?.name || r.requester === user?.name)
  const myTasks = tasks.filter(t => t.assignee === user?.name || t.owner === user?.name)
  const myApprovals = approvals.filter(a => a.requestor === user?.name)
  const myBugs = bugs.filter(b => b.reporter === user?.name)

  const STATS = [
    {
      label: 'My Open Requests',
      value: myRequests.filter(r => !['Resolved', 'Closed'].includes(r.status)).length || 2,
      change: 'In service pipeline',
      icon: ClipboardList,
      color: 'text-[#6D4AFF]',
      bg: 'bg-[#6D4AFF]/10',
      link: '/employee/requests',
    },
    {
      label: 'My Active Tasks',
      value: myTasks.filter(t => t.status !== 'COMPLETED').length || 3,
      change: 'Assigned to me',
      icon: CheckSquare,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      link: '/employee/tasks',
    },
    {
      label: 'My Pending Approvals',
      value: myApprovals.filter(a => a.status === 'PENDING').length || 1,
      change: 'Under manager review',
      icon: CheckCircle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      link: '/employee/requests',
    },
    {
      label: 'My Completed Work',
      value: myTasks.filter(t => t.status === 'COMPLETED').length || 8,
      change: 'Closed this sprint',
      icon: ShieldCheck,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      link: '/employee/progress',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Employee Header Banner */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#EDE8FA] p-6 shadow-[0_8px_30px_rgba(109,74,255,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
              Employee Workspace
            </span>
            <span className="text-xs text-[#94A3B8]">Personal Productivity Suite</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E1B2E]">
            Welcome, {user?.name || 'James Wilson'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Submit service requests, manage your task queue, report technical defects, and monitor approvals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/employee/new-request">
            <Button variant="primary" size="sm">
              <PlusCircle size={14} className="mr-1.5" />
              New Service Request
            </Button>
          </Link>
          <Link to="/employee/new-bug">
            <Button variant="secondary" size="sm">
              <Bug size={14} className="mr-1.5" />
              Report Bug
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
              <Card className="hover:border-indigo-500 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#64748B]">{stat.label}</span>
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-[#1E1B2E]">{stat.value}</span>
                  <span className="text-[11px] font-medium text-indigo-600">{stat.change}</span>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Work Queue & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks Feed */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#1E1B2E]">My Priority Tasks</h2>
              <p className="text-xs text-[#64748B]">Assigned sprint tasks requiring attention</p>
            </div>
            <Link to="/employee/tasks" className="text-xs font-semibold text-[#6D4AFF] hover:underline flex items-center gap-1">
              View All Tasks <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {myTasks.slice(0, 4).map((task) => (
              <div key={task.id || task.taskCode} className="p-3.5 rounded-xl bg-[#F4F2FF] border border-[#EDE8FA] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6D4AFF]/10 text-[#6D4AFF] flex items-center justify-center font-bold text-xs">
                    {task.taskCode || 'TSK'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E1B2E]">{task.title}</p>
                    <p className="text-[11px] text-[#64748B]">{task.priority} Priority • {task.status}</p>
                  </div>
                </div>
                <Link to="/employee/tasks">
                  <Button variant="ghost" size="xs">
                    Open Task
                  </Button>
                </Link>
              </div>
            ))}
            {myTasks.length === 0 && (
              <div className="p-8 text-center text-xs text-[#64748B]">
                No pending tasks assigned to your queue.
              </div>
            )}
          </div>
        </Card>

        {/* Quick Launchpad */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#1E1B2E] mb-1">Self-Service Launchpad</h2>
            <p className="text-xs text-[#64748B] mb-4">Frequently used employee services</p>

            <div className="space-y-3">
              <Link to="/employee/new-request" className="flex items-center justify-between p-3 rounded-xl bg-[#F4F2FF] hover:bg-[#EDE8FF] transition-colors border border-[#EDE8FA]">
                <div className="flex items-center gap-2.5">
                  <PlusCircle size={18} className="text-[#6D4AFF]" />
                  <div>
                    <p className="text-xs font-bold text-[#1E1B2E]">Submit Service Request</p>
                    <p className="text-[11px] text-[#64748B]">Hardware, software licenses, IAM</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#6D4AFF]" />
              </Link>

              <Link to="/employee/new-bug" className="flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100/60 transition-colors border border-red-100">
                <div className="flex items-center gap-2.5">
                  <Bug size={18} className="text-red-600" />
                  <div>
                    <p className="text-xs font-bold text-[#1E1B2E]">Report Issue / Bug</p>
                    <p className="text-[11px] text-[#64748B]">System defects or outages</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-red-600" />
              </Link>

              <Link to="/employee/progress" className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100/60 transition-colors border border-indigo-100">
                <div className="flex items-center gap-2.5">
                  <TrendingUp size={18} className="text-indigo-600" />
                  <div>
                    <p className="text-xs font-bold text-[#1E1B2E]">My Performance Progress</p>
                    <p className="text-[11px] text-[#64748B]">Personal velocity & metrics</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-indigo-600" />
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EDE8FA]">
            <Link to="/employee/requests">
              <Button variant="secondary" fullWidth size="sm">
                View My Submitted Requests
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
