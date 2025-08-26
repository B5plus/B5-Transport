import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { vehicleAPI } from '../services/api';
import { CreateVehicleRequest } from '../types';
import { APP_CONFIG } from '../config/api';
import { Car, MapPin, Clock, Building, MessageSquare, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1.1rem;
`;

const FormCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 12px 16px;
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
  padding: 12px 16px;
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

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.hasError ? '#e74c3c' : '#ddd'};
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  background: #3498db;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover:not(:disabled) {
    background: #2980b9;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
  }
`;

const InfoBox = styled.div`
  background: #e8f4fd;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 25px;
  color: #0c5460;
`;

const schema = yup.object({
  vehicle_type: yup.string().required('Vehicle type is required'),
  vehicle_number: yup.string().required('Vehicle number is required'),
  location: yup.string().required('Location is required'),
  taken_time: yup.string().required('Time is required'),
  estimated_usage: yup.string().required('Estimated usage is required'),
  department: yup.string().required('Department is required'),
  remarks: yup.string().required('Remarks are required').min(10, 'Remarks must be at least 10 characters')
});

export const CreateRequest: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateVehicleRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      department: user?.department || '',
      taken_time: new Date().toTimeString().substring(0, 5),
    }
  });

  const onSubmit = async (data: CreateVehicleRequest) => {
    try {
      await vehicleAPI.createRequest(data);
      toast.success('Vehicle request created successfully!');
      navigate('/my-requests');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create request';
      toast.error(message);
    }
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    return new Date().toTimeString().substring(0, 5);
  };

  return (
    <Container>
      <Header>
        <Title>Create Vehicle Request</Title>
        <Subtitle>Fill out the form below to request a vehicle</Subtitle>
      </Header>

      <FormCard>
        <InfoBox>
          <strong>Note:</strong> All fields are required. Please provide accurate information 
          for faster processing of your request.
        </InfoBox>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="vehicle_type">
                <Car size={16} />
                Vehicle Type
              </Label>
              <Select
                id="vehicle_type"
                hasError={!!errors.vehicle_type}
                {...register('vehicle_type')}
              >
                <option value="">Select Vehicle Type</option>
                {APP_CONFIG.VEHICLE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
              {errors.vehicle_type && <ErrorMessage>{errors.vehicle_type.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="vehicle_number">
                <Car size={16} />
                Vehicle Number
              </Label>
              <Input
                id="vehicle_number"
                type="text"
                placeholder="e.g., CAR-001"
                hasError={!!errors.vehicle_number}
                {...register('vehicle_number')}
              />
              {errors.vehicle_number && <ErrorMessage>{errors.vehicle_number.message}</ErrorMessage>}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="location">
              <MapPin size={16} />
              Destination/Location
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Enter destination or pickup location"
              hasError={!!errors.location}
              {...register('location')}
            />
            {errors.location && <ErrorMessage>{errors.location.message}</ErrorMessage>}
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="taken_time">
                <Clock size={16} />
                Time Needed
              </Label>
              <Input
                id="taken_time"
                type="time"
                hasError={!!errors.taken_time}
                {...register('taken_time')}
              />
              {errors.taken_time && <ErrorMessage>{errors.taken_time.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="estimated_usage">
                <Clock size={16} />
                Estimated Usage Duration
              </Label>
              <Input
                id="estimated_usage"
                type="time"
                placeholder="e.g., 02:30"
                hasError={!!errors.estimated_usage}
                {...register('estimated_usage')}
              />
              {errors.estimated_usage && <ErrorMessage>{errors.estimated_usage.message}</ErrorMessage>}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="department">
              <Building size={16} />
              Department
            </Label>
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
            {errors.department && <ErrorMessage>{errors.department.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="remarks">
              <MessageSquare size={16} />
              Purpose/Remarks
            </Label>
            <TextArea
              id="remarks"
              placeholder="Please describe the purpose of your trip and any special requirements..."
              hasError={!!errors.remarks}
              {...register('remarks')}
            />
            {errors.remarks && <ErrorMessage>{errors.remarks.message}</ErrorMessage>}
          </FormGroup>

          <SubmitButton type="submit" disabled={isSubmitting}>
            <Save size={20} />
            {isSubmitting ? 'Creating Request...' : 'Create Request'}
          </SubmitButton>
        </Form>
      </FormCard>
    </Container>
  );
};
