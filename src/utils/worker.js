importScripts("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.4/pako.min.js");
importScripts('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js');

self.addEventListener("message", async (e) => {
  const { chat, ego, darkMode, sample, base64Images } = e.data;
  const { darkBg, lightBg, darkIcon, lightIcon, pieChart, hourlyChart, monthlyChart } = base64Images;
  const { jsPDF } = self.jspdf;
  const backgroundColor = darkMode ? "#21a68d" : "#ffffff";
  const backgroundImage = darkMode ? darkBg : lightBg;
  const icon = darkMode ? darkIcon : lightIcon;
  const textColor = darkMode ? [255, 255, 255] : [0, 166, 141];
  const messageColor = darkMode ? [255, 255, 255] : [0, 0, 0];
  const authorPrimaryColor = darkMode ? "#15533b" : "#D9FDD3";
  const authorSecondaryColor = darkMode ? "#134333" : "#9cfab0";
  const othersPrimaryColor = darkMode ? "#1F2C34" : "#e9e7e4";
  const othersSecondaryColor = darkMode ? "#1a2027" : "#f0f0f0";

  const width = 210;
  const height = 297;
  const fontSize = 11;
  const marginTop = 20;
  const marginLeft = 20;
  const pageYSpace = 297 - marginTop;
  const lineHeight = (fontSize * 1.5) / 3.64;
  const messageMarginBottom = 5;
  const paddingMessage = 1;
  const authorHeight = 9;
  const timeHeight = 3;

  const setBackgroundColor = (doc, color) => {
    doc.setFillColor(color);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");
  };

  const setBackgroundImage = async (doc, imgSrc) => {
    try {
      const response = await fetch(imgSrc);
      const blob = await response.blob();
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const imgDataUrl = reader.result;

          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          doc.addImage(imgDataUrl, "PNG", 0, 0, pageWidth, pageHeight);
          resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error loading image:", error);
      throw error;
    }
  };

  const addColoredPage = async (isBackgroundImageRequired = true) => {
    doc.addPage();
    setBackgroundColor(doc, backgroundColor);
    if (isBackgroundImageRequired) await setBackgroundImage(doc, backgroundImage);

    const iconWidth = 40;
    const iconHeight = 10;
    const iconMargin = 5;
    const pageWidth = doc.internal.pageSize.getWidth();
    usedYSpace = marginTop;

    doc.addImage(icon, "PNG", pageWidth - iconWidth - iconMargin, iconMargin, iconWidth, iconHeight);
  };

  const addPageIfNeeded = (height) => {
    if (usedYSpace + height > pageYSpace) {
      addColoredPage();
    }
  };

  const writeRightSideText = (text) => {
    const textWidth = doc.getTextWidth(text);
    doc.text(text, width - marginLeft - textWidth, usedYSpace);
  };

  const addHeading = (text, x, y) => {
    doc.setTextColor(...textColor);
    doc.setFontSize(50);
    doc.text(text, x, y);
    usedYSpace += 10;
  };

  const calcMessageBodyHeight = async function (numLines, attachmentHeight, isSystem) {
    let messageY = marginTop + usedYSpace;
    const messageYSpace = numLines * lineHeight + authorHeight + timeHeight; // Height of Messages
    // Check if lines fit on page,
    if (usedYSpace + attachmentHeight + messageYSpace + marginTop / 2 > pageYSpace) {
      // is first message
      await addColoredPage(true);
      messageY = marginTop;
      usedYSpace = 0;
    }
    usedYSpace += isSystem ? messageMarginBottom + messageYSpace - authorHeight + timeHeight : messageMarginBottom + messageYSpace;
    return messageY;
  };

  const getScale = function (width, height, desiredWidth) {
    const yScale = (0.5 * pageYSpace) / height;
    const xScale = desiredWidth / width;

    const scale = xScale <= yScale ? xScale : yScale;

    const rescaledHeight = height * scale;
    const rescaledWidth = width * scale;

    return [rescaledWidth, rescaledHeight];
  };

  const hexToRgb = function (hex) {
    if (hex.length !== 7) {
      throw new Error("Only seven-digit hex colors are allowed.");
    }
    // remove #
    hex = hex.slice(1);

    const aRgbHex = hex.match(/.{1,2}/g);
    if (aRgbHex) {
      return [parseInt(aRgbHex[0], 16), parseInt(aRgbHex[1], 16), parseInt(aRgbHex[2], 16)];
    }
    return [0, 0, 0];
  };

  const drawAuthorBubble = function (author, x, y) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    // @ts-ignore
    let personHexColor = chat.personColorMap[author];
    // background color should not be used
    if (backgroundGreenHex === personHexColor) {
      personHexColor = "#20C5FF";
    }
    const personRgbColor = hexToRgb(personHexColor);
    doc.setFillColor(personRgbColor[0], personRgbColor[1], personRgbColor[2]);

    const authorWidth = doc.getTextWidth(author);

    doc.roundedRect(x - 3, y, authorWidth + 6, 10, 5, 5, "F");
    doc.text(author, x, y + 7);
  };

  // PDF generation starts from here

  const doc = new jsPDF();
  let usedYSpace = 0;

  setBackgroundColor(doc, backgroundColor);
  const iconMargin = 5;
  const iconWidth = 40;
  const iconHeight = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.addImage(icon, "PNG", pageWidth - iconWidth - iconMargin, iconMargin, iconWidth, iconHeight);

  // statistics are stored in variables
  const numberOfDays = chat.statistics["noOfDays"];
  const lastMessage = chat.statistics["lastMessage"];
  const firstMessage = chat.statistics["firstMessage"];
  const totalMessages = chat.statistics["totalMessages"];
  const mostActiveUser = chat.statistics["mostActiveUser"];
  const mostActiveMonth = chat.statistics["mostActiveMonth"];
  const totalParticipants = chat.statistics["totalParticipants"];
  const averageMessagePerUser = chat.statistics["averageMessagePerUser"];

  usedYSpace += 55;
  doc.setFont("helvetica", "bold");
  addHeading(sample ? "Your Sample" : "Your Chat", marginLeft, usedYSpace);

  usedYSpace += 10;
  doc.setFontSize(20);
  doc.text("First Message", marginLeft, usedYSpace);

  usedYSpace += 10;
  doc.setFontSize(30);
  doc.text(firstMessage, marginLeft, usedYSpace);

  usedYSpace += 15;
  doc.setFontSize(20);
  writeRightSideText("Last Message");

  usedYSpace += 10;
  doc.setFontSize(30);
  writeRightSideText(lastMessage);

  doc.setFontSize(14);
  doc.text("Number of Days", marginLeft, (usedYSpace += 15));
  doc.text(`:   ${numberOfDays}`, marginLeft + 70, usedYSpace);
  doc.text("Total Messages", marginLeft, (usedYSpace += 10));
  doc.text(`:   ${totalMessages}`, marginLeft + 70, usedYSpace);
  doc.text("Total Participants", marginLeft, (usedYSpace += 10));
  doc.text(`:   ${totalParticipants}`, marginLeft + 70, usedYSpace);
  doc.text("Most Active User", marginLeft, (usedYSpace += 10));
  doc.text(`:   ${mostActiveUser}`, marginLeft + 70, usedYSpace);
  doc.text("Most Active Month", marginLeft, (usedYSpace += 10));
  doc.text(`:   ${mostActiveMonth}`, marginLeft + 70, usedYSpace);
  doc.text("Average Messages Per User", marginLeft, (usedYSpace += 10));
  doc.text(`:   ${averageMessagePerUser}`, marginLeft + 70, usedYSpace);

  usedYSpace += 25;
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("Participants", marginLeft, usedYSpace);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  Object.keys(chat.personColorMap).forEach((user) => {
    if (user !== "null") {
      if (usedYSpace + 10 > pageYSpace) {
        addColoredPage(false);
      }
      usedYSpace += 10;
      doc.text(String(user), marginLeft, usedYSpace);
    }
  });

  // fun facts page starts from here

  await addColoredPage(false);

  usedYSpace = 55;
  addHeading("Fun Facts", marginLeft, usedYSpace);

  const funFactHeight = 51;

  chat.funFacts.forEach((user) => {
    if (user.name !== "null") {
      if (usedYSpace + funFactHeight > pageYSpace) {
        addColoredPage(false);
      }
      usedYSpace += 15;
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(String(user.name), marginLeft, usedYSpace);

      doc.setFontSize(15);
      doc.setFont("helvetica", "normal");
      doc.text("Messages sent", marginLeft, (usedYSpace += 8));
      doc.text(`:   ${user.numberOfMessages}`, marginLeft + 70, usedYSpace);
      doc.text("Longest Message", marginLeft, (usedYSpace += 7));
      doc.text(`:   ${user.longestMessage}`, marginLeft + 70, usedYSpace);
      doc.text("Words per message", marginLeft, (usedYSpace += 7));
      doc.text(`:   ${user.averageMessageLength}`, marginLeft + 70, usedYSpace);
      doc.text("Total words", marginLeft, (usedYSpace += 7));
      doc.text(`:   ${user.numberOfWords}`, marginLeft + 70, usedYSpace);
      doc.text("Unique words", marginLeft, (usedYSpace += 7));
      doc.text(`:   ${user.uniqueWords}`, marginLeft + 70, usedYSpace);
    }
  });

  // Charts page starts form here

  usedYSpace = 10;

  doc.addPage();
  doc.addImage(pieChart, "PNG", marginLeft, usedYSpace, 170, 170);
  doc.addPage();
  doc.addImage(hourlyChart, "PNG", marginLeft, usedYSpace, 170, 120);
  usedYSpace = 150;
  doc.addImage(monthlyChart, "PNG", marginLeft, usedYSpace, 170, 120);

  const messages = sample ? chat.filteredChatObject.slice(0, 100) : chat.filteredChatObject;
  await addColoredPage();
  usedYSpace = 10;
  let rendering = []

  for (const idx in messages) {
    const message = messages[idx];
    const isEgo = message.author == ego;
    const isSystem = message.author == null;
    const hasAttachment = !!message.attachment;
    let attachment;
    let attachmentSize = [0, 0];
    let attachments = chat.media["attachments"];

    if (hasAttachment) {
      attachment = await getAttachment(message.attachment["fileName"], attachments);
      if(!attachment) continue
      attachmentSize=[attachment.width,attachment.height]
      attachmentSize = getScale(
        attachmentSize[0],
        attachmentSize[1],
        (width - 2 * marginLeft) * 0.7
      );
    }
    doc.setFontSize(fontSize);
    const splitMessage = doc.splitTextToSize(message.message, isSystem?140:120);
    const numLines = splitMessage.length;
    const messageHeight = attachmentSize[1]?attachmentSize[1] : lineHeight * numLines ;
    const messageY =await calcMessageBodyHeight(numLines,attachmentSize[1],isSystem); 
    const singleLineTextWidth = doc.getTextWidth(message.message);
    let messageWidth = isSystem? singleLineTextWidth > 140 ? 140 : singleLineTextWidth :  hasAttachment? attachmentSize[0]: singleLineTextWidth > 120 ? 120: singleLineTextWidth;
    
    doc.setFont("helvetica", "bold");
    const authorWidth = doc.getTextWidth(!message.author?'':message.author);
  
    doc.setFontSize(fontSize / 1.8);
    const dateString = getDateString(message.date, true);
    const dateWidth = doc.getTextWidth(dateString);
  
    if (messageWidth < authorWidth) {
      messageWidth = authorWidth;
    }
    if (messageWidth < dateWidth) {
      messageWidth = dateWidth;
    }
  
    let messageX = isEgo ? width - marginLeft - messageWidth - 10: marginLeft + paddingMessage;
  
    let offset = 0
    if (isSystem) {
      // messageX = 105-(messageWidth/2)
      messageX = 30;
      offset = (147 - messageWidth) / 2 + paddingMessage/2;
      doc.setFillColor(...hexToRgb(othersPrimaryColor));
    } else if (isEgo) {
      doc.setFillColor(...hexToRgb(authorPrimaryColor));
    } else {
      doc.setFillColor(...hexToRgb(othersPrimaryColor));
    }
    
    doc.roundedRect(
      messageX + offset, // X-coordinate of the upper-left corner of the rectangle, offset by 'offset'
      messageY - 2, // Y-coordinate of the upper-left corner of the rectangle, adjusted slightly upward
      messageWidth + 2, // Width of the rectangle, slightly wider than the message width
      isSystem
        ? messageHeight + 2 * paddingMessage // If it's a system message, height is the message height plus extra padding
        : messageHeight + authorHeight + timeHeight, // If it's not a system message, height includes author and time heights
      2, // Horizontal radius for the rounded corners
      2, // Vertical radius for the rounded corners
      "F" // The drawing style, "F" stands for fill
    );
    
    if (!isSystem) {
      if (message.author in chat.personColorMap) {
        // @ts-ignore
        const personRgbColor = hexToRgb(chat.personColorMap[message.author]);
        doc.setTextColor(
          personRgbColor[0],
          personRgbColor[1],
          personRgbColor[2]
        );
      }
      doc.setFontSize(fontSize / 1.3);
      doc.setFont("helvetica", "bold");
      doc.text(
        message.author,
        messageX + paddingMessage,
        messageY + 2
      );
    }
    
    if (hasAttachment) {
      const filetype = attachment?.type;
      doc.addImage(
        attachment?.src,
        filetype,
        messageX + paddingMessage,
        messageY + 3,
        attachmentSize[0],
        attachmentSize[1]
      );
      usedYSpace += attachmentSize[1];
    }
    if (!hasAttachment) {
      if (isSystem) {
        doc.setTextColor(249, 217, 100);
      } else {
        doc.setTextColor(...messageColor);
      }
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", "normal");
      doc.text(
        splitMessage,
        isSystem ? messageX + 75 : messageX + paddingMessage,
        isSystem ? messageY + 2 * paddingMessage : messageY + authorHeight,
        { align: isSystem ? "center" : "left" }
      );
    }
    if (!isSystem) {
      doc.setFontSize(fontSize / 1.8);
      doc.setTextColor(200, 200, 200);

      doc.text(
        dateString,
        messageX + messageWidth - dateWidth + paddingMessage,
        messageY + authorHeight + messageHeight
      );
    }
  }

  const pdf = doc.output("blob");
  self.postMessage({pdf});
  // self.postMessage({rendering});
});

