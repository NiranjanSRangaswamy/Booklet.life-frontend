import { chatColors, hexToRgbA } from "./colors";

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

  static getMediaTypes(attachments, totalMessages) {
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

    attachments.forEach((attachment) => {
      const ext = attachment.name.split(".").pop().toLowerCase();
      if (!ext) return;

      else if(typeMappings.image.includes(ext)){
        mediaTypes.images++;
        attachment.type = "image/jpeg"
      }
      else if(typeMappings.audio.includes(ext)){
        mediaTypes.audio++
        attachment.type = "audio/mpeg"
      }
      else if(typeMappings.video.includes(ext)){
        mediaTypes.video++
        attachment.type = "video/mp4"
      }
      else{
        mediaTypes.documents++
        attachment.type = "others"
      }
    });

    return { media: mediaTypes, attachments };
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
