import React from 'react'
import { Box } from '@chakra-ui/layout'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { useRouter } from 'next/router'

export default function PublicMenuLayout({ children }) {
  const { asPath } = useRouter()
  return (
    <Box>
      <Box>Test</Box>
      <AnimateSharedLayout>
        <AnimatePresence exitBeforeEnter>
          <motion.main
            key={asPath}
            initial={'hidden'}
            animate={'enter'}
            exit={'exit'}
            variants={{
              hidden: { opacity: 0, x: 0, y: 50 },
              enter: { opacity: 1, x: 0, y: 0 },
              exit: { opacity: 0, x: 0, y: 50 },
            }}
            transition={{
              type: 'easeInOut',
            }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </AnimateSharedLayout>
    </Box>
  )
}
