import { LayoutDashboard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function EmptyDashboard() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center rounded-full bg-primary/10 p-3 w-12 h-12 mb-4">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-center">Chào mừng đến với Dashboard</CardTitle>
          <CardDescription className="text-center">
            Đây là trang dashboard trống. Bạn có thể bắt đầu thêm nội dung vào đây.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Dashboard này hiện đang trống. Bạn có thể thêm các widget, biểu đồ hoặc dữ liệu khác để theo dõi và quản lý.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button>Bắt đầu</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

