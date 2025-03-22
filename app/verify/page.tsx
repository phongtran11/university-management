import { VerifyForm } from "@/components/auth/verify-form";

export default async function VerifyPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Xác thực tài khoản
          </h1>
          <p className="text-sm text-muted-foreground">
            Nhập mã xác thực 6 số đã được gửi đến email của bạn
          </p>
        </div>
        <VerifyForm />
      </div>
    </div>
  );
}
