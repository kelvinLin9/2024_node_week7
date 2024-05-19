import PostModel from '../models/post.js';
import createHttpError from 'http-errors';
import { handleErrorAsync} from '../statusHandle/handleErrorAsync.js';


// 你感覺 `sendError` 函數和錯誤處理中間件（`app.use`）很相似，這是因為它們的目的和行為的確非常類似，都是用來處理和格式化錯誤響應的。然而，它們在應用中各自扮演著特定的角色和使用時機：

// 1. **`sendError` 函數**：
//    - **專用性**：這個函數通常在你的路由處理器中已經明確知道發生了特定錯誤時使用，例如當某些特定的業務邏輯失敗（如資料驗證失敗或特定資源不存在）時。
//    - **控制性**：使用 `sendError` 允許在確知錯誤發生時立即回應，你可以完全控制錯誤的處理時機和方法。

// 2. **錯誤處理中間件**：
//    - **全局性**：這是一種更全局的錯誤處理機制，用於捕捉整個應用範圍內未被捕捉的錯誤。這些錯誤可能來自於路由處理器內未被處理的異常，或其他中間件產生的錯誤。
//    - **後備機制**：當應用中的其他部分未能處理錯誤（例如，異步函數中未被捕捉的異常）時，錯誤處理中間件會介入，確保這些錯誤不會悄無聲息地失敗，而是以一種統一和控制的方式返回給客戶端。

// ### 總結

// 雖然它們外觀相似，因為都是產生錯誤響應，但它們的使用場景和目的不同。`sendError` 提供了更具體和即時的錯誤處理，而錯誤處理中間件則提供了一個安全網，確保所有通過路由和中間件的錯誤都被適當地處理。這兩者共同工作，為你的應用提供了全面的錯誤管理解決方案。



function sendResponse(res, statusCode, data, message = '') {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function sendError(res, statusCode, message) {
  res.status(statusCode).json({
    success: false,
    message
  });
}

export const getPosts = handleErrorAsync(async (req, res) => {
  const { page = 1, limit = 10, sort = 'desc', keyword = '' } = req.query;

  let query = {};
  if (keyword) {
      query.content = { $regex: keyword, $options: 'i' };
  }

  let sortOptions = { createdAt: sort === 'asc' ? 1 : -1 };

  const posts = await PostModel.find(query)
                               .populate('userId', 'name email')
                               .skip((page - 1) * limit)
                               .limit(limit)
                               .sort(sortOptions)
                               .exec();

  sendResponse(res, 200, posts);
});


export const getPost = handleErrorAsync(async (req, res) => {
  const post = await PostModel.findById(req.params.id)
                             .populate('userId', 'name email')
                             .exec();
  if (!post) {
      return sendError(res, 404, 'Post not found');
  }
  sendResponse(res, 200, post);
});


export const createPost = handleErrorAsync(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
      return sendError(res, 400, 'User ID is required');
  }
  const post = new PostModel({
      ...req.body,
      userId
  });
  const savedPost = await post.save();
  sendResponse(res, 201, savedPost, 'Post created successfully');
});


export const updatePost = handleErrorAsync(async (req, res) => {
  const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true,
  });
  if (!post) {
      return sendError(res, 404, 'Post not found');
  }
  sendResponse(res, 200, post, 'Post updated successfully');
});

export const deletePost = handleErrorAsync(async (req, res) => {
  const post = await PostModel.findByIdAndDelete(req.params.id);
  if (!post) {
      return sendError(res, 404, 'Post not found');
  }
  sendResponse(res, 200, post, 'Post deleted successfully');
});

export const deletePosts = handleErrorAsync(async (res) => {
  const result = await PostModel.deleteMany({});
  if (result.deletedCount === 0) {
      return sendError(res, 404, 'No posts found to delete');
  }
  sendResponse(res, 200, {}, `${result.deletedCount} posts deleted successfully`);
});





















// export const getPosts = async(req, res, next) => {
//   try {
//       const { page = 1, limit = 10, sort = 'desc', keyword = '' } = req.query;

//       let query = {};
//       if (keyword) {
//           query.content = { $regex: keyword, $options: 'i' };
//       }

//       let sortOptions = { createdAt: sort === 'asc' ? 1 : -1 };

//       const posts = await PostModel.find(query)
//                                   .populate('userId', 'name email')
//                                   .skip((page - 1) * limit)
//                                   .limit(limit)
//                                   .sort(sortOptions)
//                                   .exec();

//       sendResponse(res, 200, posts);
//   } catch (error) {
//       next(createHttpError(500, 'Server error retrieving posts'));
//   }
// };



// export const getPost = async(req, res, next) => {
//   try {
//       const post = await PostModel.findById(req.params.id)
//                                  .populate('userId', 'name email')
//                                  .exec();
//       if (!post) {
//           return sendError(res, 404, 'Post not found');
//       }
//       sendResponse(res, 200, post);
//   } catch (error) {
//       next(createHttpError(500, 'Server error retrieving post'));
//   }
// };


// export const createPost = async(req, res, next) => {
//   try {
//       const { userId } = req.body;  // 從請求體中提取 userId
//       if (!userId) {
//           return sendError(res, 400, 'User ID is required');
//       }
//       const post = new PostModel({
//           ...req.body,
//           userId
//       });
//       const savedPost = await post.save();
//       sendResponse(res, 201, savedPost, 'Post created successfully');
//   } catch (error) {
//       next(error);
//   }
// };



// export const updatePost = async(req, res, next) => {
//     try {
//         const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, { 
//             new: true,
//             runValidators: true,
//         });
//         if (!post) {
//             return sendError(res, 404, 'Post not found');
//         }
//         sendResponse(res, 200, post, 'Post updated successfully');
//     } catch (error) {
//         next(error);
//     }
// };

// export const deletePost = async(req, res, next) => {
//     try {
//         const post = await PostModel.findByIdAndDelete(req.params.id);
//         if (!post) {
//             return sendError(res, 404, 'Post not found');
//         }
//         sendResponse(res, 200, post, 'Post deleted successfully');
//     } catch (error) {
//         next(error);
//     }
// };

// export const deletePosts = async (req, res, next) => {
//   try {
//       const result = await PostModel.deleteMany({});
//       if (result.deletedCount === 0) {
//           return sendError(res, 404, 'No posts found to delete');
//       }
//       sendResponse(res, 200, {}, `${result.deletedCount} posts deleted successfully`);
//   } catch (error) {
//       next(error);
//   }
// };
