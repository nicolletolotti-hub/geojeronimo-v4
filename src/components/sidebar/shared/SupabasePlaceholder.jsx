import { useAppMode } from '../../../context/AppModeContext'
import SupabaseAuthPanel from '../../auth/SupabaseAuthPanel'

/**
 * Integração Supabase na sidebar (modos com supabase/acsSync).
 */
export default function SupabasePlaceholder() {
  const { isIntegrationEnabled } = useAppMode()

  if (!isIntegrationEnabled('supabase')) {
    return null
  }

  return <SupabaseAuthPanel />
}
