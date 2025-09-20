"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { StatusChip } from "@/components/status-chip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, DollarSign, CreditCard, Banknote, Plus, Lock, Store, User } from "lucide-react"
import { t } from "@/lib/translations"

// Mock data
const mockCurrentShift = {
  id: "shift-001",
  store_id: "ST-001",
  store_name: "فروشگاه مرکزی",
  opened_by: "احمد محمدی",
  opened_at: "2024-01-22T08:30:00Z",
  status: "open",
  opening_cash: 500000,
  cash_total: 1250000,
  card_total: 850000,
  online_total: 320000,
  voucher_total: 45000,
  total_sales: 2465000,
  transaction_count: 47,
}

const mockShiftHistory = [
  {
    id: "shift-002",
    store_name: "فروشگاه مرکزی",
    opened_by: "فاطمه احمدی",
    opened_at: "2024-01-21T09:00:00Z",
    closed_at: "2024-01-21T18:30:00Z",
    total_sales: 3200000,
    cash_variance: 15000,
    status: "closed",
  },
  {
    id: "shift-003",
    store_name: "شعبه شمال",
    opened_by: "علی رضایی",
    opened_at: "2024-01-21T08:45:00Z",
    closed_at: "2024-01-21T19:00:00Z",
    total_sales: 2800000,
    cash_variance: -8000,
    status: "closed",
  },
]

const mockStores = [
  { id: "ST-001", name: "فروشگاه مرکزی" },
  { id: "ST-002", name: "شعبه شمال" },
  { id: "ST-003", name: "شعبه جنوب" },
]

