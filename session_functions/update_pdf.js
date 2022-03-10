const { degrees, PDFDocument, rgb, StandardFonts, pdfDocEncodingDecode } = require('pdf-lib')
const fs = require('fs')
const save_file= require('./save_file')
const delete_file = require('./delete_file')
const update_pdf = async(path,data,company,b_data)=>{
    const buffer = fs.readFileSync(path)
    const pdfDoc = await PDFDocument.load(buffer)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    firstPage.drawText(b_data, {
      x: 28,
      y: 29,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    })
  
 
    const pdfBytes = await pdfDoc.save();
    fs.writeFile(path, pdfBytes, async (err) => {
        if(err)
        {
         
        }
     else
     {
        console.log('save file')
        await save_file(path,data,company)
     }
    })
}
module.exports = update_pdf