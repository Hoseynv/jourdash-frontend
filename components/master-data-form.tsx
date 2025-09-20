"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { t } from "@/lib/translations"

interface MasterDataItem {
  id: string
  code: string
  name: string
  description?: string
  is_active: boolean
  category_id?: string
  hex_color?: string
}

interface MasterDataFormProps {
  title: string
  items: MasterDataItem[]
  categories?: MasterDataItem[]
  showCategory?: boolean
  showColor?: boolean
  onSave: (item: Partial<MasterDataItem>) => void
  onDelete: (id: string) => void
}

export function MasterDataForm({
  title,
  items,
  categories,
  showCategory = false,
  showColor = false,
  onSave,
  onDelete,
}: MasterDataFormProps) {
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    category_id: "",
    hex_color: "#000000",
    is_active: true,
  })

  const showToast = (message: string, type: "success" | "error" = "success") => {
    alert(message) // Simple fallback for now
  }

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      showToast("کد و نام الزامی هستند", "error")
      return
    }

    try {
      if (editingItem) {
        onSave({ ...formData, id: editingItem.id })
        showToast(`${title} با موفقیت ویرایش شد`)
        setEditingItem(null)
      } else {
        onSave({ ...formData, id: Date.now().toString() })
        showToast(`${title} جدید با موفقیت اضافه شد`)
        setIsCreating(false)
      }
      resetForm()
    } catch (error) {
      showToast("خطا در ذخیره اطلاعات", "error")
    }
  }

  const handleEdit = (item: MasterDataItem) => {
    setEditingItem(item)
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description || "",
      category_id: item.category_id || "",
      hex_color: item.hex_color || "#000000",
      is_active: item.is_active,
    })
  }

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      category_id: "",
      hex_color: "#000000",
      is_active: true,
    })
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsCreating(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (window.confirm(`آیا از حذف این ${title} اطمینان دارید؟`)) {
      try {
        onDelete(id)
        showToast(`${title} با موفقیت حذف شد`)
      } catch (error) {
        showToast("خطا در حذف اطلاعات", "error")
      }
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Data Grid */}
      <div className="lg:col-span-2">
        <Card className="soft-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <Button onClick={() => setIsCreating(true)} disabled={isCreating || editingItem !== null} className="gap-2">
              <Plus className="h-4 w-4" />
              {t("add")}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {showColor && item.hex_color && (
                      <div className="w-6 h-6 rounded border" style={{ backgroundColor: item.hex_color }} />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.code}
                        </Badge>
                        {!item.is_active && <Badge variant="secondary">غیرفعال</Badge>}
                      </div>
                      {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      {showCategory && item.category_id && categories && (
                        <p className="text-xs text-muted-foreground">
                          دسته: {categories.find((c) => c.id === item.category_id)?.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      disabled={isCreating || editingItem !== null}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={isCreating || editingItem !== null}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="text-center py-8 text-muted-foreground">هیچ موردی یافت نشد</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side Form */}
      {(isCreating || editingItem) && (
        <div>
          <Card className="soft-shadow">
            <CardHeader>
              <CardTitle>{editingItem ? `ویرایش ${title}` : `افزودن ${title}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">کد</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="کد یکتا وارد کنید"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">نام</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="نام وارد کنید"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">توضیحات</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="توضیحات اختیاری"
                />
              </div>

              {showCategory && categories && (
                <div className="space-y-2">
                  <Label>دسته‌بندی</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showColor && (
                <div className="space-y-2">
                  <Label htmlFor="color">رنگ</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.hex_color}
                      onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.hex_color}
                      onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  {t("save")}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
                  <X className="h-4 w-4" />
                  {t("cancel")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
