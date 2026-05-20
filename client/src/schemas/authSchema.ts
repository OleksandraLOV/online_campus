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
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Введіть поточний пароль'),

    newPassword: z
      .string()
      .min(8, 'Пароль має бути не коротшим за 8 символів')
      .max(50, 'Пароль має бути не довшим за 50 символів')
      .regex(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        'Пароль має містити хоча б одну велику літеру, одну малу та одну цифру або спецсимвол',
      ),

    confirmPassword: z.string().min(1, 'Повторіть новий пароль'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;