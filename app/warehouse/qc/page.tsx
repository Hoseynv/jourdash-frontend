"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { BarcodeScannerInput } from "@/components/barcode-scanner-input"
import { StatusChip } from "@/components/status-chip"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Scan, AlertTriangle } from "lucide-react"
import { t } from "@/lib/translations"

// Mock data
const mockQCChecks = [
  {
    id: "1",
    barcode_12: "123456789012",
    sku_code: "NIKE-SHIRT-001",
    sku_description: "پیراهن ورزشی نایک مردانه",
    result: "pass",
    reason_code: null,
    notes: "کیفیت عالی",
    checked_by: "احمد محمدی",
    checked_at: "2024-01-22T10:30:00Z",
  },
  {
    id: "2",
    barcode_12: "987654321098",
    sku_code: "ADIDAS-SHOE-001",
    sku_description: "کفش ورزشی آدیداس",
    result: "fail",
    reason_code: "DAMAGED",
    notes: "آسیب در قسمت پاشنه",
    checked_by: "فاطمه احمدی",
    checked_at: "2024-01-22T11:15:00Z",
  },
  {
    id: "3",
    barcode_12: "456789123456",
    sku_code: "PUMA-PANTS-001",
    sku_description: "شلوار ورزشی پوما",
    result: "pass",
    reason_code: null,
    notes: null,
    checked_by: "علی رضایی",
    checked_at: "2024-01-22T12:00:00Z",
  },
]

const reasonCodes = [
  { value: "DAMAGED", label: "آسیب فیزیکی" },
  { value: "DEFECTIVE", label: "نقص تولیدی" },
  { value: "WRONG_SIZE", label: "سایز اشتباه" },
  { value: "WRONG_COLOR", label: "رنگ اشتباه" },
  { value: "INCOMPLETE", label: "ناقص" },
  { value: "OTHER", label: "سایر موارد" },
]

