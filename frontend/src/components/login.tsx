import React from "react";
import { Control, FieldPath, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLogin } from "@/hooks/loginHandler";

const loginSchema = z.object({
  username: z.string().min(3, "Username is required").max(50),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const loginMutation = useLogin();
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  //const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    loginMutation.mutate(data); //useMutation hook does not return a Promise that resolves when the mutation is complete
    //navigate("/profile");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <LoginFormField
          name="username"
          label="Username"
          placeholder="Username"
          description="At least 3 characters."
          inputType="text"
          formControl={form.control}
        />
        <LoginFormField
          name="password"
          label="Password"
          placeholder="Password"
          description="At least 8 characters."
          inputType="password"
          formControl={form.control}
        />
        <div className="space-x-3">
          <Button type="submit" className="bg-blue-500">
            Login
          </Button>
          <Button asChild type="submit" className="bg-green-600">
            <NavLink to="/signup">Create a new account</NavLink>
          </Button>
        </div>
      </form>
    </Form>
  );
};

type LoginFormFieldProps = {
  name: FieldPath<LoginFormInputs>;
  label: string;
  placeholder: string;
  description: string;
  inputType: string;
  formControl: Control<LoginFormInputs>;
};

const LoginFormField: React.FC<LoginFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={inputType || "text"}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LoginForm;
