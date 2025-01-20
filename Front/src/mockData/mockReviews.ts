export interface Review {
  rating: number; // Rating given by the user
  firstName: string; // First name of the reviewer
  lastName: string; // Last name of the reviewer
  reviewDate: string; // Date of the review in ISO format
  description: string; // Text description of the review
}

// Mock Reviews Array
export const mockReviews: Review[] = [
  {
    rating: 5,
    firstName: 'John',
    lastName: 'Doe',
    reviewDate: '2023-01-10T14:30:00.000Z',
    description:
      'Excellent car! The service was smooth, and the vehicle was in top-notch condition. Highly recommend!',
  },
  {
    rating: 4,
    firstName: 'Jane',
    lastName: 'Smith',
    reviewDate: '2023-02-15T10:00:00.000Z',
    description:
      'Great experience overall, but the pick-up process took a bit longer than expected.',
  },
  {
    rating: 3,
    firstName: 'Mark',
    lastName: 'Johnson',
    reviewDate: '2023-03-05T08:45:00.000Z',
    description:
      'The car was decent, but it could have been cleaner. Service was average.',
  },
  {
    rating: 5,
    firstName: 'Emily',
    lastName: 'Davis',
    reviewDate: '2023-04-20T16:20:00.000Z',
    description:
      'Loved the car! Very comfortable and well-maintained. Will rent again.',
  },
  {
    rating: 2,
    firstName: 'Michael',
    lastName: 'Brown',
    reviewDate: '2023-05-11T12:10:00.000Z',
    description:
      "Disappointed with the car's performance. Engine issues during the trip.",
  },
];
