"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { BarcodeScannerInput } from "@/components/barcode-scanner-input"
import { StatusChip } from "@/components/status-chip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, Scan, Lock, AlertTriangle } from "lucide-react"
import { t } from "@/lib/translations"

// Mock data
const mockReceipt = {
  id: "gr-001",
  receipt_no: "WRC-202401-0001",
  supplier_id: "SUP-001",
  supplier_name: "تأمین‌کننده اصلی",
  supplier_invoice_no: "INV-2024-001",
  supplier_invoice_date: "2024-01-15",
  status: "counting",
  created_at: "2024-01-15T10:00:00Z",
  created_by: "احمد محمدی",
}

const mockReceiptLines = [
  {
    id: "1",
    sku_code: "NIKE-SHIRT-001",
    sku_description: "پیراهن ورزشی نایک مردانه",
    expected_qty: 50,
    counted_qty: 48,
    diff_qty: -2,
  },
  {
    id: "2",
    sku_code: "ADIDAS-SHOE-001",
    sku_description: "کفش ورزشی آدیداس",
    expected_qty: 30,
    counted_qty: 32,
    diff_qty: 2,
  },
  {
    id: "3",
    sku_code: "PUMA-PANTS-001",
    sku_description: "شلوار ورزشی پوما",
    expected_qty: 25,
    counted_qty: 25,
    diff_qty: 0,
  },
]

const mockScannedUnits = [
  {
    id: "1",
    barcode_12: "123456789012",
    sku_code: "NIKE-SHIRT-001",
    scanned_at: "2024-01-15T14:30:00Z",
    scanned_by: "فاطمه احمدی",
  },
  {
    id: "2",
    barcode_12: "987654321098",
    sku_code: "ADIDAS-SHOE-001",
    scanned_at: "2024-01-15T14:31:00Z",
    scanned_by: "فاطمه احمدی",
  },
]

