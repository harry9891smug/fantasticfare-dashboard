"use client"; // ✅ Ensure it's a Client Component

import Header from './components/header';
import Sidebar from './components/sidebar';
import Footer from './components/footer';
import CssLoader from './components/cssloader';
import JsLoader from './components/jsloader';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // ✅ Redirect if the user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Prevent rendering the dashboard until authentication is verified
  }

  return (
    <>
      <CssLoader />
      <div className="page-wrapper compact-wrapper modern-type" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            {children}
          </div>
        </div>
        <Footer />
      </div>
      <JsLoader />
    </>
  );
}
