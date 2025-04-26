import type { z } from 'zod'
import { formatTime } from '@/utils/functions'
import { DAYS_OF_WEEK, RestaurantSchema } from '@/utils/zod'
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'
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

export default function Hours({ restaurant }: { restaurant: RestaurantType }) {
  return (
    <Box
      bg="white"
      shadow="sm"
      rounded="md"
      borderWidth="1px"
    >
      <Box p="4" borderBottomWidth="1px">
        <Heading fontSize="lg">Hours</Heading>
      </Box>
      <Stack gap="3" py="3" fontSize="sm">
        {DAYS_OF_WEEK.map(day => (
          <Flex
            as="dl"
            key={day}
            justify="space-between"
            px="4"
            w="100%"
          >
            <Box>
              <Text as="dt" fontWeight="semibold">
                {day}
                :
              </Text>
            </Box>
            <Box>
              {restaurant?.hours?.[day]?.isOpen
                ? (
                    <Text as="dd">
                      {restaurant.hours?.[day]?.openTime
                        && formatTime(
                          restaurant.hours?.[day]?.openTime || '',
                        )}
                      {' '}
                      -
                      {' '}
                      {restaurant.hours?.[day]?.closeTime
                        && formatTime(
                          restaurant.hours?.[day]?.closeTime || '',
                        )}
                    </Text>
                  )
                : (
                    <Text as="dd">Closed</Text>
                  )}
            </Box>
          </Flex>
        ))}
      </Stack>
    </Box>
  )
}
