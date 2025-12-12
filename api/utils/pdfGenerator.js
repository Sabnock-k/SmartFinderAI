import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates a comprehensive analytics PDF report
 * @param {Object} analytics - Analytics data object
 */
export const generateAnalyticsPDF = (analytics) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper function to check if we need a new page
    const checkPageBreak = (neededSpace = 20) => {
      if (yPosition + neededSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Title
    doc.setFontSize(22);
    doc.setTextColor(26, 35, 126);
    doc.text("System Analytics Dashboard", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 15;

    // Core Metrics Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Core Metrics", 14, yPosition);
    yPosition += 10;

    const coreMetricsData = [
      [
        "Total Users",
        String(analytics.totalUsers || 0),
        `${analytics.recentUsers || 0} new this month`,
      ],
      [
        "Active Listings",
        String(analytics.activeListings || 0),
        "Approved items",
      ],
      [
        "Pending Review",
        String(analytics.pendingReports || 0),
        "Awaiting approval",
      ],
      [
        "Reunited Items",
        String(analytics.reunitedItems || 0),
        `${analytics.successRate || 0}% success rate`,
      ],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value", "Details"]],
      body: coreMetricsData,
      theme: "striped",
      headStyles: { fillColor: [26, 35, 126] },
      margin: { left: 14, right: 14 },
    });

    yPosition = doc.lastAutoTable.finalY + 15;
    checkPageBreak(20);

    // Additional Metrics
    doc.setFontSize(16);
    doc.text("Additional Metrics", 14, yPosition);
    yPosition += 10;

    const additionalMetricsData = [
      ["Total Items", String(analytics.totalItems || 0), "All submissions"],
      [
        "Claim Requests",
        String(analytics.totalClaims || 0),
        `${analytics.pendingClaims || 0} pending`,
      ],
      [
        "Redemptions",
        String(analytics.totalRedemptions || 0),
        `${analytics.recentRedemptions || 0} this month`,
      ],
      [
        "Points Given",
        (analytics.totalPointsDistributed || 0).toLocaleString(),
        "Total rewards",
      ],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value", "Details"]],
      body: additionalMetricsData,
      theme: "striped",
      headStyles: { fillColor: [26, 35, 126] },
      margin: { left: 14, right: 14 },
    });

    yPosition = doc.lastAutoTable.finalY + 15;
    checkPageBreak(30);

    // Item Status Distribution
    doc.setFontSize(16);
    doc.text("Item Status Distribution", 14, yPosition);
    yPosition += 10;

    const totalItems = analytics.totalItems || 1; // Avoid division by zero
    const statusData = [
      [
        "Approved Items",
        String(analytics.activeListings || 0),
        `${(((analytics.activeListings || 0) / totalItems) * 100).toFixed(1)}%`,
      ],
      [
        "Pending Review",
        String(analytics.pendingReports || 0),
        `${(((analytics.pendingReports || 0) / totalItems) * 100).toFixed(1)}%`,
      ],
      [
        "Reunited",
        String(analytics.reunitedItems || 0),
        `${(((analytics.reunitedItems || 0) / totalItems) * 100).toFixed(1)}%`,
      ],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [["Status", "Count", "Percentage"]],
      body: statusData,
      theme: "striped",
      headStyles: { fillColor: [26, 35, 126] },
      margin: { left: 14, right: 14 },
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Key Rates
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    yPosition += 5;
    doc.text(`Approval Rate: ${analytics.approvalRate || 0}%`, 14, yPosition);
    yPosition += 7;
    doc.text(`Success Rate: ${analytics.successRate || 0}%`, 14, yPosition);
    yPosition += 15;

    checkPageBreak(30);

    // Claim Request Analytics
    doc.setFontSize(16);
    doc.text("Claim Request Analytics", 14, yPosition);
    yPosition += 10;

    const totalClaims = analytics.totalClaims || 1; // Avoid division by zero
    const claimData = [
      [
        "Approved Claims",
        String(analytics.approvedClaims || 0),
        `${(((analytics.approvedClaims || 0) / totalClaims) * 100).toFixed(
          1
        )}%`,
      ],
      [
        "Pending Claims",
        String(analytics.pendingClaims || 0),
        `${(((analytics.pendingClaims || 0) / totalClaims) * 100).toFixed(1)}%`,
      ],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value", "Percentage"]],
      body: claimData,
      theme: "striped",
      headStyles: { fillColor: [26, 35, 126] },
      margin: { left: 14, right: 14 },
    });

    yPosition = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Claim Rate: ${analytics.claimRate || 0}%`, 14, yPosition);
    yPosition += 7;
    doc.text(
      `Average Response Time: ${analytics.avgResponseTimeDays || 0} days`,
      14,
      yPosition
    );
    yPosition += 15;

    checkPageBreak(30);

    // Top Contributors
    if (analytics.topContributors && analytics.topContributors.length > 0) {
      doc.setFontSize(16);
      doc.text("Top Contributors", 14, yPosition);
      yPosition += 10;

      const contributorData = analytics.topContributors.map((c, idx) => [
        String(idx + 1),
        c.full_name || "Unknown",
        `@${c.username || "unknown"}`,
        String(c.items_found || 0),
        String(c.points || 0),
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [["Rank", "Name", "Username", "Items Found", "Points"]],
        body: contributorData,
        theme: "striped",
        headStyles: { fillColor: [26, 35, 126] },
        margin: { left: 14, right: 14 },
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    }

    checkPageBreak(30);

    // Popular Categories
    if (analytics.categoryStats && analytics.categoryStats.length > 0) {
      doc.setFontSize(16);
      doc.text("Popular Categories", 14, yPosition);
      yPosition += 10;

      const maxCount = analytics.categoryStats[0]?.count || 1;
      const categoryData = analytics.categoryStats.map((c) => [
        c.category || "Uncategorized",
        String(c.count || 0),
        `${(((c.count || 0) / maxCount) * 100).toFixed(1)}%`,
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [["Category", "Count", "Percentage"]],
        body: categoryData,
        theme: "striped",
        headStyles: { fillColor: [26, 35, 126] },
        margin: { left: 14, right: 14 },
      });
    }

    // Save the PDF
    const fileName = `analytics-report-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);

    return true;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  }
};
