import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { RegisterRequest } from '../types';
import { APP_CONFIG } from '../config/api';
import { Car, User, Mail, Lock, Building, Eye, EyeOff, Shield } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  padding-left: 45px;
  border: 1px solid ${props => props.hasError ? '#e74c3c' : '#ddd'};
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  background: white;
  
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
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  department: yup.string().required('Department is required'),
  role: yup.string().oneOf(['user', 'admin'], 'Invalid role').required('Role is required')
});

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await registerUser(data);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  return (
    <Container>
      <RegisterCard>
        <Header>
          <Logo>
            <Car size={24} />
            B5 Transport
          </Logo>
          <Title>Create Account</Title>
          <Subtitle>Join our transport management system as a User or Admin</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <InputWrapper>
                <InputIcon>
                  <User size={16} />
                </InputIcon>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  hasError={!!errors.name}
                  {...register('name')}
                />
              </InputWrapper>
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </FormGroup>

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
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="department">Department</Label>
              <InputWrapper>
                <InputIcon>
                  <Building size={16} />
                </InputIcon>
                <Select
                  id="department"
                  hasError={!!errors.department}
                  {...register('department')}
                >
                  <option value="">Select Department</option>
                  {APP_CONFIG.DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </Select>
              </InputWrapper>
              {errors.department && <ErrorMessage>{errors.department.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="role">Role</Label>
              <InputWrapper>
                <InputIcon>
                  <Shield size={16} />
                </InputIcon>
                <Select
                  id="role"
                  hasError={!!errors.role}
                  {...register('role')}
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Select>
              </InputWrapper>
              {errors.role && <ErrorMessage>{errors.role.message}</ErrorMessage>}
            </FormGroup>
          </FormRow>

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
            {loading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </Form>

        <Footer>
          Already have an account? <FooterLink to="/login">Sign in</FooterLink>
        </Footer>
      </RegisterCard>
    </Container>
  );
};
