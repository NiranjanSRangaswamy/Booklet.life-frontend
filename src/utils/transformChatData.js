import { chatColors, hexToRgbA } from "./colors";
import * as pako from 'pako';

export class Chat {
  constructor(chatObject = [], groupAfter = 9, maxWordsWordCloud = 150) {
    this.chatObject = chatObject.messages;
    this._groupAfter = groupAfter;
    this._maxWordsWordCloud = maxWordsWordCloud;
    this.filteredChatObject = Chat.removeSystemMessages(this.chatObject);
    this.totalMessages = this.filteredChatObject.filter((message)=>(message.author !== null)).length;
    this.media = Chat.getMediaTypes(chatObject.attachments, this.totalMessages);

    const messagesPerPerson = Chat.getMessagesPerPerson(this.filteredChatObject);
    this.numPersonsInChat = Object.keys(messagesPerPerson).length;
    this.personColorMap = Chat.assignColors(messagesPerPerson);

    this._sortedFreqList = null;
    this._messagesPerPerson = null;
    this._dates = null;
    this.funFacts = this.getFunFacts();
    this.statistics = Chat.getStatistics(this.filteredChatObject, this.numPersonsInChat -1);
  }
  static async getMediaTypes(attachments, totalMessages) {
    const mediaTypes = {
      totalMessages,
      images: 0,
      audio: 0,
      video: 0,
      documents: 0,
    };
  
    const typeMappings = {
      image: ["jpeg", "jpg", "png", "gif", "svg", "webp"],
      video: ["mp4", "avi", "mkv", "webm", "3gp", "mpeg"],
      audio: ["mp3", "aac", "wav", "ogg", "m4a", "opus"],
    };
  
    const thumbnailPromises = attachments.map(async (attachment) => {
      const ext = attachment.name.split(".").pop().toLowerCase();
      if (typeMappings.image.includes(ext)) {
        mediaTypes.images++;
        attachment.type = "image/jpeg";
        attachment.decompressedData = Chat.inflate(attachment);
      } else if (typeMappings.audio.includes(ext)) {
        mediaTypes.audio++;
        attachment.type = "audio/mpeg";
        attachment.decompressedData = null;
      } else if (typeMappings.video.includes(ext)) {
        attachment.type = "video/mp4";
        mediaTypes.video++;
        attachment.thumbnailData = await Chat.generateThumbnailForVideo(attachment);  

      } else {
        attachment.type = "others";
        mediaTypes.documents++;
        attachment.decompressedData = null;
      }
    });
  
    await Promise.all(thumbnailPromises);
  
    return { media: mediaTypes, attachments };
  }
  

  static async generateThumbnailForVideo(attachment) {
    const decompressedData = Chat.inflate(attachment);
    const blob = new Blob([decompressedData], { type: attachment.type });
    const videoUrl = URL.createObjectURL(blob);
  
    // Await the thumbnail creation and return it
    const thumbnailData = await Chat.createThumbnail(videoUrl);
    return thumbnailData;
  }
  

