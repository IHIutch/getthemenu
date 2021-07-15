import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import customTheme from '@/customTheme'

const theme = extendTheme(customTheme)

const App = ({ Component, pageProps }) => (
  <ChakraProvider theme={theme}>
    <Component {...pageProps} />
  </ChakraProvider>
)

export default App
