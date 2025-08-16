"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  Calendar, 
  Users, 
  PlusCircle, 
  UserPlus,
  ClipboardCheck,
  Menu, 
  X,
  LogOut
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'

const menuItems = [
  {
    title: 'Home',
    icon: Home,
    path: '/dashboard/home'
  },
  {
    title: 'Create Event',
    icon: PlusCircle,
    path: '/dashboard/create-event'
  },
  {
    title: 'My Events',
    icon: Calendar,
    path: '/dashboard/my-events'
  },
  {
    title: 'Events Participated',
    icon: Users,
    path: '/dashboard/events-participated'
  },
  {
    title: 'Send Request For College Lead',
    icon: UserPlus,
    path: '/dashboard/sendRequest'
  },
  {
    title: 'Approve Requests',
    icon: ClipboardCheck,
    path: '/dashboard/ApprovePanel'
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const router = useRouter()
  const { user} = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isCollegeLead, setIsCollegeLead] = useState(false)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  const CheckAdmin=async () => { 
    const response = await fetch('/api/admin/isAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ clerkUserId: user?.id })
    });
    const data = await response.json();
    if (data.success) {
      setIsAdmin(true);
    }
  }
  const CheckCollegeLead=async () => { 
    const response = await fetch('/api/admin/isCollegeLead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ clerkUserId: user?.id })
    });
    const data = await response.json();
    if (data.success) {
      setIsCollegeLead(true);
    }
  }
  useEffect(() => {
    if (user) {
      CheckAdmin();
      CheckCollegeLead();
    }
  }, [user]);
  // const handleSignOut = async () => {
  //   try {
  //     await signOut()
  //     router.push('/')
  //   } catch (error) {
  //     console.error('Error signing out:', error)
  //   }
  // }

  return (
    <div className="min-h-screen bg-black/90">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-900 text-white lg:hidden"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center space-x-4">
              <img
                src={user?.imageUrl || '/placeholder-avatar.png'}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-purple-500"
              />
              <div>
                <h2 className="text-white font-semibold">{user?.fullName || 'User'}</h2>
                <p className="text-gray-400 text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              // 🔹 Show Approve Requests only for Admins
              // if (item.title === "Approve Requests" && !isAdmin) return null;

              if (isCollegeLead || isAdmin) {
                // Leads & Admins → hide Send Request
                if (item.title === "Send Request For College Lead") return null;
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </button>
                );
              } else {
                // Normal users → hide Create Event & My Events
                if (item.title === "Create Event" || item.title === "My Events" || item.title === "Approve Requests") return null;
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </button>
                );
              }
            })}
          </nav>



          {/* Sign Out Button */}
          <div className="p-4 border-t border-zinc-800">
            <button
              // onClick={handleSignOut}
              onClick={()=>{
                router.push('/');
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
} 