import { Outlet } from "react-router-dom";
import LeftSideDefaultMenu from "../components/sidebars/LeftSideDefaultMenu";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import Preloader from "../components/preloader/Preloader";

function MainLayout() {
  const startupCompleted = useSelector(
    (state: RootState) => state.status.startupCompleted,
  );

  // If false, render the Preloader component.
  if (!startupCompleted) {
    return <Preloader />;
  }

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
