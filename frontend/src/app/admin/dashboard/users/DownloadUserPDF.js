import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Function to generate a PDF for the User List
 * @param {Array} users - List of users to include in the PDF
 */
export const downloadUserPDF = async (users) => {
  const doc = new jsPDF({
    orientation: "landscape", // Landscape to fit more columns
    unit: "mm",
    format: "a4",
    compress: true, // Enables compression for better clarity
  });

  // Set high-quality font
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("User List Report", 14, 15); // Adjusted text positioning

  // Define table headers (Added new fields)
  const headers = [
    ["Full Name", "Username", "Email", "Role", "Created At", "Addresses Count"],
  ];

  // Prepare table rows
  const rows = users.map((user) => [
    user.fullname,
    user.username,
    user.email,
    user.role.charAt(0).toUpperCase() + user.role.slice(1), // Capitalize Role
    new Date(user.createdAt).toLocaleDateString(), // Formatted Date
    user.addresses ? user.addresses.length : 0, // Number of saved addresses
  ]);

  // Generate High-Quality PDF Table
  doc.autoTable({
    head: headers,
    body: rows,
    startY: 25, // Adjusted for better positioning
    theme: "grid", // "grid" theme improves readability
    styles: {
      fontSize: 9,
      fontStyle: "bold",
      cellPadding: 3,
      valign: "middle",
    },
    headStyles: {
      fillColor: [0, 0, 0], // Darker header background for contrast
      textColor: [255, 255, 255], // White text for better visibility
      fontSize: 10, // Larger font size for headers
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 60 }, // Full Name
      1: { cellWidth: 60 }, // Username
      2: { cellWidth: 70 }, // Email
      3: { cellWidth: 25 }, // Role
      6: { cellWidth: 25 }, // Created At
      8: { cellWidth: 10 }, // Addresses Count
    },
    margin: { top: 20 }, // Adjusted margin
    pageBreak: "auto", // Automatically create new pages
    rowPageBreak: "avoid", // Avoid splitting rows between pages
    didDrawPage: function () {
      // Add watermark for better design (optional)
      doc.setFontSize(30);
      doc.setTextColor(200, 200, 200);
      doc.text("User Report", 90, 100, { angle: 45, opacity: 0.1 });
    },
  });

  // Save the high-quality PDF
  doc.save("User_List_Report.pdf");
};
