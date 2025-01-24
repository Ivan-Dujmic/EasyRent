import { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";
import { IVehicleLogs } from "@/typings/logs/logs.type";

export default function DynamicRows({ data, n }: { data: IVehicleLogs[], n : number }) {
  const rowsPerPage = n; // Number of rows to show initially
  const [visibleRows, setVisibleRows] = useState(rowsPerPage);

  const loadMore = () => {
    setVisibleRows((prev) => prev + rowsPerPage);
  };

  return (
    <>
      {data?.slice(0, visibleRows).map((row, index) => (
        <Tr key={index}>
          <Td>{row.dateTimePickup}</Td>
          <Td>{row.dateTimeReturned}</Td>
          <Td>{row.firstName} {row.lastName}</Td>
          <Td>{row.price}</Td>
          <Td>{row.pickUpLocation}</Td>
          <Td>{row.dropOffLocation}</Td>
        </Tr>
      ))}
      {/* Show "Load More" only if there are more rows to display */}
      {visibleRows < data?.length && (
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
