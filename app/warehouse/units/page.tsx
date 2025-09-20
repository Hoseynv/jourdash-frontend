"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { BarcodeScannerInput } from "@/components/barcode-scanner-input"
import { StatusChip } from "@/components/status-chip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Filter, Download, Eye, MapPin, Clock } from "lucide-react"
import { t } from "@/lib/translations"

// Mock data
const mockUnits = [
  {
    id: "1",
    barcode_12: "123456789012",
    tech_code: "TECH-001",
    sku_code: "NIKE-SHIRT-001",
    sku_description: "پیراهن ورزشی نایک مردانه",
    color: "آبی",
    size: "L",
    status: "available",
    owner_type: "warehouse",
    owner_id: "WH-001",
    owner_name: "انبار مرکزی",
    location_code_cached: "A-01-02-03",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    barcode_12: "987654321098",
    tech_code: "TECH-002",
    sku_code: "ADIDAS-SHOE-001",
    sku_description: "کفش ورزشی آدیداس",
    color: "مشکی",
    size: "42",
    status: "blocked",
    owner_type: "store",
    owner_id: "ST-001",
    owner_name: "فروشگاه مرکزی",
    location_code_cached: "B-02-01-01",
    created_at: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    barcode_12: "456789123456",
    tech_code: "TECH-003",
    sku_code: "PUMA-PANTS-001",
    sku_description: "شلوار ورزشی پوما",
    color: "خاکستری",
    size: "M",
    status: "reserved",
    owner_type: "warehouse",
    owner_id: "WH-001",
    owner_name: "انبار مرکزی",
    location_code_cached: "C-03-01-02",
    created_at: "2024-01-17T09:15:00Z",
  },
]

const mockMoveHistory = [
  {
    id: "1",
    from_location: "A-01-01-01",
    to_location: "A-01-02-03",
    moved_by: "احمد محمدی",
    moved_at: "2024-01-20T10:30:00Z",
    reason: "جایگذاری اولیه",
  },
  {
    id: "2",
    from_location: "RECEIVING",
    to_location: "A-01-01-01",
    moved_by: "فاطمه احمدی",
    moved_at: "2024-01-15T14:20:00Z",
    reason: "دریافت کالا",
  },
]

export default function ItemUnitsPage() {
  const [filters, setFilters] = useState({
    barcode: "",
    techCode: "",
    status: "",
    ownerType: "",
    ownerId: "",
  })
  const [selectedUnit, setSelectedUnit] = useState<(typeof mockUnits)[0] | null>(null)

  const handleBarcodeSearch = (barcode: string) => {
    setFilters((prev) => ({ ...prev, barcode }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredUnits = mockUnits.filter((unit) => {
    return (
      (!filters.barcode || unit.barcode_12.includes(filters.barcode)) &&
      (!filters.techCode || unit.tech_code.toLowerCase().includes(filters.techCode.toLowerCase())) &&
      (!filters.status || unit.status === filters.status) &&
      (!filters.ownerType || unit.owner_type === filters.ownerType)
    )
  })

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t("itemUnits")}</h1>
            <p className="text-muted-foreground">مرور و جستجوی واحدهای کالا در سیستم</p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            خروجی CSV
          </Button>
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <BarcodeScannerInput
                value={filters.barcode}
                onChange={(value) => setFilters((prev) => ({ ...prev, barcode: value }))}
                onScan={handleBarcodeSearch}
                label="بارکد"
                placeholder="اسکن یا تایپ کنید"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">کد فنی</label>
                <Input
                  value={filters.techCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, techCode: e.target.value }))}
                  placeholder="جستجوی کد فنی"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">وضعیت</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="همه وضعیت‌ها" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="available">موجود</SelectItem>
                    <SelectItem value="blocked">مسدود</SelectItem>
                    <SelectItem value="reserved">رزرو شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">نوع مالک</label>
                <Select
                  value={filters.ownerType}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, ownerType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="همه انواع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه انواع</SelectItem>
                    <SelectItem value="warehouse">انبار</SelectItem>
                    <SelectItem value="store">فروشگاه</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({ barcode: "", techCode: "", status: "", ownerType: "", ownerId: "" })}
                  className="w-full"
                >
                  پاک کردن فیلترها
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>نتایج ({filteredUnits.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">بارکد</TableHead>
                  <TableHead className="text-right">کد فنی</TableHead>
                  <TableHead className="text-right">کالا</TableHead>
                  <TableHead className="text-right">مشخصات</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">مالک</TableHead>
                  <TableHead className="text-right">موقعیت</TableHead>
                  <TableHead className="text-right">تاریخ ایجاد</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {unit.barcode_12}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{unit.tech_code}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{unit.sku_code}</p>
                        <p className="text-sm text-muted-foreground">{unit.sku_description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {unit.color}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {unit.size}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={unit.status} />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{unit.owner_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {unit.owner_type === "warehouse" ? "انبار" : "فروشگاه"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-mono">{unit.location_code_cached}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(unit.created_at)}</span>
                    </TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedUnit(unit)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[600px] sm:w-[600px]">
                          <SheetHeader>
                            <SheetTitle>جزئیات واحد کالا</SheetTitle>
                            <SheetDescription>اطلاعات کامل و تاریخچه حرکت واحد کالا</SheetDescription>
                          </SheetHeader>
                          {selectedUnit && (
                            <div className="mt-6 space-y-6">
                              {/* Unit Details */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-medium">اطلاعات واحد</h3>
                                <div className="grid gap-3">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">بارکد:</span>
                                    <Badge variant="outline" className="font-mono">
                                      {selectedUnit.barcode_12}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">کد فنی:</span>
                                    <span className="font-mono">{selectedUnit.tech_code}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">کد کالا:</span>
                                    <span>{selectedUnit.sku_code}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">وضعیت:</span>
                                    <StatusChip status={selectedUnit.status} />
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">موقعیت فعلی:</span>
                                    <span className="font-mono">{selectedUnit.location_code_cached}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Move History */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                  <Clock className="h-5 w-5" />
                                  تاریخچه حرکت
                                </h3>
                                <div className="space-y-3">
                                  {mockMoveHistory.map((move) => (
                                    <div key={move.id} className="border rounded-lg p-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4 text-muted-foreground" />
                                          <span className="font-mono text-sm">{move.from_location}</span>
                                          <span className="text-muted-foreground">←</span>
                                          <span className="font-mono text-sm">{move.to_location}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                          {formatDate(move.moved_at)}
                                        </span>
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        <p>انجام شده توسط: {move.moved_by}</p>
                                        <p>دلیل: {move.reason}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUnits.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">هیچ واحد کالایی یافت نشد</p>
                <p className="text-muted-foreground">فیلترهای جستجو را تغییر دهید</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
