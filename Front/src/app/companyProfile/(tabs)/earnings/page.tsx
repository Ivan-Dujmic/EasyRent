"use client";

import { CustomGet } from "@/fetchers/get";
import { swrKeys } from "@/fetchers/swrKeys";
import { IEarnings } from "@/typings/company/company";
import { Container, Flex, VStack, Text, Heading, Box, Select } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from 'recharts';
import useSWR, { mutate } from "swr";

const yearsOptions = [
  2024, 2025
]
export default function CompanyProfileEarnings() {
    const [selectedYear, setSelectedYear] = useState(2025);
    const { data: earnings } = useSWR(swrKeys.companyEarnings + "?year=" + selectedYear, (url) => CustomGet<IEarnings>(url));
    const handleYearChange = (e : any) => {
        setSelectedYear(Number(e.target.value)); // Convert the selected value to a number
    };

    function getMonthsForYear(months?: number[]): { month: string; price: number }[] {
      const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
      ];
      // If months is undefined, create a list of 12 months with value 0
      if (!months) {
          months = Array(12).fill(0);
      }
      return monthNames.map((name, i) => ({
          month: name,
          price: months?.[i] ?? 0,
      }));
  }
    return(
    <VStack w="100%" h="100%" justifyContent="space-evenly" alignItems="center">
        <Box w="-moz-fit-content">
          <Select value={selectedYear} onChange={handleYearChange}>
            {yearsOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </Box>

        <Flex justifyContent="space-evenly" w="80%">
            <VStack gap={4} alignItems="start">
                <Heading fontSize="xl">Earnings:</Heading>
                <Text>Total: {earnings?.results.totalEarnings}</Text>
                <Text>Selected year: {earnings?.results.yearEarnings}</Text>
            </VStack>
            <VStack gap={4} alignItems="start">
                <Heading fontSize="xl">Rentals:</Heading>
                <Text>Total: {earnings?.results.totalRentals}</Text>
                <Text>Selected year: {earnings?.results.yearRentals}</Text>
            </VStack>
        </Flex>

        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getMonthsForYear(earnings?.results.monthlyEarnings)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `€${value}`} />
            <Bar dataKey="price" fill="darkblue">
                <LabelList 
                dataKey="price" position="top" style={{ fill: '#000', fontSize: '12px' }}
                formatter={(value : number) => `€${value}`} 
                />
            </Bar>
            </BarChart>
        </ResponsiveContainer>
    </VStack>
    )
}