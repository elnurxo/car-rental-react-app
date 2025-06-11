import * as Yup from "yup";

const carValidationSchema = Yup.object().shape({
  brand: Yup.string().min(2).max(50).required(),
  model: Yup.string().min(2).max(50).required(),
  year: Yup.number().min(1800).max(new Date().getFullYear()).required(),
  type: Yup.string().required(),
  pricePerDay: Yup.number().min(10).max(1000).required(),
  availability: Yup.boolean().default(false),
  imageUrl: Yup.string().url().required(),
});

export default carValidationSchema;
