"use client"

import { useState, useEffect } from "react"
import { BarcodeScannerInput } from "@/components/barcode-scanner-input"
import { StatusChip } from "@/components/status-chip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ShoppingCart, Trash2, User, CreditCard, Banknote, DollarSign, Receipt, Search, Plus, X } from "lucide-react"
import { z } from "zod"

// Mock data
const mockCartItems = [
  {
    id: "1",
    barcode_12: "123456789012",
    sku_code: "NIKE-SHIRT-001",
    sku_description: "پیراهن ورزشی نایک مردانه",
    sku_image: "/nike-shirt-front-view.jpg",
    unit_price: 450000,
    line_discount_amt: 0,
    final_price: 450000,
    color: "آبی",
    size: "L",
  },
  {
    id: "2",
    barcode_12: "987654321098",
    sku_code: "ADIDAS-SHOE-001",
    sku_description: "کفش ورزشی آدیداس",
    sku_image: "/placeholder.svg",
    unit_price: 850000,
    line_discount_amt: 50000,
    final_price: 800000,
    color: "مشکی",
    size: "42",
  },
]

const mockCustomers = [
  {
    id: "1",
    code: "CUST-00001",
    name: "احمد محمدی",
    phone: "09123456789",
    email: "ahmad@example.com",
    tier: "طلایی",
    points: 1250,
  },
  {
    id: "2",
    code: "CUST-00002",
    name: "فاطمه احمدی",
    phone: "09987654321",
    email: "fateme@example.com",
    tier: "نقره‌ای",
    points: 850,
  },
]

const customerTiers = [
  { id: "1", name: "برنزی" },
  { id: "2", name: "نقره‌ای" },
  { id: "3", name: "طلایی" },
  { id: "4", name: "پلاتینی" },
]

const createCustomerSchema = z.object({
  full_name: z.string().min(1, "نام کامل الزامی است"),
  phone: z.string().min(10, "شماره تلفن باید حداقل ۱۰ رقم باشد"),
  email: z.string().email("ایمیل نامعتبر است").optional().or(z.literal("")),
  tier_id: z.string().optional(),
  consents: z.object({
    sms: z.boolean(),
    email: z.boolean(),
    push: z.boolean(),
  }),
})

type CreateCustomerForm = z.infer<typeof createCustomerSchema>

