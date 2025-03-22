"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  verifyEmailAction,
  checkEmailVerifiedAction,
  logoutAction,
} from "@/lib/auth";
import { APP_ROUTES } from "@/lib/constants";

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
});

export function VerifyForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  // Check if email is already verified
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const result = await checkEmailVerifiedAction();
        if (result.verified) {
          toast({
            title: "Email đã được xác thực",
            description: "Đang chuyển hướng đến trang chủ...",
          });
          router.push(APP_ROUTES.DASHBOARD);
        }
      } catch (error) {
        // User is not verified or not logged in, stay on this page
      }
    };

    checkVerificationStatus();
  }, [router, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await verifyEmailAction(values.code);

      if (result.success) {
        toast({
          variant: "success",
          title: "Xác thực thành công",
          description: "Email của bạn đã được xác thực.",
        });

        router.push(APP_ROUTES.DASHBOARD);
      } else {
        toast({
          variant: "destructive",
          title: "Xác thực thất bại",
          description: "Mã xác thực không chính xác hoặc đã hết hạn.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xác thực thất bại",
        description: "Đã xảy ra lỗi khi xác thực.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleExit = async () => {
    setIsExiting(true);
    try {
      // Clear the tokens and redirect to login
      await logoutAction();
      toast({
        title: "Đã thoát khỏi quá trình xác thực",
        description: "Bạn sẽ cần đăng nhập lại để tiếp tục.",
      });
      router.push(APP_ROUTES.LOGIN);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi",
        description: "Không thể thoát khỏi quá trình xác thực.",
      });
    } finally {
      setIsExiting(false);
    }
  };

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
        <div className="flex flex-col space-y-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xác thực..." : "Xác thực"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleExit}
            disabled={isExiting}
          >
            {isExiting ? "Đang thoát..." : "Thoát và đăng nhập lại"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
