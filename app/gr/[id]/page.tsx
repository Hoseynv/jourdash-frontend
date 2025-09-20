"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { StatusChip } from "@/components/status-chip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import {
  ArrowLeft,
  Package,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Archive,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

// Mock data for receipt details
const mockReceiptDetails = {
  id: "gr-001",
  receipt_no: "WRC-202401-0001",
  supplier_name: "تأمین‌کننده اصلی",
  supplier_invoice_no: "INV-2024-001",
  supplier_invoice_date: "2024-01-15",
  receipt_date: "2024-01-15",
  status: "counting",
  created_by: "احمد محمدی",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T14:30:00Z",
}

const mockReceiptLines = [
  {
    id: "1",
    sku_code: "JOW1112300101",
    brand: { name: "JOUR", code: "JO" },
    gender: "W",
    season: { name: "بهار", code: "1" },
    category: { name: "کیف", code: "1" },
    subcategory: { name: "کیف دستی", code: "1" },
    model: { name: "کلاسیک", code: "230" },
    color: { name: "آبی", code: "001" },
    size: { name: "متوسط", code: "01" },
    uom: "عدد",
    expected_qty: 50,
    counted_qty: 48,
    diff_qty: -2,
    notes: "دو واحد کمبود",
  },
  {
    id: "2",
    sku_code: "PHM2234500202",
    brand: { name: "Paris Hilton", code: "PH" },
    gender: "M",
    season: { name: "تابستان", code: "2" },
    category: { name: "کفش", code: "2" },
    subcategory: { name: "ورزشی", code: "3" },
    model: { name: "رانینگ", code: "450" },
    color: { name: "سفید", code: "002" },
    size: { name: "42", code: "02" },
    uom: "جفت",
    expected_qty: 30,
    counted_qty: 32,
    diff_qty: 2,
    notes: "دو واحد اضافی",
  },
]

const mockUnits = [
  {
    id: "unit-001",
    barcode_12: "123456789012",
    tech_code: "TC-001-2024",
    sku_code: "JOW1112300101",
    color: "آبی",
    size: "متوسط",
    stage: "qc_pass",
    status: "در انتظار جایگذاری",
    owner: null,
    location: null,
  },
  {
    id: "unit-002",
    barcode_12: "123456789013",
    tech_code: "TC-002-2024",
    sku_code: "JOW1112300101",
    color: "آبی",
    size: "متوسط",
    stage: "stored",
    status: "ذخیره شده",
    owner: "انبار اصلی",
    location: "A-01-01",
  },
]

const mockActivity = [
  {
    id: "1",
    timestamp: "2024-01-15T14:30:00Z",
    user: "فاطمه احمدی",
    action: "شروع شمارش",
    description: "وضعیت رسید به 'در حال شمارش' تغییر یافت",
  },
  {
    id: "2",
    timestamp: "2024-01-15T10:00:00Z",
    user: "احمد محمدی",
    action: "ایجاد رسید",
    description: "رسید جدید ایجاد شد",
  },
]

export default function GoodsReceiptDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [receipt] = useState(mockReceiptDetails)
  const [lines] = useState(mockReceiptLines)
  const [units] = useState(mockUnits)
  const [activity] = useState(mockActivity)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("sku")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [countingData, setCountingData] = useState<{ [lineId: string]: number }>({})

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

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "created":
        return <Clock className="h-4 w-4 text-gray-500" />
      case "counting":
        return <Package className="h-4 w-4 text-blue-500" />
      case "qc_pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "qc_fail":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "putaway":
        return <Truck className="h-4 w-4 text-orange-500" />
      case "stored":
        return <Archive className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStageText = (stage: string) => {
    switch (stage) {
      case "created":
        return "ایجاد شده"
      case "counting":
        return "در حال شمارش"
      case "qc_pass":
        return "تأیید کیفیت"
      case "qc_fail":
        return "رد کیفیت"
      case "putaway":
        return "در حال جایگذاری"
      case "stored":
        return "ذخیره شده"
      default:
        return "نامشخص"
    }
  }

  const canEnterCounting = receipt.status === "draft"
  const canReconcile = receipt.status === "counting"
  const isReconciled = receipt.status === "reconciled"

  const totalLines = lines.length
  const totalUnits = units.length
  const totalVariance = lines.reduce((sum, line) => sum + Math.abs(line.diff_qty), 0)

  const filteredAndSortedLines = useMemo(() => {
    const filtered = lines.filter((line) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        line.sku_code.toLowerCase().includes(searchLower) ||
        line.brand.name.toLowerCase().includes(searchLower) ||
        line.model.name.toLowerCase().includes(searchLower) ||
        line.color.name.toLowerCase().includes(searchLower)
      )
    })

    return filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "sku":
          aValue = a.sku_code
          bValue = b.sku_code
          break
        case "brand":
          aValue = a.brand.name
          bValue = b.brand.name
          break
        case "model":
          aValue = a.model.name
          bValue = b.model.name
          break
        case "color":
          aValue = a.color.name
          bValue = b.color.name
          break
        case "expected_qty":
          aValue = a.expected_qty
          bValue = b.expected_qty
          break
        case "diff_qty":
          aValue = Math.abs(a.diff_qty)
          bValue = Math.abs(b.diff_qty)
          break
        default:
          return 0
      }

      if (typeof aValue === "string") {
        const comparison = aValue.localeCompare(bValue, "fa")
        return sortOrder === "asc" ? comparison : -comparison
      } else {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }
    })
  }, [lines, searchTerm, sortBy, sortOrder])

  const toggleRowExpansion = (lineId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(lineId)) {
      newExpanded.delete(lineId)
    } else {
      newExpanded.add(lineId)
    }
    setExpandedRows(newExpanded)
  }

  const handleCountingChange = (lineId: string, value: number) => {
    setCountingData((prev) => ({ ...prev, [lineId]: value }))
  }

  const generateProductTitle = (line: any) => (
    <div className="flex flex-wrap gap-1">
      <Badge variant="outline" className="text-xs font-medium">
        {line.brand.name}#{line.brand.code}
      </Badge>
      <Badge variant="outline" className="text-xs">
        {line.model.name}#{line.model.code}
      </Badge>
      <Badge variant="outline" className="text-xs">
        {line.color.name}#{line.color.code}
      </Badge>
      <Badge variant="outline" className="text-xs">
        {line.size.name}
      </Badge>
    </div>
  )

  const generateProductSpecs = (line: any) => (
    <div className="space-y-1 text-xs">
      <div>
        <span className="font-medium">برند:</span> {line.brand.name} ({line.brand.code})
      </div>
      <div>
        <span className="font-medium">جنسیت:</span> {line.gender === "W" ? "زنانه" : "مردانه"}
      </div>
      <div>
        <span className="font-medium">فصل:</span> {line.season.name} ({line.season.code})
      </div>
      <div>
        <span className="font-medium">دسته:</span> {line.category.name} ({line.category.code})
      </div>
      <div>
        <span className="font-medium">زیردسته:</span> {line.subcategory.name} ({line.subcategory.code})
      </div>
      <div>
        <span className="font-medium">مدل:</span> {line.model.name} ({line.model.code})
      </div>
      <div>
        <span className="font-medium">رنگ:</span> {line.color.name} ({line.color.code})
      </div>
      <div>
        <span className="font-medium">سایز:</span> {line.size.name} ({line.size.code})
      </div>
    </div>
  )

  const getUnitsForLine = (lineId: string) => {
    const line = lines.find((l) => l.id === lineId)
    if (!line) return []
    return units.filter((u) => u.sku_code === line.sku_code)
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-balance">جزئیات رسید خرید</h1>
              <p className="text-muted-foreground">{receipt.receipt_no}</p>
            </div>
          </div>
          <StatusChip status={receipt.status} />
        </div>

        {/* Receipt Header Card */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              اطلاعات رسید
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">تأمین‌کننده</p>
                <p className="font-medium">{receipt.supplier_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تاریخ رسید</p>
                <p className="font-medium">{formatDate(receipt.receipt_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">شماره فاکتور تأمین‌کننده</p>
                <p className="font-medium font-mono">{receipt.supplier_invoice_no}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تاریخ فاکتور</p>
                <p className="font-medium">{formatDate(receipt.supplier_invoice_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ایجاد شده توسط</p>
                <p className="font-medium">{receipt.created_by}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">آخرین به‌روزرسانی</p>
                <p className="font-medium">{formatDateTime(receipt.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items">اقلام و واحدها</TabsTrigger>
            <TabsTrigger value="activity">رویدادها و تاریخچه</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            {/* Summary */}
            <Card className="soft-shadow">
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{totalLines}</p>
                    <p className="text-sm text-muted-foreground">تعداد اقلام</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{totalUnits}</p>
                    <p className="text-sm text-muted-foreground">تعداد واحدها</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${totalVariance > 0 ? "text-orange-600" : "text-green-600"}`}>
                      {totalVariance}
                    </p>
                    <p className="text-sm text-muted-foreground">اختلاف</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="soft-shadow">
              <CardHeader>
                <CardTitle>خلاصه اقلام</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="جستجو در SKU، برند، مدل، رنگ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sku">مرتب‌سازی بر اساس SKU</SelectItem>
                      <SelectItem value="brand">مرتب‌سازی بر اساس برند</SelectItem>
                      <SelectItem value="model">مرتب‌سازی بر اساس مدل</SelectItem>
                      <SelectItem value="color">مرتب‌سازی بر اساس رنگ</SelectItem>
                      <SelectItem value="expected_qty">مرتب‌سازی بر اساس مقدار انتظار</SelectItem>
                      <SelectItem value="diff_qty">مرتب‌سازی بر اساس اختلاف</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? "صعودی" : "نزولی"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right w-8"></TableHead>
                      <TableHead className="text-right">SKU</TableHead>
                      <TableHead className="text-right">عنوان کالا</TableHead>
                      <TableHead className="text-right">ویژگی‌ها</TableHead>
                      <TableHead className="text-right">مقدار انتظار</TableHead>
                      <TableHead className="text-right">مقدار شمارش</TableHead>
                      <TableHead className="text-right">اختلاف</TableHead>
                      <TableHead className="text-right">یادداشت</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedLines.map((line) => {
                      const isExpanded = expandedRows.has(line.id)
                      const currentCounted = countingData[line.id] ?? line.counted_qty
                      const canEdit = receipt.status === "counting"

                      return (
                        <>
                          <TableRow key={line.id}>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRowExpansion(line.id)}
                                className="p-1"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm">{line.sku_code}</span>
                            </TableCell>
                            <TableCell>{generateProductTitle(line)}</TableCell>
                            <TableCell>{generateProductSpecs(line)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{line.expected_qty}</Badge>
                            </TableCell>
                            <TableCell>
                              {canEdit ? (
                                <Input
                                  type="number"
                                  min="0"
                                  value={currentCounted}
                                  onChange={(e) => handleCountingChange(line.id, Number.parseInt(e.target.value) || 0)}
                                  className="w-20"
                                />
                              ) : (
                                <Badge variant="secondary">{currentCounted}</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  currentCounted - line.expected_qty > 0
                                    ? "default"
                                    : currentCounted - line.expected_qty < 0
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {currentCounted - line.expected_qty > 0 ? "+" : ""}
                                {currentCounted - line.expected_qty}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">{line.notes}</span>
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow>
                              <TableCell colSpan={8} className="bg-muted/30">
                                <div className="p-4">
                                  <h4 className="font-medium mb-3">واحدها برای {line.sku_code}</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="text-right">بارکد ۱۲ رقمی</TableHead>
                                        <TableHead className="text-right">کد فنی</TableHead>
                                        <TableHead className="text-right">مرحله/وضعیت</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {getUnitsForLine(line.id).map((unit) => (
                                        <TableRow key={unit.id}>
                                          <TableCell>
                                            <span className="font-mono text-sm">{unit.barcode_12}</span>
                                          </TableCell>
                                          <TableCell>
                                            <span className="font-mono text-sm">{unit.tech_code}</span>
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-2">
                                              {getStageIcon(unit.stage)}
                                              <span className="text-sm">{getStageText(unit.stage)}</span>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Units Table */}
            <Card className="soft-shadow">
              <CardHeader>
                <CardTitle>واحدها (یک ردیف برای هر واحد فیزیکی)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">بارکد ۱۲ رقمی</TableHead>
                      <TableHead className="text-right">کد فنی</TableHead>
                      <TableHead className="text-right">کد SKU</TableHead>
                      <TableHead className="text-right">رنگ/سایز</TableHead>
                      <TableHead className="text-right">مرحله/وضعیت</TableHead>
                      <TableHead className="text-right">مالک/مکان</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {units.map((unit) => (
                      <Drawer key={unit.id}>
                        <DrawerTrigger asChild>
                          <TableRow className="cursor-pointer hover:bg-muted/50">
                            <TableCell>
                              <span className="font-mono text-sm">{unit.barcode_12}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm">{unit.tech_code}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm">{unit.sku_code}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {unit.color}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {unit.size}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStageIcon(unit.stage)}
                                <span className="text-sm">{getStageText(unit.stage)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {unit.owner && <p className="font-medium">{unit.owner}</p>}
                                {unit.location && <p className="text-muted-foreground">{unit.location}</p>}
                                {!unit.owner && !unit.location && <span className="text-muted-foreground">-</span>}
                              </div>
                            </TableCell>
                          </TableRow>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>جزئیات واحد {unit.tech_code}</DrawerTitle>
                          </DrawerHeader>
                          <div className="p-6 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <p className="text-sm text-muted-foreground">بارکد ۱۲ رقمی</p>
                                <p className="font-mono">{unit.barcode_12}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">کد فنی</p>
                                <p className="font-mono">{unit.tech_code}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">کد SKU</p>
                                <p className="font-mono">{unit.sku_code}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">مرحله فعلی</p>
                                <div className="flex items-center gap-2">
                                  {getStageIcon(unit.stage)}
                                  <span>{getStageText(unit.stage)}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">تاریخچه واحد</p>
                              <div className="space-y-2 text-sm">
                                <p>• ایجاد شده در رسید {receipt.receipt_no}</p>
                                <p>• وضعیت فعلی: {unit.status}</p>
                                {unit.owner && <p>• مالک: {unit.owner}</p>}
                                {unit.location && <p>• مکان: {unit.location}</p>}
                              </div>
                            </div>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="soft-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  رویدادها و تاریخچه
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activity.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{event.action}</p>
                          <p className="text-sm text-muted-foreground">{formatDateTime(event.timestamp)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
                        <p className="text-xs text-muted-foreground">توسط {event.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        {!isReconciled && (
          <Card className="soft-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-end gap-4">
                {canEnterCounting && (
                  <Button className="gap-2">
                    <Package className="h-4 w-4" />
                    ورود به شمارش
                  </Button>
                )}
                {canReconcile && (
                  <Button className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    تطبیق و ثبت نهایی
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
