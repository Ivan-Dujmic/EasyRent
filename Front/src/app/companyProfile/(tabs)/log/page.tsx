

import LogList from "@/components/shared/cars/LogList/LogList";
import { CustomGet } from "@/fetchers/get";
import { swrKeys } from "@/fetchers/swrKeys";
import { ILog } from "@/typings/logs/logs.type";
import { Flex } from "@chakra-ui/react";
import useSWR from "swr";

export default function CompanyProfileLog() {
  const { data: completedLogs } = useSWR(swrKeys.companyLogsComplete + "?limit=10&page=1", CustomGet<ILog[]>);
  const { data: ongoingLogs } = useSWR(swrKeys.companyLogsOngoing + "?limit=10&page=1", CustomGet<ILog[]>);
  const { data: upcomingLogs } = useSWR(swrKeys.companyLogsUpcoming + "?limit=10&page=1", CustomGet<ILog[]>);


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