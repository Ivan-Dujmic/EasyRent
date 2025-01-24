"use client";

import ReviewCard from "@/components/shared/cars/ReviewCard/ReviewCard";
import { CustomGet } from "@/fetchers/get";
import { swrKeys } from "@/fetchers/swrKeys";
import { IReview } from "@/typings/reviews/reviews.type";
import { Box, Container, Grid } from "@chakra-ui/react";
import useSWR from "swr";

export default function CompanyProfileReviews() {
  const { data: reviewsData } = useSWR(swrKeys.companyReviews + "?limit=40&page=1", CustomGet<any>);
  const reviews: IReview[] = reviewsData?.results;

    return(
        <Container maxW="container.2xl" px={10}>
          <Grid
            templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gap={6}
            justifyContent="center"
            alignItems="center" 
          >
            {reviews?.map((review, indx) =>(
                <ReviewCard key={indx} review={review}/>
            ))
            }
          </Grid>
        </Container>
    )
}