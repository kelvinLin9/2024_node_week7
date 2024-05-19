

// import appError from "../service/appError.js";
import { handleErrorAsync } from '../statusHandle/handleErrorAsync.js';
import { v4 as uuidv4 } from 'uuid';
import firebaseAdmin from '../statusHandle/firebase.js';
const bucket = firebaseAdmin.storage().bucket(); // 取出存儲桶內容

const uploadFile =  handleErrorAsync(async (req, res, next) => {
  // 檢查是否有檔案被上傳
  if (!req.files.length) {
    return next(appError(400, "尚未上傳檔案", next));
  }

  // 取得上傳的檔案資訊列表裡面的第一個檔案
  const file = req.files[0];
  // 基於檔案的原始名稱建立一個 blob 物件
  const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`);
  // 建立一個可以寫入 blob 的物件
  const blobStream = blob.createWriteStream();

  // 將檔案的 buffer 寫入 blobStream
  blobStream.end(file.buffer);

  // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
  blobStream.on('finish', async () => {
    // 設定檔案的存取權限
    const config = {
      action: 'read', // 權限
      expires: '12-31-2500', // 網址的有效期限
    };
    try {
      const fileUrl = await blob.getSignedUrl(config);
      res.send({ fileUrl });
    } catch (error) {
      next(appError(500, "無法獲取檔案URL", next));
    }
  });

  // 如果上傳過程中發生錯誤，會觸發 error 事件
  blobStream.on('error', err => {
    next(appError(500, "上傳失敗", next));
  });
});

export {
  uploadFile
}
