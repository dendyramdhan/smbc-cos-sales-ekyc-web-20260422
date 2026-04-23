import { render, screen, fireEvent } from '@/utils/test-utils';
import { Table } from '@chakra-ui/react';
import ManagementUboRow from '@/components/onboarding/management-ubo/ManagementUboRow';
import type { ManagementUboMember } from '@/types/onboarding';
import { COUNTRY_MOCK_DATA } from '@/services/__mocks__/ekycParameter.onboarding';

const MEMBER: ManagementUboMember = {
  id: 1,
  positionType: 'Director',
  name: 'John Doe',
  groupType: 'INDIVIDUAL',
  authorizedSigner: true,
  dateOfBirth: '1985-06-15',
  nikPassportNo: '1234567890',
  countryOfResidence: 'Indonesia',
  address: 'Jl. Test No. 1',
};

describe('ManagementUboRow', () => {
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  describe('read-only mode', () => {
    it('should render member name and position type', () => {
      render(
        <Table.Root><Table.Body>
          <ManagementUboRow
            member={MEMBER}
            isEditing={false}
            countryOptions={COUNTRY_MOCK_DATA}
            onUpdate={mockUpdate}
            onRequestDelete={mockDelete}
          />
        </Table.Body></Table.Root>,
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Director')).toBeInTheDocument();
    });

    it('should show green checkmark for authorizedSigner = true', () => {
      render(
        <Table.Root><Table.Body>
          <ManagementUboRow
            member={{ ...MEMBER, authorizedSigner: true }}
            isEditing={false}
            countryOptions={COUNTRY_MOCK_DATA}
            onUpdate={mockUpdate}
            onRequestDelete={mockDelete}
          />
        </Table.Body></Table.Root>,
      );

      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('should show red cross for authorizedSigner = false', () => {
      render(
        <Table.Root><Table.Body>
          <ManagementUboRow
            member={{ ...MEMBER, authorizedSigner: false }}
            isEditing={false}
            countryOptions={COUNTRY_MOCK_DATA}
            onUpdate={mockUpdate}
            onRequestDelete={mockDelete}
          />
        </Table.Body></Table.Root>,
      );

      expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should not render any inputs in read-only mode', () => {
      render(
        <Table.Root><Table.Body>
          <ManagementUboRow
            member={MEMBER}
            isEditing={false}
            countryOptions={COUNTRY_MOCK_DATA}
            onUpdate={mockUpdate}
            onRequestDelete={mockDelete}
          />
        </Table.Body></Table.Root>,
      );

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    it('should render editable inputs', () => {
      render(
        <Table.Root><Table.Body>
          <ManagementUboRow
            member={MEMBER}
            isEditing={true}
            countryOptions={COUNTRY_MOCK_DATA}
            onUpdate={mockUpdate}
            onRequestDelete={mockDelete}
          />
        </Table.Body></Table.Root>,
      );

      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should call onUpdate when name input changes', () => {
      render(
        <Table.Root><Table.Body>
          <ManagementUboRow
            member={MEMBER}
            isEditing={true}
            countryOptions={COUNTRY_MOCK_DATA}
            onUpdate={mockUpdate}
            onRequestDelete={mockDelete}
          />
        </Table.Body></Table.Root>,
      );

      const nameInput = screen.getByPlaceholderText(/Full legal name/i);
      fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
      expect(mockUpdate).toHaveBeenCalledWith('name', 'Jane Smith');
    });

    it('should call onRequestDelete when trash button is clicked', () => {
      render(
        <Table.Root><Table.Body>
          <ManagementUboRow
            member={MEMBER}
            isEditing={true}
            countryOptions={COUNTRY_MOCK_DATA}
            onUpdate={mockUpdate}
            onRequestDelete={mockDelete}
          />
        </Table.Body></Table.Root>,
      );

      fireEvent.click(screen.getByRole('button', { name: /remove member/i }));
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });
});
