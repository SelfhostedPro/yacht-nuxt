import { type YachtTemplate } from "~~/types/templates/yacht"
import { type CreateContainerForm } from "~~/types/containers/create"
import { yachtV1TemplatePortSchema, yachtV2TemplatePortSchema } from "~~/types/templates/yacht"
import { type YachtV2TemplatePort, type yachtV1TemplatePorts } from "~~/types/templates/yacht"

export const useFormatPorts = async (ports: YachtTemplate['templates'][0]['ports']): Promise<CreateContainerForm['ports']> => {
  let type: 'yachtv2' | 'yachtv1' | undefined
  const portlist: CreateContainerForm['ports'] = []
  !Array.isArray(ports) && yachtV2TemplatePortSchema.safeParse(ports)
    ? type = 'yachtv2'
    : yachtV1TemplatePortSchema.safeParse(ports)
      ? type = 'yachtv1'
      : type = undefined
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
      (ports as yachtV1TemplatePorts).forEach((port): void => {
        if (typeof port === 'string') {
          if (port.includes(':') && port.includes('/')) {
            const [hostPart, containerPart] = port.split(':')
            const [containerPort, protocol] = containerPart ? containerPart.split('/') : [undefined, undefined]
            portlist.push({ 
              host: hostPart ? parseInt(hostPart) : undefined, 
              container: containerPort ? parseInt(containerPort) : undefined, 
              protocol: (protocol as "tcp" | "udp" | undefined) || undefined 
            })
          } else if (port.includes(':')) {
            const [hostPart, containerPart] = port.split(':')
            portlist.push({ 
              host: hostPart ? parseInt(hostPart) : undefined, 
              container: containerPart ? parseInt(containerPart) : undefined 
            })
          } else {
            portlist.push({ container: parseInt(port) })
          }
        } else {
          for (const _port in port) {
            const portString = port[_port]
            if (portString) {
              if (portString.includes(':') && portString.includes('/')) {
                const [hostPart, containerPart] = portString.split(':')
                const [containerPort, protocol] = containerPart ? containerPart.split('/') : [undefined, undefined]
                portlist.push({ 
                  label: _port, 
                  host: hostPart ? parseInt(hostPart) : undefined, 
                  container: containerPort ? parseInt(containerPort) : undefined, 
                  protocol: (protocol as "tcp" | "udp" | undefined) || undefined 
                })
              } else if (portString.includes(':')) {
                const [hostPart, containerPart] = portString.split(':')
                portlist.push({ 
                  label: _port, 
                  host: hostPart ? parseInt(hostPart) : undefined, 
                  container: containerPart ? parseInt(containerPart) : undefined 
                })
              } else {
                portlist.push({ label: _port, container: parseInt(portString) })
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