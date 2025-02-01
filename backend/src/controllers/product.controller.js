import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Discount } from "../models/discount.model.js";
import mongoose from "mongoose";
import { addLogActivity } from "../controllers/user.controller.js";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const AddProduct = asyncHandler(async (req, res) => {
  console.log("Incoming request body <<<<<<<<<", req.body);

  const {
    name,
    description,
    price,
    originalPrice,
    category,
    subcategory,
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
    InTheBox,
    ModelNumber,
    ModelName,
    SIMType,
    HybridSimSlot = "Yes",
    Touchscreen = "Yes",
    OTGCompatible = "Yes",
    QuickCharging = "Yes",
    DisplaySize,
    Resolution: displayResolution, // Alias to avoid conflict
    ResolutionType,
    GPU,
    OtherDisplayFeatures,
    DisplayType,
    HDGameSupport = "Yes",
    OperatingSystem,
    ProcessorBrand,
    ProcessorType,
    ProcessorCore,
    PrimaryClockSpeed,
    SecondaryClockSpeed,
    OperatingFrequency,
    InternalStorage,
    RAM: ramCapacity, // Alias for clarity
    TotalMemory,
    PrimaryCamera,
    PrimaryCameraFeatures,
    SecondaryCamera,
    VideoRecordingResolution,
    DigitalZoom,
    FrameRate,
    DualCameraLens,
    OpticalZoom = "Yes",
    SecondaryCameraAvailable = "Yes",
    Flash = "Yes",
    HDRecording = "Yes",
    FullHDRecording = "Yes",
    VideoRecording = "Yes",
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !description ||
    !price ||
    !category ||
    !subcategory ||
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
    subcategory,
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
    InTheBox,
    ModelNumber,
    ModelName,
    SIMType,
    HybridSimSlot,
    Touchscreen,
    OTGCompatible,
    QuickCharging,
    DisplaySize,
    Resolution: displayResolution,
    ResolutionType,
    GPU,
    OtherDisplayFeatures,
    DisplayType,
    HDGameSupport,
    OperatingSystem,
    ProcessorBrand,
    ProcessorType,
    ProcessorCore,
    PrimaryClockSpeed,
    SecondaryClockSpeed,
    OperatingFrequency,
    InternalStorage,
    TotalMemory,
    PrimaryCamera,
    PrimaryCameraFeatures,
    SecondaryCamera,
    VideoRecordingResolution,
    DigitalZoom,
    FrameRate,
    DualCameraLens,
    OpticalZoom,
    SecondaryCameraAvailable,
    Flash,
    HDRecording,
    FullHDRecording,
    VideoRecording,
  });

  await product.save();
  cache.flushAll();
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
  await addLogActivity(req?.user?._id, " Product added", {});

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
    subcategory,
    brand,
    minPrice,
    maxPrice,
    search,
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Generate a unique cache key based on query parameters
  const cacheKey = `products_${page}_${limit}_${sort}_${category}_${subcategory}_${brand}_${minPrice}_${maxPrice}_${search}`;

  // Check if the data exists in the cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res
      .status(200)
      .json(new ApiResponse(200, cachedData, "Products fetched from cache"));
  }

  const query = {};

  // Build query based on filters
  if (category) query.category = { $regex: category, $options: "i" };
  if (subcategory) query.subcategory = { $regex: subcategory, $options: "i" };
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

  try {
    const [products, totalProducts, categories, brands] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean(),
      Product.countDocuments(query),
      Product.distinct("category"),
      Product.distinct(
        "brand",
        category ? { category: { $regex: category, $options: "i" } } : {}
      ),
    ]);

    // Fetch discount data for the products
    const productIds = products.map((product) => product._id);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

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
          : null,
      };
    });

    const responseData = {
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
    };

    // Store data in cache
    cache.set(cacheKey, responseData);

    return res.status(200).json(new ApiResponse(200, responseData));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, { error: error.message }));
  }
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

  // Generate cache key
  const cacheKey = `product_${id}`;

  // Check if data exists in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res
      .status(200)
      .json(new ApiResponse(200, cachedData, "Product fetched from cache"));
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

  // Store in cache
  cache.set(cacheKey, productWithAdditionalData);

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
  cache.flushAll();
  // Optionally delete associated discounts
  await Discount.deleteMany({ product: id });
  await addLogActivity(req?.user?._id, " Product deleted", {});

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
    subcategory,
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
    InTheBox,
    ModelNumber,
    ModelName,
    SIMType,
    HybridSimSlot = "Yes",
    Touchscreen = "Yes",
    OTGCompatible = "Yes",
    QuickCharging = "Yes",
    DisplaySize,
    Resolution: displayResolution, // Alias to avoid conflict
    ResolutionType,
    GPU,
    OtherDisplayFeatures,
    DisplayType,
    HDGameSupport = "Yes",
    OperatingSystem,
    ProcessorBrand,
    ProcessorType,
    ProcessorCore,
    PrimaryClockSpeed,
    SecondaryClockSpeed,
    OperatingFrequency,
    InternalStorage,
    RAM: ramCapacity, // Alias for clarity
    TotalMemory,
    PrimaryCamera,
    PrimaryCameraFeatures,
    SecondaryCamera,
    VideoRecordingResolution,
    DigitalZoom,
    FrameRate,
    DualCameraLens,
    OpticalZoom = "Yes",
    SecondaryCameraAvailable = "Yes",
    Flash = "Yes",
    HDRecording = "Yes",
    FullHDRecording = "Yes",
    VideoRecording = "Yes",
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
  if (subcategory) product.subcategory = subcategory;
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
  // Update additional fields
  if (InTheBox) product.InTheBox = InTheBox;
  if (ModelNumber) product.ModelNumber = ModelNumber;
  if (ModelName) product.ModelName = ModelName;
  if (SIMType) product.SIMType = SIMType;
  if (HybridSimSlot) product.HybridSimSlot = HybridSimSlot;
  if (Touchscreen) product.Touchscreen = Touchscreen;
  if (OTGCompatible) product.OTGCompatible = OTGCompatible;
  if (QuickCharging) product.QuickCharging = QuickCharging;
  if (DisplaySize) product.DisplaySize = DisplaySize;
  if (displayResolution) product.Resolution = displayResolution;
  if (ResolutionType) product.ResolutionType = ResolutionType;
  if (GPU) product.GPU = GPU;
  if (OtherDisplayFeatures) product.OtherDisplayFeatures = OtherDisplayFeatures;
  if (DisplayType) product.DisplayType = DisplayType;
  if (HDGameSupport) product.HDGameSupport = HDGameSupport;
  if (OperatingSystem) product.OperatingSystem = OperatingSystem;
  if (ProcessorBrand) product.ProcessorBrand = ProcessorBrand;
  if (ProcessorType) product.ProcessorType = ProcessorType;
  if (ProcessorCore) product.ProcessorCore = ProcessorCore;
  if (PrimaryClockSpeed) product.PrimaryClockSpeed = PrimaryClockSpeed;
  if (SecondaryClockSpeed) product.SecondaryClockSpeed = SecondaryClockSpeed;
  if (OperatingFrequency) product.OperatingFrequency = OperatingFrequency;
  if (InternalStorage) product.InternalStorage = InternalStorage;
  if (ramCapacity) product.RAM = ramCapacity;
  if (TotalMemory) product.TotalMemory = TotalMemory;
  if (PrimaryCamera) product.PrimaryCamera = PrimaryCamera;
  if (PrimaryCameraFeatures)
    product.PrimaryCameraFeatures = PrimaryCameraFeatures;
  if (SecondaryCamera) product.SecondaryCamera = SecondaryCamera;
  if (VideoRecordingResolution)
    product.VideoRecordingResolution = VideoRecordingResolution;
  if (DigitalZoom) product.DigitalZoom = DigitalZoom;
  if (FrameRate) product.FrameRate = FrameRate;
  if (DualCameraLens) product.DualCameraLens = DualCameraLens;
  if (OpticalZoom) product.OpticalZoom = OpticalZoom;
  if (SecondaryCameraAvailable)
    product.SecondaryCameraAvailable = SecondaryCameraAvailable;
  if (Flash) product.Flash = Flash;
  if (HDRecording) product.HDRecording = HDRecording;
  if (FullHDRecording) product.FullHDRecording = FullHDRecording;
  if (VideoRecording) product.VideoRecording = VideoRecording;

  // Save the updated product
  await product.save();
  cache.flushAll();
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
  await addLogActivity(req?.user?._id, " Product updated", {});

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
  await addLogActivity(req?.user?._id, " Discount deleted", {});

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
