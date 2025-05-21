"use client"
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Calendar, Users, Star } from 'lucide-react'

interface Stats {
  totalEvents: number
  eventsParticipated: number
  upcomingEvents: number
}

export default function DashboardHome() {
  const { user } = useUser()
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    eventsParticipated: 0,
    upcomingEvents: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/event/getAllEvents')
        const events = response.data.events
        const userEvents = events.filter((event: any) => 
          event.registeredUsers.includes(user?.id)
        )
        const upcomingEvents = events.filter((event: any) => 
          new Date(event.date) > new Date()
        )

        setStats({
          totalEvents: events.length,
          eventsParticipated: userEvents.length,
          upcomingEvents: upcomingEvents.length
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  return (
    <div className="space-y-8 min-h-screen flex flex-col justify-center">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.fullName || 'User'}! 👋
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your events today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Events</p>
              <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-pink-500/10 rounded-lg">
              <Users className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Events Participated</p>
              <p className="text-2xl font-bold text-white">{stats.eventsParticipated}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Star className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Upcoming Events</p>
              <p className="text-2xl font-bold text-white">{stats.upcomingEvents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.location.href = '/dashboard/create-event'}
            className="flex items-center justify-center space-x-2 p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg text-purple-500 transition-colors duration-200"
          >
            <span>Create New Event</span>
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/participated'}
            className="flex items-center justify-center space-x-2 p-4 bg-pink-500/10 hover:bg-pink-500/20 rounded-lg text-pink-500 transition-colors duration-200"
          >
            <span>View Participated Events</span>
          </button>
        </div>
      </div>
    </div>
  )
} 