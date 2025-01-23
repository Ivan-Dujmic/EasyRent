import ReviewCard from "@/components/shared/cars/ReviewCard/ReviewCard";
import { Box, Container, Grid } from "@chakra-ui/react";

const mokReviews = [
    {
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "Pero",
        customerSurname: "Pero",
        date: "01.01.2001.",
        rating: "4.0",
        registration: "registration",
        description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper."
        

    },
    {
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "Pero",
        customerSurname: "Pero",
        date: "01.01.2001.",
        rating: "4.0",
        registration: "registration",
        description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper."
    },
    {
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "Pero",
        customerSurname: "Pero",
        date: "01.01.2001.",
        rating: "4.0",
        registration: "registration",
        description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper."
    },
    {
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "Pero",
        customerSurname: "Pero",
        date: "01.01.2001.",
        rating: "4.0",
        registration: "registration",
        description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper."
    },
    {
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "Pero",
        customerSurname: "Pero",
        date: "01.01.2001.",
        rating: "4.0",
        registration: "registration",
        description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper."
    },
    {
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "Pero",
        customerSurname: "Pero",
        date: "01.01.2001.",
        rating: "4.0",
        registration: "registration",
        description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper."
    },
    {
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "Pero",
        customerSurname: "Pero",
        date: "01.01.2001.",
        rating: "4.0",
        registration: "registration",
        description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper."
    },
    {
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "Pero",
        customerSurname: "Pero",
        date: "01.01.2001.",
        rating: "4.0",
        registration: "registration",
        description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper."
    },
    {
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        customerName: "Pero",
        customerSurname: "Pero",
        date: "01.01.2001.",
        rating: "4.0",
        registration: "registration",
        description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper."
    },
];

export interface IReview{  
    companyName: string;
    modelName: string;
    makeName: string;
    customerName: string;
    customerSurname: string;
    registration: string;
    date: string;
    description: string;
    rating: string;
  }

export default function CompanyProfileReviews() {
    return(
        <Container maxW="container.2xl" px={10}>
          <Grid
            templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gap={6}
            justifyContent="center"
            alignItems="center" 
          >
            {mokReviews.map((review, indx) =>(
                <ReviewCard key={indx} review={review}/>
            ))
            }
          </Grid>
        </Container>
    )
}