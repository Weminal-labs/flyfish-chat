// Import components
import { ScrollArea } from "./ui/scroll-area";
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type DataCardProps = {
  data: any;
};

function DataCard(props: DataCardProps) {
  return (
    <div className="w-full rounded-lg aspect-video border mb-3">
      <div className="w-3/4 bg-gray-100 aspect-square mx-auto"></div>
      <div className="w-3/4 mx-auto">{props.data}</div>
    </div>
  );
}

export default function Data() {
  return (
    <div className="flex w-full h-screen max-h-[calc(100dvh-28px)] max-w-[340px]">
      <ScrollArea className="w-full px-6">
        {numbers.map((number) => (
          <DataCard key={number} data={number} />
        ))}
      </ScrollArea>
    </div>
  );
}
