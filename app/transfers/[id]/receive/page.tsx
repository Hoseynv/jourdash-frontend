"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, CheckCircle, AlertCircle, Scan, Package, Check, X } from "lucide-react"
import { t } from "@/lib/translations"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"
import { useParams } from "next/navigation"

// Mock transfer data
const mockTransfer = {
  id: "2",
  transfer_no: "TRF-202501-002",
  from_owner: "شعبه مرکزی",
  to_owner: "شعبه جنوب",
  status: "shipped",
  items_count: 3,
  received_count: 1,
}

// Mock outbound items
const mockOutboundItems = [
  {
    barcode_12: "123456789012",
    tech_code: "TC001",
    sku_code: "SKU-001",
    item_title: "پیراهن مردانه آبی - سایز L",
    scanned_out_at: "2025-01-15T08:30:00Z",
    received: true,
    scanned_in_at: "2025-01-15T14:20:00Z",
  },
  {
    barcode_12: "123456789013",
    tech_code: "TC002",
    sku_code: "SKU-002",
    item_title: "شلوار جین زنانه مشکی - سایز M",
    scanned_out_at: "2025-01-15T08:31:00Z",
    received: false,
    scanned_in_at: null,
  },
  {
    barcode_12: "123456789014",
    tech_code: "TC003",
    sku_code: "SKU-003",
    item_title: "کفش ورزشی سفید - سایز ۴۲",
    scanned_out_at: "2025-01-15T08:32:00Z",
    received: false,
    scanned_in_at: null,
  },
]

