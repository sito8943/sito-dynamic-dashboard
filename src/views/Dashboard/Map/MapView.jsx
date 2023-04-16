import React, {
  useCallback,
  useReducer,
  useState,
  useEffect,
  useMemo,
} from /*  */ "react";
import loadable from "@loadable/component";

// @emotion/css
import { css } from "@emotion/css";

// services
import { fetchList } from "../../../services/general";
import { centerList } from "../../../services/centers/post";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useNotification } from "../../../contexts/NotificationProvider";

// components
import Loading from "../../../components/Loading/Loading";
const MapComponent = loadable((props) => import("../../../components/Map/Map"));

function MapView() {
  const { languageState } = useLanguage();

  const { map } = useMemo(() => {
    return { map: languageState.texts.map };
  }, [languageState]);

  const { setNotificationState } = useNotification();

  const filtersReducer = (filtersState, action) => {
    const { type } = action;
    switch (type) {
      case "loading": {
        const { to, id } = action;
        if (filtersState[id]) filtersState[id].loading = to;
        else filtersState[id] = { loading: to, value: true };

        return { ...filtersState };
      }
      case "toggle": {
        const { id } = action;
        if (filtersState[id]) {
          filtersState[id].value = !filtersState[id].value;
          filtersState[id].loading = true;
        } else filtersState[id] = { loading: true, value: true };
        return { ...filtersState };
      }
      default:
        return filtersState;
    }
  };

  const [filters, setFilters] = useReducer(filtersReducer, {
    centers: { value: true, loading: true },
    menus: { value: true, loading: true },
  });

  const pointsReducer = (pointsState, action) => {
    const { type } = action;
    switch (type) {
      case "add": {
        const { elements } = action;
        return [...pointsState, ...elements];
      }
      default:
        return pointsState;
    }
  };

  const [points, setPoints] = useReducer(pointsReducer, []);
  const [coordinates, setCoordinates] = useState([]);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const initCenters = async () => {
    try {
      const response = await centerList(1, -1, "date", [
        "id",
        "name",
        "headerImages",
        "location",
      ]);
      const { list } = response;
      setPoints({
        type: "add",
        elements: list.map(({ id, name, headerImages, location }) => ({
          id,
          name,
          headerImages,
          location,
        })),
      });
      setFilters({ type: "loading", to: false, id: "centers" });
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
    }
  };

  useEffect(() => {
    if (filters.centers && filters.centers.loading) initCenters();
  }, [filters]);

  const printButtons = useCallback(
    () =>
      map.filters.map((item) => (
        <button
          key={item.model}
          type="button"
          onClick={() => setFilters({ type: "toggle", id: item.model })}
          className={`flex gap-2 secondary-hover ${
            filters[item.model]?.value ? "submit" : "secondary"
          }`}
        >
          {filters[item.model]?.loading ? (
            <Loading
              strokeColor={
                filters[item.model]?.value
                  ? "stroke-secondary"
                  : "stroke-primary"
              }
              className={css({
                ".loader": {
                  width: "20px",
                },
              })}
            />
          ) : null}
          {item.label}
        </button>
      )),
    [filters]
  );

  return (
    <div className="w-full h-full">
      <div className="flex gap-2 flex-wrap">{printButtons()}</div>
      <MapComponent
        sx={{
          width: "100%",
          height: "90%",
          marginTop: "20px",
        }}
        points={points}
        coordinates={coordinates}
      />
    </div>
  );
}

export default MapView;
