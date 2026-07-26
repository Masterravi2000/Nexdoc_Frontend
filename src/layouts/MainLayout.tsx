import { Outlet } from "react-router-dom";
import LeftSideDefaultMenu from "../components/sidebars/LeftSideDefaultMenu";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-row">
      <div className="w-1/7">
        <LeftSideDefaultMenu />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
