import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useHomeStore } from '@/pages/home/useHomeStore'

export default function RoleSelector() {
  const { role, setRole } = useHomeStore()

  return (
    <div className="space-y-2">
      <Label htmlFor="role">Target Role</Label>
      <Input
        id="role"
        placeholder="e.g. Frontend Developer, Data Scientist..."
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="focus-visible:ring-violet-500"
      />
    </div>
  )
}
