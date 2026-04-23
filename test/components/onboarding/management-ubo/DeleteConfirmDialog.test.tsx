import { render, screen, fireEvent } from '@/utils/test-utils';
import DeleteConfirmDialog from '@/components/onboarding/management-ubo/DeleteConfirmDialog';

describe('DeleteConfirmDialog', () => {
  const mockConfirm = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the dialog with default copy', () => {
    render(
      <DeleteConfirmDialog onConfirm={mockConfirm} onCancel={mockCancel} />,
    );

    expect(screen.getByText('Remove Member')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this record/i)).toBeInTheDocument();
    expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument();
  });

  it('should display the member name when provided', () => {
    render(
      <DeleteConfirmDialog
        memberName="John Doe"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should call onConfirm when Remove button is clicked', () => {
    render(
      <DeleteConfirmDialog onConfirm={mockConfirm} onCancel={mockCancel} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when Cancel button is clicked', () => {
    render(
      <DeleteConfirmDialog onConfirm={mockConfirm} onCancel={mockCancel} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('should disable both buttons when isLoading is true', () => {
    render(
      <DeleteConfirmDialog onConfirm={mockConfirm} onCancel={mockCancel} isLoading />,
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });
});
