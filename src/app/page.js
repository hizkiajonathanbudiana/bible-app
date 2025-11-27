"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Kalau loading, tampilkan spinner
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Kalau belum login, arahkan ke login page
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header Profile */}
        <div className="bg-blue-600 p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
            👋
          </div>
          <h1 className="text-white text-xl font-bold">Welcome Back!</h1>
          <p className="text-blue-100 text-sm">{user.email}</p>
        </div>

        {/* Menu Grid */}
        <div className="p-6 grid gap-4">

          {/* Menu 1: Start Reading (Updated to Library) */}
          <Link href="/read" className="group block p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                📖
              </div>
              <div>
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600">Read Scripture</h3>
                <p className="text-xs text-gray-500">Select Book & Chapter</p>
              </div>
            </div>
          </Link>

          {/* Menu 2: My Vocabulary */}
          <Link href="/favorites" className="group block p-4 border border-gray-200 rounded-xl hover:border-yellow-500 hover:shadow-md transition bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
                ⭐
              </div>
              <div>
                <h3 className="font-bold text-gray-800 group-hover:text-yellow-600">My Vocabulary</h3>
                <p className="text-xs text-gray-500">Review your saved words</p>
              </div>
            </div>
          </Link>

          {/* Menu 3: Admin (Hanya muncul kalau emailnya cocok) */}
          {["admin@test.com", "weize@test.com", "hizkia.jonathanb@gmail.com"].includes(user.email) && (
            <Link href="/admin" className="group block p-4 border border-gray-200 rounded-xl hover:border-red-500 hover:shadow-md transition bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                  ⚙️
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-red-600">Admin Panel</h3>
                  <p className="text-xs text-gray-500">Upload new chapters</p>
                </div>
              </div>
            </Link>
          )}

        </div>

        {/* Footer Logout */}
        <div className="bg-gray-50 p-4 border-t text-center">
          <button
            onClick={handleLogout}
            className="text-gray-500 text-sm font-medium hover:text-red-500 transition flex items-center justify-center gap-2 w-full py-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}