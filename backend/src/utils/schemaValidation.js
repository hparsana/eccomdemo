import { z } from "zod";

export const signUpSchemaValidation = z.object({
  username: z
    .string({ required_error: "userName is required" })
    .trim()
    .min(4, { message: "username must be at least 4 character" })
    .max(50, { message: "userName must not be more than 50 letters" }),

  email: z
    .string({ required_error: "email is required" })
    .trim()
    .email({ message: "invalid email address" })
    .min(4, { message: "email must be at least 4 character" })
    .max(250, { message: "email must not be more than 50 letters" }),

  fullname: z
    .string({ required_error: "fullName is required" })
    .trim()
    .min(4, { message: "fullName must be at least 4 character" })
    .max(50, { message: "fullName must not be more than 50 letters" }),

  password: z
    .string({ required_error: "password is required" })
    .min(6, { message: "password must be at least 6 character" })
    .max(50, { message: "password must not be more than 50 letters" }),
});

const dateOnlySchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" });

export const addProductSchemaValidation = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .trim()
    .min(3, { message: "Product name must be at least 3 characters" })
    .max(100, { message: "Product name must not be more than 100 characters" }),

  description: z
    .string({ required_error: "Product description is required" })
    .trim()
    .min(10, { message: "Product description must be at least 10 characters" })
    .max(500, {
      message: "Product description must not be more than 500 characters",
    }),

  price: z
    .number({ required_error: "Product price is required" })
    .positive({ message: "Product price must be a positive value" }),

  category: z
    .string({ required_error: "Product category is required" })
    .trim()
    .min(3, { message: "Product category must be at least 3 characters" })
    .max(50, {
      message: "Product category must not be more than 50 characters",
    }),

  brand: z
    .string({ required_error: "Brand is required" })
    .trim()
    .min(2, { message: "Brand must be at least 2 characters" })
    .max(50, { message: "Brand must not be more than 50 characters" }),

  stock: z
    .number({ required_error: "Stock is required" })
    .int({ message: "Stock must be an integer" })
    .nonnegative({ message: "Stock cannot be negative" }),

  images: z
    .array(
      z.object({
        url: z
          .string({ required_error: "Image URL is required" })
          .url({ message: "Invalid URL for the image" }),
        alt: z.string().optional(),
      })
    )
    .min(1, { message: "At least one image is required" }),

  discount: z
    .object({
      percentage: z
        .number()
        .min(0, { message: "Discount percentage must be at least 0" })
        .max(100, { message: "Discount percentage cannot exceed 100" })
        .optional(),
      amount: z
        .number()
        .min(0, { message: "Discount amount must be at least 0" })
        .optional(),
      startDate: dateOnlySchema.optional(),
      endDate: dateOnlySchema.optional(),
    })
    .partial()
    .optional(),
});

export const updateProductSchemaValidation = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Product name must be at least 3 characters" })
    .max(100, { message: "Product name must not be more than 100 characters" })
    .optional(),

  description: z
    .string()
    .trim()
    .min(10, { message: "Product description must be at least 10 characters" })
    .max(500, {
      message: "Product description must not be more than 500 characters",
    })
    .optional(),

  price: z
    .number()
    .positive({ message: "Product price must be a positive value" })
    .optional(),

  category: z
    .string()
    .trim()
    .min(3, { message: "Product category must be at least 3 characters" })
    .max(50, {
      message: "Product category must not be more than 50 characters",
    })
    .optional(),

  brand: z
    .string()
    .trim()
    .min(2, { message: "Brand must be at least 2 characters" })
    .max(50, { message: "Brand must not be more than 50 characters" })
    .optional(),

  stock: z
    .number()
    .int({ message: "Stock must be an integer" })
    .nonnegative({ message: "Stock cannot be negative" })
    .optional(),

  images: z
    .array(
      z.object({
        url: z.string().url({ message: "Invalid URL for the image" }),
        alt: z.string().optional(),
      })
    )
    .min(1, { message: "At least one image is required" })
    .optional(),

  discount: z
    .object({
      percentage: z
        .number()
        .min(0, { message: "Discount percentage must be at least 0" })
        .max(100, { message: "Discount percentage cannot exceed 100" })
        .optional(),
      amount: z
        .number()
        .min(0, { message: "Discount amount must be at least 0" })
        .optional(),
      startDate: dateOnlySchema.optional(),
      endDate: dateOnlySchema.optional(),
    })
    .partial()
    .optional(),
});

export const addReviewSchemaValidation = z.object({
  rating: z
    .number({ required_error: "Rating is required" })
    .min(0, { message: "Rating cannot be less than 0" })
    .max(5, { message: "Rating cannot be more than 5" }),

  comment: z
    .string({ required_error: "Comment is required" })
    .trim()
    .min(5, { message: "Comment must be at least 5 characters" })
    .max(500, { message: "Comment must not exceed 500 characters" }),
});

export const updateReviewSchemaValidation = z.object({
  rating: z
    .number()
    .min(0, { message: "Rating cannot be less than 0" })
    .max(5, { message: "Rating cannot be more than 5" })
    .optional(),

  comment: z
    .string()
    .trim()
    .min(5, { message: "Comment must be at least 5 characters" })
    .max(500, { message: "Comment must not exceed 500 characters" })
    .optional(),
});

export const updateUserSchemaValidation = z.object({
  fullname: z
    .string()
    .trim()
    .min(3, { message: "Fullname must be at least 3 characters" })
    .max(50, { message: "Fullname must not exceed 50 characters" })
    .optional(),

  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must not exceed 50 characters" })
    .optional(),

  email: z
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .optional(),

  role: z
    .enum(["ADMIN", "USER"], {
      invalid_type_error: "Role must be ADMIN or USER",
    })
    .optional(),
});
