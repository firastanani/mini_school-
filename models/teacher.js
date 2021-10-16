const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");
const validator = require("validator");
const serverConstant = require('../config/serverConstant')
const teacherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        const regex = /^[\p{L}. ]+[\p{N}]*$/u;
        if (!regex.test(value)) {
          const errors = new Error(
            "The name must only contain letters or ends with numbers"
          );
          errors.code = 400;
          throw errors;
        }
      },
      minlength: [5, "name must be gretar than 5 charactar"],
      maxlength: [50, "name must be less  50 charactar"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [5, "name must be gretar than 5 charactar"],
      maxlength: [50, "name must be less  50 charactar"],
      validate(value) {
        if (!validator.isEmail(value)) {
          const errors = new Error("is not valid Email");
          errors.code = 400;
          throw errors;
        }
      },
      validate(value) {
        const regex = /^\w+[\+\.\w-]*@([\w-]+.)*\w+[\w-]*.([a-z]{2,4}|d+)$/i;
        if (!regex.test(value)) {
          const errors = new Error("please check email is correct");
          errors.code = 400;
          throw errors;
        }
      },
    },
    imageUrl: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "name must be gretar than 5 charactar"],
      maxlength: [200, "name must be less  50 charactar"],
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a postive number");
        }
      },
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    tokens: {
      type: [String],
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      maxlength: 10,
    }
  },
  { timestamps: true, toObject: { virtuals: true } }
);


teacherSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id, type: serverConstant.TEACHER }, config.get("jwtPrivateKey"));
  user.tokens.push(token);
  await user.save();

  return token;
};


teacherSchema.virtual("requests", {
  ref: "Requst",
  localField: "_id",
  foreignField: "owner",
});

//for login
teacherSchema.statics.findByCredentials = async (email, password) => {
  const teacher = await Teacher.findOne({ email: email });
  if (!teacher) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) {
    const errors = new Error("invalid input");
    errors.data = "password is not correct";
    errors.code = 400;
    throw errors;
  }

  if (teacher.confirm != true) {
    const errors = new Error("acount not activated");
    errors.data = "please activate your account";
    errors.code = 401;
    throw errors;
  }

  return teacher;
};

//validate login
teacherSchema.statics.validateLogin = (userInput) => {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email({ tlds: { allow: ["com", "net"] } })
      .regex(/^\w+[\+\.\w-]*@([\w-]+.)*\w+[\w-]*.([a-z]{2,4}|d+)$/i)
      .message("please check your email"),
    password: Joi.string().min(5).max(50).required(),
  };

  const { error } = Joi.object(schema).validate(userInput);

  if (error) {
    const errors = new Error("invalid input");
    errors.data = error.details[0].message;
    errors.code = 400;
    throw errors;
  }
};

//validate create user
teacherSchema.statics.validateTeacher = (user) => {
  const schema = {
    image: Joi.any(),
    phoneNumber: Joi.any(),
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
      .regex(/^[\p{L}. ]+[\p{N}]*$/u)
      .message("please check your name"),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email({ tlds: { allow: ["com", "net"] } })
      .regex(/^\w+[\+\.\w-]*@([\w-]+.)*\w+[\w-]*.([a-z]{2,4}|d+)$/i)
      .message("please check your email"),
    password: Joi.string().min(5).max(50).required(),
    age: Joi.number().min(0),
  };

  const { error } = Joi.object(schema).validate(user);

  if (error) {
    const errors = new Error("invalid input");
    errors.data = error.details[0].message;
    errors.code = 400;
    throw errors;
  }
};

//validate update user
teacherSchema.statics.validateUpdateUser = (user) => {
  const schema = {
    image: Joi.any(),
    name: Joi.string()
      .min(5)
      .max(50)
      .regex(/^[\p{L} ]+\p{N}*$/u)
      .message("please check your name"),
    age: Joi.number().min(0),
  };

  const { error } = Joi.object(schema).validate(user);

  if (error) {
    const errors = new Error("invalid input");
    errors.data = error.details[0].message;
    errors.code = 400;
    throw errors;
  }
};

//hash password before save
teacherSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const Teacher = mongoose.model("Teacher", teacherSchema);

exports.Teacher = Teacher;
