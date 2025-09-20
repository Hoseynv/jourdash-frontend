"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { MasterDataForm } from "@/components/master-data-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { t } from "@/lib/translations"

// Mock data - in real app this would come from API
const mockBrands = [
  { id: "1", code: "NIKE", name: "نایک", description: "برند ورزشی", is_active: true },
  { id: "2", code: "ADIDAS", name: "آدیداس", description: "برند ورزشی", is_active: true },
  { id: "3", code: "PUMA", name: "پوما", description: "برند ورزشی", is_active: false },
]

const mockCategories = [
  { id: "1", code: "CLOTHING", name: "پوشاک", description: "انواع لباس", is_active: true },
  { id: "2", code: "SHOES", name: "کفش", description: "انواع کفش", is_active: true },
  { id: "3", code: "ACCESSORIES", name: "لوازم جانبی", description: "لوازم جانبی", is_active: true },
]

const mockSubcategories = [
  { id: "1", code: "SHIRTS", name: "پیراهن", category_id: "1", is_active: true },
  { id: "2", code: "PANTS", name: "شلوار", category_id: "1", is_active: true },
  { id: "3", code: "SNEAKERS", name: "کفش ورزشی", category_id: "2", is_active: true },
  { id: "4", code: "BOOTS", name: "بوت", category_id: "2", is_active: true },
]

const mockModels = [
  { id: "1", code: "AIR-MAX", name: "ایر مکس", description: "مدل کلاسیک نایک", is_active: true },
  { id: "2", code: "ULTRABOOST", name: "اولترابوست", description: "مدل پرفورمنس آدیداس", is_active: true },
]

const mockColors = [
  { id: "1", code: "RED", name: "قرمز", hex_color: "#FF0000", is_active: true },
  { id: "2", code: "BLUE", name: "آبی", hex_color: "#0000FF", is_active: true },
  { id: "3", code: "BLACK", name: "مشکی", hex_color: "#000000", is_active: true },
  { id: "4", code: "WHITE", name: "سفید", hex_color: "#FFFFFF", is_active: true },
]

const mockSizes = [
  { id: "1", code: "XS", name: "خیلی کوچک", is_active: true },
  { id: "2", code: "S", name: "کوچک", is_active: true },
  { id: "3", code: "M", name: "متوسط", is_active: true },
  { id: "4", code: "L", name: "بزرگ", is_active: true },
  { id: "5", code: "XL", name: "خیلی بزرگ", is_active: true },
]

const mockUOM = [
  { id: "1", code: "PCS", name: "عدد", description: "واحد شمارشی", is_active: true },
  { id: "2", code: "KG", name: "کیلوگرم", description: "واحد وزن", is_active: true },
  { id: "3", code: "M", name: "متر", description: "واحد طول", is_active: true },
]

export default function MasterDataPage() {
  const [brands, setBrands] = useState(mockBrands)
  const [categories, setCategories] = useState(mockCategories)
  const [subcategories, setSubcategories] = useState(mockSubcategories)
  const [models, setModels] = useState(mockModels)
  const [colors, setColors] = useState(mockColors)
  const [sizes, setSizes] = useState(mockSizes)
  const [uom, setUOM] = useState(mockUOM)

  const handleSave = (type: string) => (item: any) => {
    const newItem = { ...item, id: item.id || Date.now().toString() }

    switch (type) {
      case "brands":
        setBrands((prev) => (item.id ? prev.map((b) => (b.id === item.id ? newItem : b)) : [...prev, newItem]))
        break
      case "categories":
        setCategories((prev) => (item.id ? prev.map((c) => (c.id === item.id ? newItem : c)) : [...prev, newItem]))
        break
      case "subcategories":
        setSubcategories((prev) => (item.id ? prev.map((s) => (s.id === item.id ? newItem : s)) : [...prev, newItem]))
        break
      case "models":
        setModels((prev) => (item.id ? prev.map((m) => (m.id === item.id ? newItem : m)) : [...prev, newItem]))
        break
      case "colors":
        setColors((prev) => (item.id ? prev.map((c) => (c.id === item.id ? newItem : c)) : [...prev, newItem]))
        break
      case "sizes":
        setSizes((prev) => (item.id ? prev.map((s) => (s.id === item.id ? newItem : s)) : [...prev, newItem]))
        break
      case "uom":
        setUOM((prev) => (item.id ? prev.map((u) => (u.id === item.id ? newItem : u)) : [...prev, newItem]))
        break
    }
  }

  const handleDelete = (type: string) => (id: string) => {
    switch (type) {
      case "brands":
        setBrands((prev) => prev.filter((b) => b.id !== id))
        break
      case "categories":
        setCategories((prev) => prev.filter((c) => c.id !== id))
        break
      case "subcategories":
        setSubcategories((prev) => prev.filter((s) => s.id !== id))
        break
      case "models":
        setModels((prev) => prev.filter((m) => m.id !== id))
        break
      case "colors":
        setColors((prev) => prev.filter((c) => c.id !== id))
        break
      case "sizes":
        setSizes((prev) => prev.filter((s) => s.id !== id))
        break
      case "uom":
        setUOM((prev) => prev.filter((u) => u.id !== id))
        break
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-balance">{t("masterData")}</h1>
          <p className="text-muted-foreground">مدیریت اطلاعات پایه سیستم</p>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="brands" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="brands">{t("brands")}</TabsTrigger>
            <TabsTrigger value="categories">دسته‌ها</TabsTrigger>
            <TabsTrigger value="models">{t("models")}</TabsTrigger>
            <TabsTrigger value="colors">{t("colors")}</TabsTrigger>
            <TabsTrigger value="sizes">{t("sizes")}</TabsTrigger>
            <TabsTrigger value="uom">{t("uom")}</TabsTrigger>
          </TabsList>

          <TabsContent value="brands">
            <MasterDataForm
              title={t("brands")}
              items={brands}
              onSave={handleSave("brands")}
              onDelete={handleDelete("brands")}
            />
          </TabsContent>

          <TabsContent value="categories">
            <div className="space-y-6">
              <MasterDataForm
                title={t("categories")}
                items={categories}
                onSave={handleSave("categories")}
                onDelete={handleDelete("categories")}
              />

              <MasterDataForm
                title={t("subcategories")}
                items={subcategories}
                categories={categories}
                showCategory={true}
                onSave={handleSave("subcategories")}
                onDelete={handleDelete("subcategories")}
              />
            </div>
          </TabsContent>

          <TabsContent value="models">
            <MasterDataForm
              title={t("models")}
              items={models}
              onSave={handleSave("models")}
              onDelete={handleDelete("models")}
            />
          </TabsContent>

          <TabsContent value="colors">
            <MasterDataForm
              title={t("colors")}
              items={colors}
              showColor={true}
              onSave={handleSave("colors")}
              onDelete={handleDelete("colors")}
            />
          </TabsContent>

          <TabsContent value="sizes">
            <MasterDataForm
              title={t("sizes")}
              items={sizes}
              onSave={handleSave("sizes")}
              onDelete={handleDelete("sizes")}
            />
          </TabsContent>

          <TabsContent value="uom">
            <MasterDataForm title={t("uom")} items={uom} onSave={handleSave("uom")} onDelete={handleDelete("uom")} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
