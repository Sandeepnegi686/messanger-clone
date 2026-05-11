import Sidebar from "../_components/Sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList intialItems={[]} />
        {children}
      </div>
    </Sidebar>
  );
}
