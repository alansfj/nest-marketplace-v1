import { z, ZodError } from 'zod';

export function validate(config: Record<string, any>) {
  try {
    return configSchema.parse(config);
  } catch (error) {
    let message = '';

    if (error instanceof ZodError) {
      const issue = error.issues[0];
      message = `${issue.path[0]} - ${issue.message}`;
    } else {
      message = 'Something went wrong.';
    }

    throw new Error(`Error on validating enviroment variables: ${message}`);
  }
}

const configSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d+$/, { message: 'PORT must be a number' })
    .transform((val) => Number(val))
    .refine((port) => port >= 1 && port <= 65535, {
      message: 'PORT must be greater than 1 and less than 65535',
    }),
  POSTGRES_USER: z.string().trim().min(5),
  POSTGRES_DB: z.string().trim().min(2),
  POSTGRES_PASSWORD: z.string().trim().min(3),
  POSTGRES_URL: z.string().trim().min(1),
  POSTGRES_HOST: z.string().trim().min(1),
  POSTGRES_PORT: z
    .string()
    .regex(/^\d+$/, { message: 'POSTGRES PORT must be a number' })
    .transform((val) => Number(val))
    .refine((port) => port >= 1 && port <= 65535, {
      message: 'POSTGRES PORT must be greater than 1 and less than 65535',
    }),
  JWT_SECRET: z.string().trim().min(20),
  SALT_ROUNDS: z
    .string()
    .regex(/^\d+$/, { message: 'SALT_ROUNDS must be a number' })
    .transform((val) => Number(val)),
});
