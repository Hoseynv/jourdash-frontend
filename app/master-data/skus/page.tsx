"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { SKUMediaGallery } from "@/components/sku-media-gallery"
import { SKUBarcodeManager } from "@/components/sku-barcode-manager"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, ArrowRight, Package, ImageIcon, Scan, Tag } from "lucide-react"
import { t } from "@/lib/translations"

// Mock data
const mockSKU = {
  id: "sku-001",
  sku_code: "NIKE-SHIRT-001",
  description: "پیراهن ورزشی نایک مردانه",
  brand_id: "1",
  gender: "مردانه",
  season: "تابستان",
  category_id: "1",
  subcategory_id: "1",
  model_id: "1",
  color_id: "1",
  size_id: "3",
  uom_id: "1",
  is_active: true,
}

const mockMedia = [
  {
    id: "1",
    url: "/nike-shirt-front-view.jpg",
    filename: "nike-shirt-front.jpg",
    is_primary: true,
    uploaded_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    url: "/nike-shirt-back-view.jpg",
    filename: "nike-shirt-back.jpg",
    is_primary: false,
    uploaded_at: "2024-01-15T10:31:00Z",
  },
  {
    id: "3",
    url: "/nike-shirt-side-view.jpg",
    filename: "nike-shirt-side.jpg",
    is_primary: false,
    uploaded_at: "2024-01-15T10:32:00Z",
  },
]

const mockBarcodes = [
  {
    id: "1",
    barcode: "123456789012",
    notes: "بارکد اصلی محصول",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    barcode: "987654321098",
    notes: "بارکد جایگزین",
    created_at: "2024-01-16T14:30:00Z",
  },
]

const mockLabelingStatus = {
  last_installed_at: "2024-01-20T09:15:00Z",
  last_scanned_at: "2024-01-22T16:45:00Z",
}

