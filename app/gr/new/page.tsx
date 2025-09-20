"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Check,
  ChevronsUpDown,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Mock suppliers data
const mockSuppliers = [
  { id: "SUP-001", name: "تأمین‌کننده اصلی" },
  { id: "SUP-002", name: "تأمین‌کننده فرعی" },
  { id: "SUP-003", name: "شرکت پخش مرکزی" },
]

// Mock SKU attributes for selection
const mockAttributes = {
  brands: ["نایک", "آدیداس", "پوما", "ریبوک"],
  genders: ["مردانه", "زنانه", "بچگانه"],
  seasons: ["بهار", "تابستان", "پاییز", "زمستان"],
  categories: ["پوشاک", "کفش", "لوازم جانبی"],
  subcategories: ["پیراهن", "شلوار", "کفش ورزشی", "کیف"],
  // models: ["کلاسیک", "مدرن", "ورزشی", "رسمی"], // Replaced by mockModels
  // colors: ["سفید", "مشکی", "آبی", "قرمز", "سبز"], // Replaced by mockColors
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "38", "39", "40", "41", "42", "43"],
  uoms: ["عدد", "جفت", "بسته", "کیلوگرم"],
}

const mockColors = [
  { id: "1", name: "آبی", code: "001" },
  { id: "2", name: "سفید", code: "002" },
  { id: "3", name: "مشکی", code: "003" },
  { id: "4", name: "قرمز", code: "004" },
  { id: "5", name: "سبز", code: "005" },
]

const mockModels = [
  { id: "1", name: "کلاسیک", code: "230" },
  { id: "2", name: "مدرن", code: "450" },
  { id: "3", name: "ورزشی", code: "670" },
  { id: "4", name: "رسمی", code: "890" },
]

interface ReceiptHeader {
  supplier_id: string
  receipt_date: string
  internal_receipt_no: string
  supplier_invoice_no: string
  supplier_invoice_date: string
}

interface ReceiptLine {
  id: string
  sku_code: string
  brand: string
  gender: string
  season: string
  category: string
  subcategory: string
  model: string
  color: string
  size: string
  uom: string
  description?: string
  expected_qty: number
  notes: string
}

interface Unit {
  id: string
  barcode_12: string
  tech_code: string
  sku_code: string
}

const modelSchema = z.object({
  model_name: z.string().min(2, "نام مدل باید حداقل ۲ کاراکتر باشد"),
  model_code: z.string().regex(/^\d{3}$/, "کد مدل باید دقیقاً سه رقم باشد."),
  description: z.string().optional(),
})

type ModelFormData = z.infer<typeof modelSchema>

