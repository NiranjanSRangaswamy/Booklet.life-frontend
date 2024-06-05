import React from "react";


const FAQ = () => {
  return (
    <section id="faq" className="faq w-full my-5 flex flex-col justify-around items-center">
      <h1 className="text-center font-semibold text-3xl md:text-4xl">Frequently Asked Questions</h1>
      <div className="container mt-5 flex gap-5 flex-col md:text-sm">
        <div>
          <h3>Can I export a group chat?</h3>
          <p>Yes, you can export both individual and group chats using the same export process.</p>
        </div>
        <div>
          <h3> What file format is used for the exported chat?</h3>
          <p>WhatsApp exports chats in .txt format, which our system accepts for conversion.</p>
        </div>
        <div>
          <h3>Is there a limit to the size of the chat file I can upload?</h3>
          <p> While there is no strict limit, very large files may take longer to process. If you encounter any issues with large files, please contact our support team for assistance.</p>
        </div>
        <div>
          <h3>Is my data secure during the upload process?</h3>
          <p> Absolutely. We use advanced encryption to ensure your data is secure. All files are deleted from our servers after the PDF or printed copy is delivered.</p>
        </div>
        <div>
          <h3>Can I edit the chat content before converting it to PDF or print?</h3>
          <p>Currently, we do not offer editing of chat content. The PDF or printed copy will reflect the chat as it was exported from WhatsApp.</p>
        </div>
        <div>
          <h3>Can I customize the layout of my PDF or printed book?</h3>
          <p> Currently, the layout is designed to closely mimic the WhatsApp interface. Customization options are limited to ensuring the best representation of your chat.</p>
        </div>
        <div>
          <h3>Can I preview the PDF before downloading or printing?</h3>
          <p>Yes, you can preview the PDF before finalizing your order to ensure everything looks perfect.</p>
        </div>
        <div>
          <h3>Can I cancel my order?</h3>
          <p>Orders for PDFs can be canceled before the file is downloaded. For printed copies, please contact our support team as soon as possible if you need to cancel.</p>
        </div>
        <div>
          <h3>How long does it take to get the PDF?</h3>
          <p>The PDF is available for instant download as soon as your chat file is uploaded and processed.</p>
        </div>
        <div>
          <h3>How long will it take to receive my printed copy</h3>
          <p>Printed copies typically arrive within 5-7 business days after your order is placed, depending on your location.</p>
        </div>
        
      </div>
    </section>
  )
}

export default FAQ