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

  originalPrice: z
    .number({ required_error: "Product originalPrice is required" })
    .positive({ message: "Product originalPrice must be a positive value" }),

  category: z
    .string({ required_error: "Product category is required" })
    .trim()
    .min(3, { message: "Product category must be at least 3 characters" })
    .max(50, {
      message: "Product category must not be more than 50 characters",
    }),
  subcategory: z
    .string({ required_error: "Product subcategory is required" })
    .trim()
    .min(3, { message: "Product subcategory must be at least 3 characters" })
    .max(50, {
      message: "Product subcategory must not be more than 50 characters",
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

  weight: z
    .number()
    .nonnegative({ message: "Weight cannot be negative" })
    .optional(),

  dimensions: z
    .object({
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),

  size: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),

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

  warranty: z.string().optional(),
  batteryLife: z.string().optional(),
  features: z.array(z.string()).optional(),
  resolution: z.string().optional(),
  processor: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),

  rating: z.number().min(0).max(5).optional(),

  isFeatured: z.boolean().optional(),

  tags: z.array(z.string()).optional(),

  availability: z.enum(["In Stock", "Out of Stock", "Preorder"]).optional(),

  vendor: z.string().optional(),

  shippingDetails: z
    .object({
      isFreeShipping: z.boolean().optional(),
      shippingCost: z
        .number()
        .nonnegative({ message: "Shipping cost cannot be negative" })
        .optional(),
      shippingRegions: z.array(z.string()).optional(),
    })
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
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .optional(),
  // Added generalSpecifications
  generalSpecifications: z
    .array(
      z.object({
        key: z
          .string({ required_error: "Specification key is required" })
          .min(1, { message: "Specification key cannot be empty" }),
        value: z
          .string({ required_error: "Specification value is required" })
          .min(1, { message: "Specification value cannot be empty" }),
      })
    )
    .optional(),

  InTheBox: z.string().optional(),
  ModelNumber: z.string().optional(),
  ModelName: z.string().optional(),
  SIMType: z.string().optional(),
  HybridSimSlot: z.string().optional(),
  Touchscreen: z.string().optional(),
  OTGCompatible: z.string().optional(),
  QuickCharging: z.string().optional(),
  DisplaySize: z.string().optional(),
  ResolutionType: z.string().optional(),
  GPU: z.string().optional(),
  OtherDisplayFeatures: z.string().optional(),
  DisplayType: z.string().optional(),
  HDGameSupport: z.string().optional(),
  OperatingSystem: z.string().optional(),
  ProcessorBrand: z.string().optional(),
  ProcessorType: z.string().optional(),
  ProcessorCore: z.string().optional(),
  PrimaryClockSpeed: z.string().optional(),
  SecondaryClockSpeed: z.string().optional(),
  OperatingFrequency: z.string().optional(),
  InternalStorage: z.string().optional(),
  RAM: z.string().optional(),
  TotalMemory: z.string().optional(),
  PrimaryCamera: z.string().optional(),
  PrimaryCameraFeatures: z.string().optional(),
  SecondaryCamera: z.string().optional(),
  VideoRecordingResolution: z.string().optional(),
  DigitalZoom: z.string().optional(),
  FrameRate: z.string().optional(),
  DualCameraLens: z.string().optional(),
  OpticalZoom: z.string().optional(),
  SecondaryCameraAvailable: z.string().optional(),
  Flash: z.string().optional(),
  HDRecording: z.string().optional(),
  FullHDRecording: z.string().optional(),
  VideoRecording: z.string().optional(),
});

