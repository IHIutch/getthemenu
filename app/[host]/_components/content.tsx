'use client'

import { Box } from '@chakra-ui/react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import * as React from 'react'

export default function Content({ children }: { children: React.ReactNode }) {
  const key = usePathname()?.toString()

  return (
    <LayoutGroup>
      <AnimatePresence initial={false}>
        <motion.main
          key={key}
          initial={'hidden'}
          animate={'shown'}
          exit={'hidden'}
          variants={{
            hidden: {
              opacity: 0,
              x: 0,
              y: 50,
              position: 'absolute',
            },
            shown: {
              opacity: 1,
              x: 0,
              y: 0,
              position: 'relative',
            },
          }}
          transition={{
            type: 'easeIn',
          }}
          style={{
            width: '100%',
          }}
        >
          <Box py="4">{children}</Box>
        </motion.main>
      </AnimatePresence>
    </LayoutGroup>
  )
}
