export interface GoodsReceipt {
  id: string
  receipt_no: string
  supplier_id: string
  supplier_name: string
  supplier_invoice_no: string
  supplier_invoice_date: string
  receipt_date: string
  status: "draft" | "counting" | "reconciled"
  created_by: string
  created_at: string
  updated_at: string
  lines_count: number
  units_count: number
}

export interface GoodsReceiptLine {
  id: string
  receipt_id: string
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
  counted_qty: number
  diff_qty: number
  notes: string
}

export interface GoodsReceiptUnit {
  id: string
  receipt_id: string
  line_id: string
  barcode_12: string
  tech_code: string
  sku_code: string
  color: string
  size: string
  stage: "created" | "counting" | "qc_pass" | "qc_fail" | "putaway" | "stored"
  status: string
  owner?: string
  location?: string
  created_at: string
  updated_at: string
}

export interface GoodsReceiptActivity {
  id: string
  receipt_id: string
  timestamp: string
  user: string
  action: string
  description: string
}

export interface CreateReceiptRequest {
  supplier_id: string
  receipt_date: string
  supplier_invoice_no: string
  supplier_invoice_date?: string
}

export interface CreateLineRequest {
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
}

export interface GenerateUnitsRequest {
  quantity: number
}

export interface UpdateCountedQtyRequest {
  counted_qty: number
  notes: string
}

export interface GoodsReceiptsListParams {
  query?: string
  status?: string
  date_from?: string
  date_to?: string
  page?: number
  limit?: number
}

// Base API URL - in production this would come from environment variables
const API_BASE_URL = "/api"

