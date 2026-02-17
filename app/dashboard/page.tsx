import CategoryForm from "@/app/components/categoryform";
import BookmarkForm from "@/app/components/BookmarkForm";
import BookmarkList from "@/app/components/BookmarkList";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <CategoryForm />
      <BookmarkForm />
      <BookmarkList />
    </div>
  );
}
