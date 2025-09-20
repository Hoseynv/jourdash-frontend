"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, Plus, Eye, CalendarIcon, ArrowRight, Package, Truck, CheckCircle } from "lucide-react"
import { t } from "@/lib/translations"
import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"

// Mock data for transfers
const mockTransfers = [
  {
    id: "1",
    transfer_no: "TRF-202501-001",
    from_owner: "انبار مرکزی",
    to_owner: "شعبه شمال",
    transfer_type: "warehouseToStore",
    created_at: "2025-01-15T08:30:00Z",
    planned_date: "2025-01-16T10:00:00Z",
    items_count: 25,
    status: "ready_to_ship",
  },
  {
    id: "2",
    transfer_no: "TRF-202501-002",
    from_owner: "شعبه مرکزی",
    to_owner: "شعبه جنوب",
    transfer_type: "storeToStore",
    created_at: "2025-01-14T14:20:00Z",
    planned_date: "2025-01-15T16:00:00Z",
    items_count: 12,
    status: "shipped",
  },
  {
    id: "3",
    transfer_no: "TRF-202501-003",
    from_owner: "شعبه شرق",
    to_owner: "انبار مرکزی",
    transfer_type: "storeToWarehouse",
    created_at: "2025-01-13T11:45:00Z",
    planned_date: "2025-01-14T09:00:00Z",
    items_count: 8,
    status: "received",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ready_to_ship":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {t("readyToShip")}
        </Badge>
      )
    case "shipped":
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          {t("shipped")}
        </Badge>
      )
    case "received":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {t("received")}
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getTransferTypeLabel = (type: string) => {
  switch (type) {
    case "storeToStore":
      return t("storeToStore")
    case "warehouseToStore":
      return t("warehouseToStore")
    case "storeToWarehouse":
      return t("storeToWarehouse")
    default:
      return type
  }
}

const getTransferTypeIcon = (type: string) => {
  switch (type) {
    case "warehouseToStore":
      return <Truck className="h-4 w-4" />
    case "storeToStore":
      return <ArrowRight className="h-4 w-4" />
    case "storeToWarehouse":
      return <Package className="h-4 w-4" />
    default:
      return <ArrowRight className="h-4 w-4" />
  }
}

export default function TransfersHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  const filteredTransfers = mockTransfers.filter((transfer) => {
    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter
    const matchesSearch =
      !searchQuery ||
      transfer.transfer_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.from_owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.to_owner.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const handleMarkAsShipped = async (transferId: string) => {
    if (confirm("آیا از تغییر وضعیت این انتقال به ارسال شد اطمینان دارید؟")) {
      // API call would go here
      console.log(`[v0] Marking transfer ${transferId} as shipped`)
      // Show success toast with "View Details" link
      alert(`${t("transferMarkedAsShipped")} - ${t("transferDetails")}`)
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Jour</span>
          <span className="mx-2">/</span>
          <span>{t("transfers")}</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t("transfersHistory")}</h1>
            <p className="text-muted-foreground">مدیریت و پیگیری انتقالات کالا</p>
          </div>
          <Link href="/transfers/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("newTransfer")}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              فیلترها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("status")}</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="ready_to_ship">{t("readyToShip")}</SelectItem>
                    <SelectItem value="shipped">{t("shipped")}</SelectItem>
                    <SelectItem value="received">{t("received")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("search")}</label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="شماره انتقال، مبدأ، مقصد..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <label className="text-sm font-medium">از تاریخ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-right bg-transparent">
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "yyyy/MM/dd") : "انتخاب تاریخ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <label className="text-sm font-medium">تا تاریخ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-right bg-transparent">
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "yyyy/MM/dd") : "انتخاب تاریخ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfers Table */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>لیست انتقالات</CardTitle>
            <CardDescription>{filteredTransfers.length} انتقال یافت شد</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransfers.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("noItemsFound")}</h3>
                <p className="text-muted-foreground mb-4">هیچ انتقالی با فیلترهای انتخابی یافت نشد</p>
                <Link href="/transfers/new">
                  <Button>
                    <Plus className="h-4 w-4 ml-2" />
                    {t("newTransfer")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">{t("transferNo")}</TableHead>
                      <TableHead className="text-right">مبدأ → مقصد</TableHead>
                      <TableHead className="text-right">{t("transferType")}</TableHead>
                      <TableHead className="text-right">
                        {t("createdAt")} / {t("plannedDate")}
                      </TableHead>
                      <TableHead className="text-right">{t("itemsCount")}</TableHead>
                      <TableHead className="text-right">{t("status")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-mono">
                          <Link href={`/transfers/${transfer.id}`} className="text-primary hover:underline">
                            {transfer.transfer_no}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {transfer.from_owner}
                            </Badge>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <Badge variant="outline" className="text-xs">
                              {transfer.to_owner}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTransferTypeIcon(transfer.transfer_type)}
                            <span className="text-sm">{getTransferTypeLabel(transfer.transfer_type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{format(new Date(transfer.created_at), "yyyy/MM/dd HH:mm")}</div>
                            <div className="text-muted-foreground">
                              {format(new Date(transfer.planned_date), "yyyy/MM/dd HH:mm")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{transfer.items_count}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/transfers/${transfer.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Eye className="h-3 w-3" />
                                {t("transferDetails")}
                              </Button>
                            </Link>
                            {transfer.status === "ready_to_ship" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 bg-transparent"
                                onClick={() => handleMarkAsShipped(transfer.id)}
                              >
                                <CheckCircle className="h-3 w-3" />
                                {t("markAsShipped")}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
