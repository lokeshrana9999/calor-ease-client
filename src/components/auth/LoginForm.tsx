'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import Button from '@/components/buttons/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      await login(data);
      // TODO: maybe redirect based on user role later?
      router.push('/dashboard');
    } catch (error: any) {
      // Error is handled by the auth context - server message will be shown
      // console.log('Login error details:', error); // Debug - remove later
    } finally {
      setIsSubmitting(false);
    }
  };

  // Old validation approach - keeping for reference
  // const validateForm = (data: LoginFormData) => {
  //   const errors: any = {};
  //   if (!data.email) errors.email = 'Email required';
  //   if (!data.password) errors.password = 'Password required';
  //   return errors;
  // };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Login to CalorEase</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Input
            label='Email'
            type='email'
            placeholder='Enter your email'
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label='Password'
            type='password'
            placeholder='Enter your password'
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{' '}
            <button
              type='button'
              onClick={() => router.push('/auth/register')}
              className='text-blue-600 hover:text-blue-500 font-medium'
            >
              Register here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
