import { Badge } from "@/components/ui/badge"

interface StatusChipProps {
  status: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}

const statusConfig = {
  // Warehouse statuses
  available: { label: "موجود", variant: "default" as const },
  blocked: { label: "مسدود", variant: "destructive" as const },
  reserved: { label: "رزرو شده", variant: "secondary" as const },

  // Receipt statuses
  draft: { label: "پیش‌نویس", variant: "outline" as const },
  counting: { label: "در حال شمارش", variant: "secondary" as const },
  reconciled: { label: "تطبیق شده", variant: "default" as const },

  // QC statuses
  pending: { label: "در انتظار", variant: "outline" as const },
  pass: { label: "تأیید", variant: "default" as const },
  fail: { label: "رد", variant: "destructive" as const },
}

export function StatusChip({ status, variant, className }: StatusChipProps) {
  const config = statusConfig[status as keyof typeof statusConfig]

  if (!config) {
    return (
      <Badge variant={variant || "outline"} className={className}>
        {status}
      </Badge>
    )
  }

  return (
    <Badge variant={variant || config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