export default function POSShiftsPage() {
  const [openShiftDialog, setOpenShiftDialog] = useState(false)
  const [closeShiftDialog, setCloseShiftDialog] = useState(false)
  const [newShiftData, setNewShiftData] = useState({
    store_id: "",
    opening_cash: "",
  })
  const [closeShiftData, setCloseShiftData] = useState({
    counted_cash: "",
    variance_note: "",
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " ریال"
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleOpenShift = () => {
    if (!newShiftData.store_id || !newShiftData.opening_cash) return

    // Mock: Open new shift
    alert(`شیفت جدید در ${mockStores.find((s) => s.id === newShiftData.store_id)?.name} باز شد`)
    setOpenShiftDialog(false)
    setNewShiftData({ store_id: "", opening_cash: "" })
  }

  const handleCloseShift = () => {
    if (!closeShiftData.counted_cash) return

    const countedAmount = Number.parseInt(closeShiftData.counted_cash)
    const expectedAmount = mockCurrentShift.cash_total
    const variance = countedAmount - expectedAmount

    alert(`شیفت بسته شد. اختلاف نقدی: ${formatCurrency(variance)}`)
    setCloseShiftDialog(false)
    setCloseShiftData({ counted_cash: "", variance_note: "" })
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t("shifts")}</h1>
            <p className="text-muted-foreground">مدیریت شیفت‌های فروش</p>
          </div>
          <Dialog open={openShiftDialog} onOpenChange={setOpenShiftDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                باز کردن شیفت
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>باز کردن شیفت جدید</DialogTitle>
                <DialogDescription>برای شروع فروش، شیفت جدید را باز کنید</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>فروشگاه</Label>
                  <Select
                    value={newShiftData.store_id}
                    onValueChange={(value) => setNewShiftData((prev) => ({ ...prev, store_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب فروشگاه" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>مبلغ نقد ابتدای شیفت</Label>
                  <Input
                    value={newShiftData.opening_cash}
                    onChange={(e) => setNewShiftData((prev) => ({ ...prev, opening_cash: e.target.value }))}
                    placeholder="مثال: 500000"
                    type="number"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleOpenShift} className="flex-1">
                    باز کردن شیفت
                  </Button>
                  <Button variant="outline" onClick={() => setOpenShiftDialog(false)}>
                    لغو
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current Shift */}
        {mockCurrentShift && (
          <Card className="soft-shadow border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                شیفت فعال
              </CardTitle>
              <div className="flex items-center gap-2">
                <StatusChip status="open" />
                <Dialog open={closeShiftDialog} onOpenChange={setCloseShiftDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Lock className="h-4 w-4" />
                      بستن شیفت
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>بستن شیفت</DialogTitle>
                      <DialogDescription>برای بستن شیفت، مبلغ نقد شمارش شده را وارد کنید</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid gap-4 p-4 bg-muted rounded-lg">
                        <div className="flex justify-between">
                          <span>مبلغ نقد انتظاری:</span>
                          <span className="font-medium">{formatCurrency(mockCurrentShift.cash_total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>کل فروش:</span>
                          <span className="font-medium">{formatCurrency(mockCurrentShift.total_sales)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>تعداد تراکنش:</span>
                          <span className="font-medium">{mockCurrentShift.transaction_count}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>مبلغ نقد شمارش شده</Label>
                        <Input
                          value={closeShiftData.counted_cash}
                          onChange={(e) => setCloseShiftData((prev) => ({ ...prev, counted_cash: e.target.value }))}
                          placeholder="مبلغ واقعی موجود در صندوق"
                          type="number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>یادداشت اختلاف (اختیاری)</Label>
                        <Textarea
                          value={closeShiftData.variance_note}
                          onChange={(e) => setCloseShiftData((prev) => ({ ...prev, variance_note: e.target.value }))}
                          placeholder="دلیل اختلاف در صورت وجود..."
                          rows={3}
                        />
                      </div>

                      {closeShiftData.counted_cash && (
                        <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                          <p className="text-sm">
                            اختلاف:{" "}
                            {formatCurrency(Number.parseInt(closeShiftData.counted_cash) - mockCurrentShift.cash_total)}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button onClick={handleCloseShift} className="flex-1" disabled={!closeShiftData.counted_cash}>
                          بستن شیفت
                        </Button>
                        <Button variant="outline" onClick={() => setCloseShiftDialog(false)}>
                          لغو
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">فروشگاه</span>
                  </div>
                  <p className="font-medium">{mockCurrentShift.store_name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">باز شده توسط</span>
                  </div>
                  <p className="font-medium">{mockCurrentShift.opened_by}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(mockCurrentShift.opened_at)}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">کل فروش</span>
                  </div>
                  <p className="text-xl font-bold text-primary">{formatCurrency(mockCurrentShift.total_sales)}</p>
                  <p className="text-xs text-muted-foreground">{mockCurrentShift.transaction_count} تراکنش</p>
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">ترکیب پرداخت</span>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Banknote className="h-3 w-3" />
                        <span>نقد</span>
                      </div>
                      <span>{formatCurrency(mockCurrentShift.cash_total)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        <span>کارت</span>
                      </div>
                      <span>{formatCurrency(mockCurrentShift.card_total)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>آنلاین</span>
                      <span>{formatCurrency(mockCurrentShift.online_total)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>کوپن</span>
                      <span>{formatCurrency(mockCurrentShift.voucher_total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shift History */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>تاریخچه شیفت‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">فروشگاه</TableHead>
                  <TableHead className="text-right">باز شده توسط</TableHead>
                  <TableHead className="text-right">زمان باز</TableHead>
                  <TableHead className="text-right">زمان بسته</TableHead>
                  <TableHead className="text-right">کل فروش</TableHead>
                  <TableHead className="text-right">اختلاف نقد</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockShiftHistory.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>{shift.store_name}</TableCell>
                    <TableCell>{shift.opened_by}</TableCell>
                    <TableCell>{formatDateTime(shift.opened_at)}</TableCell>
                    <TableCell>{shift.closed_at ? formatDateTime(shift.closed_at) : "-"}</TableCell>
                    <TableCell>{formatCurrency(shift.total_sales)}</TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          shift.cash_variance > 0
                            ? "text-green-600"
                            : shift.cash_variance < 0
                              ? "text-red-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {shift.cash_variance > 0 ? "+" : ""}
                        {formatCurrency(shift.cash_variance)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={shift.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
