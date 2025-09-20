"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Package, ArrowRight, Scan, Eye } from "lucide-react"
import { t } from "@/lib/translations"
import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"

// Mock data for shipped transfers
const mockShippedTransfers = [
  {
    id: "2",
    transfer_no: "TRF-202501-002",
    from_owner: "شعبه مرکزی",
    to_owner: "شعبه جنوب",
    items_count: 12,
    shipped_at: "2025-01-15T10:30:00Z",
    status: "shipped",
  },
  {
    id: "4",
    transfer_no: "TRF-202501-004",
    from_owner: "انبار مرکزی",
    to_owner: "شعبه شمال",
    items_count: 8,
    shipped_at: "2025-01-14T14:20:00Z",
    status: "shipped",
  },
]

export default function ReceiveTransferPage() {
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null)

  const handleSearchTransfer = () => {
    if (!searchQuery.trim()) {
      toast({
        title: t("error"),
        description: "لطفاً شماره انتقال را وارد کنید.",
        variant: "destructive",
      })
      return
    }

    const transfer = mockShippedTransfers.find((t) => t.transfer_no.toLowerCase().includes(searchQuery.toLowerCase()))

    if (!transfer) {
      toast({
        title: t("error"),
        description: t("transferNotReadyToReceive"),
        variant: "destructive",
      })
      return
    }

    if (transfer.status !== "shipped") {
      toast({
        title: t("error"),
        description: t("transferNotReadyToReceive"),
        variant: "destructive",
      })
      return
    }

    // Navigate to specific receive page
    window.location.href = `/transfers/${transfer.id}/receive`
  }

  const handleStartReceiving = (transferId: string) => {
    window.location.href = `/transfers/${transferId}/receive`
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Jour</span>
          <span className="mx-2">/</span>
          <Link href="/transfers" className="hover:text-foreground">
            {t("transfers")}
          </Link>
          <span className="mx-2">/</span>
          <span>{t("receiveTransfer")}</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t("receiveTransfer")}</h1>
            <p className="text-muted-foreground">دریافت انتقالات ارسال شده</p>
          </div>
        </div>

        {/* Search by Transfer Number */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              جستجو با شماره انتقال
            </CardTitle>
            <CardDescription>شماره انتقال مورد نظر را وارد کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="مثال: TRF-202501-002"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchTransfer()}
                  className="font-mono"
                />
              </div>
              <Button onClick={handleSearchTransfer} className="gap-2">
                <Search className="h-4 w-4" />
                {t("search")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Shipped Transfers */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>انتقالات آماده دریافت</CardTitle>
            <CardDescription>انتقالاتی که وضعیت ارسال شده دارند</CardDescription>
          </CardHeader>
          <CardContent>
            {mockShippedTransfers.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">انتقال آماده دریافتی وجود ندارد</h3>
                <p className="text-muted-foreground">در حال حاضر هیچ انتقالی برای دریافت آماده نیست</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">{t("transferNo")}</TableHead>
                      <TableHead className="text-right">مبدأ → مقصد</TableHead>
                      <TableHead className="text-right">{t("itemsCount")}</TableHead>
                      <TableHead className="text-right">{t("shippedAt")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockShippedTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-mono">
                          <Link href={`/transfers/${transfer.id}`} className="text-primary hover:underline">
                            {transfer.transfer_no}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {transfer.from_owner}
                            </Badge>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <Badge variant="outline" className="text-xs">
                              {transfer.to_owner}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{transfer.items_count}</Badge>
                        </TableCell>
                        <TableCell>{format(new Date(transfer.shipped_at), "yyyy/MM/dd HH:mm")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleStartReceiving(transfer.id)}
                            >
                              <Scan className="h-3 w-3" />
                              {t("startReceiving")}
                            </Button>
                            <Link href={`/transfers/${transfer.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Eye className="h-3 w-3" />
                                {t("transferDetails")}
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
