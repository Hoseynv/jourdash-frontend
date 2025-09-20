"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, ArrowRight, CalendarIcon, Package, Scan, Save, AlertCircle } from "lucide-react"
import { t } from "@/lib/translations"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"

// Mock data for owners
const mockWarehouses = [
  { id: "1", name: "انبار مرکزی" },
  { id: "2", name: "انبار شمال" },
]

const mockStores = [
  { id: "1", name: "شعبه مرکزی" },
  { id: "2", name: "شعبه شمال" },
  { id: "3", name: "شعبه جنوب" },
  { id: "4", name: "شعبه شرق" },
]

// Mock scanned items
const mockScannedItems = [
  {
    barcode_12: "123456789012",
    tech_code: "TC001",
    sku_code: "SKU-001",
    item_title: "پیراهن مردانه آبی - سایز L",
    brand: "برند A",
    model: "مدل 001",
    color: "آبی",
    size: "L",
    scanned_out_at: new Date().toISOString(),
    from_owner: "انبار مرکزی",
    to_owner: "شعبه شمال",
  },
]

export default function NewTransferPage() {
  
  const [currentStep, setCurrentStep] = useState(1)
  const [transferId, setTransferId] = useState<string | null>(null)
  const [transferNo, setTransferNo] = useState<string | null>(null)

  // Step 1 form data
  const [fromOwnerType, setFromOwnerType] = useState<string>("")
  const [fromOwnerId, setFromOwnerId] = useState<string>("")
  const [toOwnerType, setToOwnerType] = useState<string>("")
  const [toOwnerId, setToOwnerId] = useState<string>("")
  const [transferType, setTransferType] = useState<string>("")
  const [plannedDate, setPlannedDate] = useState<Date>()
  const [notes, setNotes] = useState("")

  // Step 2 scanner data
  const [barcodeInput, setBarcodeInput] = useState("")
  const [scannedItems, setScannedItems] = useState<any[]>([])
  const [scannerDisabled, setScannerDisabled] = useState(false)
  const scannerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (currentStep === 2 && scannerRef.current) {
      scannerRef.current.focus()
    }
  }, [currentStep])

  const validateBarcode = (barcode: string) => {
    return /^\d{12}$/.test(barcode)
  }

  const handleStep1Submit = async () => {
    if (!fromOwnerType || !fromOwnerId || !toOwnerType || !toOwnerId || !transferType || !plannedDate) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای الزامی را پر کنید.",
        variant: "destructive",
      })
      return
    }

    try {
      // API call to create transfer
      console.log("[v0] Creating transfer with data:", {
        fromOwnerType,
        fromOwnerId,
        toOwnerType,
        toOwnerId,
        transferType,
        plannedDate,
        notes,
      })

      // Mock response
      const mockTransferId = "TRF-001"
      const mockTransferNo = "TRF-202501-004"

      setTransferId(mockTransferId)
      setTransferNo(mockTransferNo)
      setCurrentStep(2)

      toast({
        title: t("success"),
        description: t("transferCreatedSuccess"),
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: "خطا در ایجاد انتقال",
        variant: "destructive",
      })
    }
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

    try {
      // API call to scan item
      console.log("[v0] Scanning barcode:", barcodeInput)

      // Check for duplicates
      const isDuplicate = scannedItems.some((item) => item.barcode_12 === barcodeInput)
      if (isDuplicate) {
        toast({
          title: t("warning"),
          description: t("alreadyScannedForTransfer"),
          variant: "destructive",
        })
        setBarcodeInput("")
        return
      }

      // Mock successful scan
      const newItem = {
        barcode_12: barcodeInput,
        tech_code: `TC${String(scannedItems.length + 1).padStart(3, "0")}`,
        sku_code: `SKU-${String(scannedItems.length + 1).padStart(3, "0")}`,
        item_title: `کالای نمونه ${scannedItems.length + 1}`,
        brand: "برند نمونه",
        model: "مدل نمونه",
        color: "رنگ نمونه",
        size: "سایز نمونه",
        scanned_out_at: new Date().toISOString(),
        from_owner: getOwnerName(fromOwnerType, fromOwnerId),
        to_owner: getOwnerName(toOwnerType, toOwnerId),
      }

      setScannedItems((prev) => [...prev, newItem])
      setBarcodeInput("")

      toast({
        title: t("success"),
        description: t("itemScannedSuccess"),
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: t("itemCannotBeShipped"),
        variant: "destructive",
      })
    }
  }

  const handleSaveAsReadyToShip = async () => {
    if (scannedItems.length === 0) {
      toast({
        title: t("error"),
        description: "حداقل یک کالا باید اسکن شود.",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("[v0] Setting transfer status to ready_to_ship")

      setScannerDisabled(true)

      toast({
        title: t("success"),
        description: `${t("transferUpdatedSuccess")} - ${t("transferDetails")}`,
        action: (
          <Link href={`/transfers/${transferId}`}>
            <Button variant="outline" size="sm">
              {t("transferDetails")}
            </Button>
          </Link>
        ),
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: "خطا در به‌روزرسانی انتقال",
        variant: "destructive",
      })
    }
  }

  const getOwnerName = (type: string, id: string) => {
    if (type === "warehouse") {
      return mockWarehouses.find((w) => w.id === id)?.name || ""
    } else {
      return mockStores.find((s) => s.id === id)?.name || ""
    }
  }

  const getAvailableOwners = (type: string) => {
    return type === "warehouse" ? mockWarehouses : mockStores
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
          <span>{t("newTransfer")}</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t("newTransfer")}</h1>
            {transferNo && (
              <p className="text-muted-foreground">
                شماره انتقال:
                <Link href={`/transfers/${transferId}`} className="text-primary hover:underline mr-2">
                  {transferNo}
                </Link>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={currentStep === 1 ? "default" : "secondary"}>۱. {t("transferHeader")}</Badge>
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            <Badge variant={currentStep === 2 ? "default" : "secondary"}>۲. {t("scanItems")}</Badge>
          </div>
        </div>

        {/* Step 1: Transfer Header */}
        {currentStep === 1 && (
          <Card className="soft-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t("transferHeader")}
              </CardTitle>
              <CardDescription>مشخصات کلی انتقال را وارد کنید</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* From Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">مبدأ</h3>

                  <div className="space-y-2">
                    <Label>{t("fromOwnerType")}</Label>
                    <Select value={fromOwnerType} onValueChange={setFromOwnerType}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب نوع مبدأ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warehouse">{t("warehouse")}</SelectItem>
                        <SelectItem value="store">{t("store")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {fromOwnerType && (
                    <div className="space-y-2">
                      <Label>{t("fromOwner")}</Label>
                      <Select value={fromOwnerId} onValueChange={setFromOwnerId}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب مبدأ" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableOwners(fromOwnerType).map((owner) => (
                            <SelectItem key={owner.id} value={owner.id}>
                              {owner.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* To Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">مقصد</h3>

                  <div className="space-y-2">
                    <Label>{t("toOwnerType")}</Label>
                    <Select value={toOwnerType} onValueChange={setToOwnerType}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب نوع مقصد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warehouse">{t("warehouse")}</SelectItem>
                        <SelectItem value="store">{t("store")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {toOwnerType && (
                    <div className="space-y-2">
                      <Label>{t("toOwner")}</Label>
                      <Select value={toOwnerId} onValueChange={setToOwnerId}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب مقصد" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableOwners(toOwnerType).map((owner) => (
                            <SelectItem key={owner.id} value={owner.id}>
                              {owner.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Transfer Type */}
              <div className="space-y-3">
                <Label>{t("transferType")}</Label>
                <RadioGroup value={transferType} onValueChange={setTransferType}>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="storeToStore" id="storeToStore" />
                    <Label htmlFor="storeToStore">{t("storeToStore")}</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="warehouseToStore" id="warehouseToStore" />
                    <Label htmlFor="warehouseToStore">{t("warehouseToStore")}</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="storeToWarehouse" id="storeToWarehouse" />
                    <Label htmlFor="storeToWarehouse">{t("storeToWarehouse")}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Planned Date */}
              <div className="space-y-2">
                <Label>{t("plannedDate")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-right bg-transparent">
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {plannedDate ? format(plannedDate, "yyyy/MM/dd") : "انتخاب تاریخ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={plannedDate} onSelect={setPlannedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>{t("notes")}</Label>
                <Textarea
                  placeholder="یادداشت‌های اضافی..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
            <div className="flex justify-end p-6 border-t bg-muted/50">
              <Button onClick={handleStep1Submit} className="gap-2">
                {t("nextScanItems")}
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Scan Items */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Scanner */}
            <Card className="soft-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  {t("scanItems")}
                </CardTitle>
                <CardDescription>بارکد کالاهای مورد نظر را اسکن کنید (۱۲ رقم)</CardDescription>
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
                      disabled={scannerDisabled}
                    />
                    {scannerDisabled && (
                      <div className="absolute inset-0 bg-muted/50 flex items-center justify-center rounded-md">
                        <span className="text-sm text-muted-foreground">{t("notEditableInReadyToShip")}</span>
                      </div>
                    )}
                  </div>

                  {barcodeInput && !validateBarcode(barcodeInput) && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {t("barcodeRequired")}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground text-center">Enter = ثبت اسکن | Esc = پاک کردن</div>
                </div>
              </CardContent>
            </Card>

            {/* Scanned Items Table */}
            <Card className="soft-shadow">
              <CardHeader>
                <CardTitle>{t("outboundItems")}</CardTitle>
                <CardDescription>{scannedItems.length} کالا اسکن شده</CardDescription>
              </CardHeader>
              <CardContent>
                {scannedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">هنوز کالایی اسکن نشده است</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">{t("barcode12")}</TableHead>
                          <TableHead className="text-right">{t("techCode")}</TableHead>
                          <TableHead className="text-right">کد SKU</TableHead>
                          <TableHead className="text-right">عنوان کالا</TableHead>
                          <TableHead className="text-right">{t("scannedTime")}</TableHead>
                          <TableHead className="text-right">مبدأ / مقصد</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scannedItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{item.barcode_12}</TableCell>
                            <TableCell className="font-mono">{item.tech_code}</TableCell>
                            <TableCell className="font-mono">{item.sku_code}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.item_title}</div>
                                <div className="text-sm text-muted-foreground">
                                  <Badge variant="outline" className="text-xs mr-1">
                                    {item.brand}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs mr-1">
                                    {item.model}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs mr-1">
                                    {item.color}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {item.size}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{format(new Date(item.scanned_out_at), "HH:mm:ss")}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Badge variant="outline" className="text-xs">
                                  {item.from_owner}
                                </Badge>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <Badge variant="outline" className="text-xs">
                                  {item.to_owner}
                                </Badge>
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

            {/* Footer Actions */}
            <div className="flex justify-between items-center p-6 border-t bg-muted/50 rounded-lg">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                <ArrowRight className="h-4 w-4" />
                {t("backToPrevious")}
              </Button>

              <Button
                onClick={handleSaveAsReadyToShip}
                disabled={scannedItems.length === 0 || scannerDisabled}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {t("saveAsReadyToShip")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
