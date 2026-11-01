const fs = require("fs");
const JSZip = require("jszip");

async function generateSampleDocx() {
  const zip = new JSZip();

  // [Content_Types].xml
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`
  );

  // _rels/.rels
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>`
  );

  // word/document.xml with:
  // 1. Visual Watermark VML Shape: PowerPlusWaterMarkObject "CONFIDENTIAL"
  // 2. Invisible zero-width unicode spaces: \u200B \uFEFF \u200C \u200D
  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <w:body>
    <w:p>
      <!-- Visual Watermark Shape -->
      <w:r>
        <w:pict>
          <v:shape id="PowerPlusWaterMarkObject357831032" style="position:absolute;margin-left:0;margin-top:0;width:468pt;height:351pt;z-index:-251656704;mso-position-horizontal:center;mso-position-vertical:center" fillcolor="#f0d0d0" stroked="f" type="#_x0000_t136">
            <v:textpath style="font-family:&quot;Calibri&quot;;font-size:1pt" string="CONFIDENTIAL DRAFT"/>
          </v:shape>
        </w:pict>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>UnTraceMe DOCX Forensic &amp; Steganography Test File</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <!-- Injected invisible zero-width AI tokens -->
        <w:t>This\u200B paragraph\uFEFF contains\u200C hidden\u200D AI\u2060 steganographic watermarks.</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`
  );

  // docProps/core.xml with ChatGPT / AI Metadata
  zip.file(
    "docProps/core.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:title>Internal AI Security Whitepaper</dc:title>
  <dc:creator>OpenAI ChatGPT-4o Enterprise</dc:creator>
  <cp:lastModifiedBy>ChatGPT Canvas</cp:lastModifiedBy>
</cp:coreProperties>`
  );

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  fs.writeFileSync("public/test-watermarked-sample.docx", buffer);
  console.log("DOCX generated successfully at public/test-watermarked-sample.docx");
}

generateSampleDocx();

