"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { LayoutDashboardIcon, CameraIcon, Settings2Icon, CircleHelpIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon, UsersIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"

const defaultData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon />
      ),
    },
    {
      title: "Riwayat Inspeksi",
      url: "/history",
      icon: (
        <DatabaseIcon />
      ),
    },
    {
      title: "Analisis Baru",
      url: "/analysis",
      icon: (
        <CameraIcon />
      ),
    },
  ],
  adminNav: [
    {
      title: "User Management",
      url: "/users",
      icon: (
        <UsersIcon />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Pengaturan",
      url: "/settings",
      icon: (
        <Settings2Icon />
      ),
    },
    {
      title: "Bantuan",
      url: "#",
      icon: (
        <CircleHelpIcon />
      ),
    },
  ],
  documents: [
    {
      name: "Laporan Terakhir",
      url: "/reports",
      icon: (
        <FileChartColumnIcon />
      ),
    },
    {
      name: "Panduan Teknis",
      url: "#",
      icon: (
        <FileIcon />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "",
    avatar: "https://github.com/shadcn.png",
    role: "TEKNISI"
  })

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, role")
          .eq("id", user.id)
          .single()
        
        setUserData({
          name: profile?.name || "User",
          email: user.email || "",
          avatar: "https://github.com/shadcn.png",
          role: profile?.role || "TEKNISI"
        })
      }
    }
    fetchUser()
  }, [])

  const navItems = userData.role === "ADMIN" 
    ? [...defaultData.navMain, ...defaultData.adminNav]
    : defaultData.navMain

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold truncate">PLN Nusantara Power</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavDocuments items={defaultData.documents} />
        <NavSecondary items={defaultData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
