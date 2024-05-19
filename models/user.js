import { Schema, model } from 'mongoose';
import validator from 'validator';

const userSchema = new Schema({
    name: {
        type: String,
        validate: {
            validator: function(value) {
                return validator.isLength(value, { min: 2 });
            },
            message: 'name 至少需要 2 個字元以上'
        }
    },
    email: {
        type: String,
        required: [true, 'email 未填寫'],
        validate: {
            validator: function(value) {
                return validator.isEmail(value);
            },
            message: 'Email 格式不正確'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password 未填寫'],
        select: false
    },
    photo: {
      type: String,
      default: '',
      validate: {
          validator: function(value) {
            return value === '' || validator.isURL(value, {
                protocols: ['http', 'https'],
                require_protocol: true
            });
          },
          message: '大頭照的 URL 格式不正確'
      }
    },
    sex: {
        type: String,
        enum: ['male', 'female'],
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model('User', userSchema);
