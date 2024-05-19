import { Schema, model } from 'mongoose';

// - image：貼文圖片
// - content：貼文內容(必填)
// - likes：按讚數
// - comments：留言數
// - createdAt：發文時間
// - type：貼文種類 fan(粉絲)、group(社團) (必填)
// - tags：貼文標籤(必填)
// - userId：關聯發文者資料(必填)

const postSchema = new Schema(
    {
      image: {
          type: String,
          default: '',
          cast: false
      },
      content: {
          type: String,
          required: [true, '貼文內容必填'],
          cast: false
      },
      likes: {
          type: Number,
          default: 0,
          cast: false
      },
      comments: {
          type: Number,
          default: 0,
          cast: false
      },
      createdAt: {
          type: Date,
          default: Date.now,
          select: false
      },
      type: {
          type: String,
          required: [true, '貼文種類必填'],
          enum: ['fan','group'],
          cast: false
      },
      tags: [{
          type: String,
          cast: false
      }],
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, '貼文必須關聯一個使用者']
      }
    },
    {
        versionKey: false
    }
);

export default model('Post', postSchema);