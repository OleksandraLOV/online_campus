import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
} from "lucide-react";
import api from "../../services/api";
import {
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
} from "../../schemas/authSchema";
import type {
  PasswordResetConfirmFormData,
  PasswordResetRequestFormData,
} from "../../schemas/authSchema";

type PasswordResetRequestResponse = {
  message: string;
  expiresAt?: string;
  resetToken?: string;
  resetUrl?: string;
};

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const message = error.response?.data?.message;
  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    const validationMessages = message.filter(
      (item): item is string => typeof item === "string",
    );
    if (validationMessages.length > 0) {
      return validationMessages.join("\n");
    }
  }

  return fallback;
}

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get("token") ?? "";
  const isResetMode = initialToken.length > 0;

  return (
    <div
      className="min-h-screen bg-cover bg-no-repeat p-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10,25,47,0.30), rgba(10,25,47,0.30)), url('/login-bg.webp')",
        backgroundPosition: "center 5%",
      }}
    >
      <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center">
        <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="bg-blue-900 px-8 py-7 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white">
                <img
                  src="/maup_logo.svg"
                  alt="МАУП"
                  className="h-11 w-11 object-contain"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  {isResetMode ? "Новий пароль" : "Відновлення пароля"}
                </h1>
                <p className="mt-1 text-sm text-blue-100">Кампус МАУП</p>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            {isResetMode ? (
              <PasswordResetConfirmForm initialToken={initialToken} />
            ) : (
              <PasswordResetRequestForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordResetRequestForm() {
  const [message, setMessage] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (values: PasswordResetRequestFormData) => {
    setError("");
    setMessage("");
    setDevResetUrl("");
    setCopied(false);

    try {
      const { data } = await api.post<PasswordResetRequestResponse>(
        "/auth/password-reset/request",
        values,
      );

      setMessage(data.message);
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Не вдалося створити запит на відновлення"),
      );
    }
  };

  const handleCopy = async () => {
    if (!devResetUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(devResetUrl);
      setCopied(true);
    } catch {
      setError("Не вдалося скопіювати посилання. Скопіюйте його вручну.");
    }
  };

  return (
    <div>
      <div className="mb-7">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <Mail className="h-6 w-6" aria-hidden="true" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Забули пароль?</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Введіть логін або email. Якщо акаунт існує, система створить
          одноразове посилання для встановлення нового пароля.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden="true" />
            <span>{message}</span>
          </div>
        </div>
      )}

      {devResetUrl && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            Dev-посилання для відновлення
          </p>
          <p className="mt-1 break-all text-xs text-amber-800">{devResetUrl}</p>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-300 px-3 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-100"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            {copied ? "Скопійовано" : "Скопіювати"}
          </button>
        </div>
      )}

      {error && (
        <div className="mb-5 whitespace-pre-line rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Логін або email
          </label>
          <input
            type="text"
            {...register("identifier")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="student1 або student@maup.com.ua"
          />
          {errors.identifier && (
            <p className="mt-1 text-sm text-red-600">
              {errors.identifier.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-blue-700 py-3 font-medium text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
        >
          {isSubmitting ? "Створення запиту..." : "Відновити пароль"}
        </button>
      </form>

      <BackToLoginLink />
    </div>
  );
}

function PasswordResetConfirmForm({ initialToken }: { initialToken: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(passwordResetConfirmSchema),
    defaultValues: {
      token: initialToken,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordResetConfirmFormData) => {
    setError("");
    setMessage("");

    try {
      const { data } = await api.post<{ message: string }>(
        "/auth/password-reset/confirm",
        {
          token: values.token,
          newPassword: values.newPassword,
        },
      );

      setMessage(data.message);
    } catch (err) {
      setError(getApiErrorMessage(err, "Не вдалося змінити пароль"));
    }
  };

  return (
    <div>
      <div className="mb-7">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <KeyRound className="h-6 w-6" aria-hidden="true" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          Створіть новий пароль
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Посилання одноразове. Після зміни пароля всі активні сесії акаунта
          будуть відкликані.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden="true" />
            <span>{message}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-5 whitespace-pre-line rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register("token")} />
        {errors.token && (
          <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            {errors.token.message}
          </p>
        )}

        <PasswordField
          label="Новий пароль"
          placeholder="Введіть новий пароль"
          registration={register("newPassword")}
          show={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
          error={errors.newPassword?.message}
        />

        <PasswordField
          label="Повторіть пароль"
          placeholder="Повторіть новий пароль"
          registration={register("confirmPassword")}
          show={showConfirmPassword}
          onToggle={() => setShowConfirmPassword((current) => !current)}
          error={errors.confirmPassword?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting || Boolean(message)}
          className="w-full rounded-xl bg-blue-700 py-3 font-medium text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
        >
          {isSubmitting ? "Збереження..." : "Змінити пароль"}
        </button>
      </form>

      <BackToLoginLink />
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  registration,
  show,
  onToggle,
  error,
}: {
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  show: boolean;
  onToggle: () => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...registration}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-14 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Приховати пароль" : "Показати пароль"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-blue-700"
        >
          {show ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function BackToLoginLink() {
  return (
    <div className="mt-6 flex justify-center">
      <Link
        to="/login"
        className="inline-flex items-center gap-2 text-sm text-blue-700 transition-colors hover:text-blue-900 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Повернутися
      </Link>
    </div>
  );
}