  static createThumbnail(videoUrl) {
    return new Promise((resolve) => {
      const videoElement = document.createElement("video");
      videoElement.src = videoUrl;
  
      videoElement.addEventListener("loadeddata", () => {
        videoElement.currentTime = 0; // Capture a frame at 2 seconds
      });
  
      videoElement.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
  
        const context = canvas.getContext("2d");
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
        // Draw the play button
        const playButtonSize = Math.min(canvas.width, canvas.height) / 12;
        const playButtonX = (canvas.width - playButtonSize) / 2;
        const playButtonY = (canvas.height - playButtonSize) / 2;
  
        context.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black circle
        context.beginPath();
        context.arc(
          canvas.width / 2,
          canvas.height / 2,
          playButtonSize,
          0,
          Math.PI * 2
        );
        context.fill();
  
        context.fillStyle = "white"; // White play icon
        context.beginPath();
        context.moveTo(playButtonX, playButtonY);
        context.lineTo(playButtonX + playButtonSize, playButtonY + playButtonSize / 2);
        context.lineTo(playButtonX, playButtonY + playButtonSize);
        context.closePath();
        context.fill();
  
        canvas.toBlob(async (blob) => {
          const arrayBuffer = await blob.arrayBuffer();
          const thumbnailData = new Uint8Array(arrayBuffer);
          resolve(thumbnailData); // Return the thumbnail data with play button
        }, "image/png");
      });
    });
  }
  

  static inflate(data) {
    const inflater = new pako.Inflate({ raw: true });
    const chunkSize = 1024;
    let offset = 0;
    const compressedData = data.compressedContent;
    while (offset < compressedData.length) {
      const end = Math.min(offset + chunkSize, compressedData.length);
      const chunk = compressedData.subarray(offset, end);
      inflater.push(chunk);
      offset = end;
    }
    if (inflater.err) {
      throw Error(`Error inflating data: ${inflater.msg}`);
    } else {
      const decompressedData = inflater.result;
      return decompressedData;
    }
  }

  static removeSystemMessages(chatObject) {
    return chatObject.filter(
      (message) =>
        message.author !== "system" &&
        message.author !== "null" &&
        message.author !== "null\n" &&
        message.message !== "null" &&
        message.message !== "<Media omitted>"
    );
  }

  static groupBy(chatObject, key) {
    return chatObject.reduce((acc, item) => {
      (acc[item[key]] = acc[item[key]] || []).push(item);
      return acc;
    }, {});
  }

  static getTotalNumberOfWords(chatObject) {
    return chatObject.reduce((acc, { message }) => acc + message.split(" ").length, 0);
  }

  static uniqueWords(chatDistribution) {
    return chatDistribution.filter(([_, count]) => count === 1);
  }

  static getLongestMessage(chatObject) {
    return Math.max(...chatObject.map(({ message }) => message.split(" ").length));
  }
  // creates a sorted FreqArray for the chat corpus [{word: 10},{hi:9},...]
  static createSortedFreqDict(chatObject) {
    const messageString = chatObject.map(({ message }) => message.replace(/\u200E/gi, "")).join(" ");
    const messageArray = messageString.replace(/\n/g, " ").split(" ");
    const distribution = messageArray.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).sort(([, countA], [, countB]) => countB - countA);
  }
  
  static getMessagesPerPerson(chatObject) {
    return this.groupBy(chatObject, "author");
  }

  static hourlyDataFromChat(messages) {
    const hours = new Array(24).fill(0);
    messages.forEach(({ date }) => {
      hours[date.getHours()]++;
    });
    return hours;
  }

  static dailyDataFromChat(messages) {
    const days = new Array(7).fill(0);
    messages.forEach(({ date }) => {
      days[date.getDay()]++;
    });
    return days;
  }

  static weeklyDataFromChat(messages) {
    const months = new Array(12).fill(0);
    messages.forEach(({ date }) => {
      months[date.getMonth()]++;
    });
    return months;
  }

  static getStatistics(chatObject, numPersonsInChat) {
    const users = Chat.getMessagesPerPerson(chatObject);
    const monthlyData = Chat.weeklyDataFromChat(chatObject);
    const hourlyData = Chat.hourlyDataFromChat(chatObject);

    const totalMessages = chatObject.length;
    const firstMessageDate = chatObject[chatObject.findIndex(message => message.author !== null)].date;
    const lastMessageDate = chatObject.at(-1).date;
    const noOfDays = Math.ceil((lastMessageDate - firstMessageDate) / (1000 * 60 * 60 * 24));

    const mostActiveMonth = new Date(0, monthlyData.indexOf(Math.max(...monthlyData)), 1).toLocaleString("default", { month: "long" });
    const mostActiveUser = Object.entries(users).reduce((max, curr) => (curr[1].length > max[1].length ? curr : max))[0];
    const averageMessagePerUser = (totalMessages / numPersonsInChat).toFixed(2);
    const messagesPerDay = (totalMessages / noOfDays).toFixed(2);
    const messagePerMonth = (totalMessages / (noOfDays / 30)).toFixed(2);

    const formatDate = (date) => `${date.getDate()} ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;

    return {
      hourlyData,
      monthlyData,
      noOfDays,
      totalMessages,
      firstMessage: formatDate(firstMessageDate),
      lastMessage: formatDate(lastMessageDate),
      mostActiveMonth,
      mostActiveUser,
      totalParticipants: numPersonsInChat,
      averageMessagePerUser,
      messagesPerDay,
      messagePerMonth,
    };
  }

  static assignColors(messagesPerPerson) {
    return Object.keys(messagesPerPerson).reduce((acc, person, idx) => {
      acc[person] = chatColors[idx % chatColors.length];
      return acc;
    }, {});
  }

  get sortedFreqDict() {
    if (this._sortedFreqList) return this._sortedFreqList;
    this._sortedFreqList = Chat.createSortedFreqDict(this.chatObject);
    return this._sortedFreqList;
  }

  get groupAfter() {
    return this._groupAfter;
  }

  get messagesPerPerson() {
    if (this._messagesPerPerson) return this._messagesPerPerson;
    this._messagesPerPerson = this._getMessagesPerPerson();
    return this._messagesPerPerson;
  }

  _getMessagesPerPerson() {
    let persons = Object.entries(Chat.getMessagesPerPerson(this.filteredChatObject)).sort(([, a], [, b]) => b.length - a.length);
    let enrichedPersons = [];
    let grouped = false;

    persons.forEach(([name, messages], idx) => {
      if (idx > this._groupAfter) {
        enrichedPersons[this._groupAfter].messages.push(...messages);
        grouped = true;
      } else {
        enrichedPersons.push({
          name,
          color: this.personColorMap[name],
          messages: messages.sort((a, b) => a.date - b.date),
        });
      }
    });

    if (grouped) {
      enrichedPersons[this._groupAfter].name = "Others";
      enrichedPersons[this._groupAfter].color = "#D3D3D3";
      enrichedPersons[this._groupAfter].messages.sort((a, b) => a.absolute_id - b.absolute_id);
    }

    return enrichedPersons;
  }

  getFunFacts() {
    return this.messagesPerPerson.map((person) => {
      const { name, color, messages } = person;
      const numberOfMessages = messages.length;
      const numberOfWords = Chat.getTotalNumberOfWords(messages);
      const longestMessage = Chat.getLongestMessage(messages);
      const personalFreqDict = Chat.createSortedFreqDict(messages);
      const uniqueWords = Chat.uniqueWords(personalFreqDict).length;
      const averageMessageLength = Math.round(numberOfWords / numberOfMessages);

      return {
        name,
        color,
        numberOfMessages,
        numberOfWords,
        longestMessage,
        uniqueWords,
        averageMessageLength,
      };
    });
  }

}

async function prepareChatObject(chatObject) {
  const chat = new Chat(chatObject);
  const mediaData =await chat.media;

  // Generate thumbnails for videos
  const thumbnailPromises = mediaData.attachments.map(async (attachment) => {
    try {
      if (attachment.type.startsWith("video/")) {
        attachment.decompressedData = attachment.decompressedData;  // Await the thumbnail

      }
      
    } catch (error) {
    }
  })

  await Promise.all(thumbnailPromises); 

  return chat;
}

export {prepareChatObject}