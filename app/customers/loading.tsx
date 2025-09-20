import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CustomersLoading() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-16" />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