// Generic API client with error handling
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Goods Receipts API functions
export const goodsReceiptsApi = {
  // List receipts with filtering
  async list(params: GoodsReceiptsListParams = {}): Promise<{ data: GoodsReceipt[]; total: number }> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, String(value))
      }
    })

    return apiCall<{ data: GoodsReceipt[]; total: number }>(`/gr?${searchParams}`)
  },

  // Get receipt details
  async get(id: string): Promise<GoodsReceipt> {
    return apiCall<GoodsReceipt>(`/gr/${id}`)
  },

  // Create new receipt (draft)
  async create(data: CreateReceiptRequest): Promise<GoodsReceipt> {
    return apiCall<GoodsReceipt>("/gr", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Update receipt header
  async update(id: string, data: Partial<CreateReceiptRequest>): Promise<GoodsReceipt> {
    return apiCall<GoodsReceipt>(`/gr/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Transition to counting status
  async enterCounting(id: string): Promise<GoodsReceipt> {
    return apiCall<GoodsReceipt>(`/gr/${id}/enter-counting`, {
      method: "POST",
    })
  },

  // Reconcile receipt (final step)
  async reconcile(id: string): Promise<GoodsReceipt> {
    return apiCall<GoodsReceipt>(`/gr/${id}/reconcile`, {
      method: "POST",
    })
  },

  // Lines management
  lines: {
    // Get lines for a receipt
    async list(receiptId: string): Promise<GoodsReceiptLine[]> {
      return apiCall<GoodsReceiptLine[]>(`/gr/${receiptId}/lines`)
    },

    // Create new line
    async create(receiptId: string, data: CreateLineRequest): Promise<GoodsReceiptLine> {
      return apiCall<GoodsReceiptLine>(`/gr/${receiptId}/lines`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    // Update counted quantity
    async updateCountedQty(
      receiptId: string,
      lineId: string,
      data: UpdateCountedQtyRequest,
    ): Promise<GoodsReceiptLine> {
      return apiCall<GoodsReceiptLine>(`/gr/${receiptId}/lines/${lineId}/counted-qty`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    // Delete line (only in draft status)
    async delete(receiptId: string, lineId: string): Promise<void> {
      return apiCall<void>(`/gr/${receiptId}/lines/${lineId}`, {
        method: "DELETE",
      })
    },

    // Generate units for a line
    async generateUnits(receiptId: string, lineId: string, data: GenerateUnitsRequest): Promise<GoodsReceiptUnit[]> {
      return apiCall<GoodsReceiptUnit[]>(`/gr/${receiptId}/lines/${lineId}/generate-units`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  },

  // Units management
  units: {
    // Get units for a receipt
    async list(receiptId: string): Promise<GoodsReceiptUnit[]> {
      return apiCall<GoodsReceiptUnit[]>(`/gr/${receiptId}/units`)
    },

    // Get unit details
    async get(unitId: string): Promise<GoodsReceiptUnit> {
      return apiCall<GoodsReceiptUnit>(`/units/${unitId}`)
    },

    // Get unit history
    async getHistory(unitId: string): Promise<GoodsReceiptActivity[]> {
      return apiCall<GoodsReceiptActivity[]>(`/units/${unitId}/history`)
    },

    // Delete unit (only in draft status)
    async delete(unitId: string): Promise<void> {
      return apiCall<void>(`/units/${unitId}`, {
        method: "DELETE",
      })
    },
  },

  // Activity/history
  activity: {
    // Get receipt activity log
    async list(receiptId: string): Promise<GoodsReceiptActivity[]> {
      return apiCall<GoodsReceiptActivity[]>(`/gr/${receiptId}/activity`)
    },
  },
}

// React Query hooks for state management
export const useGoodsReceipts = (params: GoodsReceiptsListParams = {}) => {
  // This would typically use React Query or SWR for caching and state management
  // For now, we'll provide the structure for integration
  return {
    data: null,
    isLoading: false,
    error: null,
    mutate: () => {},
  }
}

export const useGoodsReceipt = (id: string) => {
  return {
    data: null,
    isLoading: false,
    error: null,
    mutate: () => {},
  }
}

export const useGoodsReceiptLines = (receiptId: string) => {
  return {
    data: null,
    isLoading: false,
    error: null,
    mutate: () => {},
  }
}

export const useGoodsReceiptUnits = (receiptId: string) => {
  return {
    data: null,
    isLoading: false,
    error: null,
    mutate: () => {},
  }
}

// Validation schemas using Zod
import { z } from "zod"

export const createReceiptSchema = z.object({
  supplier_id: z.string().min(1, "تأمین‌کننده الزامی است"),
  receipt_date: z.string().min(1, "تاریخ رسید الزامی است"),
  supplier_invoice_no: z.string().min(1, "شماره فاکتور الزامی است"),
  supplier_invoice_date: z.string().optional(),
})

export const createLineSchema = z.object({
  brand: z.string().min(1, "برند الزامی است"),
  gender: z.string().min(1, "جنسیت الزامی است"),
  season: z.string().min(1, "فصل الزامی است"),
  category: z.string().min(1, "دسته‌بندی الزامی است"),
  subcategory: z.string().min(1, "زیردسته الزامی است"),
  model: z.string().min(1, "مدل الزامی است"),
  color: z.string().min(1, "رنگ الزامی است"),
  size: z.string().min(1, "سایز الزامی است"),
  uom: z.string().min(1, "واحد شمارش الزامی است"),
  expected_qty: z.number().min(1, "تعداد باید حداقل ۱ باشد"),
  description: z.string().optional(),
})

export const updateCountedQtySchema = z.object({
  counted_qty: z.number().min(0, "مقدار شمارش نمی‌تواند منفی باشد"),
  notes: z.string().optional(),
})

// Utility functions
export const generateReceiptNo = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")
  return `WRC-${year}${month}-${random}`
}

export const generateSKUCode = (attributes: {
  brand: string
  category: string
  color: string
  size: string
}): string => {
  const brandCode = attributes.brand.substring(0, 3).toUpperCase()
  const categoryCode = attributes.category.substring(0, 3).toUpperCase()
  const colorCode = attributes.color.substring(0, 2).toUpperCase()
  const sizeCode = attributes.size
  return `${brandCode}-${categoryCode}-${colorCode}-${sizeCode}`
}

export const generateTechCode = (): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 999)
  return `TC-${timestamp}-${random}`
}

export const generateBarcode = (): string => {
  return String(Math.floor(Math.random() * 999999999999)).padStart(12, "0")
}

// Status helpers
export const getStatusText = (status: string): string => {
  switch (status) {
    case "draft":
      return "پیش‌نویس"
    case "counting":
      return "در حال شمارش"
    case "reconciled":
      return "تطبیق شده"
    default:
      return "نامشخص"
  }
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800"
    case "counting":
      return "bg-blue-100 text-blue-800"
    case "reconciled":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getStageText = (stage: string): string => {
  switch (stage) {
    case "created":
      return "ایجاد شده"
    case "counting":
      return "در حال شمارش"
    case "qc_pass":
      return "تأیید کیفیت"
    case "qc_fail":
      return "رد کیفیت"
    case "putaway":
      return "در حال جایگذاری"
    case "stored":
      return "ذخیره شده"
    default:
      return "نامشخص"
  }
}

export const canEditReceipt = (status: string): boolean => {
  return status === "draft"
}

export const canEnterCounting = (status: string): boolean => {
  return status === "draft"
}

export const canReconcile = (status: string): boolean => {
  return status === "counting"
}

export const isReconciled = (status: string): boolean => {
  return status === "reconciled"
}
