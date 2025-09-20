"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Save, X, Scan } from "lucide-react"
import { t } from "@/lib/translations"

interface BarcodeItem {
  id: string
  barcode: string
  notes?: string
  created_at: string
}

interface SKUBarcodeManagerProps {
  skuId: string
  barcodes: BarcodeItem[]
  onSave: (barcode: Partial<BarcodeItem>) => void
  onDelete: (barcodeId: string) => void
}

export function SKUBarcodeManager({ skuId, barcodes, onSave, onDelete }: SKUBarcodeManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    barcode: "",
    notes: "",
  })

  const validateBarcode = (barcode: string) => {
    return /^\d{12}$/.test(barcode)
  }

  const handleSave = () => {
    if (!validateBarcode(formData.barcode)) {
      return
    }

    // Check for duplicates
    if (barcodes.some((b) => b.barcode === formData.barcode)) {
      alert("این بارکد قبلاً ثبت شده است")
      return
    }

    onSave({
      barcode: formData.barcode,
      notes: formData.notes,
    })

    setFormData({ barcode: "", notes: "" })
    setIsAdding(false)
  }

  const handleCancel = () => {
    setFormData({ barcode: "", notes: "" })
    setIsAdding(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR")
  }

  return (
    <div className="space-y-6">
      {/* Add Barcode Form */}
      {isAdding && (
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              افزودن بارکد جدید
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="barcode">بارکد (۱۲ رقم)</Label>
              <div className="relative">
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 12)
                    setFormData({ ...formData, barcode: value })
                  }}
                  placeholder="123456789012"
                  maxLength={12}
                  className="pr-10"
                />
                <Scan className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              {formData.barcode && !validateBarcode(formData.barcode) && (
                <p className="text-sm text-destructive">{t("barcodeRequired")}</p>
              )}
              {formData.barcode && barcodes.some((b) => b.barcode === formData.barcode) && (
                <p className="text-sm text-destructive">این بارکد قبلاً ثبت شده است</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">یادداشت (اختیاری)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="توضیحات اضافی در مورد این بارکد..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleSave}
                disabled={!validateBarcode(formData.barcode) || barcodes.some((b) => b.barcode === formData.barcode)}
                className="gap-2"
              >
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
      )}

      {/* Barcodes List */}
      <Card className="soft-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            بارکدهای ثبت شده ({barcodes.length})
          </CardTitle>
          <Button onClick={() => setIsAdding(true)} disabled={isAdding} className="gap-2">
            <Plus className="h-4 w-4" />
            افزودن بارکد
          </Button>
        </CardHeader>
        <CardContent>
          {barcodes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">بارکد</TableHead>
                  <TableHead className="text-right">یادداشت</TableHead>
                  <TableHead className="text-right">تاریخ ثبت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {barcodes.map((barcode) => (
                  <TableRow key={barcode.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {barcode.barcode}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {barcode.notes ? (
                        <span className="text-sm">{barcode.notes}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(barcode.created_at)}</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(barcode.id)}
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
            <div className="text-center py-12">
              <Scan className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">هنوز بارکدی ثبت نشده</p>
              <p className="text-muted-foreground mb-4">برای شروع، بارکد اول را اضافه کنید</p>
              <Button onClick={() => setIsAdding(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                افزودن بارکد اول
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
