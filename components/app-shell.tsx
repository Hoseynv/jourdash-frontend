"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  Warehouse,
  DollarSign,
  ShoppingCart,
  RotateCcw,
  RefreshCw,
  Archive,
  Users,
  Heart,
  Tag,
  FileText,
  Shield,
  Search,
  Store,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
  Truck,
  ArrowRightLeft,
} from "lucide-react"
import { t } from "@/lib/translations"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface AppShellProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    title: t("dashboard"),
    icon: LayoutDashboard,
    href: "/",
    badge: null,
  },
  {
    title: t("masterData"),
    icon: Package,
    href: "/master-data",
    badge: null,
  },
  {
    title: t("goodsReceiptMain"),
    icon: Truck,
    href: "/gr",
    badge: null,
  },
  {
    title: t("warehouse"),
    icon: Warehouse,
    href: "/warehouse",
    badge: null,
    children: [
      { title: t("itemUnits"), href: "/warehouse/units" },
      { title: t("goodsReceipts"), href: "/warehouse/receipts" },
      { title: t("qc"), href: "/warehouse/qc" },
      { title: t("putaway"), href: "/warehouse/putaway" },
      { title: t("layout"), href: "/warehouse/layout" },
    ],
  },
  {
    title: t("transfers"),
    icon: ArrowRightLeft,
    href: "/transfers",
    badge: null,
    children: [
      { title: t("transfersHistory"), href: "/transfers" },
      { title: t("newTransfer"), href: "/transfers/new" },
      { title: t("receiveTransfer"), href: "/transfers/receive" },
    ],
  },
  {
    title: t("pricing"),
    icon: DollarSign,
    href: "/pricing",
    badge: null,
  },
  {
    title: t("pos"),
    icon: ShoppingCart,
    href: "/pos",
    badge: "hot",
    children: [
      { title: t("sell"), href: "/pos/sell" },
      { title: t("shifts"), href: "/pos/shifts" },
    ],
  },
  {
    title: t("returns"),
    icon: RotateCcw,
    href: "/returns",
    badge: null,
  },
  {
    title: t("exchanges"),
    icon: RefreshCw,
    href: "/exchanges",
    badge: null,
  },
  {
    title: t("inventory"),
    icon: Archive,
    href: "/inventory",
    badge: null,
  },
  {
    title: t("customers"),
    icon: Users,
    href: "/customers",
    badge: null,
    children: [
      { title: t("profiles"), href: "/customers/profiles" },
      { title: t("tiers"), href: "/customers/tiers" },
    ],
  },
  {
    title: t("loyalty"),
    icon: Heart,
    href: "/loyalty",
    badge: null,
  },
  {
    title: t("labeling"),
    icon: Tag,
    href: "/labeling",
    badge: null,
  },
  {
    title: t("audit"),
    icon: FileText,
    href: "/audit",
    badge: null,
  },
  {
    title: t("access"),
    icon: Shield,
    href: "/access",
    badge: null,
    children: [
      { title: t("users"), href: "/access/users" },
      { title: t("roles"), href: "/access/roles" },
      { title: t("permissions"), href: "/access/permissions" },
    ],
  },
]

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on "/"
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        const searchInput = document.getElementById("global-search")
        searchInput?.focus()
      }

      // Navigate to dashboard on "g g"
      if (e.key === "g") {
        const isSecondG = e.timeStamp - (window as any).lastGPress < 500
        if (isSecondG) {
          window.location.href = "/"
        }
        ;(window as any).lastGPress = e.timeStamp
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const validateBarcode = (value: string) => {
    return /^\d{12}$/.test(value)
  }

  const handleBarcodeSearch = () => {
    if (validateBarcode(searchQuery)) {
      // Navigate to inventory search with barcode
      window.location.href = `/inventory?barcode=${searchQuery}`
    }
  }

  const isItemActive = (item: any) => {
    if (item.href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(item.href)
  }

  const isChildActive = (child: any) => {
    return pathname === child.href
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-40 h-screen transition-transform bg-sidebar border-l border-sidebar-border soft-shadow-lg",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            {!sidebarCollapsed && <h1 className="text-xl font-bold text-sidebar-foreground">Jour</h1>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      sidebarCollapsed && "px-2",
                      isItemActive(item) && "bg-sidebar-accent text-sidebar-accent-foreground",
                    )}
                    onClick={() => toggleExpanded(item.title)}
                  >
                    <item.icon className={cn("h-4 w-4", !sidebarCollapsed && "ml-2")} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-right">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="mr-2">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedItems.includes(item.title) && "rotate-90",
                          )}
                        />
                      </>
                    )}
                  </Button>
                ) : (
                  <Link href={item.href} prefetch>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        sidebarCollapsed && "px-2",
                        isItemActive(item) && "bg-sidebar-accent text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", !sidebarCollapsed && "ml-2")} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-right">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="mr-2">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Button>
                  </Link>
                )}

                {/* Submenu */}
                {item.children && !sidebarCollapsed && expandedItems.includes(item.title) && (
                  <div className="mr-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} prefetch>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-end text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isChildActive(child) && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                          )}
                        >
                          {child.title}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("transition-all duration-300", sidebarCollapsed ? "mr-16" : "mr-64")}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          {/* Global Search */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="global-search"
                placeholder={`${t("scanBarcode")} (12 رقم)`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBarcodeSearch()}
                className="w-80 pr-10"
                maxLength={12}
              />
              {searchQuery && !validateBarcode(searchQuery) && (
                <div className="absolute top-full right-0 mt-1 text-xs text-destructive">{t("barcodeRequired")}</div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{t("searchShortcut")}</div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <ThemeToggle />

            {/* Store Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Store className="h-4 w-4" />
                  <span>فروشگاه مرکزی</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>فروشگاه مرکزی</DropdownMenuItem>
                <DropdownMenuItem>شعبه شمال</DropdownMenuItem>
                <DropdownMenuItem>شعبه جنوب</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span>مدیر سیستم</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="ml-2 h-4 w-4" />
                  {t("profile")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="ml-2 h-4 w-4" />
                  {t("settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="ml-2 h-4 w-4" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
