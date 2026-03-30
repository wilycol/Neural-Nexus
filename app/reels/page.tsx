"use client";

import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ReelsFeed } from "@/components/reels-feed";

export default function ReelsPage() {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main className="flex-1 overflow-hidden">
          <ReelsFeed />
        </main>
      </div>
    </div>
  );
}