const getAttachment = async(fileName, attachments) => {
  const data = attachments.filter((file) => RegExp(".*" + fileName).test(file.name));
  if (data.length == 0) {
    return "attachment not found";
  }
  if(data[0].type != 'image/jpeg' && data[0].type != 'video/mp4')
    return null
  
  // return 'success'
  return await renderAttachment(fileName,data[0],)
};

async function renderAttachment(fileName,attachmentData){
    let width, height;
    if(attachmentData.type == "video/mp4"){
      const blob = new Blob([new Uint8Array(attachmentData.thumbnailData)],{type: 'image/png'})
      const bitmap = await createImageBitmap(blob)
      width = bitmap.width
      height = bitmap.height
      return { 
        mimeTypedata : 'image/png',
        src : attachmentData.thumbnailData,
        fileName,
        width,
        height
    }
    }
    if(attachmentData.decompressedData){
        const blob = new Blob([new Uint8Array(attachmentData.decompressedData)],{type: attachmentData.type})
        const bitmap = await createImageBitmap(blob)
        width = bitmap.width
        height = bitmap.height
        return { 
          mimeTypedata : attachmentData.type,
          src : attachmentData.decompressedData,
          fileName,
          width,
          height
      }
    }
 
}


function getDateString(date, includeTime = true) {
  if (date) {
    if (includeTime === true) {
      return moment(date).format("MMMM Do YYYY h:mm");
    } else {
      return moment(date).format("dddd, MMMM Do YYYY");
    }
  }
  return "";
}
