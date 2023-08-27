"use client";

import React from "react";
import AuthFormContainer from "@components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import { filterFormikErrors } from "@/app/utils/formikHelpers";
import { toast } from "react-toastify";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid Email").required("Email is required!"),
  password: yup
    .string()
    .min(6, "Password must be 6 characters long.")
    .required("Password is required"),
});

export default function SignUp() {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      })
        .then(async (res) => {
          if (res.ok) {
            const { message } = (await res.json()) as { message: string };
            toast.success(message);
          }
          action.setSubmitting(false);
        })
        .catch((err) => {
          console.log("signup->", err);
        });
    },
  });

  const formErrors: string[] = filterFormikErrors(errors, touched, values);

  const { email, name, password } = values;

  return (
    <AuthFormContainer title="Create New Account" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="Name"
        crossOrigin={undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        value={name}
      />
      <Input
        name="email"
        label="Email"
        crossOrigin={undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        value={email}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        crossOrigin={undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        value={password}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Sign up
      </Button>
      <div className="">
        {formErrors.map((err) => {
          return (
            <div key={err} className="space-x-1 flex items-center text-red-500">
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
