
const { degrees, PDFDocument, rgb, StandardFonts, pdfDocEncodingDecode } = require('pdf-lib')
const fs = require('fs')
const send_email = require('./send_email')
const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1278443",
  key: "ccb9776a436a9a03d270",
  secret: "e4b5b7852b7412725adc",
  cluster: "ap2",
  useTLS: true
});
const update_pdf = async (pdf_path, data, default_email,company_id,save,path) => {
    
 
    const buffer = fs.readFileSync(pdf_path)
    const pdfDoc = await PDFDocument.load(buffer)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    firstPage.drawText(data, {
      x: 28,
      y: 29,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    })
  
 
    const pdfBytes = await pdfDoc.save();
    fs.writeFile(pdf_path, pdfBytes, async () => {
     
       await send_email(pdf_path,default_email,company_id,save,path)
        return
    })

}
module.exports = update_pdf