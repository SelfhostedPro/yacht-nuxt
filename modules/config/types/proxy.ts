import { z } from 'zod'


export const ProxyRuleSchema = z.object({
    source: z.string(), // The source host to match
    destination: z.string(), // The host to proxy to
    port: z.number().optional(), // The port to proxy to
    protocol: z.enum(['http', 'https']), // The protocol to use
})

export const ProxySchema = z.object({
    enabled: z.boolean(),
    rules: z.array(ProxyRuleSchema),
})

export type ProxyRule = z.infer<typeof ProxyRuleSchema>
export type Proxy = z.infer<typeof ProxySchema>