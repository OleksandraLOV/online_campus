import { z } from 'zod';

export const loginSchema = z.object({
  login: z
    .string()
    .min(2, 'Логін має містити мінімум 2 символи'),

  password: z
    .string()
    .min(8, 'Пароль має містити мінімум 8 символів')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
     // /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]+$/, Роздокументувати, коли будуть створенні нові користувачі у бд
      'Пароль має містити англійські літери, цифри та спецсимвол',
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;