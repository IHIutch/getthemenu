'use client'

import { MenuSchema } from '@/utils/zod'
import { Box, Container, FormControl, FormLabel, Grid, GridItem, Select, Stack } from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { z } from 'zod'

const _Menus = z.array(MenuSchema)
type MenusType = z.infer<typeof _Menus>

export default function MenuSelector({ menus }: { menus: MenusType }) {
  const router = useRouter()
  const slug = usePathname()?.toString().replace('/', '')

  const handleMenuChange = (toMenuSlug: string) => {
    router.push(`/${toMenuSlug}`)
  }

  return (
    <Box
      position="sticky"
      top="0"
      borderBottomWidth="1px"
      py="4"
      bg="gray.50"
      zIndex="1"
    >
      <Container maxW="container.lg" px={{ base: '2', lg: '4' }}>
        <Grid templateColumns="repeat(12, 1fr)" gap="4">
          <GridItem colSpan={{ base: 12, lg: 7 }}>
            <Stack direction="row" align="flex-end">
              <FormControl flexGrow="1" id="menu">
                <FormLabel mb="1">Select a Menu</FormLabel>
                <Select
                  bg="white"
                  value={slug}
                  onChange={(e) => {
                    handleMenuChange(e.target.value)
                  }}
                >
                  {menus.map(m => (
                    <option key={m.id} value={m.slug || ''}>
                      {m.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}
