"use client"
import { useUser } from "@clerk/nextjs";
import { act, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PendingRequests() {
  const [data, setData] = useState([]);
  const { user } = useUser();
  const clerkUserId = user?.id;

  const fetchData = async () => {
    const response = await fetch("/api/admin/sendrequest", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      setData(result.data);
      toast.success("There are some pending requests");
    } else if (result.success && result.data.length === 0) {
      toast.success("No pending requests found");
    } else {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (targetUserId: string, action: string) => {
    const response = await fetch("/api/admin/approvecollegelead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkUserId, targetUserId, action }),
    });
    const result = await response.json();

    if (result.success && action === "approve") {
      toast.success("Request approved successfully");
      fetchData();
    } 
    else if (result.success && action === "reject") {
      toast.success("Request rejected successfully");
      fetchData();
    } else {
      toast.error("Failed to approve request");
    }
  };

  return (
   <div className="min-h-screen px-6 py-12 bg-black/90">

  <div className="mt-20 mb-8 text-center"> 
    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
      Pending College Lead Requests
    </h1>
    <p className="mt-2 text-gray-400 text-base">
      Review and approve requests submitted by students
    </p>
  </div>

  {/* Requests Section */}
  {data.length === 0 ? (
    <div className="flex items-center justify-center h-[50vh]">
      <p className="text-gray-500 text-lg">No pending requests found.</p>
    </div>
  ) : (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((user: any) => (
        <div
          key={user._id}
          className="group p-4 rounded-xl border border-gray-800 bg-zinc-900/80 backdrop-blur-md hover:bg-zinc-900/95 transition-all duration-300 shadow-md hover:shadow-purple-500/20"
        >
          {/* Card Header */}
          <div className="mb-3 border-b border-gray-700 pb-2">
            <h2 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
              {user.collegeInfo.collegeName}
            </h2>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>

          {/* Card Body */}
          <div className="space-y-1 text-gray-300 text-sm">
            <p>
              <span className="font-semibold text-purple-400">Degree:</span>{" "}
              {user.collegeInfo.degree}
            </p>
            <p>
              <span className="font-semibold text-purple-400">Year:</span>{" "}
              {user.collegeInfo.yearOfPassing}
            </p>
            <p>
              <span className="font-semibold text-purple-400">Agenda:</span>{" "}
              {user.collegeInfo.agenda}
            </p>
          </div>

          {/* Card Footer */}
          <div className="mt-4 flex space-x-2">
            {/* Approve Button */}
            <button 
              className="flex-1 px-3 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition"
              onClick={() => handleApprove(user.clerkId, "approve")}
            >
              Approve
            </button>

            {/* Reject Button */}
            <button 
              className="flex-1 px-3 py-2 rounded-md bg-red-600/80 text-white text-sm font-medium hover:bg-red-600 transition"
              onClick={() => handleApprove(user.clerkId, "reject")}
            >
              Reject
            </button>

            {/* Eye Button (View Profile) */}
            <button 
              className="px-3 py-2 rounded-md bg-gray-600 text-white text-sm hover:bg-gray-700 transition flex items-center justify-center"
              
            >
              👁️
            </button>
          </div>

        </div>
      ))}
    </div>
  )}
</div>

  );
}
