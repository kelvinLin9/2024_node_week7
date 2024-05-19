import createHttpError from 'http-errors';
import validator from 'validator';
import { verifyToken } from '../utils/index.js';

// token 驗證
export const isAuth = async (req, _res, next) => {
    try {
        const token = `${req.headers.authorization?.replace('Bearer ', '')}`;
        verifyToken(token);
        console.log(verifyToken(token));
        req.user = verifyToken(token);
        next();
    } catch (error) {
        next(error);
    }
};

export const checkRequestBodyValidator = (req, _res, next) => {
    try {
        for (let [key, value] of Object.entries(req.body)) {
            if (value === undefined || value === null) {
                throw new Error('欄位未填寫正確');
            }

            const _value = `${value}`;

            switch (key) {
                case 'name':
                    if (!validator.isLength(_value, { min: 2 })) {
                        throw new Error('name 至少 2 個字元以上');
                    }
                    break;
                case 'email':
                    if (!validator.isEmail(_value)) {
                        throw new Error('Email 格式不正確');
                    }
                    break;
                case 'password':
                case 'newPassword':
                    if (!validator.isLength(_value, { min: 8 })) {
                        throw new Error('密碼需至少 8 碼以上');
                    }
                    if (validator.isAlpha(_value)) {
                        throw new Error('密碼不能只有英文');
                    }
                    if (validator.isNumeric(_value)) {
                        throw new Error('密碼不能只有數字');
                    }
                    if (!validator.isAlphanumeric(_value)) {
                        throw new Error('密碼需至少 8 碼以上，並英數混合');
                    }
                    break;
                case 'image':
                    if (!validator.isURL(_value, { protocols: ['https'] })) {
                        throw new Error('image 格式不正確');
                    }
                    break;
                default:
                    break;
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};
