"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowRight,
  CheckCircle,
  Package,
  Clock,
  User,
  Calendar,
  FileText,
  Scan,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react"
import { t } from "@/lib/translations"
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
  transfer_type: "storeToStore",
  status: "shipped",
  created_by: "احمد محمدی",
  created_at: "2025-01-14T14:20:00Z",
  planned_date: "2025-01-15T16:00:00Z",
  shipped_at: "2025-01-15T10:30:00Z",
  notes: "انتقال فوری برای تأمین موجودی شعبه جنوب",
}

// Mock outbound items
const mockOutboundItems = [
  {
    barcode_12: "123456789012",
    tech_code: "TC001",
    sku_code: "SKU-001",
    item_title: "پیراهن مردانه آبی - سایز L",
    scanned_out_at: "2025-01-15T08:30:00Z",
  },
  {
    barcode_12: "123456789013",
    tech_code: "TC002",
    sku_code: "SKU-002",
    item_title: "شلوار جین زنانه مشکی - سایز M",
    scanned_out_at: "2025-01-15T08:31:00Z",
  },
  {
    barcode_12: "123456789014",
    tech_code: "TC003",
    sku_code: "SKU-003",
    item_title: "کفش ورزشی سفید - سایز ۴۲",
    scanned_out_at: "2025-01-15T08:32:00Z",
  },
]

// Mock inbound items (received)
const mockInboundItems = [
  {
    barcode_12: "123456789012",
    sku_code: "SKU-001",
    item_title: "پیراهن مردانه آبی - سایز L",
    scanned_in_at: "2025-01-15T14:20:00Z",
  },
]

// Mock timeline
const mockTimeline = [
  {
    id: "1",
    action: "ایجاد انتقال",
    actor: "احمد محمدی",
    timestamp: "2025-01-14T14:20:00Z",
    status: "draft",
  },
  {
    id: "2",
    action: "تغییر وضعیت به آماده ارسال",
    actor: "احمد محمدی",
    timestamp: "2025-01-14T15:30:00Z",
    status: "ready_to_ship",
  },
  {
    id: "3",
    action: "تغییر وضعیت به ارسال شد",
    actor: "فاطمه احمدی",
    timestamp: "2025-01-15T10:30:00Z",
    status: "shipped",
  },
]

// Mock variance (items expected but not received)
const mockVariance = [
  {
    barcode_12: "123456789013",
    sku_code: "SKU-002",
    item_title: "شلوار جین زنانه مشکی - سایز M",
    type: "missing",
  },
  {
    barcode_12: "123456789014",
    sku_code: "SKU-003",
    item_title: "کفش ورزشی سفید - سایز ۴۲",
    type: "missing",
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

export default function TransferDetailsPage() {
  const params = useParams()

  const handleMarkAsShipped = async () => {
    if (confirm("آیا از تغییر وضعیت این انتقال به ارسال شد اطمینان دارید؟")) {
      try {
        console.log("[v0] Marking transfer as shipped:", params.id)

        toast({
          title: t("success"),
          description: t("transferMarkedAsShipped"),
        })
      } catch (error) {
        toast({
          title: t("error"),
          description: "خطا در تغییر وضعیت",
          variant: "destructive",
        })
      }
    }
  }

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
          <span>{t("transferDetails")}</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t("transferDetails")}</h1>
            <p className="text-muted-foreground font-mono">{mockTransfer.transfer_no}</p>
          </div>
          <div className="flex items-center gap-2">
            {mockTransfer.status === "ready_to_ship" && (
              <Button onClick={handleMarkAsShipped} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                {t("markAsShipped")}
              </Button>
            )}
            {mockTransfer.status === "shipped" && (
              <Link href={`/transfers/${params.id}/receive`}>
                <Button className="gap-2">
                  <Scan className="h-4 w-4" />
                  {t("openReceivePage")}
                </Button>
              </Link>
            )}
            <Link href="/transfers">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                {t("backToHistory")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Transfer Header Info */}
        <Card className="soft-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                اطلاعات انتقال
              </CardTitle>
              {getStatusBadge(mockTransfer.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <h4 className="font-medium mb-2">{t("transferType")}</h4>
                <p className="text-sm text-muted-foreground">{getTransferTypeLabel(mockTransfer.transfer_type)}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  ایجاد شده توسط
                </h4>
                <p className="text-sm text-muted-foreground">{mockTransfer.created_by}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {t("createdAt")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(mockTransfer.created_at), "yyyy/MM/dd HH:mm")}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {t("plannedDate")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(mockTransfer.planned_date), "yyyy/MM/dd HH:mm")}
                </p>
              </div>

              {mockTransfer.shipped_at && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {t("shippedAt")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(mockTransfer.shipped_at), "yyyy/MM/dd HH:mm")}
                  </p>
                </div>
              )}
            </div>

            {mockTransfer.notes && (
              <div className="mt-6">
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {t("notes")}
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">{mockTransfer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="soft-shadow">
          <Tabs defaultValue="outbound" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="outbound">{t("outbound")}</TabsTrigger>
                <TabsTrigger value="inbound">{t("inbound")}</TabsTrigger>
                <TabsTrigger value="timeline">{t("timeline")}</TabsTrigger>
                <TabsTrigger value="variance">{t("variance")}</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* Outbound Tab */}
              <TabsContent value="outbound" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{t("outboundItems")}</h3>
                  <Badge variant="secondary">{mockOutboundItems.length} مورد</Badge>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">{t("barcode12")}</TableHead>
                        <TableHead className="text-right">{t("techCode")}</TableHead>
                        <TableHead className="text-right">کد SKU</TableHead>
                        <TableHead className="text-right">عنوان کالا</TableHead>
                        <TableHead className="text-right">زمان ثبت</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOutboundItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono">{item.barcode_12}</TableCell>
                          <TableCell className="font-mono">{item.tech_code}</TableCell>
                          <TableCell className="font-mono">{item.sku_code}</TableCell>
                          <TableCell>{item.item_title}</TableCell>
                          <TableCell>{format(new Date(item.scanned_out_at), "yyyy/MM/dd HH:mm")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Inbound Tab */}
              <TabsContent value="inbound" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{t("inboundItems")}</h3>
                  <Badge variant="secondary">{mockInboundItems.length} مورد</Badge>
                </div>
                {mockInboundItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">هنوز کالایی دریافت نشده است</p>
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
                        {mockInboundItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{item.barcode_12}</TableCell>
                            <TableCell className="font-mono">{item.sku_code}</TableCell>
                            <TableCell>{item.item_title}</TableCell>
                            <TableCell>{format(new Date(item.scanned_in_at), "yyyy/MM/dd HH:mm")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-4">
                <h3 className="text-lg font-medium">{t("timeline")}</h3>
                <div className="space-y-4">
                  {mockTimeline.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.action}</h4>
                          {getStatusBadge(event.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">توسط {event.actor}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.timestamp), "yyyy/MM/dd HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Variance Tab */}
              <TabsContent value="variance" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{t("variance")}</h3>
                  <Badge variant="destructive">{mockVariance.length} مغایرت</Badge>
                </div>
                {mockVariance.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">مغایرتی وجود ندارد</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">نوع مغایرت</TableHead>
                          <TableHead className="text-right">{t("barcode12")}</TableHead>
                          <TableHead className="text-right">کد SKU</TableHead>
                          <TableHead className="text-right">عنوان کالا</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockVariance.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                <span className="text-destructive">کالای مفقود</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">{item.barcode_12}</TableCell>
                            <TableCell className="font-mono">{item.sku_code}</TableCell>
                            <TableCell>{item.item_title}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </AppShell>
  )
}
