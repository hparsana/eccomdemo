import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Function to generate a PDF for the Category List
 * @param {Array} categories - List of categories with subcategories
 */
export const downloadCategoryPDF = async (categories) => {
  const doc = new jsPDF({
    orientation: "landscape", // Landscape for better readability
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // Set title font
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Category & Subcategory List", doc.internal.pageSize.width / 2, 15, {
    align: "center",
  });

  // Define table headers
  const headers = [["Category Name", "Description", "Subcategories"]];

  // Prepare table rows
  const rows = categories.map((category, index) => [
    `${index + 1} ] ${category.name}`,
    category.description || "N/A",
    category.subcategories.length > 0
      ? category.subcategories
          .map((sub, subIndex) => `[${subIndex + 1}] ${sub.name}`)
          .join("\n")
      : "No Subcategories",
  ]);

  // Calculate table width and center it
  const pageWidth = doc.internal.pageSize.width; // Get page width
  const tableWidth = 230; // Approximate table width based on column widths
  const marginLeft = (pageWidth - tableWidth) / 2; // Calculate left margin for centering

  // Generate High-Quality PDF Table
  doc.autoTable({
    head: headers,
    body: rows,
    startY: 25,
    theme: "grid",
    styles: {
      fontSize: 9,
      fontStyle: "bold",
      cellPadding: 3,
      valign: "middle",
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontSize: 10,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 60 }, // Category Name
      1: { cellWidth: 110 }, // Description
      2: { cellWidth: 60 }, // Subcategories
    },
    margin: { top: 20, left: marginLeft, right: marginLeft }, // Set left & right margin to center table
    pageBreak: "auto",
    rowPageBreak: "avoid",
    didDrawPage: function () {
      doc.setFontSize(30);
      doc.setTextColor(200, 200, 200);
      doc.text("Category Report", doc.internal.pageSize.width / 2, 100, {
        align: "center",
        angle: 45,
        opacity: 0.1,
      });
    },
  });

  // Save the PDF
  doc.save("Category_List_Report.pdf");
};