export default function GoodsReceiptsPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [scanInput, setScanInput] = useState("")
  const [receiptData, setReceiptData] = useState(mockReceipt)
  const [receiptLines, setReceiptLines] = useState(mockReceiptLines)
  const [scannedUnits, setScannedUnits] = useState(mockScannedUnits)

  const handleScanUnit = (barcode: string) => {
    // Check if already scanned
    if (scannedUnits.some((unit) => unit.barcode_12 === barcode)) {
      alert("این بارکد قبلاً اسکن شده است")
      return
    }

    // Mock: Find SKU for this barcode
    const newUnit = {
      id: Date.now().toString(),
      barcode_12: barcode,
      sku_code: "NIKE-SHIRT-001", // Mock SKU
      scanned_at: new Date().toISOString(),
      scanned_by: "کاربر فعلی",
    }

    setScannedUnits((prev) => [...prev, newUnit])
    setScanInput("")

    // Update counted quantity
    setReceiptLines((prev) =>
      prev.map((line) => {
        if (line.sku_code === newUnit.sku_code) {
          const newCountedQty = line.counted_qty + 1
          return {
            ...line,
            counted_qty: newCountedQty,
            diff_qty: newCountedQty - line.expected_qty,
          }
        }
        return line
      }),
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR")
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

  const canReconcile = receiptData.status === "counting"
  const totalExpected = receiptLines.reduce((sum, line) => sum + line.expected_qty, 0)
  const totalCounted = receiptLines.reduce((sum, line) => sum + line.counted_qty, 0)
  const totalDiff = totalCounted - totalExpected

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t("goodsReceipts")}</h1>
            <p className="text-muted-foreground">مدیریت رسید کالا و فرآیند دریافت</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusChip status={receiptData.status} />
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              رسید جدید
            </Button>
          </div>
        </div>

        {/* Receipt Header */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              رسید کالا: {receiptData.receipt_no}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label>تأمین‌کننده</Label>
                <p className="font-medium">{receiptData.supplier_name}</p>
              </div>
              <div>
                <Label>شماره فاکتور تأمین‌کننده</Label>
                <p className="font-medium">{receiptData.supplier_invoice_no}</p>
              </div>
              <div>
                <Label>تاریخ فاکتور</Label>
                <p className="font-medium">{formatDate(receiptData.supplier_invoice_date)}</p>
              </div>
              <div>
                <Label>ایجاد شده توسط</Label>
                <p className="font-medium">{receiptData.created_by}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-8 space-x-reverse">
          {[
            { step: 1, title: "اطلاعات رسید", icon: Package },
            { step: 2, title: "اقلام رسید", icon: Package },
            { step: 3, title: "اسکن واحدها", icon: Scan },
          ].map(({ step, title, icon: Icon }) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step ? "✓" : step}
              </div>
              <span className={currentStep >= step ? "text-foreground" : "text-muted-foreground"}>{title}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(Number.parseInt(value))}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1">اطلاعات رسید</TabsTrigger>
            <TabsTrigger value="2">اقلام رسید</TabsTrigger>
            <TabsTrigger value="3">اسکن واحدها</TabsTrigger>
          </TabsList>

          <TabsContent value="1">
            <Card className="soft-shadow">
              <CardHeader>
                <CardTitle>اطلاعات رسید</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>شماره رسید</Label>
                    <Input value={receiptData.receipt_no} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>تأمین‌کننده</Label>
                    <Select value={receiptData.supplier_id}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUP-001">تأمین‌کننده اصلی</SelectItem>
                        <SelectItem value="SUP-002">تأمین‌کننده فرعی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>شماره فاکتور تأمین‌کننده</Label>
                    <Input value={receiptData.supplier_invoice_no} />
                  </div>
                  <div className="space-y-2">
                    <Label>تاریخ فاکتور</Label>
                    <Input type="date" value={receiptData.supplier_invoice_date} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep(2)}>مرحله بعد</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="2">
            <Card className="soft-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>اقلام رسید</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">مجموع انتظار:</span>
                    <span className="font-medium mr-1">{totalExpected}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">مجموع شمارش:</span>
                    <span className="font-medium mr-1">{totalCounted}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">اختلاف:</span>
                    <span
                      className={`font-medium mr-1 ${totalDiff > 0 ? "text-green-600" : totalDiff < 0 ? "text-red-600" : ""}`}
                    >
                      {totalDiff > 0 ? "+" : ""}
                      {totalDiff}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">کد کالا</TableHead>
                      <TableHead className="text-right">شرح کالا</TableHead>
                      <TableHead className="text-right">مقدار انتظار</TableHead>
                      <TableHead className="text-right">مقدار شمارش</TableHead>
                      <TableHead className="text-right">اختلاف</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receiptLines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell>
                          <span className="font-mono">{line.sku_code}</span>
                        </TableCell>
                        <TableCell>{line.sku_description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{line.expected_qty}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{line.counted_qty}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={line.diff_qty > 0 ? "default" : line.diff_qty < 0 ? "destructive" : "outline"}
                          >
                            {line.diff_qty > 0 ? "+" : ""}
                            {line.diff_qty}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    مرحله قبل
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>مرحله بعد</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="3">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Scanning Interface */}
              <Card className="soft-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    اسکن واحدهای کالا
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BarcodeScannerInput
                    value={scanInput}
                    onChange={setScanInput}
                    onScan={handleScanUnit}
                    label="بارکد واحد کالا"
                    placeholder="بارکد ۱۲ رقمی را اسکن کنید"
                    autoFocus
                  />

                  <div className="text-sm text-muted-foreground">
                    <p>• هر واحد کالا را جداگانه اسکن کنید</p>
                    <p>• در صورت تکراری بودن بارکد، هشدار نمایش داده می‌شود</p>
                    <p>• مقدار شمارش به صورت خودکار به‌روزرسانی می‌شود</p>
                  </div>

                  {scannedUnits.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">آخرین اسکن‌ها:</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {scannedUnits
                          .slice(-5)
                          .reverse()
                          .map((unit) => (
                            <div
                              key={unit.id}
                              className="flex items-center justify-between text-sm p-2 bg-muted rounded"
                            >
                              <span className="font-mono">{unit.barcode_12}</span>
                              <span className="text-muted-foreground">{formatDateTime(unit.scanned_at)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scanned Units List */}
              <Card className="soft-shadow">
                <CardHeader>
                  <CardTitle>واحدهای اسکن شده ({scannedUnits.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {scannedUnits.map((unit) => (
                      <div key={unit.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-mono text-sm">{unit.barcode_12}</p>
                          <p className="text-xs text-muted-foreground">{unit.sku_code}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground">{unit.scanned_by}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(unit.scanned_at)}</p>
                        </div>
                      </div>
                    ))}
                    {scannedUnits.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Scan className="h-12 w-12 mx-auto mb-2" />
                        <p>هنوز واحدی اسکن نشده</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card className="soft-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    مرحله قبل
                  </Button>

                  <div className="flex items-center gap-4">
                    {totalDiff !== 0 && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">اختلاف در مقادیر وجود دارد</span>
                      </div>
                    )}

                    <Button
                      className="gap-2"
                      disabled={!canReconcile}
                      onClick={() => {
                        setReceiptData((prev) => ({ ...prev, status: "reconciled" }))
                        alert("رسید کالا تطبیق شد و قفل گردید")
                      }}
                    >
                      <Lock className="h-4 w-4" />
                      تطبیق و قفل رسید
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
