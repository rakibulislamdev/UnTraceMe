const { PDFDocument, PDFRawStream } = require("pdf-lib");
const fs = require("fs");
const zlib = require("zlib");

async function testPdfClean() {
  const bytes = fs.readFileSync("public/test-watermarked-sample.pdf");
  const pdfDoc = await PDFDocument.load(bytes);
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const contents = page.node.Contents();
    for (let i = 0; i < contents.size(); i++) {
      const refOrStream = contents.get(i);
      const stream = pdfDoc.context.lookup(refOrStream);
      const rawBytes = stream.getContents();
      const decompressed = zlib.inflateSync(Buffer.from(rawBytes));
      let text = decompressed.toString("utf-8");

      // Replace visual watermark text instructions e.g. <434F4E464944454E5449414C...> Tj or (CONFIDENTIAL) Tj
      // Or block inside q ... /GS... gs ... ET Q with low opacity or watermark keywords
      const watermarkBlockRegex = /q\s*\/GS[^\n]*\s*gs\s*BT[\s\S]*?ET\s*Q/g;
      text = text.replace(watermarkBlockRegex, "");

      // Also clean any Tj matching CONFIDENTIAL or DRAFT hex
      // 434F4E464944454E5449414C is CONFIDENTIAL
      const confidentialHexRegex = /<[^>]*434F4E464944454E5449414C[^>]*>\s*Tj/gi;
      text = text.replace(confidentialHexRegex, "<> Tj");

      const recompressed = zlib.deflateSync(Buffer.from(text, "utf-8"));
      // Create new raw stream
      const newStream = pdfDoc.context.flateStream(recompressed);
      pdfDoc.context.assign(refOrStream, newStream);
    }
  }

  const cleanBytes = await pdfDoc.save();
  fs.writeFileSync("public/test-cleaned-verify.pdf", cleanBytes);
  console.log("Successfully stripped visual watermark from PDF!");
}
testPdfClean();
