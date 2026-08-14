import { useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hook";
import { setStartupCompleted } from "../../redux/appSlice/startupSlice";
import { backendStartupStatusThunk } from "../../redux/appSlice/startupThunk"; 
import { fetchStatsThunk } from "../../redux/stats/statsThunk";
import PreloaderLogoIcon from "../svg_icons/PreloaderLogoIcon";

function Preloader() {
  const dispatch = useAppDispatch();

  const backendReady = useSelector((state: RootState) => state.status.backendReady);
  const initialDataReady = useSelector((state: RootState) => state.stats.initialDataReady);

  // 1. Polling Effect
  useEffect(() => {
    const checkStartup = () => {
      if (!backendReady) dispatch(backendStartupStatusThunk());
      if (!initialDataReady) dispatch(fetchStatsThunk());
    };

    checkStartup();
    const intervalId = setInterval(checkStartup, 1000);

    // This cleanup runs automatically when the component unmounts
    return () => clearInterval(intervalId);
  }, [backendReady, initialDataReady, dispatch]);

  // 2. Lock-in Effect
  useEffect(() => {
    if (backendReady && initialDataReady) {
      dispatch(setStartupCompleted());
    }
  }, [backendReady, initialDataReady, dispatch]);

  return (
    <div className="w-full h-screen bg-white flex justify-center items-center">
      <div className="gap-4 flex flex-col justify-center items-center">
        <div className="p-2.5 rounded-xl border-[2px] border-gray-900">
          <PreloaderLogoIcon />
        </div>
        <span className="text-gray-900 font-[700] text-md">
          Nexdoc loading ...
        </span>
      </div>
      <div className="absolute bottom-10">
        <span className="text-xl text-gray-200 font-bold">v.01</span>
      </div>
    </div>
  );
}

export default Preloader;