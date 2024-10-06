import { type YachtTemplate } from "~/types/templates/yacht"
import { type CreateContainerForm } from "~/types/containers/create"
import { yachtV1TemplatePortSchema, yachtV2TemplatePortSchema } from "~/types/templates/yacht"
import { type YachtV2TemplatePort, type yachtV1TemplatePorts } from "~/types/templates/yacht"


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
      Object.entries(ports as YachtV2TemplatePort).map(([name, port]) => {
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
      (ports as yachtV1TemplatePorts).map((port): void => {
        if (typeof port === 'string') {
          port.includes(':') && port.includes('/')
            ? portlist.push({ host: parseInt(port.split(':')[0]), container: parseInt(port.split(':')[1].split('/')[0]), protocol: port.split('/')[1] as "tcp" | "udp" || undefined })
            : typeof port === 'string' && port.includes(':')
              ? portlist.push({ host: parseInt(port.split(':')[0]), container: parseInt(port.split(':')[1]) })
              : portlist.push({ container: parseInt(port) })
        } else {
          for (const _port in port) {
            const portString = port[_port]
            portString.includes(':') && portString.includes('/')
              ? portlist.push({ label: _port, host: parseInt(portString.split(':')[0]), container: parseInt(portString.split(':')[1].split('/')[0]), protocol: portString.split('/')[1] as "tcp" | "udp" || undefined })
              : portString.includes(':')
                ? portlist.push({ label: _port, host: parseInt(portString.split(':')[0]), container: parseInt(portString.split(':')[1]) })
                : portlist.push({ label: _port, container: parseInt(portString) })
          }
        }
      })
      break;
    }
  }
  return portlist
}