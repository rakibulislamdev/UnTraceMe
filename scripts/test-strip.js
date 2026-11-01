const { PDFDocument, PDFName, PDFRawStream } = require("pdf-lib");
const fs = require("fs");
const zlib = require("zlib");

async function testStrip() {
  const bytes = fs.readFileSync("public/test-watermarked-sample.pdf");
  const doc = await PDFDocument.load(bytes);

  // 1. Delete all metadata
  const info = doc.getInfoDict();
  info.delete(PDFName.of("Producer"));
  info.delete(PDFName.of("Creator"));
  info.delete(PDFName.of("Title"));
  info.delete(PDFName.of("Author"));
  info.delete(PDFName.of("Subject"));
  info.delete(PDFName.of("Keywords"));
  info.delete(PDFName.of("CreationDate"));
  info.delete(PDFName.of("ModDate"));

  // 2. Decode and scrub content stream
  const page = doc.getPages()[0];
  const contents = page.node.Contents();
  const streamRef = contents.get(0);
  const stream = doc.context.lookup(streamRef);

  const rawBytes = stream.getContents();
  const decompressed = zlib.inflateSync(Buffer.from(rawBytes)).toString("utf-8");

  // Regex to match the watermark drawing block
  // q ... /Helvetica-Bold... 48 Tf ... <434F4E464944454E5449414C204452414654> Tj ... Q
  // or any q ... Q containing CONFIDENTIAL, DRAFT, WATERMARK, or low opacity GS
  const cleanedStreamText = decompressed.replace(/q[\s\S]*?(434F4E464944454E5449414C|CONFIDENTIAL|DRAFT|DO NOT COPY)[\s\S]*?Q/gi, "");

  console.log("Cleaned stream text:\n", cleanedStreamText);

  // Replace stream in pdf
  const recompressed = zlib.deflateSync(Buffer.from(cleanedStreamText, "utf-8"));
  const newStream = doc.context.flateStream(recompressed);
  doc.context.assign(streamRef, newStream);

  const finalPdf = await doc.save({ useObjectStreams: false });
  fs.writeFileSync("public/untraceme-clean-final-verify.pdf", finalPdf);
  console.log("Saved clean file to public/untraceme-clean-final-verify.pdf");
}
testStrip();