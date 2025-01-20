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
import React, { useState, useEffect } from 'react';
import Select, { MultiValue, GroupBase } from 'react-select';
import useSWRMutation from 'swr/mutation';
import { CustomGet, ICar } from '@/fetchers/homeData';
import { useFilterContext } from '@/context/FilterContext/FilterContext';
import { useCarContext } from '@/context/CarContext';
import { useRouter } from 'next/navigation';
import { swrKeys } from '@/fetchers/swrKeys';
import useSWR from 'swr';
import { CarMakesResponse } from '@/typings/models/models.type';

// Define the makes and models data
const makesAndModels: Record<string, string[]> = {
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class'],
  Opel: ['Astra', 'Corsa', 'Insignia'],
  Volkswagen: ['Golf', 'Passat', 'Tiguan'],
};

// Define types for react-select options
type Option = {
  label: string;
  value: string;
};

type GroupedOption = {
  label: string;
  options: Option[];
};

export default function SideFilter() {
  const [selectedMakes, setSelectedMakes] = useState<MultiValue<Option>>([]);
  const [selectedModels, setSelectedModels] = useState<MultiValue<Option>>([]);
  const [minPrice, setMinPrice] = useState<number>(15);
  const [maxPrice, setMaxPrice] = useState<number>(72);

  // State for checkboxes
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedCarType, setSelectedCarType] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>(
    []
  );

  //za submit
  const [url, setUrl] = useState(''); // State za URL

  const { filterData } = useFilterContext();
  const { setCars } = useCarContext();
  const router = useRouter();

  // Fetching car makes and models using useSWR
  const { data: offerModels, error } = useSWR<CarMakesResponse>(
    swrKeys.carModels,
    CustomGet
  );

  const makeOptions: Option[] =
    offerModels?.makes.map((make) => ({
      label: make.makeName,
      value: make.makeName,
    })) || [];

  // Generate options for models based on selected makes
  const modelOptions = selectedMakes.map((make) => {
    const selectedMakeData = offerModels?.makes.find(
      (m) => m.makeName === make.value
    );
    return {
      label: make.label,
      options:
        selectedMakeData?.models.map((model) => ({
          label: model.modelName,
          value: `${make.value}|${model.modelName}`,
        })) || [],
    };
  });

  const handleMakeChange = (selected: MultiValue<Option>) => {
    setSelectedMakes(selected);

    // Filter models based on currently selected makes
    setSelectedModels((currentModels) =>
      currentModels.filter((model) =>
        selected.some((make) => model.value.startsWith(`${make.value}|`))
      )
    );
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

  const { trigger } = useSWRMutation(url, CustomGet, {
    onSuccess: (data: ICar[]) => {
      setCars(data); // Spremanje automobila u globalni kontekst
      router.push('/listing'); // Preusmjeravanje na novu stranicu
      console.log(data);
    },
    onError: (error) => {
      console.error('Error fetching data:', error);
    },
  });

  useEffect(() => {
    if (url) {
      trigger();
    }
  }, [url, trigger]);

  const handleApply = () => {
    // Map models back to make-model pairs
    const makeModelPairs = selectedModels.map((model) => {
      const [make, modelName] = model.value.split('|');
      return { make, model: modelName };
    });

    // Extract makes without models
    const makesWithoutModels = selectedMakes
      .filter(
        (make) =>
          !selectedModels.some((model) =>
            model.value.startsWith(`${make.value}|`)
          )
      )
      .map((make) => ({ make: make.value, model: null }));

    // Combine makes with models and makes without models
    const makeAndModelData = [...makeModelPairs, ...makesWithoutModels];

    // Check for all selected values in checkboxes
    const seatsData = selectedSeats.length === 3 ? [] : selectedSeats;
    const carTypeData = selectedCarType.length === 3 ? [] : selectedCarType;

    // Determine the value for transmission
    let transmissionValue: string | null = null;
    if (selectedTransmission.length === 1) {
      transmissionValue =
        selectedTransmission[0] === 'Automatic' ? 'true' : 'false';
    }

    // Combine the SideFilter data with FilterContext data
    const queryParamsObj: Record<string, string> = {
      seats: seatsData.join(','),
      car_type: carTypeData.join(','),
      transmission: transmissionValue || '',
      min_price: String(minPrice),
      max_price: String(maxPrice),
      makes_and_models: JSON.stringify(makeAndModelData),
      pick_up_location: filterData.pick_up_location || '',
      drop_off_location: filterData.drop_off_location || '',
      pick_up_date: filterData.pick_up_date || '',
      pick_up_time: filterData.pick_up_time || '',
      drop_off_date: filterData.drop_off_date || '',
      drop_off_time: filterData.drop_off_time || '',
    };

    // Remove any empty string values from the query object
    Object.keys(queryParamsObj).forEach((key) => {
      if (!queryParamsObj[key]) {
        delete queryParamsObj[key];
      }
    });

    const queryParams = new URLSearchParams(queryParamsObj);

    const fullUrl = swrKeys.search(queryParams.toString());

    console.log(fullUrl);
    setUrl(fullUrl); // Postavljamo URL u state
  };

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
          <CheckboxGroup
            colorScheme="blue"
            value={selectedSeats}
            onChange={(values) => setSelectedSeats(values as string[])}
          >
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
        <CheckboxGroup
          colorScheme="blue"
          value={selectedCarType}
          onChange={(values) => setSelectedCarType(values as string[])}
        >
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
        <CheckboxGroup
          colorScheme="blue"
          value={selectedTransmission}
          onChange={(values) => setSelectedTransmission(values as string[])}
        >
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
            onChange={(selected) =>
              handleMakeChange(selected as MultiValue<Option>)
            }
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
            onChange={(selected) =>
              handleModelChange(selected as MultiValue<Option>)
            }
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
        onClick={handleApply}
      >
        Apply
      </Button>
    </Box>
  );
}
