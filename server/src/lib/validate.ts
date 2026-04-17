import joi from "joi";

function validateRegister(data: {
  email: string;
  name: string;
  password: string;
}) {
  const schema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  return schema.validate(data);
}

function loginValidation(data: { email: string; password: string }) {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  return schema.validate(data);
}
export { validateRegister, loginValidation };
