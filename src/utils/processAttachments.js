import * as pako from 'pako'

const inflate=(data)=>{
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
    // use uint8 array instead, the width and height can be calculated in the render attachment function
    return decompressedData;
  }
}

const getAttachment = (fileName, attachments ) => {
  const data= attachments.filter((file) =>RegExp(".*" + fileName).test(file.name));
  if(data.length == 0){
    return 'attachment not found'
  }
  if(data[0].compressedContent){
    data[0].decompressedData = inflate(data[0])
    const blob = new Blob([new Uint8Array(data[0].decompressedData)], { type: data[0].type });
    const url = URL.createObjectURL(blob);
    return {url,type: data[0].type }
  }
}

export {getAttachment}