"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

export default function UserManagmentPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const clerkUserId = user?.id;

  const [selectedUser, setSelectedUser] = useState(null); // track user for profile modal

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/getAllUsersData");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (targetUserId, action) => {
    const response = await fetch("/api/admin/approvecollegelead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkUserId, targetUserId, action }),
    });
    const result = await response.json();

    if (result.success && action === "approve") {
      toast.success("Request approved successfully");
      fetchUsers();
    } else if (result.success && action === "reject") {
      toast.success("Request rejected successfully");
      fetchUsers();
    } else {
      toast.error("Failed to approve request");
    }
  };

  const handleRemove = async (userId) => {
    const response = await fetch("/api/admin/removeUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkId: userId }),
    });
    await response.json();
    toast.success("User removed successfully");
    fetchUsers();
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
  };

  const closeProfile = () => {
    setSelectedUser(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 text-gray-100 pt-20">
      <h1 className="text-3xl font-bold mt-4 mb-6 text-purple-400">
        User Management
      </h1>

      {loading ? (
        <div className="text-center text-lg text-gray-300">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-[#111827] rounded-lg">
            <thead>
              <tr className="bg-[#1f2937] text-purple-300 text-left">
                <th className="px-4 py-3">Profile</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">College</th>
                <th className="px-4 py-3">Degree</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Lead Request</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-[#27272a] transition-colors duration-200 border-b border-gray-700"
                >
                  <td className="px-4 py-3">
                    {u.profilePicture ? (
                      <img
                        src={u.profilePicture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                        {u.email?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">
                    {u.collegeInfo?.collegeName || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {u.collegeInfo?.degree || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {u.collegeInfo?.yearOfPassing || "-"}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {u.collegeLeadRequest || "-"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <div className="flex space-x-2">
                      {u.role?.toLowerCase() !== "collegelead" ? (
                        <button
                          onClick={() => handleApprove(u.clerkId, "approve")}
                          className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm"
                        >
                          Promote
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1 rounded-md bg-gray-500 text-white text-sm cursor-not-allowed opacity-70"
                        >
                          Approved
                        </button>
                      )}

                      <button
                        onClick={() => handleRemove(u.clerkId)}
                        className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        Remove
                      </button>

                      <button
                        onClick={() => handleViewProfile(u)}
                        className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center justify-center"
                      >
                        <Eye size={16} className="mr-1" /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Profile Modal */}
      {/* Profile Modal */}
{selectedUser && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
      <button
        onClick={closeProfile}
        className="absolute top-3 right-3 text-gray-300 hover:text-white"
      >
        ✕
      </button>
      
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        {selectedUser.profilePicture ? (
          <img
            src={selectedUser.profilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-purple-400 shadow-md"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl shadow-md">
            {selectedUser.email?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        {/* User Info */}
        <h2 className="text-xl font-bold text-purple-300 mt-4">
          {selectedUser.email}
        </h2>
        <p className="text-gray-300 capitalize">{selectedUser.role}</p>

        {/* Extra Details */}
        <div className="mt-6 space-y-2 text-gray-200 w-full text-left">
          <p>
            <span className="font-semibold text-white">College:</span>{" "}
            {selectedUser.collegeInfo?.collegeName || "-"}
          </p>
          <p>
            <span className="font-semibold text-white">Degree:</span>{" "}
            {selectedUser.collegeInfo?.degree || "-"}
          </p>
          <p>
            <span className="font-semibold text-white">Year:</span>{" "}
            {selectedUser.collegeInfo?.yearOfPassing || "-"}
          </p>
          <p>
            <span className="font-semibold text-white">Lead Request:</span>{" "}
            {selectedUser.collegeLeadRequest || "-"}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3 w-full">
          <button
            onClick={closeProfile}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white font-medium shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
