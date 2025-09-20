import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, AlertTriangle, Clock } from "lucide-react"
import { t } from "@/lib/translations"
import Link from "next/link"

export default function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t("dashboard")}</h1>
            <p className="text-muted-foreground">نمای کلی عملکرد فروشگاه و انبار</p>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Badge variant="outline">امروز</Badge>
            <Badge variant="outline">۷ روز</Badge>
            <Badge variant="secondary">۳۰ روز</Badge>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="soft-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">فروش امروز</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">۱۲,۳۴۵,۶۷۸ ریال</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                +۲۰.۱% نسبت به دیروز
              </p>
            </CardContent>
          </Card>

          <Card className="soft-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تعداد رسیدها</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">۱۲۳</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                +۱۵% نسبت به هفته گذشته
              </p>
            </CardContent>
          </Card>

          <Card className="soft-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">میانگین سبد خرید</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">۴۵۶,۷۸۹ ریال</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingDown className="h-3 w-3 text-red-500 ml-1" />
                -۵.۲% نسبت به ماه گذشته
              </p>
            </CardContent>
          </Card>

          <Card className="soft-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مشتریان فعال</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">۲,۳۴۵</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                +۸.۳% نسبت به ماه گذشته
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Open Shifts */}
          <Card className="soft-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                شیفت‌های باز
              </CardTitle>
              <CardDescription>شیفت‌هایی که هنوز بسته نشده‌اند</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">فروشگاه مرکزی</p>
                    <p className="text-sm text-muted-foreground">باز شده توسط: احمد محمدی</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">اختلاف: +۱۲,۰۰۰ ریال</p>
                    <p className="text-xs text-muted-foreground">۰۸:۳۰</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">شعبه شمال</p>
                    <p className="text-sm text-muted-foreground">باز شده توسط: فاطمه احمدی</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">اختلاف: -۵,۰۰۰ ریال</p>
                    <p className="text-xs text-muted-foreground">۰۹:۰۰</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Items */}
          <Card className="soft-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                کالاهای کم موجود
              </CardTitle>
              <CardDescription>کالاهایی که موجودی کمی دارند</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">پیراهن مردانه آبی - سایز L</p>
                    <p className="text-sm text-muted-foreground">کد: SKU-001234</p>
                  </div>
                  <Badge variant="destructive">۳ عدد</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">شلوار جین زنانه مشکی - سایز M</p>
                    <p className="text-sm text-muted-foreground">کد: SKU-005678</p>
                  </div>
                  <Badge variant="destructive">۱ عدد</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">کفش ورزشی سفید - سایز ۴۲</p>
                    <p className="text-sm text-muted-foreground">کد: SKU-009876</p>
                  </div>
                  <Badge variant="destructive">۵ عدد</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>عملیات سریع</CardTitle>
            <CardDescription>دسترسی سریع به عملیات پرکاربرد</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/pos/sell">
                <Button className="h-20 flex-col gap-2 w-full bg-transparent" variant="outline">
                  <ShoppingCart className="h-6 w-6" />
                  شروع فروش
                </Button>
              </Link>
              <Link href="/warehouse/receipts">
                <Button className="h-20 flex-col gap-2 w-full bg-transparent" variant="outline">
                  <Package className="h-6 w-6" />
                  رسید کالا
                </Button>
              </Link>
              <Link href="/customers">
                <Button className="h-20 flex-col gap-2 w-full bg-transparent" variant="outline">
                  <Users className="h-6 w-6" />
                  مشتری جدید
                </Button>
              </Link>
              <Link href="/inventory">
                <Button className="h-20 flex-col gap-2 w-full bg-transparent" variant="outline">
                  <AlertTriangle className="h-6 w-6" />
                  گزارش موجودی
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
