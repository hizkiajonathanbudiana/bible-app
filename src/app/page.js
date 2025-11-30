"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("Checking session...");

  useEffect(() => {
    let isMounted = true;

    async function checkLastRead() {
      // 1. Jika belum login atau masih loading, jangan ngapa-ngapain
      if (loading || !user) return;

      setStatus("Syncing last reading...");

      try {
        // 2. Ambil data dari Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (isMounted && docSnap.exists() && docSnap.data().lastRead) {
          const lr = docSnap.data().lastRead;

          // Validasi data
          if (lr.version && lr.bookId && lr.chapter) {
            // 3. Susun URL
            let url = `/read/${lr.version}/${lr.bookId}/${lr.chapter}`;
            const params = new URLSearchParams();
            if (lr.enVer) params.set("en", lr.enVer);
            if (lr.indVer) params.set("ind", lr.indVer);

            const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;

            console.log("Found history, redirecting to:", fullUrl);
            router.replace(fullUrl);
            return;
          }
        }

        // 4. Kalau tidak ada history, biarkan di halaman ini
        if (isMounted) setStatus("Ready");

      } catch (e) {
        console.error("Error redirecting:", e);
        if (isMounted) setStatus("Ready");
      }
    }

    checkLastRead();

    return () => { isMounted = false; };
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  // TAMPILAN LOADING (Sampai status "Ready" atau Redirect terjadi)
  if (loading || status !== "Ready") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-400 text-sm font-medium animate-pulse">{status}</p>
      </div>
    );
  }

  // TAMPILAN MENU (Hanya muncul jika User Baru / Belum ada History)
  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-white text-xl font-bold">Welcome!</h1>
          <p className="text-blue-100 text-sm">{user.email}</p>
        </div>

        <div className="p-6 grid gap-4">
          <Link href="/read" className="block p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition bg-white">
            <div className="flex items-center gap-4">
              <span className="text-2xl">📖</span>
              <div>
                <h3 className="font-bold text-gray-800">Bible Library</h3>
                <p className="text-xs text-gray-500">Start reading now</p>
              </div>
            </div>
          </Link>

          <Link href="/favorites" className="block p-4 border border-gray-200 rounded-xl hover:border-yellow-500 hover:shadow-md transition bg-white">
            <div className="flex items-center gap-4">
              <span className="text-2xl">⭐</span>
              <div>
                <h3 className="font-bold text-gray-800">My Vocabulary</h3>
                <p className="text-xs text-gray-500">Your saved words</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-gray-50 p-4 border-t text-center">
          <button onClick={handleLogout} className="text-red-500 text-sm font-bold hover:underline">Sign Out</button>
        </div>
      </div>
    </div>
  );
}