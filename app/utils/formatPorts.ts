import type { YachtTemplate, YachtV2TemplatePort, yachtV1TemplatePorts } from "~~/types/templates/yacht"
import type { CreateContainerForm } from "~~/types/containers/create"
import { yachtV1TemplatePortSchema, yachtV2TemplatePortSchema } from "~~/types/templates/yacht"

export const useFormatPorts = async (ports: YachtTemplate['templates'][0]['ports']): Promise<CreateContainerForm['ports']> => {
  let type: 'yachtv2' | 'yachtv1' | undefined
  const portlist: CreateContainerForm['ports'] = []

  const isYachtV2 = !Array.isArray(ports) && yachtV2TemplatePortSchema.safeParse(ports).success
  const isYachtV1 = yachtV1TemplatePortSchema.safeParse(ports).success

  if (isYachtV2) {
    type = 'yachtv2'
  } else if (isYachtV1) {
    type = 'yachtv1'
  } else {
    type = undefined
  }

  switch (type) {
    case 'yachtv2': {
      Object.entries(ports as YachtV2TemplatePort).forEach(([name, port]) => {
        portlist.push({
          host: port.host ? parseInt(port.host) : undefined,
          container: port.container ? parseInt(port.container) : undefined,
          protocol: port.protocol,
          label: name,
          unchangable: port.unchangable
        })
      })
      break;
    }
    case 'yachtv1': {
      (ports as yachtV1TemplatePorts).forEach((port) => {
        if (typeof port === 'string') {
          if (port.includes(':') && port.includes('/')) {
            const parts = port.split(':')
            const hostPart = parts[0] ?? ''
            const containerProtocolString = parts[1] ?? ''
            const containerProtocolParts = containerProtocolString?.split('/') ?? []
            const containerPart = containerProtocolParts[0] ?? ''
            const protocol = containerProtocolParts[1]

            if (hostPart && containerPart && (protocol === 'tcp' || protocol === 'udp')) {
              portlist.push({
                host: parseInt(hostPart),
                container: parseInt(containerPart),
                protocol
              })
            }
          } else if (port.includes(':')) {
            const parts = port.split(':')
            const hostPart = parts[0] ?? ''
            const containerPart = parts[1] ?? ''

            if (hostPart && containerPart) {
              portlist.push({
                host: parseInt(hostPart),
                container: parseInt(containerPart)
              })
            }
          } else {
            portlist.push({ container: parseInt(port) })
          }
        } else {
          for (const _port in port) {
            const portString = port[_port]
            if (portString) {
              if (portString.includes(':') && portString.includes('/')) {
                const parts = portString.split(':')
                const hostPart = parts[0] ?? ''
                const containerProtocolString = parts[1] ?? ''
                const containerProtocolParts = containerProtocolString?.split('/') ?? []
                const containerPart = containerProtocolParts[0] ?? ''
                const protocol = containerProtocolParts[1]

                if (hostPart && containerPart && (protocol === 'tcp' || protocol === 'udp')) {
                  portlist.push({
                    label: _port,
                    host: parseInt(hostPart),
                    container: parseInt(containerPart),
                    protocol
                  })
                }
              } else if (portString.includes(':')) {
                const parts = portString.split(':')
                const hostPart = parts[0] ?? ''
                const containerPart = parts[1] ?? ''

                if (hostPart && containerPart) {
                  portlist.push({
                    label: _port,
                    host: parseInt(hostPart),
                    container: parseInt(containerPart)
                  })
                }
              } else {
                portlist.push({
                  label: _port,
                  container: parseInt(portString)
                })
              }
            }
          }
        }
      })
      break;
    }
  }
  return portlist
}
