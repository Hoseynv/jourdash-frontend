import { Badge } from "@/components/ui/badge"
import { Clock, Package, CheckCircle } from "lucide-react"

interface ReceiptStatusChipProps {
  status: "draft" | "counting" | "reconciled"
  className?: string
}

export function ReceiptStatusChip({ status, className }: ReceiptStatusChipProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "draft":
        return {
          label: "پیش‌نویس",
          variant: "secondary" as const,
          icon: Clock,
          className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        }
      case "counting":
        return {
          label: "در حال شمارش",
          variant: "default" as const,
          icon: Package,
          className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        }
      case "reconciled":
        return {
          label: "تطبیق شده",
          variant: "default" as const,
          icon: CheckCircle,
          className: "bg-green-100 text-green-800 hover:bg-green-200",
        }
      default:
        return {
          label: "نامشخص",
          variant: "outline" as const,
          icon: Clock,
          className: "bg-gray-100 text-gray-800",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`gap-1 ${config.className} ${className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}
