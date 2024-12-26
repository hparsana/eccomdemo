import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Discount } from "../models/discount.model.js";
import mongoose from "mongoose";

const AddProduct = asyncHandler(async (req, res) => {
  console.log("Incoming request body <<<<<<<<<", req.body);

  const {
    name,
    description,
    price,
    originalPrice,
    category,
    brand,
    stock,
    weight,
    dimensions,
    size = [],
    color = [],
    images = [],
    warranty,
    batteryLife,
    features = [],
    resolution,
    processor,
    ram,
    storage,
    rating,
    isFeatured = false,
    tags = [],
    availability,
    vendor,
    shippingDetails = {},
    discount = {}, // Optional discount details
    generalSpecifications = [], // Add generalSpecifications here
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !description ||
    !price ||
    !category ||
    !brand ||
    stock === undefined
  ) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  // Validate discount details, if provided
  if (
    discount.percentage &&
    (discount.percentage < 0 || discount.percentage > 100)
  ) {
    throw new ApiError(400, "Discount percentage must be between 0 and 100.");
  }
  if (
    discount.startDate &&
    discount.endDate &&
    new Date(discount.startDate) > new Date(discount.endDate)
  ) {
    throw new ApiError(400, "Discount start date must be before the end date.");
  }

  // Validate generalSpecifications, if provided
  if (generalSpecifications.length > 0) {
    const invalidSpecifications = generalSpecifications.filter(
      (spec) => !spec.key || !spec.value
    );
    if (invalidSpecifications.length > 0) {
      throw new ApiError(
        400,
        "Each general specification must have both a key and a value."
      );
    }
  }

  let featureValid = false;
  if (Array.isArray(features) && features.length !== 0) {
    featureValid = true;
  }

  // Create product
  const product = new Product({
    name,
    description,
    price,
    originalPrice,
    category,
    brand,
    stock,
    weight,
    dimensions,
    size,
    color,
    images,
    warranty,
    batteryLife,
    features,
    resolution,
    processor,
    ram,
    storage,
    rating,
    isFeatured: featureValid,
    tags,
    availability,
    vendor,
    shippingDetails,
    generalSpecifications, // Add this field to the product
  });

  await product.save();

  // If discount details are provided, create a discount entry
  if (discount.percentage || discount.amount) {
    const productDiscount = new Discount({
      product: product._id,
      percentage: discount.percentage,
      amount: discount.amount,
      startDate: discount.startDate || Date.now(),
      endDate: discount.endDate,
      isActive: true,
    });

    await productDiscount.save();
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { product }, "Product added successfully"));
});

const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "-createdAt",
    category,
    brand,
    minPrice,
    maxPrice,
    search,
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const query = {};

  if (category) query.category = { $regex: category, $options: "i" };
  if (brand) query.brand = { $regex: brand, $options: "i" };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  // Parallel execution of queries
  const [products, totalProducts, categories, brands] = await Promise.all([
    Product.find(query)
      .sort(sort)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean(), // Fetch plain objects for easier merging
    Product.countDocuments(query),
    Product.distinct("category", query),
    Product.distinct("brand", query),
  ]);

  // Fetch discount data for the products
  const productIds = products.map((product) => product._id);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0); // Start of today

  const discounts = await Discount.find({
    product: { $in: productIds },
    endDate: { $gte: startOfToday },
  }).lean();

  // Merge discount data with products
  const productsWithDiscounts = products.map((product) => {
    const discount = discounts.find(
      (disc) => disc.product.toString() === product._id.toString()
    );
    return {
      ...product,
      discount: discount
        ? {
            percentage: discount.percentage,
            amount: discount.amount,
            startDate: discount.startDate,
            endDate: discount.endDate,
            isActive: discount.isActive,
          }
        : null, // No discount for this product
    };
  });

  return res.status(200).json(
    new ApiResponse(200, {
      products: productsWithDiscounts,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitNumber),
      currentPage: pageNumber,
      facets: {
        categories,
        brands,
        priceRange: {
          min: minPrice || 0,
          max: maxPrice || 1000,
        },
      },
    })
  );
});

const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    throw new ApiError(400, "Product ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Product ID format");
  }

  // Fetch product details
  const product = await Product.findById(id).lean();
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Fetch discount details if available
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const discount = await Discount.findOne({
    product: id,
    endDate: { $gte: startOfToday },
  }).lean();

  // Fetch similar products
  const similarProducts = await Product.find({
    $or: [{ brand: product.brand }, { category: product.category }],
    _id: { $ne: id },
  })
    .limit(4)
    .lean();

  // Fetch "You might be interested in" products
  const youMightBeInterestedIn = await Product.find({
    category: product.category, // Match the same category
    _id: { $ne: id }, // Exclude the current product
  })
    .sort({ views: -1 }) // Example: Sort by most viewed products
    .limit(4)
    .lean();

  // Merge all data
  const productWithAdditionalData = {
    ...product,
    discount: discount
      ? {
          percentage: discount.percentage,
          amount: discount.amount,
          startDate: discount.startDate,
          endDate: discount.endDate,
          isActive: discount.isActive,
        }
      : null,
    similarProducts,
    youMightBeInterestedIn,
  };

  // Return the product with additional details
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        productWithAdditionalData,
        "Product fetched successfully"
      )
    );
});

const deleteProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Product ID format");
  }

  // Find and delete the product
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Optionally delete associated discounts
  await Discount.deleteMany({ product: id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

const updateProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    originalPrice,
    category,
    brand,
    stock,
    weight,
    dimensions,
    size = [],
    color = [],
    images,
    warranty,
    batteryLife,
    features = [],
    resolution,
    processor,
    ram,
    storage,
    rating,
    isFeatured,
    tags = [],
    availability,
    vendor,
    shippingDetails = {},
    discount,
    generalSpecifications = [], // Added generalSpecifications here
  } = req.body;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Product ID format");
  }

  // Find the product
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Update product fields
  if (name) product.name = name;
  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (originalPrice !== undefined) product.originalPrice = originalPrice;
  if (category) product.category = category;
  if (brand) product.brand = brand;
  if (stock !== undefined) product.stock = stock;
  if (weight !== undefined) product.weight = weight;
  if (dimensions) product.dimensions = dimensions;
  if (size.length > 0) product.size = size;
  if (color.length > 0) product.color = color;
  if (images && Array.isArray(images)) product.images = images;
  if (warranty) product.warranty = warranty;
  if (batteryLife) product.batteryLife = batteryLife;
  if (features.length > 0) product.features = features;
  if (resolution) product.resolution = resolution;
  if (processor) product.processor = processor;
  if (ram) product.ram = ram;
  if (storage) product.storage = storage;
  if (rating !== undefined) product.rating = rating;
  if (isFeatured !== undefined) product.isFeatured = isFeatured;
  if (tags.length > 0) product.tags = tags;
  if (availability) product.availability = availability;
  if (vendor) product.vendor = vendor;
  if (Object.keys(shippingDetails).length > 0)
    product.shippingDetails = shippingDetails;

  // Update generalSpecifications if provided
  if (generalSpecifications.length > 0) {
    // Validate generalSpecifications
    const invalidSpecifications = generalSpecifications.filter(
      (spec) => !spec.key || !spec.value
    );
    if (invalidSpecifications.length > 0) {
      throw new ApiError(
        400,
        "Each general specification must have both a key and a value."
      );
    }
    product.generalSpecifications = generalSpecifications;
  }

  // Save the updated product
  await product.save();

  // Update discount details, if provided
  if (discount) {
    if (
      discount.percentage &&
      (discount.percentage < 0 || discount.percentage > 100)
    ) {
      throw new ApiError(400, "Discount percentage must be between 0 and 100");
    }
    if (
      discount.startDate &&
      discount.endDate &&
      new Date(discount.startDate) > new Date(discount.endDate)
    ) {
      throw new ApiError(
        400,
        "Discount start date must be before the end date"
      );
    }

    // Check if a discount exists for the product
    let productDiscount = await Discount.findOne({ product: id });

    if (productDiscount) {
      // Update existing discount
      if (discount.percentage !== undefined)
        productDiscount.percentage = discount.percentage;
      if (discount.amount !== undefined)
        productDiscount.amount = discount.amount;
      if (discount.startDate !== undefined)
        productDiscount.startDate = discount.startDate;
      if (discount.endDate !== undefined)
        productDiscount.endDate = discount.endDate;

      productDiscount.isActive =
        new Date(discount.endDate) >= new Date() ? true : false;

      await productDiscount.save();
    } else if (discount.percentage || discount.amount) {
      // Create a new discount if no discount exists
      productDiscount = new Discount({
        product: id,
        percentage: discount.percentage,
        amount: discount.amount,
        startDate: discount.startDate || Date.now(),
        endDate: discount.endDate,
        isActive: new Date(discount.endDate) >= new Date(),
      });
      await productDiscount.save();
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product updated successfully"));
});

const deleteDiscount = asyncHandler(async (req, res) => {
  const { discountId } = req.params;

  // Validate discount ID
  if (!mongoose.Types.ObjectId.isValid(discountId)) {
    throw new ApiError(400, "Invalid Discount ID format.");
  }

  // Find and delete the discount
  const discount = await Discount.findByIdAndDelete(discountId);
  if (!discount) {
    throw new ApiError(404, "Discount not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Discount deleted successfully."));
});

const getAllDiscounts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "-createdAt",
    search = "",
    isActive,
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Build query object
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } }, // Assuming discounts have a `name` field
      { description: { $regex: search, $options: "i" } }, // Assuming discounts have a `description` field
    ];
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true"; // Convert string to boolean
  }

  // Fetch data and count in parallel
  const [discounts, totalDiscounts] = await Promise.all([
    Discount.find(query)
      .sort(sort)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate({
        path: "product", // Populate the `product` field
        select: "name price category brand", // Select specific fields from the product
      })
      .lean(), // Use lean() for better performance when only reading data
    Discount.countDocuments(query),
  ]);

  // Pagination metadata
  const totalPages = Math.ceil(totalDiscounts / limitNumber);

  // Send response
  return res.status(200).json(
    new ApiResponse(200, {
      discounts,
      totalDiscounts,
      totalPages,
      currentPage: pageNumber,
    })
  );
});

export {
  AddProduct,
  getProducts,
  getProductById,
  deleteProductById,
  updateProductById,
  deleteDiscount,
  getAllDiscounts,
};
