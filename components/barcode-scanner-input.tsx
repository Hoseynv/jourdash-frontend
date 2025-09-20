"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Scan, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { t } from "@/lib/translations"

interface BarcodeScannerInputProps {
  value: string
  onChange: (value: string) => void
  onScan?: (barcode: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

export function BarcodeScannerInput({
  value,
  onChange,
  onScan,
  placeholder = "اسکن بارکد ۱۲ رقمی",
  label,
  disabled = false,
  autoFocus = false,
  className,
}: BarcodeScannerInputProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateBarcode = (barcode: string) => {
    return /^\d{12}$/.test(barcode)
  }

  useEffect(() => {
    if (value) {
      const valid = validateBarcode(value)
      setIsValid(valid)

      if (valid && onScan) {
        onScan(value)
      }
    } else {
      setIsValid(null)
    }
  }, [value, onScan])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, "").slice(0, 12)
    onChange(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && validateBarcode(value) && onScan) {
      onScan(value)
    }
  }

  const clearInput = () => {
    onChange("")
    inputRef.current?.focus()
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={12}
          disabled={disabled}
          autoFocus={autoFocus}
          className={cn(
            "pr-20 font-mono",
            isValid === true && "border-green-500 focus:border-green-500",
            isValid === false && "border-red-500 focus:border-red-500",
          )}
        />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isValid === true && <Check className="h-4 w-4 text-green-500" />}
          {isValid === false && <X className="h-4 w-4 text-red-500" />}
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={clearInput} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          )}
          <Scan className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      {isValid === false && value && <p className="text-xs text-red-500">{t("barcodeRequired")}</p>}
    </div>
  )
}
