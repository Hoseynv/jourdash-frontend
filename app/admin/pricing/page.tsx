"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, TrendingUp, TrendingDown, Calendar, Edit } from "lucide-react"

export default function PricingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false)

  const pricingRules = [
    {
      id: 1,
      name: "تخفیف فصلی پاییز",
      type: "تخفیف درصدی",
      value: "20%",
      category: "پوشاک",
      startDate: "1403/07/01",
      endDate: "1403/09/30",
      status: "فعال",
      appliedItems: 145,
    },
    {
      id: 2,
      name: "افزایش قیمت کفش ورزشی",
      type: "افزایش درصدی",
      value: "15%",
      category: "کفش",
      startDate: "1403/08/01",
      endDate: "1403/12/30",
      status: "فعال",
      appliedItems: 67,
    },
  ]

  const priceHistory = [
    {
      id: 1,
      sku: "SKU-001234",
      productName: "تی‌شرت نایک مشکی",
      oldPrice: 500000,
      newPrice: 450000,
      changePercent: -10,
      changedBy: "علی احمدی",
      changeDate: "1403/08/15",
      reason: "تخفیف فصلی",
    },
    {
      id: 2,
      sku: "SKU-001235",
      productName: "کفش ورزشی آدیداس",
      oldPrice: 2000000,
      newPrice: 2300000,
      changePercent: 15,
      changedBy: "فاطمه محمدی",
      changeDate: "1403/08/14",
      reason: "افزایش قیمت تامین‌کننده",
    },
  ]

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت قیمت‌گذاری</h1>
        <div className="flex gap-2">
          <Dialog open={isBulkUpdateOpen} onOpenChange={setIsBulkUpdateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="w-4 h-4 ml-2" />
                به‌روزرسانی گروهی
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle>به‌روزرسانی گروهی قیمت</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>دسته‌بندی</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clothing">پوشاک</SelectItem>
                        <SelectItem value="shoes">کفش</SelectItem>
                        <SelectItem value="accessories">لوازم جانبی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>برند</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب برند" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nike">نایک</SelectItem>
                        <SelectItem value="adidas">آدیداس</SelectItem>
                        <SelectItem value="puma">پوما</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>نوع تغییر</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="نوع تغییر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">درصدی</SelectItem>
                        <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>مقدار تغییر</Label>
                    <Input placeholder="مثال: 10 یا -15" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>دلیل تغییر</Label>
                  <Textarea placeholder="دلیل این تغییر قیمت را بنویسید..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsBulkUpdateOpen(false)}>
                  انصراف
                </Button>
                <Button onClick={() => setIsBulkUpdateOpen(false)}>اعمال تغییرات</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            قانون قیمت‌گذاری جدید
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">قوانین فعال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">۱۲</div>
            <p className="text-xs text-green-600">+۲ نسبت به ماه قبل</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">محصولات تحت تأثیر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">۲۱۲</div>
            <p className="text-xs text-blue-600">از کل محصولات</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">میانگین تخفیف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">%۱۵</div>
            <p className="text-xs text-gray-500">در ماه جاری</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">صرفه‌جویی مشتریان</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">۱۲.۵M</div>
            <p className="text-xs text-green-600">تومان در ماه</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>قوانین قیمت‌گذاری فعال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pricingRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {rule.category} • {rule.appliedItems} محصول
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 ml-1" />
                        {rule.startDate} تا {rule.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      {rule.type.includes("تخفیف") ? (
                        <TrendingDown className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      )}
                      <span className="font-bold text-lg">{rule.value}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 mt-1">{rule.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تاریخچه تغییرات قیمت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priceHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-gray-500">{item.sku}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      توسط {item.changedBy} • {item.changeDate}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{item.reason}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-500">{item.oldPrice.toLocaleString("fa-IR")} ←</div>
                    <div className="font-bold">{item.newPrice.toLocaleString("fa-IR")} تومان</div>
                    <div
                      className={`text-sm font-medium ${item.changePercent > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {item.changePercent > 0 ? "+" : ""}
                      {item.changePercent}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
