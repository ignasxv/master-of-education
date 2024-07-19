import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/lessons/physics')({
  component: () => <div>Hello /lessons/physics!</div>
})