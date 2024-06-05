import { parseString } from "whatsapp-chat-parser";
import JSZip from "jszip";

class FileProcessor {
  constructor(props) {
    this.props = props;
  }

  processFileList(file) {
    if (!file) return 'File is not selected';
    const reader = new FileReader();
    if (/^application\/(?:x-)?zip(?:-compressed)?$/.test(file.type)) {
      reader.addEventListener('loadend', this.zipLoadEndHandler.bind(this));
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'text/plain') {
      reader.addEventListener('loadend', this.txtLoadEndHandler.bind(this));
      reader.readAsText(file);
    } else {
      return 'wrong file';
    }
  }

  async zipLoadEndHandler(e) {
    const arrayBuffer = e.target.result;
    const zip = await JSZip.loadAsync(arrayBuffer);

    const chatFile = await this.getChatFile(zip);
    const messages = await parseString(chatFile, { parseAttachments: true });
    this.updateMessages({
      messages,
      attachments: await Promise.all(
        Object.values(zip.files).map(async (file) => ({
          name: file.name,
          compressedContent: await file.async('arraybuffer'),
        }))
      ),
    });
  }

  txtLoadEndHandler(e) {
    const messages = parseString(e.target.result);
    this.updateMessages({ messages });
  }

  async extendDataStructure(chatObject) {
    let authors = {};
    await chatObject.messages.forEach((object, index) => {
      if (!(object.author in authors)) authors[object.author] = 0;
      else authors[object.author] += 1;
      object.absolute_id = index;
      object.personal_id = authors[object.author];
    });
    this.props.getAuthors(Object.keys(authors));
  }

  updateMessages(chatObject) {
    console.log(chatObject);
    this.extendDataStructure(chatObject);
    this.props.getChat(chatObject);
  }

  async getChatFile(zipData) {
    const chatFile = zipData.file('_chat.txt');
    if (chatFile) return await chatFile.async('string');

    return zipData
      .file(/.*(?:chat|whatsapp).*\.txt$/i)
      .sort((a, b) => a.name.length - b.name.length)[0]
      .async('string');
  }

  readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
}

export default FileProcessor;
