import React from "react";
import { Control, FieldPath, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useSignup } from "@/hooks/signupHandler";

const signupSchema = z.object({
  username: z.string().min(3, "Username is required").max(50),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {
  const signupMutation = useSignup();
  const form = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormInputs) => {
    signupMutation.mutate(data);
    navigate("/login");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <SignupFormField
          name="username"
          label="Username"
          placeholder="Username"
          description="At least 3 characters."
          inputType="text"
          formControl={form.control}
        />
        <SignupFormField
          name="password"
          label="Password"
          placeholder="Password"
          description="At least 8 characters."
          inputType="password"
          formControl={form.control}
        />
        <Button type="submit">Signup</Button>
      </form>
    </Form>
  );
};

type SignupFormFieldProps = {
  name: FieldPath<SignupFormInputs>;
  label: string;
  placeholder: string;
  description: string;
  inputType: string;
  formControl: Control<SignupFormInputs>;
};

const SignupFormField: React.FC<SignupFormFieldProps> = ({
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

export default SignupForm;
