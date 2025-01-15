"use client";

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

const mockData = [
    {
      year: 2024,
      months: [
        { month: 'January', price: 1200 },
        { month: 'February', price: 1300 },
        { month: 'March', price: 1250 },
        { month: 'April', price: 1400 },
        { month: 'May', price: 1350 },
        { month: 'June', price: 1500 },
        { month: 'July', price: 1450 },
        { month: 'August', price: 1600 },
        { month: 'September', price: 1550 },
        { month: 'October', price: 1700 },
        { month: 'November', price: 1650 },
        { month: 'December', price: 1800 },
      ],
    },
    {
      year: 2025,
      months: [
        { month: 'January', price: 1250 },
        { month: 'February', price: 1350 },
        { month: 'March', price: 1300 },
        { month: 'April', price: 1450 },
        { month: 'May', price: 1400 },
        { month: 'June', price: 1550 },
        { month: 'July', price: 1500 },
        { month: 'August', price: 1650 },
        { month: 'September', price: 1600 },
        { month: 'October', price: 1750 },
        { month: 'November', price: 1700 },
        { month: 'December', price: 1850 },
      ],
    },
  ];

export default function CompanyProfileEarnings() {
    const [selectedYear, setSelectedYear] = useState(mockData[0].year);
    const handleYearChange = (e : any) => {
        setSelectedYear(Number(e.target.value)); // Convert the selected value to a number
    };
    const getMonthsForYear = (year: Number) => {
        const yearData = mockData.find((entry) => entry.year === year);
        return yearData ? yearData.months : [];
    };
    return(
    <VStack w="100%" h="100%" justifyContent="space-evenly" alignItems="center">
        <Box w="-moz-fit-content">
          <Select value={selectedYear} onChange={handleYearChange}>
            {mockData.map((data) => (
              <option key={data.year} value={data.year}>
                {data.year}
              </option>
            ))}
          </Select>
        </Box>

        <Flex justifyContent="space-evenly" w="80%">
            <VStack gap={4} alignItems="start">
                <Heading fontSize="xl">Earnings:</Heading>
                <Text>Total:</Text>
                <Text>Selected year:</Text>
            </VStack>
            <VStack gap={4} alignItems="start">
                <Heading fontSize="xl">Rentals:</Heading>
                <Text>Total:</Text>
                <Text>Selected year:</Text>
            </VStack>
        </Flex>

        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getMonthsForYear(selectedYear)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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