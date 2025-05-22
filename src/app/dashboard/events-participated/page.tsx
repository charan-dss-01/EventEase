"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Calendar, MapPin, Users, Ticket } from 'lucide-react'

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  category: string
  image: string
  capacity: number
  totalParticipants: number
  ticketId: string
}

export default function EventsParticipated() {
  const router = useRouter()
  const { user } = useUser()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post('/api/event/getParticipatedEvents', {
          clerkUserId: user?.id
        })
        setEvents(response.data.events)
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchEvents()
    }
  }, [user])

  const downloadTicket = async (eventId: string, ticketId: string) => {
    try {
      console.log("Downloading ticket:", { eventId, ticketId, userId: user?.id });
      const response = await axios.post('/api/event/getTicket', {
        eventId,
        ticketId,
        userId: user?.id
      })

      if (response.data.ticket) {
        const ticket = response.data.ticket
        const ticketContent = `
╔════════════════════════════════════════════════════════════╗
║                     EVENT TICKET                           ║
╠════════════════════════════════════════════════════════════╣
║ Event: ${ticket.eventTitle.padEnd(50)} ║
║ Date: ${new Date(ticket.eventDate).toLocaleDateString().padEnd(50)} ║
║ Location: ${ticket.eventLocation.padEnd(45)} ║
║                                                           ║
║ Participant: ${ticket.participantName.padEnd(45)} ║
║ Ticket ID: ${ticket.ticketId.padEnd(45)} ║
║                                                           ║
║ Please present this ticket at the event entrance.         ║
╚════════════════════════════════════════════════════════════╝
        `

        const blob = new Blob([ticketContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ticket-${ticketId}.txt`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to download ticket')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 min-h-screen flex flex-col justify-center">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Events Participated</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">You haven't participated in any events yet.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={event.image || '/placeholder-event.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4 bg-purple-500/90 text-white px-3 py-1 rounded-full text-sm">
                  {event.category}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                <p className="text-gray-400 line-clamp-2">{event.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">{event.totalParticipants}/{event.capacity} registered</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={() => router.push(`/event/${event._id}`)}
                    className="flex-1 px-4 py-2 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20 transition-colors duration-200"
                  >
                    View Details
                  </button>
                  <button
                    // onClick={() => downloadTicket(event._id, event.ticketId)}
                    className="p-2 text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors duration-200"
                    title="Download Ticket"
                  >
                    <Ticket className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 