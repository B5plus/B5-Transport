import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequest } from '../types';
import { Car, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
  
  svg {
    color: #3498db;
  }
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  padding-left: 45px;
  border: 1px solid ${props => props.hasError ? '#e74c3c' : '#ddd'};
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  color: #7f8c8d;
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  display: block;
`;

const SubmitButton = styled.button`
  background: #3498db;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover:not(:disabled) {
    background: #2980b9;
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
`;

const FooterLink = styled(Link)`
  color: #3498db;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
});

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  return (
    <Container>
      <LoginCard>
        <Header>
          <Logo>
            <Car size={24} />
            B5 Transport
          </Logo>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to your account</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <InputIcon>
                <Mail size={16} />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                hasError={!!errors.email}
                {...register('email')}
              />
            </InputWrapper>
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={16} />
              </InputIcon>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                hasError={!!errors.password}
                {...register('password')}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </SubmitButton>
        </Form>

        <Footer>
          Don't have an account? <FooterLink to="/register">Sign up</FooterLink>
        </Footer>
      </LoginCard>
    </Container>
  );
};
