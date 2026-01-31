"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { SessionProvider } from "next-auth/react"
import { QueryProvider } from "./query-provider"
import { Toaster } from "./toaster"

export function Provider(props: ColorModeProviderProps) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ChakraProvider value={defaultSystem}>
          <ColorModeProvider 
            defaultTheme="system" 
            enableSystem={true}
            attribute="class"
            disableTransitionOnChange={true}
            {...props} 
          />
          <Toaster />
        </ChakraProvider>
      </QueryProvider>
    </SessionProvider>
  )
}
