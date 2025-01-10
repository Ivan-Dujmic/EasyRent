'use client';

import {
  Box,
  Flex,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Checkbox,
  CheckboxGroup,
  Button,
  Heading,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Select, { MultiValue, GroupBase, components } from 'react-select';

// Define the makes and models data
const makesAndModels: Record<string, string[]> = {
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class'],
  Opel: ['Astra', 'Corsa', 'Insignia'],
  Volkswagen: ['Golf', 'Passat', 'Tiguan'],
};

// Define type for react-select options
type Option = {
  label: string;
  value: string;
};

export default function SideFilter() {
  const [selectedMakes, setSelectedMakes] = useState<MultiValue<Option>>([]);
  const [selectedModels, setSelectedModels] = useState<MultiValue<Option>>([]);
  const [minPrice, setMinPrice] = useState<number>(15);
  const [maxPrice, setMaxPrice] = useState<number>(72);

  const makeOptions: Option[] = Object.keys(makesAndModels).map((make) => ({
    label: make,
    value: make,
  }));

  const modelOptions: GroupBase<Option>[] = selectedMakes.map((make) => ({
    label: make.label,
    options: makesAndModels[make.value]?.map((model) => ({
      label: model,
      value: model,
    })),
  }));

  const handleMakeChange = (selected: MultiValue<Option>) => {
    setSelectedMakes(selected);
    setSelectedModels([]);
  };

  const handleModelChange = (selected: MultiValue<Option>) => {
    setSelectedModels(selected);
  };

  const CustomTag = (
    props: any,
    selectedItems: MultiValue<Option>,
    setSelectedItems: React.Dispatch<React.SetStateAction<MultiValue<Option>>>
  ) => (
    <Box
      as="span"
      bg="brandblue"
      color="white"
      px={2}
      py={0}
      borderRadius="full"
      display="inline-flex"
      alignItems="center"
      mr={1}
      mt={1}
      mb={0.5}
    >
      {props.data.label}
      <Box
        as="span"
        ml={2}
        cursor="pointer"
        onClick={() => {
          const updatedValues = selectedItems.filter(
            (item) => item.value !== props.data.value
          );
          setSelectedItems(updatedValues);
        }}
      >
        &times;
      </Box>
    </Box>
  );

  return (
    <Box
      width="400px"
      bg="brandlightgray"
      p={5}
      borderRadius="lg"
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
      color="brandblack"
    >
      <Heading size="md" mb={4} textAlign="center" color="brandblue">
        Filters
      </Heading>

      {/* Seats Filter */}
      <Box mb={6}>
        <Text fontSize="lg" mb={2} fontWeight="bold">
          Seats:
        </Text>
        <Flex gap={4}>
          <CheckboxGroup colorScheme="blue">
            <Flex gap={4}>
              <Checkbox value="1-2">1-2</Checkbox>
              <Checkbox value="4-5">4-5</Checkbox>
              <Checkbox value="6+">6+</Checkbox>
            </Flex>
          </CheckboxGroup>
        </Flex>
      </Box>

      {/* Car Type */}
      <Box mb={6}>
        <Text fontSize="lg" mb={2} fontWeight="bold">
          Car Type:
        </Text>
        <CheckboxGroup colorScheme="blue">
          <Flex direction="column" gap={2}>
            <Checkbox value="Compact">Compact</Checkbox>
            <Checkbox value="Limo/Estate">Limo/Estate</Checkbox>
            <Checkbox value="SUV">SUV</Checkbox>
          </Flex>
        </CheckboxGroup>
      </Box>

      {/* Transmission */}
      <Box mb={6}>
        <Text fontSize="lg" mb={2} fontWeight="bold">
          Transmission:
        </Text>
        <CheckboxGroup colorScheme="blue">
          <Flex direction="row" gap={4}>
            <Checkbox value="Manual">Manual</Checkbox>
            <Checkbox value="Automatic">Automatic</Checkbox>
          </Flex>
        </CheckboxGroup>
      </Box>

      {/* Price Range */}
      <Box mb={6}>
        <Text fontSize="lg" mb={2} fontWeight="bold">
          Price Range (€ / day):
        </Text>
        <Text mb={1}>min price:</Text>
        <Flex alignItems="center" gap={4} mb={4} style={{ width: '100%' }}>
          <Text style={{ width: '50px', textAlign: 'right' }}>{minPrice}€</Text>
          <Slider
            aria-label="min-price-slider"
            value={minPrice}
            min={10}
            max={600}
            step={20}
            onChange={(value) => setMinPrice(Math.min(value, maxPrice - 20))}
            style={{ flexGrow: 1 }}
          >
            <SliderTrack bg="gray.300">
              <SliderFilledTrack bg="brandblue" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </Flex>
        <Text mb={1}>max price:</Text>
        <Flex alignItems="center" gap={4} style={{ width: '100%' }}>
          <Text style={{ width: '50px', textAlign: 'right' }}>{maxPrice}€</Text>
          <Slider
            aria-label="max-price-slider"
            value={maxPrice}
            min={10}
            max={600}
            step={20}
            onChange={(value) => setMaxPrice(Math.max(value, minPrice + 20))}
            style={{ flexGrow: 1 }}
          >
            <SliderTrack bg="gray.300">
              <SliderFilledTrack bg="brandblue" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </Flex>
      </Box>

      {/* Make and Model Filter */}
      <Box mb={6}>
        <Text fontSize="lg" mb={2} fontWeight="bold">
          Make and Model:
        </Text>
        <Box mb={4}>
          <Select
            isMulti
            options={makeOptions}
            value={selectedMakes}
            onChange={handleMakeChange}
            placeholder="Select Makes"
            closeMenuOnSelect={false}
            components={{
              MultiValueContainer: (props) =>
                CustomTag(props, selectedMakes, setSelectedMakes),
            }}
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
              }),
            }}
          />
        </Box>
        <Box>
          <Select
            isMulti
            options={modelOptions}
            value={selectedModels}
            onChange={handleModelChange}
            placeholder="Select Models"
            isDisabled={selectedMakes.length === 0}
            components={{
              MultiValueContainer: (props) =>
                CustomTag(props, selectedModels, setSelectedModels),
            }}
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
              }),
            }}
          />
        </Box>
      </Box>

      {/* Apply Button */}
      <Button
        bg="brandblue"
        size="lg"
        color="white"
        _hover={{ bg: 'brandyellow', color: 'brandblack' }}
        width="100%"
      >
        Apply
      </Button>
    </Box>
  );
}
