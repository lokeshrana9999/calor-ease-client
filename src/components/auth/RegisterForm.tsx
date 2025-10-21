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

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      await registerUser(data);
      router.push('/dashboard');
    } catch (error: any) {
      // Error is handled by the auth context with specific messages
      // Additional handling could be added here if needed
      if (error.status === 400) {
        // Email already exists - user should try logging in
        // The error message is already shown by AuthContext
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Register for CalorEase</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Input
              label='First Name'
              placeholder='John'
              error={errors.firstName?.message}
              {...register('firstName')}
            />

            <Input
              label='Last Name'
              placeholder='Doe'
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label='Email'
            type='email'
            placeholder='john@example.com'
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
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <button
              type='button'
              onClick={() => router.push('/auth/login')}
              className='text-blue-600 hover:text-blue-500 font-medium'
            >
              Login here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
