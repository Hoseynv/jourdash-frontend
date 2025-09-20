"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Phone, Mail, MapPin, Star, Calendar, Edit, Eye } from "lucide-react"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false)

  const customers = [
    {
      id: 1,
      name: "احمد محمدی",
      phone: "09123456789",
      email: "ahmad@example.com",
      loyaltyTier: "طلایی",
      points: 2450,
      totalSpent: 15750000,
      lastVisit: "1403/08/15",
      status: "فعال",
      address: "تهران، خیابان ولیعصر، پلاک 123",
    },
    {
      id: 2,
      name: "فاطمه احمدی",
      phone: "09187654321",
      email: "fateme@example.com",
      loyaltyTier: "نقره‌ای",
      points: 1200,
      totalSpent: 8500000,
      lastVisit: "1403/08/12",
      status: "فعال",
      address: "اصفهان، خیابان چهارباغ، پلاک 456",
    },
  ]

  const loyaltyPrograms = [
    {
      id: 1,
      name: "برنامه وفاداری طلایی",
      tier: "طلایی",
      minSpend: 10000000,
      pointsPerToman: 0.1,
      discountPercent: 15,
      benefits: ["تخفیف ۱۵٪", "ارسال رایگان", "دسترسی زودهنگام به محصولات جدید"],
    },
    {
      id: 2,
      name: "برنامه وفاداری نقره‌ای",
      tier: "نقره‌ای",
      minSpend: 5000000,
      pointsPerToman: 0.05,
      discountPercent: 10,
      benefits: ["تخفیف ۱۰٪", "ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان"],
    },
  ]

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "طلایی":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "نقره‌ای":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "برنزی":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت مشتریان</h1>
        <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              مشتری جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>افزودن مشتری جدید</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نام و نام خانوادگی</Label>
                <Input placeholder="نام مشتری را وارد کنید" />
              </div>
              <div className="space-y-2">
                <Label>شماره تلفن</Label>
                <Input placeholder="09xxxxxxxxx" />
              </div>
              <div className="space-y-2">
                <Label>ایمیل</Label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>تاریخ تولد</Label>
                <Input placeholder="1370/01/01" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>آدرس</Label>
                <Textarea placeholder="آدرس کامل مشتری" />
              </div>
              <div className="space-y-2">
                <Label>سطح وفاداری</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب سطح" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">برنزی</SelectItem>
                    <SelectItem value="silver">نقره‌ای</SelectItem>
                    <SelectItem value="gold">طلایی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch id="sms-notifications" />
                <Label htmlFor="sms-notifications">دریافت پیامک</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsNewCustomerOpen(false)}>
                انصراف
              </Button>
              <Button onClick={() => setIsNewCustomerOpen(false)}>ذخیره</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customers">مشتریان</TabsTrigger>
          <TabsTrigger value="loyalty">برنامه‌های وفاداری</TabsTrigger>
          <TabsTrigger value="analytics">تحلیل مشتریان</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو بر اساس نام، تلفن یا ایمیل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فیلتر بر اساس سطح" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه سطوح</SelectItem>
                <SelectItem value="gold">طلایی</SelectItem>
                <SelectItem value="silver">نقره‌ای</SelectItem>
                <SelectItem value="bronze">برنزی</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>مشتری</TableHead>
                  <TableHead>تماس</TableHead>
                  <TableHead>سطح وفاداری</TableHead>
                  <TableHead>امتیاز</TableHead>
                  <TableHead>کل خرید</TableHead>
                  <TableHead>آخرین بازدید</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 ml-1" />
                          {customer.address.split("،")[0]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 ml-1" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-3 h-3 ml-1" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTierColor(customer.loyaltyTier)}>{customer.loyaltyTier}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 ml-1" />
                        {customer.points.toLocaleString("fa-IR")}
                      </div>
                    </TableCell>
                    <TableCell>{customer.totalSpent.toLocaleString("fa-IR")} تومان</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-3 h-3 ml-1" />
                        {customer.lastVisit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(customer)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">برنامه‌های وفاداری</h2>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              برنامه جدید
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loyaltyPrograms.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{program.name}</span>
                    <Badge className={getTierColor(program.tier)}>{program.tier}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">حداقل خرید:</span>
                      <div className="font-medium">{program.minSpend.toLocaleString("fa-IR")} تومان</div>
                    </div>
                    <div>
                      <span className="text-gray-500">امتیاز به ازای هر تومان:</span>
                      <div className="font-medium">{program.pointsPerToman}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">درصد تخفیف:</span>
                      <div className="font-medium">%{program.discountPercent}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">مزایا:</span>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      {program.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">کل مشتریان</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">۱,۲۳۴</div>
                <p className="text-xs text-green-600">+۱۲% نسبت به ماه قبل</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">مشتریان فعال</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">۸۹۲</div>
                <p className="text-xs text-green-600">+۸% نسبت به ماه قبل</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">میانگین خرید</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">۲.۳M</div>
                <p className="text-xs text-red-600">-۳% نسبت به ماه قبل</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">نرخ بازگشت</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">%۶۸</div>
                <p className="text-xs text-green-600">+۵% نسبت به ماه قبل</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>توزیع سطوح وفاداری</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>طلایی</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-3/12 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">۲۵%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>نقره‌ای</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-5/12 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">۴۲%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>برنزی</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-4/12 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">۳۳%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>مشتریان برتر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customers.slice(0, 3).map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{customer.totalSpent.toLocaleString("fa-IR")}</div>
                        <div className="text-sm text-gray-500">تومان</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-4xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>جزئیات مشتری - {selectedCustomer.name}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">پروفایل</TabsTrigger>
                <TabsTrigger value="transactions">تراکنش‌ها</TabsTrigger>
                <TabsTrigger value="loyalty">امتیازات</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">اطلاعات شخصی</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{selectedCustomer.address}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">آمار خرید</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>کل خرید:</span>
                        <span className="font-medium">{selectedCustomer.totalSpent.toLocaleString("fa-IR")} تومان</span>
                      </div>
                      <div className="flex justify-between">
                        <span>امتیاز فعلی:</span>
                        <span className="font-medium">{selectedCustomer.points.toLocaleString("fa-IR")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>آخرین بازدید:</span>
                        <span className="font-medium">{selectedCustomer.lastVisit}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>تاریخچه تراکنش‌ها</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>تاریخ</TableHead>
                          <TableHead>شماره فاکتور</TableHead>
                          <TableHead>مبلغ</TableHead>
                          <TableHead>امتیاز کسب شده</TableHead>
                          <TableHead>وضعیت</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>1403/08/15</TableCell>
                          <TableCell>INV-001234</TableCell>
                          <TableCell>2,450,000 تومان</TableCell>
                          <TableCell>245</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">تکمیل شده</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>1403/08/10</TableCell>
                          <TableCell>INV-001198</TableCell>
                          <TableCell>1,200,000 تومان</TableCell>
                          <TableCell>120</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">تکمیل شده</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="loyalty">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>امتیازات فعلی</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600">
                          {selectedCustomer.points.toLocaleString("fa-IR")}
                        </div>
                        <p className="text-gray-500">امتیاز قابل استفاده</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>سطح وفاداری</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <Badge className={`${getTierColor(selectedCustomer.loyaltyTier)} text-lg px-4 py-2`}>
                          {selectedCustomer.loyaltyTier}
                        </Badge>
                        <p className="text-gray-500 mt-2">سطح فعلی</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
