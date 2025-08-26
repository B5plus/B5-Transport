import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Car, Users, Shield, Clock } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 80px);
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #13182dff 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 80px 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButton = styled(Link)`
  background: #3498db;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  
  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }
  
  &.secondary {
    background: transparent;
    border: 2px solid white;
    
    &:hover {
      background: white;
      color: #667eea;
    }
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 20px;
  background: #f8f9fa;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #2c3e50;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #2c3e50;
`;

const FeatureDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
`;

export const Home: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Container>
      <HeroSection>
        <HeroTitle>B5 Transport Management</HeroTitle>
        <HeroSubtitle>
          Streamline your vehicle requests with our comprehensive transport management system. 
          Easy booking, real-time tracking, and efficient administration.
        </HeroSubtitle>
        <CTAButtons>
          {isAuthenticated ? (
            <>
              <CTAButton to="/dashboard">Go to Dashboard</CTAButton>
              <CTAButton to="/create-request" className="secondary">
                New Request
              </CTAButton>
            </>
          ) : (
            <>
              <CTAButton to="/register">Get Started</CTAButton>
              <CTAButton to="/login" className="secondary">
                Login
              </CTAButton>
            </>
          )}
        </CTAButtons>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose B5 Transport?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <Car size={40} />
              </FeatureIcon>
              <FeatureTitle>Easy Vehicle Booking</FeatureTitle>
              <FeatureDescription>
                Request vehicles with just a few clicks. Choose from cars, vans, trucks, 
                and more based on your needs.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Clock size={40} />
              </FeatureIcon>
              <FeatureTitle>Real-time Tracking</FeatureTitle>
              <FeatureDescription>
                Track your requests in real-time. Get instant updates on approval status 
                and vehicle availability.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Users size={40} />
              </FeatureIcon>
              <FeatureTitle>Department Management</FeatureTitle>
              <FeatureDescription>
                Organized by departments with proper approval workflows. 
                Perfect for corporate and institutional use.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Shield size={40} />
              </FeatureIcon>
              <FeatureTitle>Secure & Reliable</FeatureTitle>
              <FeatureDescription>
                Built with security in mind. Role-based access control and 
                comprehensive audit trails.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>
    </Container>
  );
};
