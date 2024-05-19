import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

import usersRouter from './routes/users.js';
import postsRouter from './routes/posts.js';
import uploadRouter from './routes/upload.js';


const app = express();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception: ', err);
  // 記錄錯誤後，進行重啟或終止程序，取決於應用程式需求
  process.exit(1); // 退出程序
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // 處理邏輯，例如記錄錯誤或發送警報
});


mongoose.connect(`mongodb+srv://kelvin80121:${process.env.DB_CONNECTION_STRING}@data.freax1j.mongodb.net`)
  .then(res=> console.log("連線資料成功"))
  .catch(err=> console.log("連線資料失敗"));


app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter)


app.use((err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const statusCode = err.status || 500;

  // 如果是開發環境，返回詳細的錯誤信息
  if (isDevelopment) {
      res.status(statusCode).json({
          success: false,
          error: {
              message: err.message,
              stack: err.stack
          }
      });
  } else {
      // 在生產環境中，隱藏錯誤細節，返回通用錯誤信息
      res.status(statusCode).json({
          success: false,
          message: 'An internal server error occurred.'
      });
  }
});

// 修正404 Not Found中間件
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});





// 故意拋出一個錯誤來測試 uncaughtException 處理
// setTimeout(() => {
//   throw new Error('This is an uncaught exception');
// }, 1000);

// 創建一個將會被拒絕但未被捕捉的 Promise 來測試 unhandledRejection
// new Promise((resolve, reject) => {
//   reject(new Error('This is an unhandled rejection'));
// });





export default app;
