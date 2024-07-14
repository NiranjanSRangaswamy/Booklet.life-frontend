import jsPDF from "jspdf";
import darkBg from "../assets/dark1-bg.png";
import lightBg from "../assets/light-bg.png";
import darkIcon from '../assets/logo-white.jpg';
import lightIcon from '../assets/logo-green.jpg';

const renderPDF = async (chat, ego, darkMode = true, sample = true) => {

  console.log(chat);

  const backgroundColor = darkMode ? '#21a68d' : '#ffffff';
  const backgroundImage = darkMode ? darkBg : lightBg;
  const icon = darkMode ? darkIcon : lightIcon;
  const textColor = darkMode ? [255, 255, 255] : [33, 166, 141];

  const width = 210;
  const height = 297;
  const fontSize = 11;
  const marginTop = 32;
  const marginLeft = 20;
  const pageYSpace = 297 - marginTop;
  const lineHeight = (fontSize * 1.5) / 3.64;

  const doc = new jsPDF();
  let usedYSpace = 0;

  const setBackgroundColor = (doc, color) => {
    doc.setFillColor(color);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
  };

  const setBackgroundImage = (doc, imageSrc) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgWidth = img.width;
        const imgHeight = img.height;
        const pageRatio = pageWidth / pageHeight;
        const imgRatio = imgWidth / imgHeight;

        let drawWidth, drawHeight;
        let offsetX = 0, offsetY = 0;

        if (imgRatio > pageRatio) {
          drawHeight = pageHeight;
          drawWidth = imgWidth * (pageHeight / imgHeight);
          offsetX = (pageWidth - drawWidth) / 2;
        } else {
          drawWidth = pageWidth;
          drawHeight = imgHeight * (pageWidth / imgWidth);
          offsetY = (pageHeight - drawHeight) / 2;
        }

        doc.addImage(img, 'PNG', offsetX, offsetY, drawWidth, drawHeight);
        resolve();
      };
      img.onerror = reject;
    });
  };

  const addColoredPage = async (isBackgroundImageRequired) => {
    doc.addPage();
    setBackgroundColor(doc, backgroundColor);
    if (isBackgroundImageRequired) await setBackgroundImage(doc, backgroundImage);

    const iconWidth = 40;
    const iconHeight = 10;
    const iconMargin = 5;
    const pageWidth = doc.internal.pageSize.getWidth();
    usedYSpace = marginTop;

    doc.addImage(icon, 'PNG', pageWidth - iconWidth - iconMargin, iconMargin, iconWidth, iconHeight);
  };

  const addPageIfNeeded = (height) => {
    if (usedYSpace + height > pageYSpace) {
      addColoredPage(false);
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


  // PDF generation starts from here
  setBackgroundColor(doc, backgroundColor);
  const iconMargin = 5;
  const iconWidth = 40;
  const iconHeight = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.addImage(icon, 'PNG', pageWidth - iconWidth - iconMargin, iconMargin, iconWidth, iconHeight);

  // statistics are stored in variables
  const numberOfDays = chat.statistics['noOfDays'];
  const lastMessage = chat.statistics['lastMessage'];
  const firstMessage = chat.statistics['firstMessage'];
  const totalMessages = chat.statistics['totalMessages'];
  const mostActiveUser = chat.statistics['mostActiveUser'];
  const mostActiveMonth = chat.statistics['mostActiveMonth'];
  const totalParticipants = chat.statistics['totalParticipants'];
  const averageMessagePerUser = chat.statistics['averageMessagePerUser'];

  //statistics starts from here
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
  doc.text('Number of Days', marginLeft, usedYSpace += 15);
  doc.text(`:   ${numberOfDays}`, marginLeft + 70, usedYSpace);
  doc.text('Total Messages', marginLeft, usedYSpace += 10);
  doc.text(`:   ${totalMessages}`, marginLeft + 70, usedYSpace);
  doc.text('Total Participants', marginLeft, usedYSpace += 10);
  doc.text(`:   ${totalParticipants}`, marginLeft + 70, usedYSpace);
  doc.text('Most Active User', marginLeft, usedYSpace += 10);
  doc.text(`:   ${mostActiveUser}`, marginLeft + 70, usedYSpace);
  doc.text('Most Active Month', marginLeft, usedYSpace += 10);
  doc.text(`:   ${mostActiveMonth}`, marginLeft + 70, usedYSpace);
  doc.text('Average Messages Per User', marginLeft, usedYSpace += 10);
  doc.text(`:   ${averageMessagePerUser}`, marginLeft + 70, usedYSpace);

  usedYSpace += 25;
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("Participants", marginLeft, usedYSpace);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  Object.keys(chat.personColorMap).forEach((user) => {
    if (user !== 'null') {
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
    if (user.name !== 'null') {
      if (usedYSpace + funFactHeight > pageYSpace) {
        addColoredPage(false);
      }
      usedYSpace += 15;
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(String(user.name), marginLeft, usedYSpace);

      doc.setFontSize(15);
      doc.setFont("helvetica", "normal");
      doc.text('Messages sent', marginLeft, usedYSpace += 8);
      doc.text(`:   ${user.numberOfMessages}`, marginLeft + 70, usedYSpace);
      doc.text('Longest Message', marginLeft, usedYSpace += 7);
      doc.text(`:   ${user.longestMessage}`, marginLeft + 70, usedYSpace);
      doc.text('Words per message', marginLeft, usedYSpace += 7);
      doc.text(`:   ${user.averageMessageLength}`, marginLeft + 70, usedYSpace);
      doc.text('Total words', marginLeft, usedYSpace += 7);
      doc.text(`:   ${user.numberOfWords}`, marginLeft + 70, usedYSpace);
      doc.text('Unique words', marginLeft, usedYSpace += 7);
      doc.text(`:   ${user.uniqueWords}`, marginLeft + 70, usedYSpace);
    }
  });

  // Charts page starts form here

  doc.save("sample.pdf");
};

export default renderPDF;
