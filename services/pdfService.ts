// This declaration is necessary to inform TypeScript about the global `PDFLib` object
// that is loaded from the CDN script in index.html.
declare const PDFLib: any;

const { PDFDocument, degrees, PageSizes } = PDFLib;

// Layout defines the position, source page, and rotation for each frame
// on the new single-page PDF. Coordinates are grid-based (0-3 for x, 0-1 for y).
// The pageIndex here is relative to the start of a chunk of 8 pages (0-7).
const FLIPBOOK_LAYOUT = [
    // Bottom row (normal orientation)
    { gridX: 0, gridY: 0, pageIndex: 3, rotation: 0 }, // Frame 4 <- Page 4 of chunk
    { gridX: 1, gridY: 0, pageIndex: 4, rotation: 0 }, // Frame 5 <- Page 5 of chunk
    { gridX: 2, gridY: 0, pageIndex: 5, rotation: 0 }, // Frame 6 <- Page 6 of chunk
    { gridX: 3, gridY: 0, pageIndex: 6, rotation: 0 }, // Frame 7 <- Page 7 of chunk
    // Top row (upside down)
    { gridX: 0, gridY: 1, pageIndex: 2, rotation: 180 }, // Frame 3 <- Page 3 of chunk
    { gridX: 1, gridY: 1, pageIndex: 1, rotation: 180 }, // Frame 2 <- Page 2 of chunk
    { gridX: 2, gridY: 1, pageIndex: 0, rotation: 180 }, // Frame 1 <- Page 1 of chunk
    { gridX: 3, gridY: 1, pageIndex: 7, rotation: 180 }, // Frame 8 <- Page 8 of chunk
];

export async function createFlipbookPdf(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  const newPdfDoc = await PDFDocument.create();
  const allPages = pdfDoc.getPages();
  const embeddedPages = await newPdfDoc.embedPages(allPages);
  
  const [pageWidth, pageHeight] = PageSizes.A4.reverse();
  const cellWidth = pageWidth / 4;
  const cellHeight = pageHeight / 2;

  const numOutputPagesForFirst8 = pageCount > 0 ? 1 : 0;
  const remainingPages = pageCount > 8 ? pageCount - 8 : 0;
  const numSubsequentPages = Math.ceil(remainingPages / 7);
  const numOutputPages = numOutputPagesForFirst8 + numSubsequentPages;


  for (let i = 0; i < numOutputPages; i++) {
    const newPage = newPdfDoc.addPage([pageWidth, pageHeight]);

    for (const item of FLIPBOOK_LAYOUT) {
      const { gridX, gridY, pageIndex: relativePageIndex, rotation } = item;
      let absolutePageIndex;

      if (i === 0) { // First output page uses pages 1-8
          absolutePageIndex = relativePageIndex;
      } else { // Subsequent pages have the special layout
          if (relativePageIndex === 0) { // This is frame 1
              absolutePageIndex = 0; // Always use original page 1
          } else {
              // Pages used for subsequent sheets start after the first 8
              const pageOffset = 8 + (i - 1) * 7;
              absolutePageIndex = pageOffset + (relativePageIndex - 1);
          }
      }

      if (absolutePageIndex >= pageCount) {
        continue;
      }

      const embeddedPage = embeddedPages[absolutePageIndex];
      const drawOptions = {
        width: cellWidth,
        height: cellHeight,
        rotate: degrees(rotation),
        x: 0,
        y: 0,
      };

      if (rotation === 180) {
        drawOptions.x = (gridX + 1) * cellWidth;
        drawOptions.y = (gridY + 1) * cellHeight;
      } else {
        drawOptions.x = gridX * cellWidth;
        drawOptions.y = gridY * cellHeight;
      }
      
      newPage.drawPage(embeddedPage, drawOptions);
    }
  }

  const pdfBytes = await newPdfDoc.save();
  return pdfBytes;
}

export async function createBookletPdf(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();

    if (pageCount === 0) {
        throw new Error('O PDF está vazio.');
    }

    const newPdfDoc = await PDFDocument.create();
    const allPages = pdfDoc.getPages();
    const embeddedPages = await newPdfDoc.embedPages(allPages);

    let paddedPageCount = pageCount;
    if (pageCount % 4 !== 0) {
        paddedPageCount = Math.ceil(pageCount / 4) * 4;
    }
    
    const [pageWidth, pageHeight] = PageSizes.A4.reverse(); // A4 Landscape
    const halfWidth = pageWidth / 2;

    const impositionOrder: (number | null)[] = [];
    let low = 1;
    let high = paddedPageCount;
    while(low < high) {
        impositionOrder.push(high, low, low + 1, high - 1);
        low += 2;
        high -= 2;
    }
    
    for (let i = 0; i < impositionOrder.length; i += 2) {
        const newPage = newPdfDoc.addPage([pageWidth, pageHeight]);
        const leftPageNumber = impositionOrder[i];
        const rightPageNumber = impositionOrder[i+1];
        
        // Draw left page
        if (leftPageNumber && leftPageNumber <= pageCount) {
            const pageToEmbed = embeddedPages[leftPageNumber - 1];
            newPage.drawPage(pageToEmbed, {
                x: 0,
                y: 0,
                width: halfWidth,
                height: pageHeight,
            });
        }
        
        // Draw right page
        if (rightPageNumber && rightPageNumber <= pageCount) {
            const pageToEmbed = embeddedPages[rightPageNumber - 1];
            newPage.drawPage(pageToEmbed, {
                x: halfWidth,
                y: 0,
                width: halfWidth,
                height: pageHeight,
            });
        }
    }

    const pdfBytes = await newPdfDoc.save();
    return pdfBytes;
}