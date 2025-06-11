import * as Yup from "yup";

const registerValidationSchema = Yup.object().shape({
  fullName: Yup.string().min(3).max(20).required(),
  email: Yup.string().email().required(),
  phone: Yup.string().required(),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    )
    .required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required(),
  profileImage: Yup.string().url().optional(),
  balance: Yup.number().min(0).max(500).required(),
});

export default registerValidationSchema;
