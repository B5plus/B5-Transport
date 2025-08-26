import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { DashboardStats, VehicleRequest } from '../types';
import { Car, Clock, CheckCircle, Users, Settings, List } from 'lucide-react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-left: 4px solid #3498db;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  background: ${props => props.color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-weight: 500;
`;

const ActionsSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  background: #3498db;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
  
  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }
  
  &.secondary {
    background: #95a5a6;
    
    &:hover {
      background: #7f8c8d;
    }
  }
`;

const RecentRequestsSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const RequestsTable = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 15px 10px;
  border-bottom: 2px solid #ecf0f1;
  color: #2c3e50;
  font-weight: 600;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 15px 10px;
  border-bottom: 1px solid #ecf0f1;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.status === 'pending' && `
    background: #fff3cd;
    color: #856404;
  `}
  
  ${props => props.status === 'returned' && `
    background: #d4edda;
    color: #155724;
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingRequests: 0,
    returnedRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState<VehicleRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.stats);
      setRecentRequests(response.recentRequests || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM format
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div>Loading dashboard...</div>
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Admin Dashboard</Title>
        <Subtitle>Manage vehicle requests and monitor system activity</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#3498db">
            <Car size={24} />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.totalRequests}</StatNumber>
            <StatLabel>Total Requests</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#f39c12">
            <Clock size={24} />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.pendingRequests}</StatNumber>
            <StatLabel>Pending Requests</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#27ae60">
            <CheckCircle size={24} />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.returnedRequests}</StatNumber>
            <StatLabel>Completed Requests</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ActionsSection>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionButtons>
          <ActionButton to="/admin/requests">
            <List size={20} />
            View All Requests
          </ActionButton>
          <ActionButton to="/admin/requests?status=pending" className="secondary">
            <Clock size={20} />
            Pending Requests
          </ActionButton>
        </ActionButtons>
      </ActionsSection>

      <RecentRequestsSection>
        <SectionTitle>Recent Requests</SectionTitle>
        <RequestsTable>
          {recentRequests.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <TableHeader>Request #</TableHeader>
                  <TableHeader>User</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Vehicle</TableHeader>
                  <TableHeader>Location</TableHeader>
                  <TableHeader>Status</TableHeader>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.request_number}</TableCell>
                    <TableCell>{request.user?.name || 'N/A'}</TableCell>
                    <TableCell>{formatDate(request.request_date)}</TableCell>
                    <TableCell>
                      {request.vehicle_type} - {request.vehicle_number}
                    </TableCell>
                    <TableCell>{request.location}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status}>
                        {request.status}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState>
              <Car size={48} color="#bdc3c7" />
              <p>No recent requests found.</p>
            </EmptyState>
          )}
        </RequestsTable>
      </RecentRequestsSection>
    </Container>
  );
};
