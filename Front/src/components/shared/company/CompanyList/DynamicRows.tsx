import { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";

interface RentalData {
  from: string;
  to: string;
  who: string;
  price: string;
  pickup: string;
  dropoff: string;
}

export default function DynamicRows({ data, n }: { data: RentalData[], n : number }) {
  const rowsPerPage = n; // Number of rows to show initially
  const [visibleRows, setVisibleRows] = useState(rowsPerPage);

  const loadMore = () => {
    setVisibleRows((prev) => prev + rowsPerPage);
  };

  return (
    <>
      {data.slice(0, visibleRows).map((row, index) => (
        <Tr key={index}>
          <Td>{row.from}</Td>
          <Td>{row.to}</Td>
          <Td>{row.who}</Td>
          <Td>{row.price}</Td>
          <Td>{row.pickup}</Td>
          <Td>{row.dropoff}</Td>
        </Tr>
      ))}
      {/* Show "Load More" only if there are more rows to display */}
      {visibleRows < data.length && (
        <Tr>
          <Td colSpan={6} textAlign="center">
            <Button mt={4} onClick={loadMore}>
              Load More
            </Button>
          </Td>
        </Tr>
      )}
    </>
  );
}
