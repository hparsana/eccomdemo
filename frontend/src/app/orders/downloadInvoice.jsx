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

export const downloadInvoicePDF = async (order) => {
  console.log("order is<<,", order);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set header
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("INVOICE", 14, 20);
  doc.setFontSize(12);
  doc.text(`#${order._id}`, 140, 20);

  doc.setFontSize(10);
  doc.text("BILLED TO:", 14, 30);
  doc.text(order.user.fullname || "Really Great Company", 14, 36);

  doc.text("PAY TO:", 14, 46);
  doc.text(
    order.shippingDetails.address || "123 Anywhere St., Any City",
    14,
    52
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "City:-" +
      order.shippingDetails.city +
      ", " +
      "State:-" +
      order.shippingDetails.state,
    14,
    73
  );
  doc.text(
    "PostalCode:-" +
      order.shippingDetails.postalCode +
      ", " +
      "Country:-" +
      order.shippingDetails.country,
    14,
    78
  );

  doc.text("PAYMENT DETAILS", 14, 85);
  doc.text(`Method: ${order.paymentDetails.method}`, 14, 93);
  doc.text(`Status: ${order.paymentDetails.status}`, 14, 98);
  doc.text(`Transaction ID: ${order.paymentDetails.transactionId}`, 14, 103);
  doc.text(`Total Amount: ${order.totalAmount}`, 14, 109);

  // Order status table
  const orderDate = new Date(order.createdAt);
  const pendingDate = orderDate.toLocaleDateString();
  const shippedDate = new Date(order.isShippedAt);
  const deliveredDate = new Date(order.deliveredAt);

  doc.autoTable({
    startY: 115,
    head: [["Status", "Date"]],
    body: [
      ["Proccessing", pendingDate],
      ["Shipped", shippedDate.toLocaleDateString()],
      ["Delivered", deliveredDate.toLocaleDateString()],
    ],
    theme: "grid",
  });

  // Product Table
  const rows = await Promise.all(
    order.items.map(async (item) => {
      const productImage = item.product.images?.[0]?.url
        ? await getBase64Image(item.product.images[0].url)
        : null;
      return [
        { image: productImage },
        item.product.name,
        item.product.category,
        `₹${item.price}`,
        item.quantity,
      ];
    })
  );

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 10,
    head: [["Image", "Product Name", "Category", "Price", "Qty"]],
    body: rows,
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
      0: { cellWidth: 30, minCellHeight: 30, valign: "middle" },
      1: { cellWidth: 60 },
      2: { cellWidth: 40 },
      3: { cellWidth: 25 },
      4: { cellWidth: 15 },
    },
    didDrawCell: (data) => {
      if (data.column.index === 0 && data.cell.raw && data.cell.raw.image) {
        doc.addImage(
          data.cell.raw.image,
          "JPEG",
          data.cell.x + 3,
          data.cell.y + 3,
          20,
          20
        );
      }
    },
  });

  doc.setFontSize(10);
  doc.text(
    "Payment is required within 14 business days of invoice date.",
    14,
    doc.autoTable.previous.finalY + 10
  );
  doc.text(
    "Please send remittance to hello@reallygreatsite.com.",
    14,
    doc.autoTable.previous.finalY + 16
  );
  doc.text(
    "Thank you for your business.",
    14,
    doc.autoTable.previous.finalY + 26
  );
  doc.setFontSize(20);
  doc.text("Tuftzy", 14, doc.autoTable.previous.finalY + 40);
  doc.save(`Invoice_${order._id}.pdf`);
};
