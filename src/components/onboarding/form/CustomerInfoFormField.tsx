'use client';

import { useState, useMemo, useEffect, useRef, startTransition } from 'react';
import {
  Box,
  Text,
  Input,
  HStack,
  NativeSelect,
  Combobox,
  createListCollection,
} from '@chakra-ui/react';
import { Pencil, Lock, ChevronsUpDown } from 'lucide-react';
import { formatDateDMYSlashFromStringDate } from '@/utils/dateTimeUtil';
import RenderIf, { RenderElse } from '@/components/ui/RenderIf';

interface CustomerInfoFormFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  isEditing: boolean;
  isSystem: boolean;
  isRequired: boolean;
  type?: 'text' | 'date' | 'select' | 'combobox';
  options?: readonly string[];
}

export default function CustomerInfoFormField({
  label,
  value,
  onChange,
  isEditing,
  isSystem,
  isRequired,
  type = 'text',
  options,
}: CustomerInfoFormFieldProps) {
  const isEditable = isEditing && !isSystem;
  const labelColor = isEditing
    ? isSystem
      ? 'gray.500'
      : 'brand.600'
    : 'gray.600';

  // Local state for text/date inputs so the input is responsive without
  // waiting for the parent state round-trip on every keystroke.
  const [localValue, setLocalValue] = useState(value);
  const isFocused = useRef(false);

  // Sync prop → local only when the field is not being edited
  useEffect(() => {
    if (!isFocused.current) {
      setLocalValue(value);
    }
  }, [value]);

  const [searchQuery, setSearchQuery] = useState('');

  const allItems = useMemo(
    () => (options ?? []).map((opt) => ({ label: opt, value: opt })),
    [options],
  );

  const filteredItems = useMemo(() => {
    if (!searchQuery) return allItems;
    const query = searchQuery.toLowerCase();
    return allItems.filter((item) => item.label.toLowerCase().includes(query));
  }, [allItems, searchQuery]);

  const collection = useMemo(
    () => createListCollection({ items: filteredItems }),
    [filteredItems],
  );

  return (
    <Box>
      <HStack gap={1} mb={1.5}>
        <RenderIf when={isRequired && isEditing}>
          <Text color="red.500" fontSize="xs" fontWeight="bold">
            *
          </Text>
        </RenderIf>
        <Text fontSize="xs" color={labelColor} fontWeight="medium">
          {label}
        </Text>
        <RenderIf when={isEditing && !isSystem}>
          <Pencil size={11} style={{ color: 'var(--chakra-colors-brand-600)' }} />
        </RenderIf>
        <RenderIf when={isEditing && isSystem}>
          <Lock size={11} style={{ color: 'var(--chakra-colors-gray-500)' }} />
        </RenderIf>
      </HStack>

      <RenderIf when={isEditable && type === 'combobox' && !!options}>
        <Combobox.Root
          collection={collection}
          value={value ? [value] : []}
          onValueChange={(details) => onChange?.(details.value[0] ?? '')}
          onInputValueChange={(details) => setSearchQuery(details.inputValue)}
          onOpenChange={(details) => {
            if (details.open) setSearchQuery('');
          }}
        >
          <Combobox.Control
            display="flex"
            alignItems="center"
            bg="white"
            border="1px solid"
            borderColor="brand.600"
            borderRadius="md"
            h="38px"
            overflow="hidden"
            transition="border-color 0.2s ease, box-shadow 0.2s ease"
            _focusWithin={{
              borderColor: 'brand.600',
              boxShadow: '0 0 0 1px brand.600',
            }}
          >
            <Combobox.Input
              bg="transparent"
              border="none"
              color="brand.600"
              fontSize="sm"
              h="full"
              outline="none"
              px={3}
              flex={1}
              _focus={{ outline: 'none', boxShadow: 'none' }}
              placeholder="Search..."
            />
            <Combobox.Trigger
              bg="transparent"
              border="none"
              color="brand.600"
              cursor="pointer"
              px={2}
              h="full"
              display="flex"
              alignItems="center"
              _hover={{ bg: 'brand.50' }}
            >
              <ChevronsUpDown size={14} />
            </Combobox.Trigger>
          </Combobox.Control>
          <Combobox.Positioner>
            <Combobox.Content
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="md"
              maxH="200px"
              overflowY="auto"
              zIndex={1500}
            >
              {filteredItems.map((item) => (
                <Combobox.Item
                  key={item.value}
                  item={item}
                  px={3}
                  py={2}
                  fontSize="sm"
                  cursor="pointer"
                  _highlighted={{ bg: 'brand.50', color: 'brand.600' }}
                >
                  <Combobox.ItemText>{item.label}</Combobox.ItemText>
                  <Combobox.ItemIndicator color="brand.600">✓</Combobox.ItemIndicator>
                </Combobox.Item>
              ))}
              <Combobox.Empty px={3} py={2} fontSize="sm" color="gray.500">
                No results found
              </Combobox.Empty>
            </Combobox.Content>
          </Combobox.Positioner>
        </Combobox.Root>

        <RenderElse>
          <RenderIf when={isEditable && type === 'select' && !!options}>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                bg="white"
                border="1px solid"
                color={isEditable ? 'brand.600' : 'gray.500'}
                borderColor={isEditable ? 'brand.600' : 'gray.300'}
                borderRadius="md"
                fontSize="sm"
                h="38px"
                transition="border-color 0.2s ease, box-shadow 0.2s ease"
                _focus={{
                  borderColor: 'brand.600',
                  boxShadow: '0 0 0 1px brand.600',
                }}
              >
                {options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <RenderElse>
              <Input
                value={type === 'date' && !isEditable ? formatDateDMYSlashFromStringDate(localValue) : localValue}
                readOnly={!isEditable}
                onChange={(e) => setLocalValue(e.target.value)}
                onFocus={() => { isFocused.current = true; }}
                onBlur={(e) => {
                  isFocused.current = false;
                  const val = e.target.value;
                  startTransition(() => {
                    onChange?.(val);
                  });
                }}
                type={isEditable && type === 'date' ? 'date' : 'text'}
                bg={isEditable ? 'white' : '#f7fafc'}
                border="1px solid"
                color={isEditable ? 'brand.600' : 'gray.500'}
                borderColor={isEditable ? 'brand.600' : 'gray.300'}
                borderRadius="md"
                cursor={isEditable ? 'text' : 'default'}
                fontSize="sm"
                h="38px"
                transition="border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease"
                _focus={
                  isEditable
                    ? {
                      borderColor: 'brand.600',
                      boxShadow: '0 0 0 1px brand.600',
                    }
                    : {}
                }
              />
            </RenderElse>
          </RenderIf>
        </RenderElse>
      </RenderIf>
    </Box>
  );
}