export default function POSSellPage() {
  const [scanInput, setScanInput] = useState("")
  const [cartItems, setCartItems] = useState(mockCartItems)
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof mockCustomers)[0] | null>(null)
  const [invoiceDiscount, setInvoiceDiscount] = useState({ type: "amount", value: 0 })
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [customerDialog, setCustomerDialog] = useState(false)
  const [customerSearch, setCustomerSearch] = useState("")
  const [createCustomerDialog, setCreateCustomerDialog] = useState(false)
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false)
  const [customerForm, setCustomerForm] = useState<CreateCustomerForm>({
    full_name: "",
    phone: "",
    email: "",
    tier_id: "",
    consents: {
      sms: false,
      email: false,
      push: false,
    },
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  const [payments, setPayments] = useState([
    { type: "cash", amount: 0 },
    { type: "card", amount: 0 },
    { type: "online", amount: 0 },
    { type: "voucher", amount: 0 },
  ])

  const [searchResults, setSearchResults] = useState(mockCustomers)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const searchCustomers = async () => {
      if (!customerSearch.trim()) {
        setSearchResults(mockCustomers)
        return
      }

      setIsSearching(true)
      setTimeout(() => {
        const filtered = mockCustomers.filter(
          (customer) =>
            customer.name.includes(customerSearch) ||
            customer.phone.includes(customerSearch) ||
            customer.email.includes(customerSearch),
        )
        setSearchResults(filtered)
        setIsSearching(false)
      }, 300)
    }

    const debounceTimer = setTimeout(searchCustomers, 300)
    return () => clearTimeout(debounceTimer)
  }, [customerSearch])

  const handleScanItem = (barcode: string) => {
    const isBlocked = false
    if (isBlocked) {
      alert("این واحد کالا مسدود است و قابل فروش نیست")
      return
    }

    if (cartItems.some((item) => item.barcode_12 === barcode)) {
      alert("این واحد کالا قبلاً به سبد خرید اضافه شده است")
      return
    }

    const mockItem = {
      id: Date.now().toString(),
      barcode_12: barcode,
      sku_code: "NIKE-SHIRT-002",
      sku_description: "پیراهن ورزشی نایک زنانه",
      sku_image: "/placeholder.svg",
      unit_price: 420000,
      line_discount_amt: 0,
      final_price: 420000,
      color: "سفید",
      size: "M",
    }

    setCartItems((prev) => [...prev, mockItem])
    setScanInput("")
  }

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleLineDiscount = (itemId: string, discountAmount: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, line_discount_amt: discountAmount, final_price: item.unit_price - discountAmount }
          : item,
      ),
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " ریال"
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.unit_price, 0)
  const totalLineDiscounts = cartItems.reduce((sum, item) => sum + item.line_discount_amt, 0)
  const invoiceDiscountAmount =
    invoiceDiscount.type === "percent"
      ? (subtotal - totalLineDiscounts) * (invoiceDiscount.value / 100)
      : invoiceDiscount.value
  const taxTotal = (subtotal - totalLineDiscounts - invoiceDiscountAmount) * 0.09
  const grandTotal = subtotal - totalLineDiscounts - invoiceDiscountAmount + taxTotal

  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const changeAmount = totalPayments - grandTotal

  const handleCompletePayment = () => {
    if (totalPayments < grandTotal) {
      alert("مبلغ پرداختی کافی نیست")
      return
    }

    alert("فروش با موفقیت تکمیل شد")
    setCartItems([])
    setSelectedCustomer(null)
    setInvoiceDiscount({ type: "amount", value: 0 })
    setPayments([
      { type: "cash", amount: 0 },
      { type: "card", amount: 0 },
      { type: "online", amount: 0 },
      { type: "voucher", amount: 0 },
    ])
    setPaymentDialog(false)
  }

  const handleCreateCustomer = async () => {
    try {
      setFormErrors({})
      const validatedData = createCustomerSchema.parse(customerForm)

      setIsCreatingCustomer(true)

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.detail?.includes("phone")) {
          setFormErrors({ phone: "این شماره قبلاً ثبت شده است." })
          return
        }
        throw new Error("خطا در ایجاد مشتری")
      }

      const newCustomer = await response.json()

      const customerWithTier = {
        ...newCustomer,
        tier: customerTiers.find((t) => t.id === validatedData.tier_id)?.name || "برنزی",
        points: 0,
      }

      setSelectedCustomer(customerWithTier)

      setCustomerForm({
        full_name: "",
        phone: "",
        email: "",
        tier_id: "",
        consents: { sms: false, email: false, push: false },
      })
      setCreateCustomerDialog(false)
      setCustomerDialog(false)

      toast({
        title: "موفقیت",
        description: "مشتری با موفقیت اضافه شد و به فاکتور وصل شد.",
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message
          }
        })
        setFormErrors(errors)
      } else {
        toast({
          title: "خطا",
          description: "خطا در ایجاد مشتری",
          variant: "destructive",
        })
      }
    } finally {
      setIsCreatingCustomer(false)
    }
  }

  const handleRemoveCustomer = () => {
    setSelectedCustomer(null)
    toast({
      title: "اطلاعات",
      description: "مشتری از فاکتور حذف شد",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid h-screen lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                فروش
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline">شیفت: WRC-202401-0001</Badge>
                <Badge variant="secondary">فروشگاه مرکزی</Badge>
              </div>
            </div>
          </div>

          <div className="border-b p-4 bg-muted/30">
            <BarcodeScannerInput
              value={scanInput}
              onChange={setScanInput}
              onScan={handleScanItem}
              placeholder="اسکن بارکد کالا (F2)"
              autoFocus
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground mt-1">F2 برای فوکس روی اسکنر • Enter برای افزودن به سبد</p>
          </div>

          <div className="flex-1 overflow-auto">
            {cartItems.length > 0 ? (
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="text-right">تصویر</TableHead>
                    <TableHead className="text-right">کالا</TableHead>
                    <TableHead className="text-right">مشخصات</TableHead>
                    <TableHead className="text-right">قیمت واحد</TableHead>
                    <TableHead className="text-right">تخفیف ردیف</TableHead>
                    <TableHead className="text-right">قیمت نهایی</TableHead>
                    <TableHead className="text-right">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.sku_image || "/placeholder.svg"}
                          alt={item.sku_description}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.sku_description}</p>
                          <p className="text-sm text-muted-foreground">{item.sku_code}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.barcode_12}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.color}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.size}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(item.unit_price)}</span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.line_discount_amt}
                          onChange={(e) => handleLineDiscount(item.id, Number.parseInt(e.target.value) || 0)}
                          className="w-24"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-primary">{formatCurrency(item.final_price)}</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">سبد خرید خالی است</p>
                  <p className="text-muted-foreground">برای شروع، بارکد کالا را اسکن کنید</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-r flex flex-col bg-muted/20">
          <div className="border-b p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">مشتری</h3>
              <div className="flex items-center gap-2">
                <Sheet open={customerDialog} onOpenChange={setCustomerDialog}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <User className="h-4 w-4" />
                      {selectedCustomer ? "تغییر" : "انتخاب"}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>انتخاب مشتری</SheetTitle>
                      <SheetDescription>مشتری را جستجو و انتخاب کنید</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          placeholder="جستجو بر اساس نام، تلفن یا ایمیل"
                          className="pr-10"
                        />
                      </div>
                      <Button
                        variant="secondary"
                        className="w-full gap-2"
                        onClick={() => setCreateCustomerDialog(true)}
                      >
                        <Plus className="h-4 w-4" />
                        مشتری جدید
                      </Button>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {isSearching ? (
                          <div className="text-center py-4 text-muted-foreground">در حال جستجو...</div>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((customer) => (
                            <div
                              key={customer.id}
                              className="p-3 border rounded-lg cursor-pointer hover:bg-muted"
                              onClick={() => {
                                setSelectedCustomer(customer)
                                setCustomerDialog(false)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{customer.name}</p>
                                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                                </div>
                                <div className="text-left">
                                  <Badge variant="secondary">{customer.tier}</Badge>
                                  <p className="text-xs text-muted-foreground mt-1">{customer.points} امتیاز</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">مشتری یافت نشد</div>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                {selectedCustomer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCustomer}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {selectedCustomer ? (
              <div className="flex items-center justify-between p-2 bg-background rounded border">
                <div>
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                </div>
                <div className="text-left">
                  <Badge variant="secondary">{selectedCustomer.tier}</Badge>
                  <p className="text-xs text-muted-foreground">{selectedCustomer.points} امتیاز</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">مشتری انتخاب نشده</p>
            )}
          </div>

          <div className="border-b p-4 space-y-3">
            <h3 className="font-medium">خلاصه فاکتور</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>جمع کل:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {totalLineDiscounts > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>تخفیف ردیف‌ها:</span>
                  <span>-{formatCurrency(totalLineDiscounts)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>تخفیف فاکتور:</span>
                <div className="flex items-center gap-2">
                  <Select
                    value={invoiceDiscount.type}
                    onValueChange={(value) => setInvoiceDiscount((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amount">ریال</SelectItem>
                      <SelectItem value="percent">درصد</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={invoiceDiscount.value}
                    onChange={(e) =>
                      setInvoiceDiscount((prev) => ({ ...prev, value: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="w-20 h-8"
                    placeholder="0"
                  />
                </div>
              </div>
              {invoiceDiscountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>مبلغ تخفیف فاکتور:</span>
                  <span>-{formatCurrency(invoiceDiscountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>مالیات (9%):</span>
                <span>{formatCurrency(taxTotal)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-primary">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="space-y-4">
              <StatusChip status="open" />
              <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2" size="lg" disabled={cartItems.length === 0}>
                    <CreditCard className="h-5 w-5" />
                    پرداخت ({formatCurrency(grandTotal)})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>پرداخت فاکتور</DialogTitle>
                    <DialogDescription>روش‌های پرداخت را تعیین کنید</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between font-medium">
                        <span>مبلغ قابل پرداخت:</span>
                        <span>{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>
                    {payments.map((payment, index) => (
                      <div key={payment.type} className="flex items-center gap-3">
                        <div className="flex items-center gap-2 w-20">
                          {payment.type === "cash" && <Banknote className="h-4 w-4" />}
                          {payment.type === "card" && <CreditCard className="h-4 w-4" />}
                          {payment.type === "online" && <DollarSign className="h-4 w-4" />}
                          {payment.type === "voucher" && <Receipt className="h-4 w-4" />}
                          <span className="text-sm">
                            {payment.type === "cash" && "نقد"}
                            {payment.type === "card" && "کارت"}
                            {payment.type === "online" && "آنلاین"}
                            {payment.type === "voucher" && "کوپن"}
                          </span>
                        </div>
                        <Input
                          type="number"
                          value={payment.amount}
                          onChange={(e) => {
                            const newPayments = [...payments]
                            newPayments[index].amount = Number.parseInt(e.target.value) || 0
                            setPayments(newPayments)
                          }}
                          placeholder="0"
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const remaining = grandTotal - totalPayments + payment.amount
                            const newPayments = [...payments]
                            newPayments[index].amount = Math.max(0, remaining)
                            setPayments(newPayments)
                          }}
                        >
                          کامل
                        </Button>
                      </div>
                    ))}
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>مجموع پرداخت:</span>
                        <span className="font-medium">{formatCurrency(totalPayments)}</span>
                      </div>
                      {changeAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>باقی‌مانده:</span>
                          <span className="font-medium">{formatCurrency(changeAmount)}</span>
                        </div>
                      )}
                      {totalPayments < grandTotal && (
                        <div className="flex justify-between text-red-600">
                          <span>کمبود:</span>
                          <span className="font-medium">{formatCurrency(grandTotal - totalPayments)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCompletePayment} disabled={totalPayments < grandTotal} className="flex-1">
                        تکمیل فروش
                      </Button>
                      <Button variant="outline" onClick={() => setPaymentDialog(false)}>
                        لغو
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="w-full bg-transparent" disabled={cartItems.length === 0}>
                ذخیره موقت
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setCartItems([])
                  setSelectedCustomer(null)
                  setInvoiceDiscount({ type: "amount", value: 0 })
                }}
                disabled={cartItems.length === 0}
              >
                پاک کردن سبد
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={createCustomerDialog} onOpenChange={setCreateCustomerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ایجاد مشتری جدید</DialogTitle>
            <DialogDescription>اطلاعات مشتری جدید را وارد کنید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">نام کامل *</Label>
              <Input
                id="full_name"
                value={customerForm.full_name}
                onChange={(e) => setCustomerForm((prev) => ({ ...prev, full_name: e.target.value }))}
                placeholder="نام و نام خانوادگی"
                className={formErrors.full_name ? "border-destructive" : ""}
              />
              {formErrors.full_name && <p className="text-sm text-destructive">{formErrors.full_name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">شماره تلفن *</Label>
              <Input
                id="phone"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="09123456789"
                className={formErrors.phone ? "border-destructive" : ""}
              />
              {formErrors.phone && <p className="text-sm text-destructive">{formErrors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                value={customerForm.email}
                onChange={(e) => setCustomerForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="example@email.com"
                className={formErrors.email ? "border-destructive" : ""}
              />
              {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">سطح مشتری</Label>
              <Select
                value={customerForm.tier_id}
                onValueChange={(value) => setCustomerForm((prev) => ({ ...prev, tier_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب سطح" />
                </SelectTrigger>
                <SelectContent>
                  {customerTiers.map((tier) => (
                    <SelectItem key={tier.id} value={tier.id}>
                      {tier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>رضایت‌نامه‌ها</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-consent" className="text-sm">
                    دریافت پیامک
                  </Label>
                  <Switch
                    id="sms-consent"
                    checked={customerForm.consents.sms}
                    onCheckedChange={(checked) =>
                      setCustomerForm((prev) => ({
                        ...prev,
                        consents: { ...prev.consents, sms: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-consent" className="text-sm">
                    دریافت ایمیل
                  </Label>
                  <Switch
                    id="email-consent"
                    checked={customerForm.consents.email}
                    onCheckedChange={(checked) =>
                      setCustomerForm((prev) => ({
                        ...prev,
                        consents: { ...prev.consents, email: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-consent" className="text-sm">
                    دریافت اعلان
                  </Label>
                  <Switch
                    id="push-consent"
                    checked={customerForm.consents.push}
                    onCheckedChange={(checked) =>
                      setCustomerForm((prev) => ({
                        ...prev,
                        consents: { ...prev.consents, push: checked },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateCustomer}
                disabled={isCreatingCustomer || !customerForm.full_name || !customerForm.phone}
                className="flex-1"
              >
                {isCreatingCustomer ? "در حال ذخیره..." : "ذخیره و انتخاب"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateCustomerDialog(false)
                  setCustomerForm({
                    full_name: "",
                    phone: "",
                    email: "",
                    tier_id: "",
                    consents: { sms: false, email: false, push: false },
                  })
                  setFormErrors({})
                }}
                disabled={isCreatingCustomer}
              >
                انصراف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
