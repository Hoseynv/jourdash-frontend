import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  goodsReceiptsApi,
  type GoodsReceiptsListParams,
  type CreateReceiptRequest,
  type CreateLineRequest,
  type GenerateUnitsRequest,
  type UpdateCountedQtyRequest,
} from "@/lib/api/goods-receipts"

// Query keys for consistent caching
export const goodsReceiptsKeys = {
  all: ["goods-receipts"] as const,
  lists: () => [...goodsReceiptsKeys.all, "list"] as const,
  list: (params: GoodsReceiptsListParams) => [...goodsReceiptsKeys.lists(), params] as const,
  details: () => [...goodsReceiptsKeys.all, "detail"] as const,
  detail: (id: string) => [...goodsReceiptsKeys.details(), id] as const,
  lines: (receiptId: string) => [...goodsReceiptsKeys.detail(receiptId), "lines"] as const,
  units: (receiptId: string) => [...goodsReceiptsKeys.detail(receiptId), "units"] as const,
  activity: (receiptId: string) => [...goodsReceiptsKeys.detail(receiptId), "activity"] as const,
}

// List goods receipts with filtering
export const useGoodsReceiptsList = (params: GoodsReceiptsListParams = {}) => {
  return useQuery({
    queryKey: goodsReceiptsKeys.list(params),
    queryFn: () => goodsReceiptsApi.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single goods receipt
export const useGoodsReceipt = (id: string) => {
  return useQuery({
    queryKey: goodsReceiptsKeys.detail(id),
    queryFn: () => goodsReceiptsApi.get(id),
    enabled: !!id,
  })
}

// Get receipt lines
export const useGoodsReceiptLines = (receiptId: string) => {
  return useQuery({
    queryKey: goodsReceiptsKeys.lines(receiptId),
    queryFn: () => goodsReceiptsApi.lines.list(receiptId),
    enabled: !!receiptId,
  })
}

// Get receipt units
export const useGoodsReceiptUnits = (receiptId: string) => {
  return useQuery({
    queryKey: goodsReceiptsKeys.units(receiptId),
    queryFn: () => goodsReceiptsApi.units.list(receiptId),
    enabled: !!receiptId,
  })
}

// Get receipt activity
export const useGoodsReceiptActivity = (receiptId: string) => {
  return useQuery({
    queryKey: goodsReceiptsKeys.activity(receiptId),
    queryFn: () => goodsReceiptsApi.activity.list(receiptId),
    enabled: !!receiptId,
  })
}

// Create new goods receipt
export const useCreateGoodsReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReceiptRequest) => goodsReceiptsApi.create(data),
    onSuccess: (newReceipt) => {
      // Invalidate and refetch lists
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.lists() })

      // Add to cache
      queryClient.setQueryData(goodsReceiptsKeys.detail(newReceipt.id), newReceipt)

      toast.success("رسید جدید ایجاد شد")
    },
    onError: (error: Error) => {
      toast.error(`خطا در ایجاد رسید: ${error.message}`)
    },
  })
}

// Update goods receipt
export const useUpdateGoodsReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateReceiptRequest> }) =>
      goodsReceiptsApi.update(id, data),
    onSuccess: (updatedReceipt) => {
      // Update cache
      queryClient.setQueryData(goodsReceiptsKeys.detail(updatedReceipt.id), updatedReceipt)

      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.lists() })

      toast.success("رسید به‌روزرسانی شد")
    },
    onError: (error: Error) => {
      toast.error(`خطا در به‌روزرسانی رسید: ${error.message}`)
    },
  })
}

// Enter counting mode
export const useEnterCounting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (receiptId: string) => goodsReceiptsApi.enterCounting(receiptId),
    onSuccess: (updatedReceipt) => {
      queryClient.setQueryData(goodsReceiptsKeys.detail(updatedReceipt.id), updatedReceipt)
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.lists() })

      toast.success("وارد مرحله شمارش شدید")
    },
    onError: (error: Error) => {
      toast.error(`خطا در ورود به شمارش: ${error.message}`)
    },
  })
}

// Reconcile receipt
export const useReconcileReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (receiptId: string) => goodsReceiptsApi.reconcile(receiptId),
    onSuccess: (updatedReceipt) => {
      queryClient.setQueryData(goodsReceiptsKeys.detail(updatedReceipt.id), updatedReceipt)
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.lists() })

      toast.success("رسید تطبیق شد و قفل گردید")
    },
    onError: (error: Error) => {
      toast.error(`خطا در تطبیق رسید: ${error.message}`)
    },
  })
}

