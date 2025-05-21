"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Users } from 'lucide-react'
import { useRouter } from 'next/navigation';

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
}

function Page() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  const handleRegister = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post('/api/event/getEventsByCategory', {
          category: "technical"
        })
        setEvents(response.data.events)
      } catch (error: any) {
        setError(error.message || 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/90">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/90">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black/90 py-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 mt-20"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Technical Events
          </span>
        </h1>
        <p className="text-gray-400 text-center text-lg max-w-2xl mx-auto">
          Discover the latest technology events, workshops, and conferences. Stay ahead of the curve with cutting-edge tech knowledge.
        </p>
      </motion.div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              onClick={() => handleRegister(event._id)}
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image || '/placeholder-event.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                {/* Event Details */}
                <div className="space-y-3">
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

                {/* Register Button */}
                <button className="w-full mt-6 bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 text-white py-2 rounded-lg transition-all duration-300">
                  Register Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No technical events found at the moment.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Page
