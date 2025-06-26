import {z} from 'zod'

const shortenUrlSchema = z.object({
  url: z.string().url("Invalid URL format.").trim().min(5,"URL must not be empty.")
})

export {shortenUrlSchema}