export default function SKUEditorPage() {
  const [skuData, setSKUData] = useState(mockSKU)
  const [media, setMedia] = useState(mockMedia)
  const [barcodes, setBarcodes] = useState(mockBarcodes)
  const [activeTab, setActiveTab] = useState("basic")

  const handleSKUUpdate = (field: string, value: any) => {
    setSKUData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMediaUpload = (files: FileList) => {
    // Mock upload - in real app would upload to server
    Array.from(files).forEach((file, index) => {
      const newMedia = {
        id: Date.now().toString() + index,
        url: URL.createObjectURL(file),
        filename: file.name,
        is_primary: media.length === 0 && index === 0,
        uploaded_at: new Date().toISOString(),
      }
      setMedia((prev) => [...prev, newMedia])
    })
  }

  const handleSetPrimary = (mediaId: string) => {
    setMedia((prev) => prev.map((m) => ({ ...m, is_primary: m.id === mediaId })))
  }

  const handleDeleteMedia = (mediaId: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== mediaId))
  }

  const handleSaveBarcode = (barcode: any) => {
    const newBarcode = {
      ...barcode,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    setBarcodes((prev) => [...prev, newBarcode])
  }

  const handleDeleteBarcode = (barcodeId: string) => {
    setBarcodes((prev) => prev.filter((b) => b.id !== barcodeId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{t("masterData")}</span>
          <ArrowRight className="h-4 w-4" />
          <span>{t("skus")}</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-foreground">{skuData.sku_code}</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">ویرایش کالا</h1>
            <p className="text-muted-foreground">{skuData.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={skuData.is_active ? "default" : "secondary"}>
              {skuData.is_active ? "فعال" : "غیرفعال"}
            </Badge>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="gap-2">
              <Package className="h-4 w-4" />
              اطلاعات پایه
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              تصاویر ({media.length})
            </TabsTrigger>
            <TabsTrigger value="barcodes" className="gap-2">
              <Scan className="h-4 w-4" />
              بارکدها ({barcodes.length})
            </TabsTrigger>
            <TabsTrigger value="labeling" className="gap-2">
              <Tag className="h-4 w-4" />
              وضعیت برچسب
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="soft-shadow">
                <CardHeader>
                  <CardTitle>اطلاعات اصلی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku_code">کد کالا</Label>
                    <Input
                      id="sku_code"
                      value={skuData.sku_code}
                      onChange={(e) => handleSKUUpdate("sku_code", e.target.value)}
                      placeholder="کد یکتا کالا"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">شرح کالا</Label>
                    <Textarea
                      id="description"
                      value={skuData.description}
                      onChange={(e) => handleSKUUpdate("description", e.target.value)}
                      placeholder="توضیحات کامل کالا"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">وضعیت فعال</Label>
                    <Switch
                      id="is_active"
                      checked={skuData.is_active}
                      onCheckedChange={(checked) => handleSKUUpdate("is_active", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="soft-shadow">
                <CardHeader>
                  <CardTitle>مشخصات کالا</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>برند</Label>
                      <Select value={skuData.brand_id} onValueChange={(value) => handleSKUUpdate("brand_id", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب برند" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">نایک</SelectItem>
                          <SelectItem value="2">آدیداس</SelectItem>
                          <SelectItem value="3">پوما</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>جنسیت</Label>
                      <Select value={skuData.gender} onValueChange={(value) => handleSKUUpdate("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب جنسیت" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="مردانه">مردانه</SelectItem>
                          <SelectItem value="زنانه">زنانه</SelectItem>
                          <SelectItem value="بچگانه">بچگانه</SelectItem>
                          <SelectItem value="یونیسکس">یونیسکس</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>فصل</Label>
                      <Select value={skuData.season} onValueChange={(value) => handleSKUUpdate("season", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب فصل" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="بهار">بهار</SelectItem>
                          <SelectItem value="تابستان">تابستان</SelectItem>
                          <SelectItem value="پاییز">پاییز</SelectItem>
                          <SelectItem value="زمستان">زمستان</SelectItem>
                          <SelectItem value="چهارفصل">چهارفصل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>دسته‌بندی</Label>
                      <Select
                        value={skuData.category_id}
                        onValueChange={(value) => handleSKUUpdate("category_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب دسته" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">پوشاک</SelectItem>
                          <SelectItem value="2">کفش</SelectItem>
                          <SelectItem value="3">لوازم جانبی</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>رنگ</Label>
                      <Select value={skuData.color_id} onValueChange={(value) => handleSKUUpdate("color_id", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب رنگ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">قرمز</SelectItem>
                          <SelectItem value="2">آبی</SelectItem>
                          <SelectItem value="3">مشکی</SelectItem>
                          <SelectItem value="4">سفید</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>سایز</Label>
                      <Select value={skuData.size_id} onValueChange={(value) => handleSKUUpdate("size_id", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب سایز" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">XS</SelectItem>
                          <SelectItem value="2">S</SelectItem>
                          <SelectItem value="3">M</SelectItem>
                          <SelectItem value="4">L</SelectItem>
                          <SelectItem value="5">XL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>واحد</Label>
                      <Select value={skuData.uom_id} onValueChange={(value) => handleSKUUpdate("uom_id", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب واحد" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">عدد</SelectItem>
                          <SelectItem value="2">کیلوگرم</SelectItem>
                          <SelectItem value="3">متر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <SKUMediaGallery
              skuId={skuData.id}
              media={media}
              onUpload={handleMediaUpload}
              onSetPrimary={handleSetPrimary}
              onDelete={handleDeleteMedia}
            />
          </TabsContent>

          {/* Barcodes Tab */}
          <TabsContent value="barcodes">
            <SKUBarcodeManager
              skuId={skuData.id}
              barcodes={barcodes}
              onSave={handleSaveBarcode}
              onDelete={handleDeleteBarcode}
            />
          </TabsContent>

          {/* Labeling Status Tab */}
          <TabsContent value="labeling">
            <Card className="soft-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  وضعیت برچسب‌گذاری
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">آخرین نصب برچسب</h3>
                        {mockLabelingStatus.last_installed_at ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="default">نصب شده</Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(mockLabelingStatus.last_installed_at)}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="secondary">هنوز نصب نشده</Badge>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">آخرین اسکن</h3>
                        {mockLabelingStatus.last_scanned_at ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="default">اسکن شده</Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(mockLabelingStatus.last_scanned_at)}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="secondary">هنوز اسکن نشده</Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">عملیات سریع</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                            <Tag className="h-4 w-4" />
                            علامت‌گذاری به عنوان "نصب شده"
                          </Button>
                          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                            <Scan className="h-4 w-4" />
                            علامت‌گذاری به عنوان "اسکن شده"
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">تاریخچه برچسب‌گذاری</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="default">اسکن</Badge>
                          <span>برچسب توسط کاربر اسکن شد</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(mockLabelingStatus.last_scanned_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">نصب</Badge>
                          <span>برچسب روی کالا نصب شد</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(mockLabelingStatus.last_installed_at)}
                        </span>
                      </div>
                    </div>
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
