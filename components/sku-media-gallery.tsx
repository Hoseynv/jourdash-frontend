"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Star, Trash2, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaItem {
  id: string
  url: string
  filename: string
  is_primary: boolean
  uploaded_at: string
}

interface SKUMediaGalleryProps {
  skuId: string
  media: MediaItem[]
  onUpload: (files: FileList) => void
  onSetPrimary: (mediaId: string) => void
  onDelete: (mediaId: string) => void
}

export function SKUMediaGallery({ skuId, media, onUpload, onSetPrimary, onDelete }: SKUMediaGalleryProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) {
      onUpload(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onUpload(e.target.files)
    }
  }

  const primaryImage = media.find((m) => m.is_primary)
  const secondaryImages = media.filter((m) => !m.is_primary)

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="soft-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            آپلود تصاویر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">تصاویر را اینجا بکشید یا کلیک کنید</p>
            <p className="text-sm text-muted-foreground mb-4">فرمت‌های مجاز: JPG, PNG, WebP - حداکثر ۵ مگابایت</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                انتخاب فایل‌ها
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Media Gallery */}
      {media.length > 0 && (
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>گالری تصاویر ({media.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Primary Image */}
              {primaryImage && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    تصویر اصلی
                  </h3>
                  <div className="relative group">
                    <img
                      src={primaryImage.url || "/placeholder.svg"}
                      alt={primaryImage.filename}
                      className="w-full max-w-md h-64 object-cover rounded-lg border"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(primaryImage.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-yellow-500">اصلی</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{primaryImage.filename}</p>
                </div>
              )}

              {/* Secondary Images */}
              {secondaryImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">تصاویر ثانویه</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {secondaryImages.map((item) => (
                      <div key={item.id} className="relative group">
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={item.filename}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                          <Button size="sm" variant="secondary" onClick={() => onSetPrimary(item.id)}>
                            <Star className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{item.filename}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {media.length === 0 && (
        <Card className="soft-shadow">
          <CardContent className="py-12 text-center">
            <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">هنوز تصویری آپلود نشده</p>
            <p className="text-muted-foreground">برای شروع، تصاویر کالا را آپلود کنید</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
