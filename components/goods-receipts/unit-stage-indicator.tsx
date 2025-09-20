import { Clock, Package, CheckCircle, XCircle, Truck, Archive } from "lucide-react"

interface UnitStageIndicatorProps {
  stage: "created" | "counting" | "qc_pass" | "qc_fail" | "putaway" | "stored"
  className?: string
  showLabel?: boolean
}

export function UnitStageIndicator({ stage, className, showLabel = true }: UnitStageIndicatorProps) {
  const getStageConfig = (stage: string) => {
    switch (stage) {
      case "created":
        return {
          label: "ایجاد شده",
          icon: Clock,
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          progress: 16,
        }
      case "counting":
        return {
          label: "در حال شمارش",
          icon: Package,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          progress: 33,
        }
      case "qc_pass":
        return {
          label: "تأیید کیفیت",
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-100",
          progress: 50,
        }
      case "qc_fail":
        return {
          label: "رد کیفیت",
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-100",
          progress: 50,
        }
      case "putaway":
        return {
          label: "در حال جایگذاری",
          icon: Truck,
          color: "text-orange-500",
          bgColor: "bg-orange-100",
          progress: 83,
        }
      case "stored":
        return {
          label: "ذخیره شده",
          icon: Archive,
          color: "text-green-600",
          bgColor: "bg-green-100",
          progress: 100,
        }
      default:
        return {
          label: "نامشخص",
          icon: Clock,
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          progress: 0,
        }
    }
  }

  const config = getStageConfig(stage)
  const Icon = config.icon

  if (!showLabel) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon className={`h-4 w-4 ${config.color}`} />
      <span className="text-sm">{config.label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-1.5 ml-2">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            stage === "qc_fail" ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${config.progress}%` }}
        />
      </div>
    </div>
  )
}
