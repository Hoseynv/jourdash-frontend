"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { StatusChip } from "@/components/status-chip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Eye } from "lucide-react"

// Mock data for goods receipts list
const mockReceipts = [
  {
    id: "gr-001",
    receipt_no: "WRC-202401-0001",
    supplier_name: "تأمین‌کننده اصلی",
    supplier_invoice_no: "INV-2024-001",
    receipt_date: "2024-01-15",
    created_by: "احمد محمدی",
    lines_count: 3,
    units_count: 105,
    status: "reconciled",
  },
  {
    id: "gr-002",
    receipt_no: "WRC-202401-0002",
    supplier_name: "تأمین‌کننده فرعی",
    supplier_invoice_no: "INV-2024-002",
    receipt_date: "2024-01-16",
    created_by: "فاطمه احمدی",
    lines_count: 5,
    units_count: 87,
    status: "counting",
  },
  {
    id: "gr-003",
    receipt_no: "WRC-202401-0003",
    supplier_name: "تأمین‌کننده اصلی",
    supplier_invoice_no: "INV-2024-003",
    receipt_date: "2024-01-17",
    created_by: "علی رضایی",
    lines_count: 2,
    units_count: 45,
    status: "draft",
  },
]

export default function GoodsReceiptsIndexPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [receipts] = useState(mockReceipts)

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      searchQuery === "" ||
      receipt.receipt_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.supplier_name.includes(searchQuery) ||
      receipt.supplier_invoice_no.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || receipt.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR")
  }

  const handleViewDetails = (receiptId: string) => {
    router.push(`/gr/${receiptId}`)
  }

  const handleNewReceipt = () => {
    router.push("/gr/new")
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">رسیدهای خرید</h1>
            <p className="text-muted-foreground">مدیریت رسیدهای دریافت کالا از تأمین‌کنندگان</p>
          </div>
          <Button onClick={handleNewReceipt} className="gap-2">
            <Plus className="h-4 w-4" />
            رسید جدید
          </Button>
        </div>

        {/* Filters */}
        <Card className="soft-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="جستجو بر اساس شماره رسید، تأمین‌کننده یا شماره فاکتور..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="draft">پیش‌نویس</SelectItem>
                    <SelectItem value="counting">در حال شمارش</SelectItem>
                    <SelectItem value="reconciled">تطبیق شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipts Table */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>فهرست رسیدهای خرید ({filteredReceipts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">شماره رسید</TableHead>
                  <TableHead className="text-right">تأمین‌کننده</TableHead>
                  <TableHead className="text-right">شماره فاکتور</TableHead>
                  <TableHead className="text-right">تاریخ رسید</TableHead>
                  <TableHead className="text-right">ایجاد شده توسط</TableHead>
                  <TableHead className="text-right">تعداد اقلام</TableHead>
                  <TableHead className="text-right">تعداد واحدها</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell>
                      <span className="font-mono text-sm">{receipt.receipt_no}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{receipt.supplier_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{receipt.supplier_invoice_no}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(receipt.receipt_date)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{receipt.created_by}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{receipt.lines_count}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{receipt.units_count}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={receipt.status} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(receipt.id)} className="gap-2">
                        <Eye className="h-4 w-4" />
                        مشاهده جزئیات
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredReceipts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Plus className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>هیچ رسیدی یافت نشد</p>
                <p className="text-sm">برای ایجاد رسید جدید روی دکمه "رسید جدید" کلیک کنید</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
