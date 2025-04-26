import type { z } from 'zod'
import { RestaurantSchema } from '@/utils/zod'
import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import React from 'react'

const _Restaurant = RestaurantSchema.pick({
  name: true,
  hours: true,
  address: true,
  phone: true,
  email: true,
  coverImage: true,
  customHost: true,
  customDomain: true,
})

type RestaurantType = z.infer<typeof _Restaurant>

export default function Contact({ restaurant }: { restaurant: RestaurantType }) {
  return (
    <Box
      bg="white"
      shadow="sm"
      rounded="md"
      borderWidth="1px"
    >
      <Box p="4" borderBottomWidth="1px">
        <Heading fontSize="lg">Contact</Heading>
      </Box>
      <Stack gap="4" p="4" fontSize="sm">
        {restaurant?.phone && restaurant.phone.length > 0
          ? (
              <Box>
                <Text fontWeight="semibold">Phone</Text>
                <Stack as="ul" gap="1">
                  {restaurant.phone.map((phone, idx) => (
                    <Text
                      as="li"
                      key={idx}
                      listStyleType="none"
                    >
                      {phone}
                    </Text>
                  ))}
                </Stack>
              </Box>
            )
          : null}
        {restaurant?.address
          ? (
              <Box>
                <Text as="dt" fontWeight="semibold">
                  Address
                </Text>
                <Text as="dd">
                  {restaurant.address?.streetAddress}
                  {' '}
                  <br />
                  {restaurant.address?.city}
                  ,
                  {' '}
                  {restaurant.address?.state}
                  {' '}
                  {restaurant.address?.zip}
                </Text>
              </Box>
            )
          : null}
        {restaurant?.email && restaurant.email.length > 0
          ? (
              <Box>
                <Text fontWeight="semibold">Email</Text>
                <Stack as="ul" gap="1">
                  {restaurant.email.map((email, idx) => (
                    <Text
                      as="li"
                      key={idx}
                      listStyleType="none"
                    >
                      {email}
                    </Text>
                  ))}
                </Stack>
              </Box>
            )
          : null}
      </Stack>
    </Box>
  )
}
