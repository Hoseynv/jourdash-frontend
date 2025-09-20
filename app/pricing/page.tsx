"use client"

import { useState, useEffect, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { t, formatCurrency, formatDate } from "@/lib/translations"
import { Search, CalendarIcon, ChevronLeft, ChevronRight, X, Eye, DollarSign } from "lucide-react"
import { format, subDays } from "date-fns"

// Mock data types
interface SKU {
  id: string
  sku_code: string
  brand_code: string
  brand_name: string
  gender: string
  season: string
  category_code: string
  subcategory_code: string
  model_name: string
  model_code: string
  color_name: string
  color_code: string
  size_code: string
}

interface SKUMedia {
  id: string
  url: string
  is_primary: boolean
}

interface Price {
  id: string
  sku_id: string
  base_price: number
  currency: string
  tax_rate: number
  effective_from: string
  effective_to?: string
  created_at: string
  created_by: string
}

interface PricingTableRow extends SKU {
  media: SKUMedia[]
  latest_price?: Price
  status: "priced" | "unpriced"
}

const mockSKUs: PricingTableRow[] = [
  {
    id: "1",
    sku_code: "NKE001BLK42",
    brand_code: "NKE",
    brand_name: "نایک",
    gender: "مردانه",
    season: "همه فصل",
    category_code: "SHO",
    subcategory_code: "SNK",
    model_name: "ایر مکس",
    model_code: "001",
    color_name: "مشکی",
    color_code: "BLK",
    size_code: "42",
    media: [
      { id: "1", url: "/nike-air-max-black.jpg", is_primary: true },
      { id: "2", url: "/nike-air-max-black-side.jpg", is_primary: false },
      { id: "3", url: "/nike-air-max-black-back.jpg", is_primary: false },
    ],
    latest_price: {
      id: "p1",
      sku_id: "1",
      base_price: 2500000,
      currency: "IRR",
      tax_rate: 9,
      effective_from: "2024-01-15",
      created_at: "2024-01-15T10:00:00Z",
      created_by: "admin",
    },
    status: "priced",
  },
  {
    id: "2",
    sku_code: "ADI002WHT40",
    brand_code: "ADI",
    brand_name: "آدیداس",
    gender: "زنانه",
    season: "بهار",
    category_code: "SHO",
    subcategory_code: "RUN",
    model_name: "اولترابوست",
    model_code: "002",
    color_name: "سفید",
    color_code: "WHT",
    size_code: "40",
    media: [],
    status: "unpriced",
  },
  {
    id: "3",
    sku_code: "PUM003RED44",
    brand_code: "PUM",
    brand_name: "پوما",
    gender: "مردانه",
    season: "تابستان",
    category_code: "SHO",
    subcategory_code: "CAS",
    model_name: "سوید کلاسیک",
    model_code: "003",
    color_name: "قرمز",
    color_code: "RED",
    size_code: "44",
    media: [{ id: "4", url: "/puma-suede-classic-red.jpg", is_primary: true }],
    latest_price: {
      id: "p3",
      sku_id: "3",
      base_price: 1800000,
      currency: "IRR",
      tax_rate: 9,
      effective_from: "2024-01-20",
      created_at: "2024-01-20T14:30:00Z",
      created_by: "admin",
    },
    status: "priced",
  },
]

export default function PricingPage() {
  const [skus, setSKUs] = useState<PricingTableRow[]>(mockSKUs)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "unpriced" | "recent">("all")
  const [dateFrom, setDateFrom] = useState<Date>(subDays(new Date(), 30))
  const [dateTo, setDateTo] = useState<Date>(new Date())
  const [selectedSKU, setSelectedSKU] = useState<PricingTableRow | null>(null)
  const [setPriceOpen, setSetPriceOpen] = useState(false)
  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [viewerImages, setViewerImages] = useState<SKUMedia[]>([])

  // Price form state
  const [priceForm, setPriceForm] = useState({
    base_price: "",
    currency: "IRR",
    tax_rate: "9",
    effective_from: format(new Date(), "yyyy-MM-dd"),
    effective_to: "",
  })

  // Filter and search logic
  const filteredSKUs = useMemo(() => {
    let filtered = skus

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (sku) =>
          sku.sku_code.toLowerCase().includes(query) ||
          sku.brand_name.toLowerCase().includes(query) ||
          sku.model_name.toLowerCase().includes(query) ||
          sku.color_name.toLowerCase().includes(query) ||
          sku.size_code.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter === "unpriced") {
      filtered = filtered.filter((sku) => sku.status === "unpriced")
    } else if (statusFilter === "recent") {
      filtered = filtered.filter((sku) => {
        if (!sku.latest_price) return false
        const priceDate = new Date(sku.latest_price.effective_from)
        return priceDate >= dateFrom && priceDate <= dateTo
      })
    }

    return filtered
  }, [skus, searchQuery, statusFilter, dateFrom, dateTo])

  // Price calculation
  const calculatePrice = (basePrice: number, taxRate: number) => {
    const net = basePrice
    const tax = (basePrice * taxRate) / 100
    const gross = net + tax
    return { net, tax, gross }
  }

  const currentCalculation = useMemo(() => {
    const basePrice = Number.parseFloat(priceForm.base_price) || 0
    const taxRate = Number.parseFloat(priceForm.tax_rate) || 0
    return calculatePrice(basePrice, taxRate)
  }, [priceForm.base_price, priceForm.tax_rate])

  // Image viewer functions
  const openImageViewer = (images: SKUMedia[], startIndex = 0) => {
    setViewerImages(images)
    setCurrentImageIndex(startIndex)
    setImageViewerOpen(true)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % viewerImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + viewerImages.length) % viewerImages.length)
  }

  // Handle keyboard navigation in image viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!imageViewerOpen) return

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        nextImage()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        prevImage()
      } else if (e.key === "Escape") {
        e.preventDefault()
        setImageViewerOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [imageViewerOpen])

  // Handle set price
  const handleSetPrice = (sku: PricingTableRow) => {
    setSelectedSKU(sku)
    setPriceForm({
      base_price: sku.latest_price?.base_price.toString() || "",
      currency: sku.latest_price?.currency || "IRR",
      tax_rate: sku.latest_price?.tax_rate.toString() || "9",
      effective_from: format(new Date(), "yyyy-MM-dd"),
      effective_to: "",
    })
    setSetPriceOpen(true)
  }

  // Handle save price
  const handleSavePrice = async () => {
    if (!selectedSKU) return

    // Validation
    const basePrice = Number.parseFloat(priceForm.base_price)
    if (!basePrice || basePrice <= 0) {
      toast({
        title: t("error"),
        description: t("priceMustBePositive"),
        variant: "destructive",
      })
      return
    }

    if (priceForm.effective_to && new Date(priceForm.effective_to) < new Date(priceForm.effective_from)) {
      toast({
        title: t("error"),
        description: t("endDateMustBeAfterStart"),
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the SKU with new price
      const newPrice: Price = {
        id: `p${Date.now()}`,
        sku_id: selectedSKU.id,
        base_price: basePrice,
        currency: priceForm.currency,
        tax_rate: Number.parseFloat(priceForm.tax_rate),
        effective_from: priceForm.effective_from,
        effective_to: priceForm.effective_to || undefined,
        created_at: new Date().toISOString(),
        created_by: "current_user",
      }

      setSKUs((prev) =>
        prev.map((sku) =>
          sku.id === selectedSKU.id ? { ...sku, latest_price: newPrice, status: "priced" as const } : sku,
        ),
      )

      toast({
        title: t("success"),
        description: t("priceSavedSuccess"),
      })

      setSetPriceOpen(false)
      setSelectedSKU(null)
    } catch (error) {
      toast({
        title: t("error"),
        description: "خطا در ذخیره قیمت",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("pricingManagement")}</h1>
            <p className="text-muted-foreground mt-1">مدیریت قیمت‌گذاری کالاها در سطح SKU</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label>{t("statusFilter")}</Label>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("all")}</SelectItem>
                    <SelectItem value="unpriced">{t("unpricedFilter")}</SelectItem>
                    <SelectItem value="recent">{t("recentlyPriced")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range (only for recent filter) */}
              {statusFilter === "recent" && (
                <>
                  <div className="space-y-2">
                    <Label>از</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-40 justify-start text-right bg-transparent">
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {formatDate(dateFrom)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={(date) => date && setDateFrom(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>تا</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-40 justify-start text-right bg-transparent">
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {formatDate(dateTo)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={(date) => date && setDateTo(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}

              {/* Search */}
              <div className="flex-1 space-y-2">
                <Label>{t("search")}</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>نتایج ({filteredSKUs.length})</span>
              {loading && <Skeleton className="h-4 w-20" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">{t("images")}</TableHead>
                    <TableHead className="text-right font-mono">{t("skuCode")}</TableHead>
                    <TableHead className="text-right">{t("itemTitle")}</TableHead>
                    <TableHead className="text-right">{t("lastPrice")}</TableHead>
                    <TableHead className="text-right">{t("effectiveFrom")}</TableHead>
                    <TableHead className="text-right">{t("effectiveTo")}</TableHead>
                    <TableHead className="text-right">{t("status")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSKUs.map((sku) => (
                    <TableRow key={sku.id}>
                      {/* Images */}
                      <TableCell>
                        <div className="relative">
                          {sku.media.length > 0 ? (
                            <div className="relative">
                              <img
                                src={sku.media.find((m) => m.is_primary)?.url || sku.media[0].url}
                                alt={`عکس محصول - ${sku.sku_code}`}
                                className="h-12 w-12 rounded object-cover cursor-pointer"
                                onClick={() => openImageViewer(sku.media)}
                              />
                              {sku.media.length > 1 && (
                                <Badge
                                  variant="secondary"
                                  className="absolute -top-1 -left-1 h-5 min-w-5 text-xs cursor-pointer"
                                  onClick={() => openImageViewer(sku.media)}
                                >
                                  +{sku.media.length - 1}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              {t("noImage")}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* SKU Code */}
                      <TableCell className="font-mono text-sm">{sku.sku_code}</TableCell>

                      {/* Item Title */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline">{sku.brand_name}</Badge>
                          <Badge variant="outline">
                            {sku.model_name}#{sku.model_code}
                          </Badge>
                          <Badge variant="outline">
                            {sku.color_name}#{sku.color_code}
                          </Badge>
                          <Badge variant="outline">{sku.size_code}</Badge>
                        </div>
                      </TableCell>

                      {/* Last Price */}
                      <TableCell>
                        {sku.latest_price ? (
                          <span className="font-medium">{formatCurrency(sku.latest_price.base_price)}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      {/* Effective From */}
                      <TableCell>
                        {sku.latest_price ? (
                          formatDate(sku.latest_price.effective_from)
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      {/* Effective To */}
                      <TableCell>
                        {sku.latest_price?.effective_to ? (
                          formatDate(sku.latest_price.effective_to)
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant={sku.status === "priced" ? "default" : "secondary"}>
                          {sku.status === "priced" ? t("priced") : t("unpriced")}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Button size="sm" onClick={() => handleSetPrice(sku)} className="gap-2">
                          <DollarSign className="h-4 w-4" />
                          {t("setPrice")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredSKUs.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  {statusFilter === "unpriced"
                    ? t("noUnpricedItems")
                    : statusFilter === "recent"
                      ? t("noRecentlyPricedItems")
                      : t("noResultsFound")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Set Price Modal */}
        <Dialog open={setPriceOpen} onOpenChange={setSetPriceOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right">{t("setPriceModal")}</DialogTitle>
            </DialogHeader>

            {selectedSKU && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Images */}
                <div className="space-y-4">
                  {selectedSKU.media.length > 0 ? (
                    <div className="space-y-4">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={selectedSKU.media.find((m) => m.is_primary)?.url || selectedSKU.media[0].url}
                          alt={`عکس محصول - ${selectedSKU.sku_code}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => openImageViewer(selectedSKU.media)}
                        />
                      </div>
                      {selectedSKU.media.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {selectedSKU.media.map((media, index) => (
                            <img
                              key={media.id}
                              src={media.url || "/placeholder.svg"}
                              alt={`عکس محصول ${index + 1}`}
                              className="h-16 w-16 rounded object-cover cursor-pointer flex-shrink-0"
                              onClick={() => openImageViewer(selectedSKU.media, index)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Eye className="h-12 w-12 mx-auto mb-2" />
                        <p>{t("noImage")}</p>
                      </div>
                    </div>
                  )}

                  {/* SKU Info */}
                  <div className="space-y-2">
                    <div className="font-mono text-lg font-semibold">{selectedSKU.sku_code}</div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">{selectedSKU.brand_name}</Badge>
                      <Badge variant="outline">
                        {selectedSKU.model_name}#{selectedSKU.model_code}
                      </Badge>
                      <Badge variant="outline">
                        {selectedSKU.color_name}#{selectedSKU.color_code}
                      </Badge>
                      <Badge variant="outline">{selectedSKU.size_code}</Badge>
                    </div>
                  </div>
                </div>

                {/* Right: Price Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Base Price */}
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="base_price">{t("basePrice")} *</Label>
                      <Input
                        id="base_price"
                        type="number"
                        value={priceForm.base_price}
                        onChange={(e) => setPriceForm((prev) => ({ ...prev, base_price: e.target.value }))}
                        placeholder="0"
                        className="text-right"
                      />
                    </div>

                    {/* Currency */}
                    <div className="space-y-2">
                      <Label htmlFor="currency">{t("currency")}</Label>
                      <Select
                        value={priceForm.currency}
                        onValueChange={(value) => setPriceForm((prev) => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IRR">ریال</SelectItem>
                          <SelectItem value="USD">دلار</SelectItem>
                          <SelectItem value="EUR">یورو</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tax Rate */}
                    <div className="space-y-2">
                      <Label htmlFor="tax_rate">{t("taxRate")}</Label>
                      <Input
                        id="tax_rate"
                        type="number"
                        value={priceForm.tax_rate}
                        onChange={(e) => setPriceForm((prev) => ({ ...prev, tax_rate: e.target.value }))}
                        placeholder="9"
                        className="text-right"
                      />
                    </div>

                    {/* Effective From */}
                    <div className="space-y-2">
                      <Label htmlFor="effective_from">{t("effectiveFrom")} *</Label>
                      <Input
                        id="effective_from"
                        type="date"
                        value={priceForm.effective_from}
                        onChange={(e) => setPriceForm((prev) => ({ ...prev, effective_from: e.target.value }))}
                      />
                    </div>

                    {/* Effective To */}
                    <div className="space-y-2">
                      <Label htmlFor="effective_to">{t("effectiveTo")}</Label>
                      <Input
                        id="effective_to"
                        type="date"
                        value={priceForm.effective_to}
                        onChange={(e) => setPriceForm((prev) => ({ ...prev, effective_to: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Price Calculation */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{t("priceCalculation")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t("netPrice")}:</span>
                        <span className="font-medium">{formatCurrency(currentCalculation.net)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("taxAmount")}:</span>
                        <span className="font-medium">{formatCurrency(currentCalculation.tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>{t("grossPrice")}:</span>
                        <span>{formatCurrency(currentCalculation.gross)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setSetPriceOpen(false)}>
                      {t("cancel")}
                    </Button>
                    <Button onClick={handleSavePrice} disabled={loading}>
                      {loading ? t("processing") : t("savePrice")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Image Viewer Modal */}
        <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative">
              {viewerImages.length > 0 && (
                <>
                  <img
                    src={viewerImages[currentImageIndex]?.url || "/placeholder.svg"}
                    alt={`تصویر ${currentImageIndex + 1}`}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />

                  {/* Navigation */}
                  {viewerImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Close button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 left-4 bg-transparent"
                    onClick={() => setImageViewerOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Image counter */}
                  {viewerImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {viewerImages.length}
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
