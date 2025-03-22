import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Đăng ký tài khoản</h1>
          <p className="text-sm text-muted-foreground">Nhập thông tin của bạn để tạo tài khoản</p>
        </div>
        <RegisterForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <a href="/login" className="underline underline-offset-4 hover:text-primary">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  )
}

