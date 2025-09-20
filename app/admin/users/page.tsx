"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, User, Clock, Edit, Trash2 } from "lucide-react"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewUserOpen, setIsNewUserOpen] = useState(false)
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "علی احمدی",
      username: "ali.ahmadi",
      email: "ali@example.com",
      role: "مدیر",
      store: "فروشگاه مرکزی",
      status: "فعال",
      lastLogin: "1403/08/15 - 14:30",
      permissions: ["مدیریت کاربران", "مدیریت انبار", "فروش", "گزارشات"],
    },
    {
      id: 2,
      name: "فاطمه محمدی",
      username: "fateme.mohammadi",
      email: "fateme@example.com",
      role: "فروشنده",
      store: "فروشگاه شعبه 1",
      status: "فعال",
      lastLogin: "1403/08/15 - 12:15",
      permissions: ["فروش", "مشاهده موجودی"],
    },
  ])
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "",
    store: "",
    permissions: [] as string[],
  })

  const showToast = (message: string, type: "success" | "error" = "success") => {
    alert(message)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "مدیر":
        return "bg-red-100 text-red-800 border-red-200"
      case "فروشنده":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "انباردار":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.username || !newUser.email || !newUser.role) {
      showToast("لطفاً تمام فیلدهای الزامی را پر کنید", "error")
      return
    }

    const user = {
      id: users.length + 1,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role === "admin" ? "مدیر" : newUser.role === "seller" ? "فروشنده" : "انباردار",
      store: newUser.store === "main" ? "فروشگاه مرکزی" : newUser.store === "branch1" ? "شعبه 1" : "شعبه 2",
      status: "فعال",
      lastLogin: "هرگز",
      permissions: newUser.permissions,
    }

    setUsers([...users, user])
    setNewUser({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "",
      store: "",
      permissions: [],
    })
    setIsNewUserOpen(false)

    showToast("کاربر جدید با موفقیت اضافه شد")
  }

  const handleDeleteUser = (userId: number) => {
    if (window.confirm("آیا از حذف این کاربر اطمینان دارید؟")) {
      setUsers(users.filter((user) => user.id !== userId))
      showToast("کاربر با موفقیت حذف شد")
    }
  }

  const togglePermission = (permission: string) => {
    setNewUser((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }))
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
        <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              کاربر جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>افزودن کاربر جدید</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نام و نام خانوادگی</Label>
                <Input
                  placeholder="نام کاربر"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>نام کاربری</Label>
                <Input
                  placeholder="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>ایمیل</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>رمز عبور</Label>
                <Input
                  type="password"
                  placeholder="رمز عبور"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>نقش</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب نقش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">مدیر</SelectItem>
                    <SelectItem value="seller">فروشنده</SelectItem>
                    <SelectItem value="warehouse">انباردار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>فروشگاه</Label>
                <Select value={newUser.store} onValueChange={(value) => setNewUser({ ...newUser, store: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب فروشگاه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">فروشگاه مرکزی</SelectItem>
                    <SelectItem value="branch1">شعبه 1</SelectItem>
                    <SelectItem value="branch2">شعبه 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label className="text-base font-medium">دسترسی‌ها</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {["مدیریت کاربران", "مدیریت انبار", "فروش", "گزارشات", "مدیریت مشتریان", "تنظیمات قیمت"].map(
                    (permission) => (
                      <div key={permission} className="flex items-center space-x-2 space-x-reverse">
                        <Switch
                          id={permission}
                          checked={newUser.permissions.includes(permission)}
                          onCheckedChange={() => togglePermission(permission)}
                        />
                        <Label htmlFor={permission} className="text-sm">
                          {permission}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsNewUserOpen(false)}>
                انصراف
              </Button>
              <Button onClick={handleCreateUser}>ذخیره</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="جستجو بر اساس نام، نام کاربری یا ایمیل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="فیلتر بر اساس نقش" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه نقش‌ها</SelectItem>
            <SelectItem value="admin">مدیر</SelectItem>
            <SelectItem value="seller">فروشنده</SelectItem>
            <SelectItem value="warehouse">انباردار</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>کاربر</TableHead>
              <TableHead>نقش</TableHead>
              <TableHead>فروشگاه</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>آخرین ورود</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>{user.store}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Clock className="w-3 h-3 ml-1" />
                    {user.lastLogin}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => showToast("ویرایش کاربر به‌زودی اضافه می‌شود")}
                      title="به‌زودی"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
