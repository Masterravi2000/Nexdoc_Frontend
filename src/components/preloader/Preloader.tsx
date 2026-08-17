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

  const backendReady = useSelector(
    (state: RootState) => state.status.backendReady,
  );
  const initialDataReady = useSelector(
    (state: RootState) => state.stats.initialDataReady,
  );

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
      <div className="absolute bottom-10 flex flex-col px-50 gap-7 justify-center items-center">
        <p className="text-[13px] text-gray-500 text-center bg-gray-50 p-3 rounded-xl">
          <span className="font-semibold text-gray-700 text-xs">Tech Note:</span> It may
          take ~1-2 min loading delay because PyTorch's dynamic graph
          generation on the fly then loading weights for the model. The planned fix is migrating to{" "}
          <strong>ONNX Runtime</strong> for instant, static C++ execution
          (deferred for now due to time constraints).
        </p>
        <span className="text-xl text-gray-300 font-bold">v.01</span>
      </div>
    </div>
  );
}

export default Preloader;
