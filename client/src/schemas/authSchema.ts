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

const passwordRecoveryPasswordSchema = z
  .string()
  .min(8, 'Пароль має бути не коротшим за 8 символів')
  .max(50, 'Пароль має бути не довшим за 50 символів')
  .regex(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    'Пароль має містити велику літеру, малу літеру та цифру або спецсимвол',
  );

export const passwordResetRequestSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(2, 'Введіть логін або email')
    .max(120, 'Значення занадто довге'),
});

export const passwordResetConfirmSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(32, 'Некоректне посилання для відновлення')
      .max(200, 'Некоректне посилання для відновлення'),
    newPassword: passwordRecoveryPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Паролі не збігаються',
    path: ['confirmPassword'],
  });

export type PasswordResetRequestFormData = z.infer<
  typeof passwordResetRequestSchema
>;
export type PasswordResetConfirmFormData = z.infer<
  typeof passwordResetConfirmSchema
>;
