import z from 'zod'

const registerUserSchema = z.object({
  username: z.string().min(3, "Username must be atleast 3 characters").max(15, "Username too long.").trim(),
  email: z.string().email("Invalid email address."),
  password: z.string({
    required_error: "Password is required",
  })
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ),
  confirmPassword: z.string()
})

const loginUserSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string({
    required_error: "Password is required",
  })
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  )
})
export {registerUserSchema, loginUserSchema}