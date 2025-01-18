import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Convert an image URL to Base64 for adding to PDF
 */
const getBase64Image = async (imgUrl) => {
  try {
    if (!imgUrl) return null; // Prevent fetching empty URLs

    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(imgUrl)}`;

    const response = await fetch(proxyUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading image:", imgUrl, error);
    return null;
  }
};

export const downloadProductPDF = async (products) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true, // Enables compression for better clarity
  });

  // Set high-quality font
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Product List Report", 14, 35); // Adjusted text positioning

  // Placeholder image in case a product has no image
  const placeholderImage = "https://picsum.photos/100/100"; // Smaller placeholder

  // Convert product images to Base64 and ensure no null data is added
  const rows = await Promise.all(
    products
      .filter((product) => product && product.name) // Ensure no empty products
      .map(async (product) => {
        console.log("Processing product:", product.name);
        const productImage = product.images?.[0]?.url
          ? await getBase64Image(product.images[0].url)
          : await getBase64Image(placeholderImage); // Convert placeholder to Base64

        return [
          { image: productImage }, // Image as object to avoid undefined issues
          product.name,
          product.category,
          product.brand,
          `₹${product.price}`,
          product.discount?.isActive ? `${product.discount.percentage}%` : "No",
          product.stock,
          product.description.length > 50
            ? product.description.substring(0, 50) + "..."
            : product.description,
        ];
      })
  );

  console.log("Total Products:", products.length);
  console.log("Generated Rows:", rows.length);

  // Generate High-Quality PDF Table with Images
  doc.autoTable({
    head: [
      [
        "Image",
        "Product Name",
        "Category",
        "Brand",
        "Price",
        "Discount",
        "Stock",
        "Description",
      ],
    ],
    body: rows,
    startY: 45, // Adjusted to start after the top image
    theme: "grid",
    styles: {
      fontSize: 8,
      fontStyle: "bold",
      cellPadding: 3, // Increased padding for consistent row height
      valign: "middle",
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontSize: 8,
      textCenter: "center",
    },
    columnStyles: {
      0: { cellWidth: 25, minCellHeight: 30, valign: "middle" }, // Image Column (Fixed height)
      1: { cellWidth: 50 },
      2: { cellWidth: 40 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 15 },
      6: { cellWidth: 15 },
      7: { cellWidth: 70 },
    },
    margin: { top: 30 },
    pageBreak: "auto", // Automatically create new pages when needed
    rowPageBreak: "avoid", // Avoid splitting rows between pages
    didParseCell: (data) => {
      // Ensure the row index is within the valid range before parsing the cell
      if (data.row.index < 0 || data.row.index >= rows.length) return;

      // Insert image in the first column if available
      if (data.column.index === 0 && data.cell.raw && data.cell.raw.image) {
        data.cell.text = ""; // Removes default text
      }
    },
    didDrawCell: (data) => {
      // Ensure the row index is within the valid range before drawing an image
      if (data.row.index < 0 || data.row.index >= rows.length) return;

      if (data.column.index === 0 && data.cell.raw && data.cell.raw.image) {
        doc.addImage(
          data.cell.raw.image,
          "JPEG",
          data.cell.x + 3,
          data.cell.y + 3,
          20,
          20 // Resized image to fit within the cell
        );
      }
    },
    didDrawPage: function (data) {
      // Add watermark for better design (optional)
      doc.setFontSize(30);
      doc.setTextColor(200, 200, 200);
      doc.text("Product Report", 90, 100, { angle: 45, opacity: 0.1 });
    },
  });

  // Save the high-quality PDF
  doc.save("High_Quality_Product_List.pdf");
};
