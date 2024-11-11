import { Category } from '@/typings/locationCategorys/LocationCategroys';
import { Box, MenuGroup, MenuItem, useBreakpointValue } from '@chakra-ui/react';
import LocationFormatter from '../LocationFormatter/LocationFormatter';
import { FaCity, FaTrain } from 'react-icons/fa';
import { MdLocalAirport } from 'react-icons/md';

interface LocationDDMGroupsProps {
  options: { [key: string]: string[] };
  handleSelectLocation: (location: string) => void;
  search: string;
  setSearch: (value: string) => void;
}
const categoryIcons: { [key in Category]: JSX.Element } = {
  'Cities (including airports)': <FaCity />,
  Airports: <MdLocalAirport />,
  'Train stations': <FaTrain />,
};

export default function LocationDDMGroups({
  options,
  handleSelectLocation,
  search,
}: LocationDDMGroupsProps) {
  const inputTextSize = useBreakpointValue({
    md: 'xs',
    lg: 'sm',
    xl: 'md',
  });

  const filteredOptions: { [key: string]: string[] } = Object.keys(
    options
  ).reduce(
    (acc, category) => {
      const filteredItems = options[category].filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredItems.length) {
        acc[category] = filteredItems;
      }
      return acc;
    },
    {} as { [key: string]: string[] }
  );

  const renderCategoryIcon = (category: Category): JSX.Element => {
    return categoryIcons[category] || <span />;
  };

  return (
    <>
      {Object.keys(filteredOptions).length > 0 ? (
        Object.keys(filteredOptions).map((category) => (
          <MenuGroup title={category} key={category}>
            {filteredOptions[category as Category].map((item) => (
              <MenuItem
                key={item}
                onClick={() => {
                  handleSelectLocation(item);
                }}
                fontSize="sm"
                gap={2}
              >
                <Box p={2} borderRadius="3px" bg="brandmiddlegray">
                  {renderCategoryIcon(category as Category)}
                </Box>
                <LocationFormatter input={item} type={category as Category} />
              </MenuItem>
            ))}
          </MenuGroup>
        ))
      ) : (
        <MenuItem fontSize="sm" color="brandgray">
          No matching locations found
        </MenuItem>
      )}
    </>
  );
}
