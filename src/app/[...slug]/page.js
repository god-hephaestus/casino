import Menu from "@/components/Menu";
import GameList from "../../components/GameList";

const DynamicPage = ({ params }) => {
  // Default to an empty array if no slug is provided
  const { slug = [] } = params;

  return (
    <div className="">
      <Menu />
      <GameList slug={slug} />
    </div>
  );
};

export default DynamicPage;