export default function QCPage() {
  const [scanInput, setScanInput] = useState("")
  const [currentUnit, setCurrentUnit] = useState<any>(null)
  const [qcForm, setQCForm] = useState({
    result: "",
    reason_code: "",
    notes: "",
  })
  const [qcChecks, setQCChecks] = useState(mockQCChecks)

  const showToast = (message: string, type: "success" | "error" = "success") => {
    alert(message)
  }

  const handleScanUnit = (barcode: string) => {
    if (qcChecks.some((check) => check.barcode_12 === barcode)) {
      showToast("این بارکد قبلاً کنترل کیفیت شده است", "error")
      return
    }

    // Mock: Find unit by barcode
    const mockUnit = {
      barcode_12: barcode,
      sku_code: "NIKE-SHIRT-001",
      sku_description: "پیراهن ورزشی نایک مردانه",
      sku_image: "/nike-shirt-front-view.jpg",
      color: "آبی",
      size: "L",
      status: "available",
    }

    setCurrentUnit(mockUnit)
    setScanInput("")
    setQCForm({ result: "", reason_code: "", notes: "" })

    showToast("واحد کالا برای کنترل کیفیت آماده شد")
  }

  const handleSubmitQC = () => {
    if (!currentUnit || !qcForm.result) {
      showToast("لطفاً نتیجه کنترل کیفیت را انتخاب کنید", "error")
      return
    }

    if (qcForm.result === "fail" && !qcForm.reason_code) {
      showToast("لطفاً دلیل رد را انتخاب کنید", "error")
      return
    }

    const newCheck = {
      id: Date.now().toString(),
      barcode_12: currentUnit.barcode_12,
      sku_code: currentUnit.sku_code,
      sku_description: currentUnit.sku_description,
      result: qcForm.result,
      reason_code: qcForm.result === "fail" ? qcForm.reason_code : null,
      notes: qcForm.notes || null,
      checked_by: "کاربر فعلی",
      checked_at: new Date().toISOString(),
    }

    setQCChecks((prev) => [newCheck, ...prev])
    setCurrentUnit(null)
    setQCForm({ result: "", reason_code: "", notes: "" })

    showToast(`کنترل کیفیت با نتیجه "${qcForm.result === "pass" ? "تأیید" : "رد"}" ثبت شد`)
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

  const getResultIcon = (result: string) => {
    switch (result) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-orange-500" />
    }
  }

  const passedCount = qcChecks.filter((check) => check.result === "pass").length
  const failedCount = qcChecks.filter((check) => check.result === "fail").length

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t("qc")}</h1>
            <p className="text-muted-foreground">کنترل کیفیت واحدهای کالا</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-green-600 font-medium">{passedCount} تأیید</span>
              <span className="text-muted-foreground mx-2">|</span>
              <span className="text-red-600 font-medium">{failedCount} رد</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* QC Interface */}
          <div className="space-y-6">
            {/* Scanner */}
            <Card className="soft-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  اسکن واحد کالا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarcodeScannerInput
                  value={scanInput}
                  onChange={setScanInput}
                  onScan={handleScanUnit}
                  label="بارکد واحد کالا"
                  placeholder="بارکد ۱۲ رقمی را اسکن کنید"
                  autoFocus
                />
              </CardContent>
            </Card>

            {/* Unit Details */}
            {currentUnit && (
              <Card className="soft-shadow">
                <CardHeader>
                  <CardTitle>اطلاعات واحد کالا</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <img
                      src={currentUnit.sku_image || "/placeholder.svg"}
                      alt={currentUnit.sku_description}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="font-medium">{currentUnit.sku_description}</p>
                        <p className="text-sm text-muted-foreground">{currentUnit.sku_code}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{currentUnit.color}</Badge>
                        <Badge variant="secondary">{currentUnit.size}</Badge>
                        <StatusChip status={currentUnit.status} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          بارکد: <span className="font-mono">{currentUnit.barcode_12}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* QC Form */}
            {currentUnit && (
              <Card className="soft-shadow">
                <CardHeader>
                  <CardTitle>کنترل کیفیت</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>نتیجه کنترل</Label>
                    <Select
                      value={qcForm.result}
                      onValueChange={(value) => setQCForm((prev) => ({ ...prev, result: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب نتیجه" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            تأیید
                          </div>
                        </SelectItem>
                        <SelectItem value="fail">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            رد
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {qcForm.result === "fail" && (
                    <div className="space-y-2">
                      <Label>دلیل رد</Label>
                      <Select
                        value={qcForm.reason_code}
                        onValueChange={(value) => setQCForm((prev) => ({ ...prev, reason_code: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب دلیل" />
                        </SelectTrigger>
                        <SelectContent>
                          {reasonCodes.map((reason) => (
                            <SelectItem key={reason.value} value={reason.value}>
                              {reason.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>یادداشت (اختیاری)</Label>
                    <Textarea
                      value={qcForm.notes}
                      onChange={(e) => setQCForm((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="توضیحات اضافی در مورد کنترل کیفیت..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmitQC}
                      disabled={!qcForm.result || (qcForm.result === "fail" && !qcForm.reason_code)}
                      className="flex-1"
                    >
                      ثبت کنترل کیفیت
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentUnit(null)
                        setQCForm({ result: "", reason_code: "", notes: "" })
                        showToast("کنترل کیفیت لغو شد")
                      }}
                    >
                      لغو
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent QC Checks */}
          <Card className="soft-shadow">
            <CardHeader>
              <CardTitle>کنترل‌های اخیر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {qcChecks.map((check) => (
                  <div
                    key={check.id}
                    className={`border rounded-lg p-3 ${
                      check.result === "fail" ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getResultIcon(check.result)}
                        <span className="font-mono text-sm">{check.barcode_12}</span>
                        <StatusChip status={check.result} />
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDateTime(check.checked_at)}</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">{check.sku_description}</p>
                      <p className="text-xs text-muted-foreground">{check.sku_code}</p>

                      {check.reason_code && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{reasonCodes.find((r) => r.value === check.reason_code)?.label}</span>
                        </div>
                      )}

                      {check.notes && <p className="text-xs text-muted-foreground italic">"{check.notes}"</p>}

                      <p className="text-xs text-muted-foreground">توسط: {check.checked_by}</p>
                    </div>
                  </div>
                ))}

                {qcChecks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2" />
                    <p>هنوز کنترل کیفیتی انجام نشده</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
