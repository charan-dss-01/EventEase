"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, MapPin, Clock, Users, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

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
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const router = useRouter()

  const handleRegister = (eventId: string) => {
    router.push(`/event/${eventId}`)
  }

  // Get unique locations for filter
  const locations = Array.from(new Set(events.map(event => event.location)))

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post('/api/event/getEventsByCategory', {
          category: "Technical"
        })
        setEvents(response.data.events)
        setFilteredEvents(response.data.events)
      } catch (error: any) {
        setError(error.message || 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Filter events based on search query, date, and location
  useEffect(() => {
    let filtered = events

    // Filter out completed events
    filtered = filtered.filter(event => {
      const eventDate = new Date(event.date)
      const today = new Date()
      return eventDate >= today
    })

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate.toDateString() === selectedDate.toDateString()
      })
    }

    // Filter by location
    if (selectedLocation && selectedLocation !== 'all') {
      filtered = filtered.filter(event => event.location === selectedLocation)
    }

    setFilteredEvents(filtered)
  }, [searchQuery, selectedDate, selectedLocation, events])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedDate(undefined)
    setSelectedLocation('all')
  }

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
        <p className="text-gray-400 text-center text-lg max-w-2xl mx-auto mb-8">
          Discover the latest technology events, workshops, and conferences. Stay ahead of the curve with cutting-edge tech knowledge.
        </p>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-gray-400 focus:ring-purple-500"
                suppressHydrationWarning={true}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] justify-start text-left font-normal",
                    "bg-zinc-900/50 border-zinc-800 text-white hover:bg-zinc-800",
                    !selectedDate && "text-gray-400"
                  )}
                  suppressHydrationWarning={true}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="bg-zinc-900 text-white"
                  classNames={{
                    day_selected: "bg-purple-500 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-500 focus:text-white",
                    day_today: "bg-zinc-800 text-white",
                    day_outside: "text-gray-400 opacity-50",
                    day_disabled: "text-gray-400 opacity-50",
                    day_range_middle: "aria-selected:bg-zinc-800 aria-selected:text-white",
                    day_hidden: "invisible",
                  }}
                />
              </PopoverContent>
            </Popover>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full sm:w-[200px] bg-zinc-900/50 border-zinc-800 text-white focus:ring-purple-500">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all" className="text-white focus:bg-zinc-800 focus:text-white">
                  All Locations
                </SelectItem>
                {locations.map((location) => (
                  <SelectItem 
                    key={location} 
                    value={location}
                    className="text-white focus:bg-zinc-800 focus:text-white"
                  >
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(searchQuery || selectedDate || selectedLocation !== 'all') && (
            <div className="flex justify-end mt-4">
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-gray-400 hover:text-white hover:bg-zinc-800"
                suppressHydrationWarning={true}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              onClick={() => handleRegister(event._id)}
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image || '/placeholder-event.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4 bg-purple-500/90 text-white px-3 py-1 rounded-full text-sm">
                  {event.category}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                {/* Event Details */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-400">
                    <CalendarIcon className="w-4 h-4 mr-2" />
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
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No events found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Page