export const updateProductSchemaValidation = z.object({
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

  originalPrice: z
    .number({ required_error: "Product originalPrice is required" })
    .positive({ message: "Product originalPrice must be a positive value" }),

  category: z
    .string({ required_error: "Product category is required" })
    .trim()
    .min(3, { message: "Product category must be at least 3 characters" })
    .max(50, {
      message: "Product category must not be more than 50 characters",
    }),
  subcategory: z
    .string({ required_error: "Product subcategory is required" })
    .trim()
    .min(3, { message: "Product subcategory must be at least 3 characters" })
    .max(50, {
      message: "Product subcategory must not be more than 50 characters",
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

  weight: z
    .number()
    .nonnegative({ message: "Weight cannot be negative" })
    .optional(),

  dimensions: z
    .object({
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),

  size: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),

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

  warranty: z.string().optional(),
  batteryLife: z.string().optional(),
  features: z.array(z.string()).optional(),
  resolution: z.string().optional(),
  processor: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),

  rating: z.number().min(0).max(5).optional(),

  isFeatured: z.boolean().optional(),

  tags: z.array(z.string()).optional(),

  availability: z.enum(["In Stock", "Out of Stock", "Preorder"]).optional(),

  vendor: z.string().optional(),

  shippingDetails: z
    .object({
      isFreeShipping: z.boolean().optional(),
      shippingCost: z
        .number()
        .nonnegative({ message: "Shipping cost cannot be negative" })
        .optional(),
      shippingRegions: z.array(z.string()).optional(),
    })
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
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .optional(),
  // Added generalSpecifications
  generalSpecifications: z
    .array(
      z.object({
        key: z
          .string({ required_error: "Specification key is required" })
          .min(1, { message: "Specification key cannot be empty" }),
        value: z
          .string({ required_error: "Specification value is required" })
          .min(1, { message: "Specification value cannot be empty" }),
      })
    )
    .optional(),

  InTheBox: z.string().optional(),
  ModelNumber: z.string().optional(),
  ModelName: z.string().optional(),
  SIMType: z.string().optional(),
  HybridSimSlot: z.string().optional(),
  Touchscreen: z.string().optional(),
  OTGCompatible: z.string().optional(),
  QuickCharging: z.string().optional(),
  DisplaySize: z.string().optional(),
  ResolutionType: z.string().optional(),
  GPU: z.string().optional(),
  OtherDisplayFeatures: z.string().optional(),
  DisplayType: z.string().optional(),
  HDGameSupport: z.string().optional(),
  OperatingSystem: z.string().optional(),
  ProcessorBrand: z.string().optional(),
  ProcessorType: z.string().optional(),
  ProcessorCore: z.string().optional(),
  PrimaryClockSpeed: z.string().optional(),
  SecondaryClockSpeed: z.string().optional(),
  OperatingFrequency: z.string().optional(),
  InternalStorage: z.string().optional(),
  RAM: z.string().optional(),
  TotalMemory: z.string().optional(),
  PrimaryCamera: z.string().optional(),
  PrimaryCameraFeatures: z.string().optional(),
  SecondaryCamera: z.string().optional(),
  VideoRecordingResolution: z.string().optional(),
  DigitalZoom: z.string().optional(),
  FrameRate: z.string().optional(),
  DualCameraLens: z.string().optional(),
  OpticalZoom: z.string().optional(),
  SecondaryCameraAvailable: z.string().optional(),
  Flash: z.string().optional(),
  HDRecording: z.string().optional(),
  FullHDRecording: z.string().optional(),
  VideoRecording: z.string().optional(),
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

export const createOrderSchemaValidation = z.object({
  items: z
    .array(
      z.object({
        product: z
          .string({ required_error: "Product ID is required" })
          .trim()
          .min(1, { message: "Product ID cannot be empty" })
          .regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid product ID format" }), // MongoDB ObjectId format
        quantity: z
          .number({ required_error: "Quantity is required" })
          .int({ message: "Quantity must be an integer" })
          .min(1, { message: "Quantity must be at least 1" })
          .max(100, { message: "Quantity cannot exceed 100 per item" }),
        color: z
          .string()
          .trim()
          // .regex(/^#?[a-fA-F0-9]{3,6}$/, { message: "Invalid color format" })
          .optional(),
      })
    )
    .nonempty({ message: "Order must contain at least one item" }),

  shippingDetails: z.object({
    address: z
      .string({ required_error: "Shipping address is required" })
      .trim()
      .min(5, { message: "Shipping address must be at least 5 characters" })
      .max(255, { message: "Shipping address cannot exceed 255 characters" }),
    city: z
      .string({ required_error: "City is required" })
      .trim()
      .min(2, { message: "City must be at least 2 characters" })
      .max(100, { message: "City cannot exceed 100 characters" }),
    state: z
      .string({ required_error: "State is required" })
      .trim()
      .min(2, { message: "State must be at least 2 characters" })
      .max(100, { message: "State cannot exceed 100 characters" }),
    postalCode: z
      .string({ required_error: "Postal code is required" })
      .trim()
      .regex(/^[a-zA-Z0-9\- ]{4,10}$/, {
        message:
          "Postal code must be 4 to 10 characters (letters, numbers, dashes allowed)",
      }),
    country: z
      .string({ required_error: "Country is required" })
      .trim()
      .min(2, { message: "Country must be at least 2 characters" })
      .max(100, { message: "Country cannot exceed 100 characters" }),
  }),

  paymentDetails: z
    .object({
      method: z.enum(["Credit Card", "PayPal", "Cash on Delivery", "card"], {
        required_error: "Payment method is required",
      }),
      status: z
        .enum(["Pending", "Paid", "Failed", "Refunded"])
        .default("Pending"),
      transactionId: z
        .string()
        .trim()
        .min(8, { message: "Transaction ID must be at least 8 characters" })
        .max(50, { message: "Transaction ID cannot exceed 50 characters" })
        .regex(/^[a-zA-Z0-9\-_]+$/, {
          message:
            "Transaction ID can only contain letters, numbers, dashes, and underscores",
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      // Ensure transaction ID is required for non-Cash on Delivery methods
      if (data.method !== "Cash on Delivery" && !data.transactionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Transaction ID is required for non-Cash on Delivery payments",
          path: ["transactionId"],
        });
      }

      // Prevent Cash on Delivery from having a transaction ID
      if (data.method === "Cash on Delivery" && data.transactionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cash on Delivery should not have a transaction ID",
          path: ["transactionId"],
        });
      }
    }),

  discount: z
    .object({
      percentage: z
        .number()
        .min(0, { message: "Discount percentage cannot be less than 0" })
        .max(100, { message: "Discount percentage cannot exceed 100" })
        .optional(),
      amount: z
        .number()
        .min(0, { message: "Discount amount cannot be less than 0" })
        .optional(),
    })
    .optional()
    .superRefine((discount, ctx) => {
      if (discount?.percentage && discount?.amount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Provide either discount percentage or discount amount, not both",
        });
      }
    }),
});

