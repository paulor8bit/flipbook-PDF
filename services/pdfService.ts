// This declaration is necessary to inform TypeScript about the global `PDFLib` object
// that is loaded from the CDN script in index.html.
declare const PDFLib: any;

export async function createFlipbookPdf(file: File): Promise<Uint8Array> {
  const { PDFDocument, degrees, PageSizes } = PDFLib;

  const arrayBuffer = await file.arrayBuffer();

  const pdfDoc = await PDFDocument.load(arrayBuffer);

  if (pdfDoc.getPageCount() !== 8) {
    throw new Error('O PDF deve ter exatamente 8 páginas.');
  }

  const newPdfDoc = await PDFDocument.create();
  
  // Use A4 Landscape size for the new page
  const [pageWidth, pageHeight] = PageSizes.A4.reverse();
  const newPage = newPdfDoc.addPage([pageWidth, pageHeight]);

  const cellWidth = pageWidth / 4;
  const cellHeight = pageHeight / 2;

  const pages = pdfDoc.getPages();
  const embeddedPages = await newPdfDoc.embedPages(pages);

  // Layout defines the position, source page, and rotation for each frame
  // on the new single-page PDF. Coordinates are grid-based (0-3 for x, 0-1 for y).
  const layout = [
    // Bottom row (normal orientation)
    { gridX: 0, gridY: 0, pageIndex: 3, rotation: 0 }, // Frame 4 <- Page 4
    { gridX: 1, gridY: 0, pageIndex: 4, rotation: 0 }, // Frame 5 <- Page 5
    { gridX: 2, gridY: 0, pageIndex: 5, rotation: 0 }, // Frame 6 <- Page 6
    { gridX: 3, gridY: 0, pageIndex: 6, rotation: 0 }, // Frame 7 <- Page 7
    // Top row (upside down)
    { gridX: 0, gridY: 1, pageIndex: 2, rotation: 180 }, // Frame 3 <- Page 3
    { gridX: 1, gridY: 1, pageIndex: 1, rotation: 180 }, // Frame 2 <- Page 2
    { gridX: 2, gridY: 1, pageIndex: 0, rotation: 180 }, // Frame 1 <- Page 1
    { gridX: 3, gridY: 1, pageIndex: 7, rotation: 180 }, // Frame 8 <- Page 8
  ];

  for (const item of layout) {
    const { gridX, gridY, pageIndex, rotation } = item;
    const embeddedPage = embeddedPages[pageIndex];

    const drawOptions: {
        x: number;
        y: number;
        width: number;
        height: number;
        rotate: any;
    } = {
      width: cellWidth,
      height: cellHeight,
      rotate: degrees(rotation),
      x: 0,
      y: 0,
    };
    
    // When rotating by 180 degrees, the origin (x, y) must be the top-right
    // corner of the cell for the page to be drawn correctly within its bounds.
    if (rotation === 180) {
      drawOptions.x = (gridX + 1) * cellWidth;
      drawOptions.y = (gridY + 1) * cellHeight;
    } else {
      drawOptions.x = gridX * cellWidth;
      drawOptions.y = gridY * cellHeight;
    }

    newPage.drawPage(embeddedPage, drawOptions);
  }

  const pdfBytes = await newPdfDoc.save();
  return pdfBytes;
}