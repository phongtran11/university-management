"use client";

import { Fragment, useState } from "react";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { registerAction } from "@/lib/auth";
import { APP_ROUTES } from "@/lib/constants";
import { Eye, EyeOff } from "lucide-react";

// Validate Vietnamese phone number
const vnPhoneRegex = /^(0|\+84)(\d{9,10})$/;

const formSchema = z
  .object({
    email: z.string().email({
      message: "Email không hợp lệ.",
    }),
    password: z.string().min(8, {
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    }),
    confirm_password: z.string().min(1, {
      message: "Vui lòng xác nhận mật khẩu.",
    }),
    phone_number: z
      .string()
      .regex(vnPhoneRegex, {
        message: "Số điện thoại không hợp lệ.",
      })
      .optional()
      .or(z.literal("")),
    first_name: z.string().min(1, {
      message: "Vui lòng nhập tên.",
    }),
    last_name: z.string().min(1, {
      message: "Vui lòng nhập họ.",
    }),
    date_of_birth: z.string().optional().or(z.literal("")),
    gender: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirm_password"],
  });

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Transform the data to match the expected format
      const { confirm_password, ...dataToSubmit } = values;
      const formattedValues = {
        ...dataToSubmit,
        phone_number: dataToSubmit.phone_number
          ? dataToSubmit.phone_number
          : null,
        date_of_birth: dataToSubmit.date_of_birth
          ? new Date(dataToSubmit.date_of_birth)
          : null,
        gender: dataToSubmit.gender
          ? Number.parseInt(dataToSubmit.gender)
          : null,
      };
      const result = await registerAction(formattedValues);

      if (result.success) {
        toast({
          variant: "success",
          title: "Đăng ký thành công",
          description: "Vui lòng xác thực email của bạn.",
        });

        router.push(APP_ROUTES.VERIFY);
      } else if (result.error === "email already exists") {
        toast({
          variant: "destructive",
          title: "Đăng ký thất bại",
          description: "Email đã tồn tại. Vui lòng sử dụng email khác.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Đăng ký thất bại",
          description: "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đăng ký thất bại",
        description: "Đã xảy ra lỗi khi đăng ký.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <div className="relative" key={showPassword ? "show" : "hide"}>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input placeholder="0912345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Nam</SelectItem>
                    <SelectItem value="2">Nữ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
      </form>
    </Form>
  );
}
