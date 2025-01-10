

import LogList from "@/components/shared/cards/LogList/LogList";
import { Flex } from "@chakra-ui/react";

const mokdata = [
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "pero",
        customerSurame: "peric",
        price: "price",
        registration: "registration",
        pickupp: "pickupp",
        dropoff: "dropoff"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "pero",
        customerSurame: "peric",
        price: "price",
        registration: "registration",
        pickupp: "pickupp",
        dropoff: "dropoff"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "pero",
        customerSurame: "peric",
        price: "price",
        registration: "registration",
        pickupp: "pickupp",
        dropoff: "dropoff"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "pero",
        customerSurame: "peric",
        price: "price",
        registration: "registration",
        pickupp: "pickupp",
        dropoff: "dropoff"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "pero",
        customerSurame: "peric",
        price: "price",
        registration: "registration",
        pickupp: "pickupp",
        dropoff: "dropoff"
    },
];

export default function CompanyProfileLog() {
    return(
        <Flex
          justify={'center'}
          align={'center'}
          direction={'column'}
          py={8}
          gap={2}
          w="100%"
        >
          <LogList
            logs={mokdata}
            description={'Upcoming:'}
            useDescription={true}
          />
          <LogList
            logs={mokdata}
            description={'Ongoing:'}
            useDescription={true}
          />

          <LogList
            logs={mokdata}
            description={'Completed:'}
            useDescription={true}
          />
        </Flex>
    )
}