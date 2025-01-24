"use client";

import LogList from "@/components/shared/cars/LogList/LogList";
import { CustomGet } from "@/fetchers/get";
import { swrKeys } from "@/fetchers/swrKeys";
import { ILog } from "@/typings/logs/logs.type";
import { Flex } from "@chakra-ui/react";
import { use } from "react";
import useSWR from "swr";

export default function CompanyProfileLog() {
  const { data: completedLogsData } = useSWR(swrKeys.companyLogsComplete + "?limit=10&page=1", CustomGet<any>);
  const { data: ongoingLogsData } = useSWR(swrKeys.companyLogsOngoing + "?limit=10&page=1", CustomGet<any>);
  const { data: upcomingLogsData } = useSWR(swrKeys.companyLogsUpcoming + "?limit=10&page=1", CustomGet<any>);
  
  const completedLogs = completedLogsData?.results as ILog[];
  const ongoingLogs = ongoingLogsData?.results as ILog[];
  const upcomingLogs = upcomingLogsData?.results as ILog[];

    return(
        <Flex
          justify={'center'}
          align={'center'}
          direction={'column'}
          gap={2}
          w="100%"
        >
          <LogList
            logs={upcomingLogs}
            description={'Upcoming:'}
            useDescription={true}
          />
          <LogList
            logs={ongoingLogs}
            description={'Ongoing:'}
            useDescription={true}
          />

          <LogList
            logs={completedLogs}
            description={'Completed:'}
            useDescription={true}
          />
        </Flex>
    )
}