import { render, screen, fireEvent, act, waitFor } from '@/utils/test-utils';
import ManagementUboStep from '@/components/onboarding/steps/ManagementUboStep';
import { COUNTRY_MOCK_DATA } from '@/services/__mocks__/ekycParameter.onboarding';
import type { ManagementUboMember } from '@/types/onboarding';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockMutateAsync = jest.fn();
const mockDeleteMutateAsync = jest.fn();

jest.mock('@/hooks/queries/useManagementUboQueries', () => ({
  useManagementUboMembers: jest.fn(),
  useSaveManagementUboMembers: jest.fn(),
  useDeleteManagementUboMember: jest.fn(),
  managementUboKeys: { all: ['managementUbo'], detail: (id: string) => ['managementUbo', 'detail', id] },
}));

jest.mock('@/hooks/queries/useEKYCParameterQueries', () => ({
  useCountryOptions: jest.fn(),
}));

const mockSetIsEditing = jest.fn();
const mockNextStep = jest.fn();
const mockUseOnboardingForm = jest.fn();

jest.mock('@/features/onboarding/OnboardingFormContext', () => ({
  useOnboardingForm: () => mockUseOnboardingForm(),
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'REF-001' }),
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────

import {
  useManagementUboMembers,
  useSaveManagementUboMembers,
  useDeleteManagementUboMember,
} from '@/hooks/queries/useManagementUboQueries';
import { useCountryOptions } from '@/hooks/queries/useEKYCParameterQueries';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MOCK_MEMBERS: ManagementUboMember[] = [
  {
    id: 1,
    positionType: 'Director',
    name: 'John Doe',
    groupType: 'INDIVIDUAL',
    authorizedSigner: true,
    dateOfBirth: '1985-06-15',
    nikPassportNo: '1234567890',
    countryOfResidence: 'Indonesia',
    address: 'Jl. Test No. 1',
  },
  {
    id: 2,
    positionType: 'Commissioner',
    name: 'Jane Smith',
    groupType: 'ENTITY',
    authorizedSigner: false,
  },
];

const buildContextValue = (overrides = {}) => ({
  isEditing: false,
  setIsEditing: mockSetIsEditing,
  nextStep: mockNextStep,
  setDisabledSteps: jest.fn(),
  setIsWarningActiveStep: jest.fn(),
  updateManagementUbo: jest.fn(),
  isAllStepsDisabled: false,
  ...overrides,
});

const setupMocks = (overrides: { isEditing?: boolean; isLoading?: boolean; members?: ManagementUboMember[] } = {}) => {
  const { isEditing = false, isLoading = false, members = MOCK_MEMBERS } = overrides;

  (useManagementUboMembers as jest.Mock).mockReturnValue({
    data: { result: members, message: 'SUCCESS', status: 200 },
    isLoading,
  });

  (useCountryOptions as jest.Mock).mockReturnValue({
    data: { result: COUNTRY_MOCK_DATA },
  });

  (useSaveManagementUboMembers as jest.Mock).mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending: false,
  });

  (useDeleteManagementUboMember as jest.Mock).mockReturnValue({
    mutateAsync: mockDeleteMutateAsync,
    isPending: false,
  });

  mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing }));
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ManagementUboStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMutateAsync.mockResolvedValue({});
    mockDeleteMutateAsync.mockResolvedValue({});
  });

  describe('loading state', () => {
    it('should render skeleton while loading', () => {
      setupMocks({ isLoading: true });
      const { container } = render(<ManagementUboStep />);
      expect(container.innerHTML).toBeTruthy();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  describe('read-only mode', () => {
    beforeEach(() => setupMocks({ isEditing: false }));

    it('should render member names in the table', () => {
      render(<ManagementUboStep />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should not show Add New Member button when not editing', () => {
      render(<ManagementUboStep />);
      expect(screen.queryByText(/Add New Member/i)).not.toBeInTheDocument();
    });

    it('should show Yes for authorizedSigner=true and No for false', () => {
      render(<ManagementUboStep />);
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should display member count in badge', () => {
      render(<ManagementUboStep />);
      expect(screen.getByText('2 Total')).toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    beforeEach(() => setupMocks({ isEditing: true }));

    it('should show Add New Member button when editing', () => {
      render(<ManagementUboStep />);
      expect(screen.getByText(/Add New Member/i)).toBeInTheDocument();
    });

    it('should append a blank row when Add New Member is clicked', () => {
      render(<ManagementUboStep />);
      const before = screen.getAllByRole('row').length;
      fireEvent.click(screen.getByText(/Add New Member/i));
      expect(screen.getAllByRole('row').length).toBe(before + 1);
    });

    it('should show Required/Optional field legend when editing', () => {
      render(<ManagementUboStep />);
      expect(screen.getByText('Required field')).toBeInTheDocument();
      expect(screen.getByText('Optional field')).toBeInTheDocument();
    });

    it('should open delete confirmation dialog when trash button is clicked', () => {
      render(<ManagementUboStep />);
      const trashButtons = screen.getAllByRole('button', { name: /remove member/i });
      fireEvent.click(trashButtons[0]);
      expect(screen.getByText('Remove Member')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete this record/i)).toBeInTheDocument();
    });

    it('should show member name in delete dialog', () => {
      render(<ManagementUboStep />);
      const trashButtons = screen.getAllByRole('button', { name: /remove member/i });
      fireEvent.click(trashButtons[0]);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should call delete mutation and remove row on confirm', async () => {
      render(<ManagementUboStep />);
      const trashButtons = screen.getAllByRole('button', { name: /remove member/i });
      fireEvent.click(trashButtons[0]);
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /^remove$/i }));
      });
      expect(mockDeleteMutateAsync).toHaveBeenCalledWith(1);
    });

    it('should close dialog on cancel without deleting', async () => {
      render(<ManagementUboStep />);
      const trashButtons = screen.getAllByRole('button', { name: /remove member/i });
      fireEvent.click(trashButtons[0]);
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(mockDeleteMutateAsync).not.toHaveBeenCalled();
      expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
    });
  });

  describe('save actions', () => {
    beforeEach(() => setupMocks({ isEditing: true }));

    it('should call saveMembers when Save and Continue Edit is clicked', async () => {
      render(<ManagementUboStep />);
      await act(async () => {
        fireEvent.click(screen.getByText('Save and Continue Edit'));
      });
      expect(mockMutateAsync).toHaveBeenCalledWith(MOCK_MEMBERS);
    });

    it('should stay in edit mode after Save and Continue Edit', async () => {
      render(<ManagementUboStep />);
      await act(async () => {
        fireEvent.click(screen.getByText('Save and Continue Edit'));
      });
      expect(mockSetIsEditing).not.toHaveBeenCalledWith(false);
    });

    it('should call saveMembers when Save and End Edit is clicked', async () => {
      render(<ManagementUboStep />);
      await act(async () => {
        fireEvent.click(screen.getByText('Save and End Edit'));
      });
      expect(mockMutateAsync).toHaveBeenCalledWith(MOCK_MEMBERS);
    });

    it('should call setIsEditing(false) after Save and End Edit', async () => {
      render(<ManagementUboStep />);
      await act(async () => {
        fireEvent.click(screen.getByText('Save and End Edit'));
      });
      await waitFor(() => expect(mockSetIsEditing).toHaveBeenCalledWith(false));
    });
  });

  describe('empty state', () => {
    it('should show 0 members recorded when no members', () => {
      setupMocks({ members: [] });
      render(<ManagementUboStep />);
      expect(screen.getByText(/0 members recorded/i)).toBeInTheDocument();
    });
  });
});
