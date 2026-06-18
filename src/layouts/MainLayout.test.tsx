import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router';
import MainLayout from './MainLayout';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/hooks/useAuth';

const mockUseAuth = vi.mocked(useAuth);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );

  return Wrapper;
};

describe('MainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state while session is loading', () => {
    mockUseAuth.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      logoutUser: vi.fn(),
      isProfileComplete: false,
    } as any);

    render(
      <MemoryRouter initialEntries={['/bar']}>
        <Routes>
          <Route path="/bar" element={<MainLayout />}>
            <Route index element={<div>Profile Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should redirect to /login when session data is null', () => {
    mockUseAuth.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      logoutUser: vi.fn(),
      isProfileComplete: false,
    } as any);

    render(
      <MemoryRouter initialEntries={['/bar']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/bar" element={<MainLayout />}>
            <Route index element={<div>Profile Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should redirect to /onboarding when profile is incomplete and not on /onboarding', () => {
    mockUseAuth.mockReturnValue({
      data: { id: '1', name: '', email: 'test@example.com' },
      isLoading: false,
      isError: false,
      logoutUser: vi.fn(),
      isProfileComplete: false,
    } as any);

    render(
      <MemoryRouter initialEntries={['/bar']}>
        <Routes>
          <Route path="/onboarding" element={<div>Onboarding Page</div>} />
          <Route path="/bar" element={<MainLayout />}>
            <Route index element={<div>Profile Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Onboarding Page')).toBeInTheDocument();
  });

  it('should render children when profile is complete', () => {
    mockUseAuth.mockReturnValue({
      data: { id: '1', name: 'Test', lastName: 'User', birthdate: '2000-01-15', email: 'test@example.com' },
      isLoading: false,
      isError: false,
      logoutUser: vi.fn(),
      isProfileComplete: true,
    } as any);

    render(
      <MemoryRouter initialEntries={['/bar']}>
        <Routes>
          <Route path="/bar" element={<MainLayout />}>
            <Route index element={<div>Profile Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Profile Content')).toBeInTheDocument();
  });

  it('should NOT redirect when on /onboarding path with incomplete profile', () => {
    mockUseAuth.mockReturnValue({
      data: { id: '1', name: '', email: 'test@example.com' },
      isLoading: false,
      isError: false,
      logoutUser: vi.fn(),
      isProfileComplete: false,
    } as any);

    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <Routes>
          <Route path="/onboarding" element={<MainLayout />}>
            <Route index element={<div>Onboarding View</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Onboarding View')).toBeInTheDocument();
  });
});