// Create receipt line
export const useCreateReceiptLine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ receiptId, data }: { receiptId: string; data: CreateLineRequest }) =>
      goodsReceiptsApi.lines.create(receiptId, data),
    onSuccess: (newLine, { receiptId }) => {
      // Invalidate lines and units queries
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.lines(receiptId) })
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.units(receiptId) })
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.detail(receiptId) })

      toast.success("قلم جدید اضافه شد")
    },
    onError: (error: Error) => {
      toast.error(`خطا در افزودن قلم: ${error.message}`)
    },
  })
}

// Delete receipt line
export const useDeleteReceiptLine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ receiptId, lineId }: { receiptId: string; lineId: string }) =>
      goodsReceiptsApi.lines.delete(receiptId, lineId),
    onSuccess: (_, { receiptId }) => {
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.lines(receiptId) })
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.units(receiptId) })
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.detail(receiptId) })

      toast.success("قلم حذف شد")
    },
    onError: (error: Error) => {
      toast.error(`خطا در حذف قلم: ${error.message}`)
    },
  })
}

// Generate units for line
export const useGenerateUnits = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ receiptId, lineId, data }: { receiptId: string; lineId: string; data: GenerateUnitsRequest }) =>
      goodsReceiptsApi.lines.generateUnits(receiptId, lineId, data),
    onSuccess: (newUnits, { receiptId }) => {
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.units(receiptId) })
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.detail(receiptId) })

      toast.success(`${newUnits.length} واحد جدید ایجاد شد`)
    },
    onError: (error: Error) => {
      toast.error(`خطا در ایجاد واحدها: ${error.message}`)
    },
  })
}

// Update counted quantity
export const useUpdateCountedQty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ receiptId, lineId, data }: { receiptId: string; lineId: string; data: UpdateCountedQtyRequest }) =>
      goodsReceiptsApi.lines.updateCountedQty(receiptId, lineId, data),
    onSuccess: (updatedLine, { receiptId }) => {
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.lines(receiptId) })
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.detail(receiptId) })

      toast.success("مقدار شمارش به‌روزرسانی شد")
    },
    onError: (error: Error) => {
      toast.error(`خطا در به‌روزرسانی شمارش: ${error.message}`)
    },
  })
}

// Delete unit
export const useDeleteUnit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ unitId, receiptId }: { unitId: string; receiptId: string }) => goodsReceiptsApi.units.delete(unitId),
    onSuccess: (_, { receiptId }) => {
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.units(receiptId) })
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.lines(receiptId) })
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.detail(receiptId) })

      toast.success("واحد حذف شد")
    },
    onError: (error: Error) => {
      toast.error(`خطا در حذف واحد: ${error.message}`)
    },
  })
}

// Optimistic updates helper
export const useOptimisticUpdate = () => {
  const queryClient = useQueryClient()

  const updateReceiptOptimistically = (receiptId: string, updates: any) => {
    queryClient.setQueryData(goodsReceiptsKeys.detail(receiptId), (old: any) => ({
      ...old,
      ...updates,
    }))
  }

  const updateLineOptimistically = (receiptId: string, lineId: string, updates: any) => {
    queryClient.setQueryData(goodsReceiptsKeys.lines(receiptId), (old: any[]) =>
      old?.map((line) => (line.id === lineId ? { ...line, ...updates } : line)),
    )
  }

  return {
    updateReceiptOptimistically,
    updateLineOptimistically,
  }
}

// Bulk operations
export const useBulkUpdateCounting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      receiptId,
      updates,
    }: { receiptId: string; updates: Array<{ lineId: string; data: UpdateCountedQtyRequest }> }) => {
      const promises = updates.map(({ lineId, data }) =>
        goodsReceiptsApi.lines.updateCountedQty(receiptId, lineId, data),
      )
      return Promise.all(promises)
    },
    onSuccess: (_, { receiptId }) => {
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.lines(receiptId) })
      queryClient.invalidateQueries({ queryKey: goodsReceiptsKeys.detail(receiptId) })

      toast.success("تمام مقادیر شمارش به‌روزرسانی شد")
    },
    onError: (error: Error) => {
      toast.error(`خطا در به‌روزرسانی گروهی: ${error.message}`)
    },
  })
}
