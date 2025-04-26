'use client'

import type { z } from 'zod'
import { formatTime } from '@/utils/functions'
import { DAYS_OF_WEEK, RestaurantSchema } from '@/utils/zod'
import { AspectRatio, Box, Button, Container, Dialog, Flex, Heading, Icon, Stack, Tabs, Text, useDisclosure } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { ClockIcon, PhoneIcon } from 'lucide-react'
import NextImage from 'next/image'
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

export default function Header({ restaurant }: { restaurant: RestaurantType }) {
  const modalState = useDisclosure()

  const weekdayName = dayjs().format('dddd') as typeof DAYS_OF_WEEK[number]
  return (
    <>
      <AspectRatio ratio={{ base: 4 / 3, sm: 21 / 9 }}>
        <Box boxSize="full">
          {restaurant?.coverImage?.src
            ? (
                <NextImage
                  alt={restaurant?.name || ''}
                  src={restaurant?.coverImage?.src}
                  blurDataURL={restaurant?.coverImage?.blurDataURL}
                  fill={true}
                  priority={true}
                  sizes="100vw"
                  style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                  placeholder={restaurant?.coverImage?.blurDataURL?.startsWith('data') ? 'blur' : 'empty'}
                />
              )
            : (
                <Box boxSize="full" bg="gray.400" />
              )}
          <Flex
            position="absolute"
            bottom="0"
            left="0"
            w="full"
            pt="8"
            pb="6"
            bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2) 20%, rgba(0, 0, 0, 0.9))"
          >
            <Container maxW="container.lg" px={{ base: '2', lg: '4' }}>
              <Heading
                as="h1"
                lineHeight="1.2"
                textShadow="0 2px 1px black"
                flexGrow="1"
                color="white"
                size={{ base: 'xl', sm: '2xl' }}
                mb="4"
              >
                {restaurant?.name}
              </Heading>
              <Flex align="center">
                <Flex wrap="wrap" color="white" flexGrow="1">
                  {restaurant?.phone?.length && (
                    <Stack direction="row" align="center" mr="6" py="1">
                      <Icon as={PhoneIcon} />
                      <Text>{restaurant.phone[0]}</Text>
                    </Stack>
                  )}
                  <Stack direction="row" align="center" py="1">
                    <Icon as={ClockIcon} />
                    {restaurant?.hours?.[weekdayName]?.isOpen
                      ? (
                          <Text>
                            {restaurant.hours?.[weekdayName]?.openTime
                              ? formatTime(
                                  restaurant.hours?.[weekdayName]?.openTime || '',
                                )
                              : null}
                            {' '}
                            -
                            {' '}
                            {restaurant.hours?.[weekdayName]?.closeTime
                              ? formatTime(
                                  restaurant.hours?.[weekdayName]?.closeTime || '',
                                )
                              : null}
                          </Text>
                        )
                      : (
                          <Text>Closed Today</Text>
                        )}
                  </Stack>
                </Flex>
                {restaurant.phone && restaurant.address
                  ? (
                      <Box display={{ lg: 'none' }} flexShrink="0">
                        <Button onClick={modalState.onOpen}>
                          View Details
                        </Button>
                      </Box>

                    )
                  : null}
              </Flex>
            </Container>
          </Flex>
        </Box>
      </AspectRatio>

      <Dialog.Root open={modalState.open} onOpenChange={modalState.onClose}>
        <Dialog.Backdrop />
        <Dialog.Content>
          <Dialog.Header>Restaurant Details</Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            <Tabs.Root fitted>
              <Tabs.List>
                <Tabs.Trigger value="contact">Contact</Tabs.Trigger>
                <Tabs.Trigger value="hours">Hours</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="contact" px="0">
                <Stack gap="4">
                  {restaurant?.phone && restaurant.phone.length > 0
                    ? (
                        <Box>
                          <Text fontWeight="semibold">Phone</Text>
                          <Stack as="ul" gap="1">
                            {restaurant.phone.map((phone, idx) => (
                              <Text as="li" key={idx} listStyleType="none">
                                {phone}
                              </Text>
                            ))}
                          </Stack>
                        </Box>
                      )
                    : null}

                  {restaurant?.address && (
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
                  )}

                  {restaurant?.email && restaurant?.email?.length > 0
                    ? (
                        <Box>
                          <Text fontWeight="semibold">Email</Text>
                          <Stack as="ul" gap="1">
                            {restaurant.email.map((email, idx) => (
                              <Text as="li" key={idx} listStyleType="none">
                                {email}
                              </Text>
                            ))}
                          </Stack>
                        </Box>
                      )
                    : null}
                </Stack>
              </Tabs.Content>
              <Tabs.Content value="hours" px="0">
                <Stack gap="3">
                  {DAYS_OF_WEEK.map(day => (
                    <Flex as="dl" key={day} justify="space-between" w="100%">
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
                                  && formatTime(restaurant.hours?.[day]?.closeTime || '')}
                              </Text>
                            )
                          : (
                              <Text as="dd">Closed</Text>
                            )}
                      </Box>
                    </Flex>
                  ))}
                </Stack>
              </Tabs.Content>
            </Tabs.Root>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}
