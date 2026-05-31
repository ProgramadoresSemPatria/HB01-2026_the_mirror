import { z } from 'zod';

const emailRule = z.string().trim().email('Use um email válido.');
const passwordRule = z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres.');
const nameRule = z.string().trim().min(1, 'Informe seu nome.');

export const registerSchema = z.object({
  name: nameRule,
  email: emailRule,
  password: passwordRule,
});

export const loginSchema = z.object({
  email: emailRule,
  password: passwordRule,
});
