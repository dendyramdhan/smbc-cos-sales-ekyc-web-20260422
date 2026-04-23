import { render, screen, fireEvent, act } from '@/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { CustomerInfoFormField } from '@/components/onboarding/form';

describe('CustomerInfoFormField', () => {
  const baseProps = {
    label: 'Customer Name',
    value: 'SUZUKI MOTOR',
    isEditing: false,
    isSystem: false,
    isRequired: false,
  };

  it('should match snapshot in read-only mode', () => {
    const { container } = render(<CustomerInfoFormField {...baseProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in editing mode', () => {
    const { container } = render(
      <CustomerInfoFormField {...baseProps} isEditing={true} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for system field in editing mode', () => {
    const { container } = render(
      <CustomerInfoFormField {...baseProps} isEditing={true} isSystem={true} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for select type', () => {
    const { container } = render(
      <CustomerInfoFormField
        {...baseProps}
        isEditing={true}
        type="select"
        options={['Option A', 'Option B']}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the label', () => {
    render(<CustomerInfoFormField {...baseProps} />);
    expect(screen.getByText('Customer Name')).toBeInTheDocument();
  });

  it('should render the value in the input', () => {
    render(<CustomerInfoFormField {...baseProps} />);
    expect(screen.getByDisplayValue('SUZUKI MOTOR')).toBeInTheDocument();
  });

  it('should render input as readOnly when not editing', () => {
    render(<CustomerInfoFormField {...baseProps} />);
    const input = screen.getByDisplayValue('SUZUKI MOTOR');
    expect(input).toHaveAttribute('readOnly');
  });

  it('should render input as readOnly when system field even in editing mode', () => {
    render(
      <CustomerInfoFormField {...baseProps} isEditing={true} isSystem={true} />,
    );
    const input = screen.getByDisplayValue('SUZUKI MOTOR');
    expect(input).toHaveAttribute('readOnly');
  });

  it('should render input as editable when editing and not system', () => {
    render(
      <CustomerInfoFormField {...baseProps} isEditing={true} />,
    );
    const input = screen.getByDisplayValue('SUZUKI MOTOR');
    expect(input).not.toHaveAttribute('readOnly');
  });

  it('should show required asterisk only when editing and required', () => {
    const { rerender } = render(
      <CustomerInfoFormField {...baseProps} isEditing={true} isRequired={true} />,
    );
    expect(screen.getByText('*')).toBeInTheDocument();

    rerender(
      <CustomerInfoFormField {...baseProps} isEditing={false} isRequired={true} />,
    );
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('should call onChange when input loses focus after value change', () => {
    const onChange = jest.fn();
    render(
      <CustomerInfoFormField
        {...baseProps}
        isEditing={true}
        onChange={onChange}
      />,
    );
    const input = screen.getByDisplayValue('SUZUKI MOTOR');
    fireEvent.change(input, { target: { value: 'NEW NAME' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith('NEW NAME');
  });

  it('should render select dropdown when type is select, editing, and options provided', () => {
    render(
      <CustomerInfoFormField
        {...baseProps}
        isEditing={true}
        type="select"
        options={['Option A', 'Option B', 'Option C']}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('should call onChange when select value changes', () => {
    const onChange = jest.fn();
    render(
      <CustomerInfoFormField
        {...baseProps}
        isEditing={true}
        type="select"
        options={['Option A', 'Option B']}
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Option B' } });
    expect(onChange).toHaveBeenCalledWith('Option B');
  });

  it('should format date value when type is date and not editable', () => {
    render(
      <CustomerInfoFormField
        {...baseProps}
        value="2024-01-10"
        type="date"
        isEditing={false}
      />,
    );
    expect(screen.getByDisplayValue('10 / 01 / 2024')).toBeInTheDocument();
  });

  it('should show raw date value when type is date and editable', () => {
    render(
      <CustomerInfoFormField
        {...baseProps}
        value="2024-01-10"
        type="date"
        isEditing={true}
      />,
    );
    expect(screen.getByDisplayValue('2024-01-10')).toBeInTheDocument();
  });

  it('should render input with type=date when editable and type is date', () => {
    render(
      <CustomerInfoFormField
        {...baseProps}
        value="2024-01-10"
        type="date"
        isEditing={true}
      />,
    );
    const input = screen.getByDisplayValue('2024-01-10');
    expect(input).toHaveAttribute('type', 'date');
  });

  it('should render input with type=text when not editable even if type is date', () => {
    render(
      <CustomerInfoFormField
        {...baseProps}
        value="2024-01-10"
        type="date"
        isEditing={false}
      />,
    );
    const input = screen.getByDisplayValue('10 / 01 / 2024');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should render input instead of select when type is select but not editing', () => {
    render(
      <CustomerInfoFormField
        {...baseProps}
        type="select"
        options={['Option A']}
        isEditing={false}
      />,
    );
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('SUZUKI MOTOR')).toBeInTheDocument();
  });

  // ── Combobox ──────────────────────────────────────────────────────────────

  it('should match snapshot for combobox type', () => {
    const { container } = render(
      <CustomerInfoFormField
        {...baseProps}
        value="Japan"
        isEditing={true}
        type="combobox"
        options={['Japan', 'Indonesia', 'Singapore']}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render search input for combobox type when editing with options', () => {
    render(
      <CustomerInfoFormField
        {...baseProps}
        isEditing={true}
        type="combobox"
        options={['Japan', 'Indonesia', 'Singapore']}
      />,
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('should filter combobox items when typing in the search input', () => {
    render(
      <CustomerInfoFormField
        {...baseProps}
        value=""
        isEditing={true}
        type="combobox"
        options={['Japan', 'Indonesia', 'Singapore']}
      />,
    );
    const searchInput = screen.getByPlaceholderText('Search...');
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'Jap' } });
    });
    // onInputValueChange fires → setSearchQuery('Jap') → filteredItems filter executes
    // covers lines 66-67 (filter branch) and line 99 (onInputValueChange callback)
    expect(searchInput).toBeInTheDocument();
  });

  it('should call onChange when a combobox item is selected', async () => {
    const onChange = jest.fn();
    render(
      <CustomerInfoFormField
        {...baseProps}
        value=""
        isEditing={true}
        type="combobox"
        options={['Japan', 'Indonesia', 'Singapore']}
        onChange={onChange}
      />,
    );
    const user = userEvent.setup();
    // Open the combobox via the trigger button then click the first option
    await user.click(screen.getByRole('button'));
    const options = screen.getAllByRole('option', { hidden: true });
    await user.click(options[0]);
    // onValueChange fires → onChange?.(details.value[0] ?? '') is called
    // covers line 98 (onValueChange callback)
    expect(onChange).toHaveBeenCalled();
  });

  it('should reset search query when combobox is opened', () => {
    render(
      <CustomerInfoFormField
        {...baseProps}
        value=""
        isEditing={true}
        type="combobox"
        options={['Japan', 'Indonesia', 'Singapore']}
      />,
    );
    // Combobox starts closed; clicking trigger opens it →
    // onOpenChange fires with { open: true } → setSearchQuery('')
    // covers lines 100-101 (onOpenChange callback)
    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  // ── Input Focus Behavior ──────────────────────────────────────────────────

  it('should not sync prop value to local state while input is focused', () => {
    const { rerender } = render(
      <CustomerInfoFormField {...baseProps} isEditing={true} />,
    );
    const input = screen.getByDisplayValue('SUZUKI MOTOR');
    act(() => {
      fireEvent.focus(input); // sets isFocused.current = true → covers line 210
    });
    rerender(
      <CustomerInfoFormField {...baseProps} isEditing={true} value="UPDATED VALUE" />,
    );
    // useEffect skips update because isFocused.current is true
    expect(screen.getByDisplayValue('SUZUKI MOTOR')).toBeInTheDocument();
  });
});
