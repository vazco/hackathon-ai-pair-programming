import { createFileRoute } from '@tanstack/react-router';

function Index() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: Index,
});
