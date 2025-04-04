import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
          <p className="text-sm text-muted-foreground">Nhập thông tin đăng nhập của bạn bên dưới</p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <a href="/register" className="underline underline-offset-4 hover:text-primary">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  )
}