export const updateOrderSchemaValidation = z.object({
  orderStatus: z
    .enum(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], {
      required_error: "Order status is required",
    })
    .optional(),

  paymentStatus: z
    .enum(["Pending", "Paid", "Failed", "Refunded"], {
      required_error: "Payment status is required",
    })
    .optional(),

  trackingDetails: z
    .object({
      carrier: z
        .string()
        .trim()
        .min(2, { message: "Carrier must be at least 2 characters" })
        .optional(),
      trackingNumber: z
        .string()
        .trim()
        .min(5, { message: "Tracking number must be at least 5 characters" })
        .optional(),
      estimatedDelivery: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Estimated delivery must be a valid date",
        })
        .optional(),
    })
    .optional(),
});

export const cancelOrderSchemaValidation = z.object({
  reason: z
    .string()
    .trim()
    .min(5, { message: "Cancellation reason must be at least 5 characters" })
    .optional(),
});

export const updateAddressSchemaValidation = z.object({
  address: z
    .string({ required_error: "Address is required" })
    .trim()
    .min(5, { message: "Address must be at least 5 characters" })
    .optional(),
  city: z
    .string({ required_error: "City is required" })
    .trim()
    .min(2, { message: "City must be at least 2 characters" })
    .optional(),
  state: z
    .string({ required_error: "State is required" })
    .trim()
    .min(2, { message: "State must be at least 2 characters" })
    .optional(),
  postalCode: z
    .string({ required_error: "Postal code is required" })
    .trim()
    .regex(/^\d{4,6}$/, { message: "Postal code must be 4 to 6 digits" })
    .optional(),
  country: z
    .string({ required_error: "Country is required" })
    .trim()
    .min(2, { message: "Country must be at least 2 characters" })
    .optional(),
});

export const addressSchemaValidation = z.object({
  fullName: z.string().optional(),
  phone: z
    .string({ required_error: "Phone number is required." })
    .min(10)
    .max(15),
  addressLine1: z
    .string({ required_error: "Address Line 1 is required." })
    .min(1),
  addressLine2: z.string().optional(),
  city: z.string({ required_error: "City is required." }).min(1),
  state: z.string({ required_error: "State is required." }).min(1),
  postalCode: z.string({ required_error: "Postal code is required." }).min(1),
  country: z.string({ required_error: "Country is required." }).min(1),
  isDefault: z.boolean().optional(),
});
