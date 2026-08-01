import { Outlet } from "react-router-dom";
import LeftSideDefaultMenu from "../components/sidebars/LeftSideDefaultMenu";

function MainLayout() {
  return (
    <div className="flex h-screen">
      <div className="h-screen w-1/7 flex-shrink-0">
        <LeftSideDefaultMenu />
      </div>
      <main className="h-screen flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