export default function NewGoodsReceiptPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Header data
  const [headerData, setHeaderData] = useState<ReceiptHeader>({
    supplier_id: "",
    receipt_date: new Date().toISOString().split("T")[0],
    internal_receipt_no: `WRC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")}`,
    supplier_invoice_no: "",
    supplier_invoice_date: "",
  })

  // Step 2: Lines and units
  const [lines, setLines] = useState<ReceiptLine[]>([])
  const [units, setUnits] = useState<Unit[]>([])

  // Step 2: Add item form
  const [itemForm, setItemForm] = useState({
    brand: "",
    gender: "",
    season: "",
    category: "",
    subcategory: "",
    model: null as { id: string; name: string; code: string } | null,
    color: null as { id: string; name: string; code: string } | null,
    size: "",
    uom: "",
    description: "",
    quantity: 1,
  })

  const [colorSearch, setColorSearch] = useState("")
  const [showModelCreateModal, setShowModelCreateModal] = useState(false)
  const [newColor, setNewColor] = useState({ name: "", code: "" })
  const [colorOpen, setColorOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const [showColorCreate, setShowColorCreate] = useState(false) // Declared here

  // Step 3: Counting data
  const [countingData, setCountingData] = useState<{ [lineId: string]: { counted_qty: number; notes: string } }>({})

  const generateReceiptNo = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")
    return `WRC-${year}${month}-${random}`
  }

  const generateSKUCode = (attributes: any) => {
    if (
      !attributes.brand ||
      !attributes.gender ||
      !attributes.season ||
      !attributes.category ||
      !attributes.subcategory ||
      !attributes.model ||
      !attributes.color ||
      !attributes.size
    ) {
      throw new Error("SKU نامعتبر: فیلدهای لازم کامل نیست.")
    }

    // Brand mapping (2 chars)
    const brandMap: { [key: string]: string } = {
      نایک: "JO", // JOUR
      آدیداس: "PH", // Paris Hilton
      پوما: "VE", // Versace
      ریبوک: "PA", // Parfois
    }
    const brandCode = brandMap[attributes.brand] || "JO"

    // Gender (1 char: W/M)
    const genderCode = attributes.gender === "زنانه" ? "W" : "M"

    // Season (1 digit)
    const seasonMap: { [key: string]: string } = {
      بهار: "1",
      تابستان: "2",
      پاییز: "3",
      زمستان: "4",
      "همه فصل": "5",
      "بدون فصل": "0",
    }
    const seasonCode = seasonMap[attributes.season] || "0"

    // Category (1 digit)
    const categoryMap: { [key: string]: string } = {
      کیف: "1",
      کفش: "2",
      پوشاک: "3",
      "لوازم جانبی": "4",
    }
    const categoryCode = categoryMap[attributes.category] || "1"

    // Subcategory (1 digit)
    const subcategoryMap: { [key: string]: string } = {
      "کیف دستی": "1",
      "کیف کراس بادی": "2",
      ورزشی: "3",
      رسمی: "4",
    }
    const subcategoryCode = subcategoryMap[attributes.subcategory] || "1"

    // Model (3 digits)
    const modelCode = attributes.model.code

    // Color (3 digits)
    const colorCode = attributes.color.code

    // Size (2 digits)
    const sizeMap: { [key: string]: string } = {
      XS: "01",
      S: "02",
      M: "03",
      L: "04",
      XL: "05",
      XXL: "06",
      "38": "38",
      "39": "39",
      "40": "40",
      "41": "41",
      "42": "42",
      "43": "43",
      کوچک: "01",
      متوسط: "02",
      بزرگ: "03",
    }
    const sizeCode = sizeMap[attributes.size] || "01"

    return `${brandCode}${genderCode}${seasonCode}${categoryCode}${subcategoryCode}${modelCode}${colorCode}${sizeCode}`
  }

  const generateUnits = (quantity: number, skuCode: string): Unit[] => {
    const newUnits: Unit[] = []
    for (let i = 0; i < quantity; i++) {
      const unitId = `unit-${Date.now()}-${i}`
      const techCode = `TC-${Date.now()}-${i}`
      const barcode = String(Math.floor(Math.random() * 999999999999)).padStart(12, "0")

      newUnits.push({
        id: unitId,
        barcode_12: barcode,
        tech_code: techCode,
        sku_code: skuCode,
      })
    }
    return newUnits
  }

  const filteredColors = mockColors.filter(
    (color) => color.name.toLowerCase().includes(colorSearch.toLowerCase()) || color.code.includes(colorSearch),
  )

  const handleCreateColor = async () => {
    if (!newColor.name.trim()) {
      toast.error("نام رنگ الزامی است")
      return
    }

    if (!/^\d{3}$/.test(newColor.code)) {
      toast.error("کد رنگ باید دقیقاً سه رقم باشد.")
      return
    }

    // Mock API call
    const createdColor = {
      id: Date.now().toString(),
      name: newColor.name,
      code: newColor.code,
    }

    // Add to mock data (in real app, this would be handled by state management)
    mockColors.push(createdColor)

    setItemForm((prev) => ({ ...prev, color: createdColor }))
    setNewColor({ name: "", code: "" })
    setShowColorCreate(false)
    setColorOpen(false)
    toast.success(`رنگ "${createdColor.name}" ایجاد و انتخاب شد`)
  }

  const modelForm = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      model_name: "",
      model_code: "",
      description: "",
    },
  })

  const [models, setModels] = useState(mockModels)
  const [isSearchingModels, setIsSearchingModels] = useState(false)
  const [modelSearch, setModelSearch] = useState("") // Moved here from above

  // Debounced model search
  useEffect(() => {
    const searchModels = async () => {
      if (modelSearch.length < 2) {
        setModels(mockModels)
        return
      }

      setIsSearchingModels(true)
      try {
        // Mock API call - replace with actual endpoint
        const response = await fetch(`/api/md/models?query=${encodeURIComponent(modelSearch)}&limit=10`)
        if (response.ok) {
          const data = await response.json()
          setModels(data.models || [])
        } else {
          // Fallback to local search if API fails
          console.error("API error during model search, falling back to local search.")
          const filtered = mockModels.filter(
            (model) => model.name.toLowerCase().includes(modelSearch.toLowerCase()) || model.code.includes(modelSearch),
          )
          setModels(filtered)
        }
      } catch (error) {
        console.error("Model search error:", error)
        // Fallback to local search
        const filtered = mockModels.filter(
          (model) => model.name.toLowerCase().includes(modelSearch.toLowerCase()) || model.code.includes(modelSearch),
        )
        setModels(filtered)
      } finally {
        setIsSearchingModels(false)
      }
    }

    const timeoutId = setTimeout(searchModels, 300)
    return () => clearTimeout(timeoutId)
  }, [modelSearch])

  const handleCreateModel = async (data: ModelFormData) => {
    try {
      // Call API to create model
      const response = await fetch("/api/md/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        if (response.status === 409) {
          modelForm.setError("model_code", {
            type: "manual",
            message: "کد مدل باید یکتا باشد.",
          })
          return
        }
        throw new Error("Failed to create model")
      }

      const createdModel = await response.json()

      // Update local state and form
      setModels((prev) => [...prev, createdModel])
      setItemForm((prev) => ({ ...prev, model: createdModel }))

      // Reset and close modal
      modelForm.reset()
      setShowModelCreateModal(false)
      setModelOpen(false)

      toast.success(`مدل "${createdModel.name}" ایجاد و انتخاب شد`)
    } catch (error) {
      console.error("Model creation error:", error)
      toast.error("خطا در ایجاد مدل")
    }
  }

  const filteredModels = models.filter(
    (model) => model.name.toLowerCase().includes(modelSearch.toLowerCase()) || model.code.includes(modelSearch),
  )

  // Removed handleCreateModel as it's now handled by the form submission

  const handleAddItem = () => {
    // Validate form
    const requiredFields = ["brand", "gender", "season", "category", "subcategory", "model", "color", "size", "uom"]
    const missingFields = requiredFields.filter((field) => {
      const value = itemForm[field as keyof typeof itemForm]
      return !value || (typeof value === "object" && value === null)
    })

    if (missingFields.length > 0) {
      toast.error("لطفاً تمام مشخصات کالا را انتخاب کنید")
      return
    }

    if (itemForm.quantity < 1) {
      toast.error("تعداد باید حداقل ۱ باشد")
      return
    }

    try {
      // Generate SKU code
      const skuCode = generateSKUCode(itemForm)

      // Check if SKU already exists in lines
      const existingLine = lines.find((line) => line.sku_code === skuCode)
      if (existingLine) {
        const confirmed = window.confirm("افزودن تکراری شناسایی شد؛ می‌خواهید تعداد را افزایش دهید؟")
        if (confirmed) {
          // Update existing line quantity
          setLines((prev) =>
            prev.map((line) =>
              line.id === existingLine.id ? { ...line, expected_qty: line.expected_qty + itemForm.quantity } : line,
            ),
          )

          // Generate additional units
          const newUnits = generateUnits(itemForm.quantity, skuCode)
          setUnits((prev) => [...prev, ...newUnits])

          toast.success(`${itemForm.quantity} واحد به کالای موجود اضافه شد`)
        }
        return
      }

      // Create new line
      const newLine: ReceiptLine = {
        id: `line-${Date.now()}`,
        sku_code: skuCode,
        brand: itemForm.brand,
        gender: itemForm.gender,
        season: itemForm.season,
        category: itemForm.category,
        subcategory: itemForm.subcategory,
        model: itemForm.model!.name,
        color: itemForm.color!.name,
        size: itemForm.size,
        uom: itemForm.uom,
        description: itemForm.description,
        expected_qty: itemForm.quantity,
        notes: "",
      }

      // Generate units for this line
      const newUnits = generateUnits(itemForm.quantity, skuCode)

      // Update state
      setLines((prev) => [...prev, newLine])
      setUnits((prev) => [...prev, ...newUnits])

      // Initialize counting data
      setCountingData((prev) => ({
        ...prev,
        [newLine.id]: { counted_qty: itemForm.quantity, notes: "" },
      }))

      // Reset form
      setItemForm({
        brand: "",
        gender: "",
        season: "",
        category: "",
        subcategory: "",
        model: null,
        color: null,
        size: "",
        uom: "",
        description: "",
        quantity: 1,
      })

      toast.success(`${itemForm.quantity} واحد از کالا اضافه شد`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ایجاد SKU")
    }
  }

  const handleDeleteLine = (lineId: string) => {
    const line = lines.find((l) => l.id === lineId)
    if (!line) return

    // Remove line and its units
    setLines((prev) => prev.filter((l) => l.id !== lineId))
    setUnits((prev) => prev.filter((u) => u.sku_code !== line.sku_code))

    // Remove counting data
    setCountingData((prev) => {
      const newData = { ...prev }
      delete newData[lineId]
      return newData
    })

    toast.success("قلم حذف شد")
  }

  const handleDeleteUnit = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId)
    if (!unit) return

    // Remove unit
    setUnits((prev) => prev.filter((u) => u.id !== unitId))

    // Update line expected_qty
    setLines((prev) =>
      prev.map((line) => {
        if (line.sku_code === unit.sku_code) {
          const newQty = line.expected_qty - 1
          return { ...line, expected_qty: Math.max(0, newQty) }
        }
        return line
      }),
    )

    // Update counting data
    const line = lines.find((l) => l.sku_code === unit.sku_code)
    if (line) {
      setCountingData((prev) => ({
        ...prev,
        [line.id]: {
          ...prev[line.id],
          counted_qty: Math.max(0, (prev[line.id]?.counted_qty || 0) - 1),
        },
      }))
    }

    toast.success("واحد حذف شد")
  }

  const handleCountingNext = () => {
    setCurrentStep(3)
  }

  const handleSetAllCounted = () => {
    const newCountingData: { [lineId: string]: { counted_qty: number; notes: string } } = {}
    lines.forEach((line) => {
      newCountingData[line.id] = {
        counted_qty: line.expected_qty,
        notes: countingData[line.id]?.notes || "",
      }
    })
    setCountingData(newCountingData)
    toast.success("تمام مقادیر شمارش برابر انتظار تنظیم شد")
  }

  const handleFinalSubmit = () => {
    // Validate counting data
    const hasEmptyCount = lines.some(
      (line) => countingData[line.id]?.counted_qty === undefined || countingData[line.id]?.counted_qty < 0,
    )

    if (hasEmptyCount) {
      toast.error("لطفاً مقدار شمارش تمام اقلام را وارد کنید")
      return
    }

    // Show confirmation
    const totalVariance = lines.reduce((sum, line) => {
      const counted = countingData[line.id]?.counted_qty || 0
      return sum + Math.abs(counted - line.expected_qty)
    }, 0)

    if (totalVariance > 0) {
      const confirmed = window.confirm(
        `اختلاف در مقادیر وجود دارد (${totalVariance} واحد). آیا مطمئن هستید که می‌خواهید رسید را تطبیق کنید؟ این عمل غیرقابل بازگشت است.`,
      )
      if (!confirmed) return
    }

    // Mock API call to finalize receipt
    toast.success("رسید با موفقیت تطبیق شد و قفل گردید")

    // Redirect to receipt details
    setTimeout(() => {
      router.push("/gr/gr-new-001") // Mock ID
    }, 1500)
  }

  const getUnitsForLine = (lineId: string) => {
    const line = lines.find((l) => l.id === lineId)
    if (!line) return []
    return units.filter((u) => u.sku_code === line.sku_code)
  }

  const handleHeaderNext = () => {
    setCurrentStep(2)
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
              <h1 className="text-3xl font-bold text-balance">رسید خرید جدید</h1>
              <p className="text-muted-foreground">ایجاد رسید دریافت کالا از تأمین‌کننده</p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-8 space-x-reverse">
          {[
            { step: 1, title: "اطلاعات رسید", icon: Package },
            { step: 2, title: "افزودن اقلام", icon: Plus },
            { step: 3, title: "شمارش", icon: CheckCircle },
          ].map(({ step, title, icon: Icon }) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step ? "✓" : step}
              </div>
              <span className={currentStep >= step ? "text-foreground" : "text-muted-foreground"}>{title}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Header Information */}
        {currentStep === 1 && (
          <Card className="soft-shadow">
            <CardHeader>
              <CardTitle>اطلاعات رسید</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>تأمین‌کننده *</Label>
                  <Select
                    value={headerData.supplier_id}
                    onValueChange={(value) => setHeaderData((prev) => ({ ...prev, supplier_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب تأمین‌کننده" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSuppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>تاریخ رسید *</Label>
                  <Input
                    type="date"
                    value={headerData.receipt_date}
                    onChange={(e) => setHeaderData((prev) => ({ ...prev, receipt_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>شماره رسید داخلی</Label>
                  <div className="flex gap-2">
                    <Input value={headerData.internal_receipt_no} disabled className="font-mono" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHeaderData((prev) => ({ ...prev, internal_receipt_no: generateReceiptNo() }))}
                    >
                      تولید مجدد
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">شماره نهایی توسط سرور تولید می‌شود</p>
                </div>

                <div className="space-y-2">
                  <Label>شماره فاکتور تأمین‌کننده *</Label>
                  <Input
                    value={headerData.supplier_invoice_no}
                    onChange={(e) => setHeaderData((prev) => ({ ...prev, supplier_invoice_no: e.target.value }))}
                    placeholder="شماره فاکتور"
                  />
                </div>

                <div className="space-y-2">
                  <Label>تاریخ فاکتور تأمین‌کننده</Label>
                  <Input
                    type="date"
                    value={headerData.supplier_invoice_date}
                    onChange={(e) => setHeaderData((prev) => ({ ...prev, supplier_invoice_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleHeaderNext} className="gap-2">
                  بعدی
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Add Items */}
        {currentStep === 2 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Add Item Form */}
            <Card className="soft-shadow">
              <CardHeader>
                <CardTitle>افزودن قلم</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>برند *</Label>
                    <Select
                      value={itemForm.brand}
                      onValueChange={(value) => setItemForm((prev) => ({ ...prev, brand: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب برند" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAttributes.brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>جنسیت *</Label>
                    <Select
                      value={itemForm.gender}
                      onValueChange={(value) => setItemForm((prev) => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب جنسیت" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAttributes.genders.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>فصل *</Label>
                    <Select
                      value={itemForm.season}
                      onValueChange={(value) => setItemForm((prev) => ({ ...prev, season: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب فصل" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAttributes.seasons.map((season) => (
                          <SelectItem key={season} value={season}>
                            {season}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>دسته‌بندی *</Label>
                    <Select
                      value={itemForm.category}
                      onValueChange={(value) => setItemForm((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAttributes.categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>زیردسته *</Label>
                    <Select
                      value={itemForm.subcategory}
                      onValueChange={(value) => setItemForm((prev) => ({ ...prev, subcategory: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب زیردسته" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAttributes.subcategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>مدل *</Label>
                    <Popover open={modelOpen} onOpenChange={setModelOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={modelOpen}
                          className="w-full justify-between bg-transparent"
                        >
                          {itemForm.model ? `${itemForm.model.name} (${itemForm.model.code})` : "انتخاب مدل"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="جستجو مدل..." value={modelSearch} onValueChange={setModelSearch} />
                          <CommandList>
                            <CommandEmpty>
                              <div className="p-2">
                                <p className="text-sm text-muted-foreground mb-2">مدل یافت نشد</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowModelCreateModal(true)}
                                  className="w-full"
                                >
                                  تعریف مدل جدید
                                </Button>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              <CommandItem onSelect={() => setShowModelCreateModal(true)} className="text-primary">
                                <Plus className="mr-2 h-4 w-4" />
                                تعریف مدل جدید
                              </CommandItem>
                              {isSearchingModels ? (
                                <CommandItem disabled>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  در حال جستجو...
                                </CommandItem>
                              ) : (
                                models.map((model) => (
                                  <CommandItem
                                    key={model.id}
                                    value={`${model.name}-${model.code}`}
                                    onSelect={() => {
                                      setItemForm((prev) => ({ ...prev, model }))
                                      setModelOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        itemForm.model?.id === model.id ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {model.name} ({model.code})
                                  </CommandItem>
                                ))
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>رنگ *</Label>
                    <Popover open={colorOpen} onOpenChange={setColorOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={colorOpen}
                          className="w-full justify-between bg-transparent"
                        >
                          {itemForm.color ? `${itemForm.color.name} (${itemForm.color.code})` : "انتخاب رنگ"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="جستجو رنگ..." value={colorSearch} onValueChange={setColorSearch} />
                          <CommandList>
                            <CommandEmpty>
                              <div className="p-2">
                                <p className="text-sm text-muted-foreground mb-2">رنگ یافت نشد</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowColorCreate(true)}
                                  className="w-full"
                                >
                                  ایجاد رنگ جدید
                                </Button>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {filteredColors.map((color) => (
                                <CommandItem
                                  key={color.id}
                                  value={`${color.name}-${color.code}`}
                                  onSelect={() => {
                                    setItemForm((prev) => ({ ...prev, color }))
                                    setColorOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      itemForm.color?.id === color.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {color.name} ({color.code})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>

                        {showColorCreate && (
                          <div className="border-t p-3 space-y-2">
                            <h4 className="font-medium text-sm">ایجاد رنگ جدید</h4>
                            <Input
                              placeholder="نام رنگ"
                              value={newColor.name}
                              onChange={(e) => setNewColor((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            <Input
                              placeholder="کد رنگ (3 رقم)"
                              value={newColor.code}
                              onChange={(e) => setNewColor((prev) => ({ ...prev, code: e.target.value }))}
                              maxLength={3}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleCreateColor}>
                                ایجاد
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setShowColorCreate(false)
                                  setNewColor({ name: "", code: "" })
                                }}
                              >
                                لغو
                              </Button>
                            </div>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>سایز *</Label>
                    <Select
                      value={itemForm.size}
                      onValueChange={(value) => setItemForm((prev) => ({ ...prev, size: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب سایز" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAttributes.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>واحد شمارش *</Label>
                    <Select
                      value={itemForm.uom}
                      onValueChange={(value) => setItemForm((prev) => ({ ...prev, uom: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب واحد" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAttributes.uoms.map((uom) => (
                          <SelectItem key={uom} value={uom}>
                            {uom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>تعداد *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={itemForm.quantity}
                      onChange={(e) =>
                        setItemForm((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>توضیحات (اختیاری)</Label>
                  <Input
                    value={itemForm.description}
                    onChange={(e) => setItemForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="توضیحات اضافی"
                  />
                </div>

                <Button onClick={handleAddItem} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  افزودن قلم
                </Button>
              </CardContent>
            </Card>

            <Card className="soft-shadow">
              <CardHeader>
                <CardTitle>
                  اقلام و واحدها ({lines.length} قلم، {units.length} واحد)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lines.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>هنوز قلمی اضافه نشده</p>
                    <p className="text-sm">از فرم سمت چپ برای افزودن قلم استفاده کنید</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lines.map((line) => (
                      <div key={line.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-mono text-sm font-medium mb-1">{line.sku_code}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {line.brand}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {line.gender === "زنانه" ? "زنانه" : "مردانه"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {line.season}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {line.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {line.subcategory}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {line.model}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {line.color}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {line.size}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {line.uom}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{line.expected_qty} واحد</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLine(line.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Units for this line */}
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              مشاهده واحدها ({getUnitsForLine(line.id).length})
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>واحدهای {line.sku_code}</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-6">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-right">بارکد ۱۲ رقمی</TableHead>
                                    <TableHead className="text-right">کد فنی</TableHead>
                                    <TableHead className="text-right">SKU</TableHead>
                                    <TableHead className="text-right">عملیات</TableHead>
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
                                        <span className="font-mono text-sm">{unit.sku_code}</span>
                                      </TableCell>
                                      <TableCell>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteUnit(unit.id)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            <div className="p-6 pt-0">
                              <DrawerClose asChild>
                                <Button variant="outline" className="w-full bg-transparent">
                                  بستن
                                </Button>
                              </DrawerClose>
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </div>
                    ))}
                  </div>
                )}

                {lines.length > 0 && (
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      <ArrowLeft className="h-4 w-4 ml-2" />
                      قبلی
                    </Button>
                    <Button onClick={handleCountingNext} className="gap-2">
                      بعدی
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Counting */}
        {currentStep === 3 && (
          <Card className="soft-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>شمارش</CardTitle>
              <Button variant="outline" onClick={handleSetAllCounted}>
                تنظیم همه برابر انتظار
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                مقادیر واقعی شمارش شده را وارد کنید. به طور پیش‌فرض، مقدار شمارش برابر مقدار انتظار تنظیم شده است.
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">کد SKU</TableHead>
                    <TableHead className="text-right">مشخصات</TableHead>
                    <TableHead className="text-right">مقدار انتظار</TableHead>
                    <TableHead className="text-right">مقدار شمارش</TableHead>
                    <TableHead className="text-right">اختلاف</TableHead>
                    <TableHead className="text-right">یادداشت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line) => {
                    const countedQty = countingData[line.id]?.counted_qty ?? line.expected_qty
                    const diff = countedQty - line.expected_qty

                    return (
                      <TableRow key={line.id}>
                        <TableCell>
                          <span className="font-mono text-sm">{line.sku_code}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {line.brand}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {line.color}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {line.size}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{line.expected_qty}</Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={countedQty}
                            onChange={(e) => {
                              const newQty = Number.parseInt(e.target.value) || 0
                              setCountingData((prev) => ({
                                ...prev,
                                [line.id]: {
                                  ...prev[line.id],
                                  counted_qty: newQty,
                                },
                              }))
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant={diff > 0 ? "default" : diff < 0 ? "destructive" : "outline"}>
                            {diff > 0 ? "+" : ""}
                            {diff}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="یادداشت..."
                            value={countingData[line.id]?.notes || ""}
                            onChange={(e) => {
                              setCountingData((prev) => ({
                                ...prev,
                                [line.id]: {
                                  ...prev[line.id],
                                  notes: e.target.value,
                                },
                              }))
                            }}
                            className="w-32"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  قبلی
                </Button>

                <div className="flex items-center gap-4">
                  {lines.some((line) => {
                    const countedQty = countingData[line.id]?.counted_qty ?? line.expected_qty
                    return countedQty !== line.expected_qty
                  }) && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">اختلاف در مقادیر وجود دارد</span>
                    </div>
                  )}

                  <Button onClick={handleFinalSubmit} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    تطبیق و ثبت نهایی
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showModelCreateModal} onOpenChange={setShowModelCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تعریف مدل جدید</DialogTitle>
            <DialogDescription>مدل جدید را با وارد کردن نام و کد سه رقمی تعریف کنید</DialogDescription>
          </DialogHeader>

          <Form {...modelForm}>
            <form onSubmit={modelForm.handleSubmit(handleCreateModel)} className="space-y-4">
              <FormField
                control={modelForm.control}
                name="model_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام مدل</FormLabel>
                    <FormControl>
                      <Input placeholder="نام مدل را وارد کنید" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={modelForm.control}
                name="model_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>کد مدل (سه رقمی)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123"
                        maxLength={3}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={modelForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>توضیحات (اختیاری)</FormLabel>
                    <FormControl>
                      <Input placeholder="توضیحات مدل" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    modelForm.reset()
                    setShowModelCreateModal(false)
                  }}
                >
                  انصراف
                </Button>
                <Button type="submit" disabled={modelForm.formState.isSubmitting}>
                  {modelForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    "ذخیره و انتخاب"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