export default function ReceiveTransferDetailPage() {
  const params = useParams()
  const [barcodeInput, setBarcodeInput] = useState("")
  const [outboundItems, setOutboundItems] = useState(mockOutboundItems)
  const [receivedItems, setReceivedItems] = useState(mockOutboundItems.filter((item) => item.received))
  const scannerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scannerRef.current) {
      scannerRef.current.focus()
    }
  }, [])

  const validateBarcode = (barcode: string) => {
    return /^\d{12}$/.test(barcode)
  }

  const handleBarcodeSubmit = async () => {
    if (!validateBarcode(barcodeInput)) {
      toast({
        title: t("error"),
        description: t("barcodeRequired"),
        variant: "destructive",
      })
      return
    }

    // Check if barcode belongs to this transfer
    const outboundItem = outboundItems.find((item) => item.barcode_12 === barcodeInput)

    if (!outboundItem) {
      toast({
        title: t("error"),
        description: t("notIncludedInTransfer"),
        variant: "destructive",
      })
      setBarcodeInput("")
      return
    }

    // Check if already received
    if (outboundItem.received) {
      toast({
        title: t("warning"),
        description: t("alreadyReceived"),
        variant: "destructive",
      })
      setBarcodeInput("")
      return
    }

    try {
      console.log("[v0] Receiving item with barcode:", barcodeInput)

      // Update the item as received
      const updatedOutboundItems = outboundItems.map((item) =>
        item.barcode_12 === barcodeInput ? { ...item, received: true, scanned_in_at: new Date().toISOString() } : item,
      )

      setOutboundItems(updatedOutboundItems)
      setReceivedItems(updatedOutboundItems.filter((item) => item.received))
      setBarcodeInput("")

      toast({
        title: t("success"),
        description: t("itemScannedSuccess"),
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: "خطا در دریافت کالا",
        variant: "destructive",
      })
    }
  }

  const handleConfirmFullReceipt = async () => {
    const allReceived = outboundItems.every((item) => item.received)

    if (!allReceived) {
      toast({
        title: t("error"),
        description: "تمام کالاها باید دریافت شوند.",
        variant: "destructive",
      })
      return
    }

    if (confirm("آیا از ثبت دریافت کامل این انتقال اطمینان دارید؟")) {
      try {
        console.log("[v0] Confirming full receipt for transfer:", params.id)

        toast({
          title: t("success"),
          description: `${t("transferMarkedAsReceived")} - ${t("transferDetails")}`,
          action: (
            <Link href={`/transfers/${params.id}`}>
              <Button variant="outline" size="sm">
                {t("transferDetails")}
              </Button>
            </Link>
          ),
        })
      } catch (error) {
        toast({
          title: t("error"),
          description: "خطا در ثبت دریافت کامل",
          variant: "destructive",
        })
      }
    }
  }

  const receivedCount = outboundItems.filter((item) => item.received).length
  const totalCount = outboundItems.length
  const progressPercentage = (receivedCount / totalCount) * 100

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Jour</span>
          <span className="mx-2">/</span>
          <Link href="/transfers" className="hover:text-foreground">
            {t("transfers")}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/transfers/receive" className="hover:text-foreground">
            {t("receiveTransfer")}
          </Link>
          <span className="mx-2">/</span>
          <span>صفحه دریافت</span>
        </div>

        {/* Transfer Header */}
        <Card className="soft-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  صفحه دریافت
                </CardTitle>
                <CardDescription>
                  <Link href={`/transfers/${params.id}`} className="text-primary hover:underline font-mono">
                    {mockTransfer.transfer_no}
                  </Link>
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {t("shipped")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">مبدأ → مقصد</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {mockTransfer.from_owner}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {mockTransfer.to_owner}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">{t("progress")}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {receivedCount} / {totalCount}
                    </span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleConfirmFullReceipt} disabled={receivedCount !== totalCount} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {t("confirmFullReceipt")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scanner */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              اسکن دریافت
            </CardTitle>
            <CardDescription>بارکد کالاهای دریافتی را اسکن کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  ref={scannerRef}
                  type="text"
                  placeholder="بارکد ۱۲ رقمی را وارد کنید..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleBarcodeSubmit()
                    } else if (e.key === "Escape") {
                      setBarcodeInput("")
                    }
                  }}
                  className="text-center font-mono text-lg"
                  maxLength={12}
                />
              </div>

              {barcodeInput && !validateBarcode(barcodeInput) && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {t("barcodeRequired")}
                </div>
              )}

              <div className="text-xs text-muted-foreground text-center">Enter = ثبت دریافت | Esc = پاک کردن</div>
            </div>
          </CardContent>
        </Card>

        {/* Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Expected Items */}
          <Card className="soft-shadow">
            <CardHeader>
              <CardTitle>{t("expectedItems")}</CardTitle>
              <CardDescription>کالاهای ارسال شده ({totalCount} مورد)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">{t("barcode12")}</TableHead>
                      <TableHead className="text-right">کد SKU</TableHead>
                      <TableHead className="text-right">عنوان کالا</TableHead>
                      <TableHead className="text-right">زمان ارسال</TableHead>
                      <TableHead className="text-right">دریافت شد؟</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outboundItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{item.barcode_12}</TableCell>
                        <TableCell className="font-mono text-sm">{item.sku_code}</TableCell>
                        <TableCell className="text-sm">{item.item_title}</TableCell>
                        <TableCell className="text-sm">{format(new Date(item.scanned_out_at), "HH:mm")}</TableCell>
                        <TableCell>
                          {item.received ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Received Items */}
          <Card className="soft-shadow">
            <CardHeader>
              <CardTitle>{t("receivedItems")}</CardTitle>
              <CardDescription>کالاهای دریافت شده ({receivedCount} مورد)</CardDescription>
            </CardHeader>
            <CardContent>
              {receivedItems.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">هنوز کالایی دریافت نشده</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">{t("barcode12")}</TableHead>
                        <TableHead className="text-right">کد SKU</TableHead>
                        <TableHead className="text-right">عنوان کالا</TableHead>
                        <TableHead className="text-right">زمان دریافت</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receivedItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{item.barcode_12}</TableCell>
                          <TableCell className="font-mono text-sm">{item.sku_code}</TableCell>
                          <TableCell className="text-sm">{item.item_title}</TableCell>
                          <TableCell className="text-sm">
                            {item.scanned_in_at && format(new Date(item.scanned_in_at), "HH:mm")}
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
      </div>
    </AppShell>
  )
}
