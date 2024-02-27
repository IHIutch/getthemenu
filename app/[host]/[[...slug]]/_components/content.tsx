'use client'

import { Box } from '@chakra-ui/react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import * as React from 'react'

export default function Content({ slug, children }: { slug: string, children: React.ReactNode }) {
  return (
    <LayoutGroup>
      <AnimatePresence initial={false}>
        <motion.main
          key={slug}
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
            type: 'easeInOut',
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
