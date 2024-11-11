import type { YachtConfig } from "../../types"

export const useClientConfig = () => {
    const clientConfig = useState<Pick<YachtConfig, 'auth' | 'theme' | 'name'> | null>("auth-enabled", () => null)
    return clientConfig
}