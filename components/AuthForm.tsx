"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "./ui/form";

type FormType = "sign-up" | "sign-in";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName: formType === "sign-up" ? z.string().min(3) : z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-up" ? "Sign Up" : "Sign In"}
          </h1>
        </form>
      </Form>
    </>
  );
};

export default AuthForm;
