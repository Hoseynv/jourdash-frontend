"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Download, User, Package, ShoppingCart, Settings, AlertTriangle } from "lucide-react"

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState("")

  const auditLogs = [
    {
      id: 1,
      timestamp: "1403/08/15 - 14:30:25",
      user: "علی احمدی",
      action: "ایجاد SKU جدید",
      entity: "SKU",
      entityId: "SKU-001234",
      details: "ایجاد محصول جدید: تی‌شرت نایک مشکی سایز L",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 119.0.0.0",
      severity: "اطلاعات",
    },
    {
      id: 2,
      timestamp: "1403/08/15 - 14:25:10",
      user: "فاطمه محمدی",
      action: "فروش محصول",
      entity: "فاکتور",
      entityId: "INV-001235",
      details: "فروش 2 عدد تی‌شرت به مشتری احمد محمدی",
      ipAddress: "192.168.1.101",
      userAgent: "Chrome 119.0.0.0",
      severity: "اطلاعات",
    },
    {
      id: 3,
      timestamp: "1403/08/15 - 14:20:45",
      user: "علی احمدی",
      action: "تغییر قیمت",
      entity: "SKU",
      entityId: "SKU-001230",
      details: "تغییر قیمت از 500,000 به 450,000 تومان",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 119.0.0.0",
      severity: "هشدار",
    },
    {
      id: 4,
      timestamp: "1403/08/15 - 14:15:30",
      user: "سیستم",
      action: "ورود ناموفق",
      entity: "کاربر",
      entityId: "user-failed-login",
      details: "تلاش ناموفق برای ورود با نام کاربری: admin",
      ipAddress: "192.168.1.200",
      userAgent: "Chrome 119.0.0.0",
      severity: "خطر",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "اطلاعات":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "هشدار":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "خطر":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes("SKU") || action.includes("محصول")) return <Package className="w-4 h-4" />
    if (action.includes("فروش") || action.includes("فاکتور")) return <ShoppingCart className="w-4 h-4" />
    if (action.includes("کاربر") || action.includes("ورود")) return <User className="w-4 h-4" />
    if (action.includes("تغییر") || action.includes("تنظیم")) return <Settings className="w-4 h-4" />
    return <AlertTriangle className="w-4 h-4" />
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">گزارش حسابرسی</h1>
        <Button>
          <Download className="w-4 h-4 ml-2" />
          خروجی Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">کل رویدادها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">۱,۲۳۴</div>
            <p className="text-xs text-gray-500">امروز</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">هشدارها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">۲۳</div>
            <p className="text-xs text-gray-500">امروز</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">خطرات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">۵</div>
            <p className="text-xs text-gray-500">امروز</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">کاربران فعال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">۱۲</div>
            <p className="text-xs text-gray-500">در حال حاضر</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="جستجو در گزارش‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="نوع عملیات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه عملیات</SelectItem>
            <SelectItem value="sku">مدیریت SKU</SelectItem>
            <SelectItem value="sale">فروش</SelectItem>
            <SelectItem value="user">مدیریت کاربر</SelectItem>
            <SelectItem value="inventory">انبارداری</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="سطح اهمیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه سطوح</SelectItem>
            <SelectItem value="info">اطلاعات</SelectItem>
            <SelectItem value="warning">هشدار</SelectItem>
            <SelectItem value="danger">خطر</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Calendar className="w-4 h-4 ml-2" />
          بازه زمانی
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>زمان</TableHead>
              <TableHead>کاربر</TableHead>
              <TableHead>عملیات</TableHead>
              <TableHead>جزئیات</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>سطح</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    {log.user}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getActionIcon(log.action)}
                    <span>{log.action}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <div>
                    <div className="font-medium">
                      {log.entity}: {log.entityId}
                    </div>
                    <div className="text-sm text-gray-500 truncate">{log.details}</div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
