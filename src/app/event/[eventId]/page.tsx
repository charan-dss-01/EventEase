"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState, use, useRef } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, Download, CheckCircle2, Ticket } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image: string;
  capacity: number;
  registeredUsers: string[];
  totalParticipants: number;
  createdBy: string;
}

interface Ticket {
  ticketId: string;
  eventId: string;
  userId: string;
  createdAt: string;
  status: 'active' | 'cancelled' | 'used';
  event?: {
    title: string;
    date: string;
    location: string;
    category: string;
  };
  user?: {
    fullName: string;
    username: string;
  };
}

const COLORS = ['#9333EA', '#EC4899', '#3B82F6', '#10B981'];

const EventDetail = ({ params }: { params: Promise<{ eventId: string }> }) => {
  const resolvedParams = use(params);
  const { user, isLoaded: isUserLoaded } = useUser();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!isUserLoaded) return;
      
      try {
        const response = await axios.post('/api/event/getSingleEvent', {
          eventId: resolvedParams.eventId
        });
        const eventData = response.data.event;
        console.log('Fetched event data:', eventData);
        setEvent(eventData);
        
        // Check if user is already registered
        if (user) {
          const isUserRegistered = eventData.registeredUsers.includes(user.id);
          console.log('Is user registered:', isUserRegistered);
          setIsRegistered(isUserRegistered);
          
          // If user is already registered, fetch ticket data
          if (isUserRegistered) {
            try {
              const ticketResponse = await axios.post('/api/event/getTicket', {
                eventId: resolvedParams.eventId,
                userId: user.id
              });
              if (ticketResponse.data.success) {
                setTicket(ticketResponse.data.ticket);
              }
            } catch (error) {
              console.error('Error fetching ticket:', error);
            }
          }
        }
      } catch (error: any) {
        console.error('Error fetching event:', error);
        setError(error.message || 'Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.eventId) {
      fetchEvent();
    }
  }, [resolvedParams.eventId, isUserLoaded, user]);

  const handleRegister = async () => {
    if (!user) {
      setError('Please sign in to register for events');
      return;
    }

    setIsRegistering(true);
    try {
      console.log('Registering for event:', resolvedParams.eventId);
      const response = await axios.post('/api/event/registerEvent', {
        eventId: resolvedParams.eventId,
        userId: user.id
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.success && event) {
        setIsRegistered(true);
        // Fetch the newly created ticket
        const ticketResponse = await axios.post('/api/event/getTicket', {
          eventId: resolvedParams.eventId,
          userId: user.id
        });
        if (ticketResponse.data.success) {
          setTicket(ticketResponse.data.ticket);
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register for event');
    } finally {
      setIsRegistering(false);
    }
  };

  const downloadTicket = async () => {
    if (!ticket) {
      console.error('No ticket data available');
      if (event && user) {
        try {
          console.log("Downloading ticket:", { eventId: resolvedParams.eventId, userId: user?.id });
          // Fetch ticket data from API
          const ticketResponse = await axios.post('/api/event/getTicket', {
            eventId: resolvedParams.eventId,
            userId: user?.id
          });
          if (ticketResponse.data.success) {
            setTicket(ticketResponse.data.ticket);
            // Wait for state to update
            setTimeout(() => {
              downloadTicket();
            }, 100);
            return;
          }
        } catch (error) {
          console.error('Error fetching ticket:', error);
          setError('Failed to fetch ticket data. Please try again.');
          return;
        }
      }
      setError('Ticket data is not available. Please try registering again.');
      return;
    }

    try {
      const element = ticketRef.current;
      if (!element) return;

      // Dynamically import html2pdf only on the client side
      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: 0,
        filename: `ticket-${ticket.ticketId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error downloading ticket:', error);
      setError('Failed to download ticket. Please try again.');
    }
  };

  // Chart data
  const registrationData = [
    { name: 'Registered', value: event?.totalParticipants || 0 },
    { name: 'Available', value: (event?.capacity || 0) - (event?.totalParticipants || 0) }
  ];

  const registrationTrendData = [
    { name: 'Week 1', registrations: 5 },
    { name: 'Week 2', registrations: 12 },
    { name: 'Week 3', registrations: 18 },
    { name: 'Week 4', registrations: event?.totalParticipants || 0 }
  ];

  const categoryData = [
    { name: 'Technical', value: 65 },
    { name: 'Business', value: 25 },
    { name: 'Social', value: 15 },
    { name: 'Other', value: 10 }
  ];

  if (!isUserLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/90">
        <div className="text-white text-xl">Loading user data...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/90">
        <div className="text-white text-xl">Please sign in to view event details</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/90">
        <div className="text-white text-xl">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/90">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/90">
        <div className="text-white text-xl">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/90 py-20">
      <div className="max-w-4xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Event Details & Analytics
            </span>
          </h1>
          <p className="text-gray-400">Comprehensive overview of event information and participation metrics</p>
        </div>

        {/* Event Card */}
        <div className="bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 mb-12">
          {/* Event Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={event.image || '/placeholder-event.jpg'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Event Content */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-gray-400 mb-6">{event.description}</p>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-purple-400 font-semibold mb-2">Date & Time</h3>
                <p className="text-gray-300">{new Date(event.date).toLocaleDateString()}</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-purple-400 font-semibold mb-2">Location</h3>
                <p className="text-gray-300">{event.location}</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-purple-400 font-semibold mb-2">Category</h3>
                <p className="text-gray-300 capitalize">{event.category}</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-purple-400 font-semibold mb-2">Registration</h3>
                <p className="text-gray-300">{event.totalParticipants}/{event.capacity} registered</p>
              </div>
            </div>

            {/* Hidden Ticket Template */}
            {ticket && (
              <div className="hidden">
                <div ref={ticketRef} className="w-[297mm] h-[210mm] bg-gradient-to-br from-purple-900 to-pink-900 p-8">
                  {/* Ticket Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-2">Event Ticket</h1>
                      <p className="text-purple-200">Thank you for registering!</p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-200 mb-1">Ticket ID</p>
                      <p className="text-2xl font-mono text-white">{ticket.ticketId}</p>
                    </div>
                  </div>

                  {/* Ticket Content */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-6">{ticket.event?.title}</h2>
                        <div className="space-y-4">
                          <div className="flex items-center text-purple-200">
                            <Calendar className="w-6 h-6 mr-3" />
                            <span className="text-xl">{new Date(ticket.event?.date || '').toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-purple-200">
                            <MapPin className="w-6 h-6 mr-3" />
                            <span className="text-xl">{ticket.event?.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="text-right">
                          <p className="text-purple-200 mb-2">Participant</p>
                          <p className="text-2xl font-semibold text-white">{ticket.user?.fullName || ticket.user?.username || 'Guest'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-purple-200 mb-2">Event Category</p>
                          <p className="text-xl text-white capitalize">{ticket.event?.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Footer */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Ticket className="w-8 h-8 text-purple-400 mr-3" />
                      <p className="text-purple-200">This ticket is valid for one-time entry</p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-200">Generated on</p>
                      <p className="text-white">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-pink-600"></div>
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-pink-600"></div>
                </div>
              </div>
            )}

            {/* Registration Status */}
            {isRegistered ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mr-3" />
                    <span className="text-green-500 font-medium">Successfully Registered</span>
                  </div>
                  <button
                    onClick={downloadTicket}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 text-white rounded-lg transition-all duration-300"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Ticket
                  </button>
                </div>
                {ticket && (
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <h3 className="text-purple-400 font-semibold mb-2">Ticket Details</h3>
                    <div className="space-y-2 text-gray-300">
                      <p>Ticket ID: {ticket.ticketId}</p>
                      <p>Event: {ticket.event?.title}</p>
                      <p>Date: {new Date(ticket.event?.date || '').toLocaleDateString()}</p>
                      <p>Location: {ticket.event?.location}</p>
                      <p>Participant: {ticket.user?.fullName || ticket.user?.username || 'Guest'}</p>
                      <p>Status: <span className={`capitalize ${ticket.status === 'active' ? 'text-green-500' : ticket.status === 'used' ? 'text-yellow-500' : 'text-red-500'}`}>{ticket.status}</span></p>
                      <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className={`w-full bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 text-white py-3 rounded-lg transition-all duration-300 ${
                  isRegistering ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isRegistering ? 'Registering...' : 'Register Now'}
              </button>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="space-y-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Event Analysis
              </span>
            </h2>
            <p className="text-gray-400">Detailed insights into event participation and trends</p>
          </div>

          {/* Registration Status */}
          <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Registration Status</h2>
              <div className="text-sm text-gray-400">
                {event.totalParticipants} / {event.capacity} spots filled
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={registrationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={8}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {registrationData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#000',
                        fontSize: '14px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    formatter={(value: number) => [`${value} spots`, '']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-gray-300">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Registration Trend */}
          <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Registration Trend</h2>
              <div className="text-sm text-gray-400">Last 4 weeks</div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={registrationTrendData}>
                  <defs>
                    <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '14px',
                      padding: '8px 12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stroke="#9333EA"
                    fillOpacity={1}
                    fill="url(#colorRegistrations)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Comparison */}
          <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Category Comparison</h2>
              <div className="text-sm text-gray-400">Across all events</div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#000',
                      fontSize: '14px',
                      padding: '8px 12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 