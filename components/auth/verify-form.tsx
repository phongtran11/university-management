"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { checkEmailVerified, verifyEmail } from "@/lib/auth"

const formSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Mã xác thực phải có 6 số.",
    })
    .max(6, {
      message: "Mã xác thực phải có 6 số.",
    })
    .regex(/^\d+$/, {
      message: "Mã xác thực chỉ được chứa số.",
    }),
})

export function VerifyForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  })

  // Check if email is already verified
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const isVerified = await checkEmailVerified()
        if (isVerified) {
          toast({
            title: "Email đã được xác thực",
            description: "Đang chuyển hướng đến trang chủ...",
          })
          router.push("/dashboard")
        }
      } catch (error) {
        // User is not verified or not logged in, stay on this page
      }
    }

    checkVerificationStatus()
  }, [router, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await verifyEmail(values.code)

      toast({
        title: "Xác thực thành công",
        description: "Email của bạn đã được xác thực.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xác thực thất bại",
        description: "Mã xác thực không chính xác hoặc đã hết hạn.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Nhập mã 6 số"
                  {...field}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang xác thực..." : "Xác thực"}
        </Button>
      </form>
    </Form>
  )
}

