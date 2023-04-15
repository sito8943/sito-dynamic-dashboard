import React, {
  useEffect,
  useReducer,
  useState,
  useCallback,
  Suspense,
  useRef,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useScreenWidth } from "use-screen-width";
import loadable from "@loadable/component";

// services
import { deleteModels, modifyModel, pingSender } from "../services/general.js";

// utils
import { localReducer } from "../utils/reducer.js";
import { parsePluralName } from "../utils/parser.js";

// contexts
import { useLanguage } from "../contexts/LanguageProvider.jsx";
import { useNotification } from "../contexts/NotificationProvider.jsx";

// components
import Loading from "../components/Loading/Loading.jsx";

const Table = loadable((props) => import("../components/Table/Table.jsx"));
const Error = loadable((props) => import("../components/Error/Error.jsx"));
const Empty = loadable((props) => import("../components/Empty/Empty.jsx"));
const ResponsiveList = loadable((props) =>
  import("../components/ResponsiveList/ResponsiveList.jsx")
);

export default function List({
  model,
  modelFetch,
  navigateToInsert,
  parseRows,
  tableQuery,
  noAction,
}) {
  const widthViewport = useScreenWidth();

  const [biggerThanMD, setBiggerThanMD] = useState(false);

  useEffect(() => {
    setBiggerThanMD(widthViewport.screenWidth > 575);
  }, [widthViewport]);

  const { languageState } = useLanguage();

  const { models, errors, messages } = useMemo(() => {
    return {
      models: languageState.texts.models,
      errors: languageState.texts.errors,
      messages: languageState.texts.messages,
    };
  }, [languageState]);

  const { setNotificationState } = useNotification();

  const [loading, setLoading] = useState(1);

  const [localList, setLocalList] = useReducer(localReducer, []);
  const [realModels, setRealModels] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      message,
      ntype,
    });

  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  const onScroll = useCallback(
    (e) => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      if (top >= ref?.current?.offsetTop - 507) setIsInView(true);
      else setIsInView(false);
    },
    [setIsInView]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetch = useCallback(
    async (pageA = 1) => {
      setLoading(1);
      try {
        const pingResponse = await pingSender(parsePluralName(model));
        const response = await modelFetch(
          pageA,
          5,
          "id",
          models[model].table.columns,
          tableQuery(),
          pingResponse
        );
        const { list, totalPages } = response;
        setHasMore(pageA < totalPages);
        if (list.length) {
          const parsedLocalRows = [];
          for (const item of list) {
            const parsedItem = await parseRows(item, languageState.texts);
            parsedLocalRows.push(parsedItem);
          }
          setLocalList({
            type: pageA === 1 ? "set" : "add",
            elements: parsedLocalRows,
            max: totalPages,
            page: pageA,
          });
          setRealModels([realModels, ...list]);
        }
        setLoading(0);
      } catch (err) {
        console.error(err);
        setLocalList({ type: "error" });
        setLoading(-1);
        setRealModels([]);
        setHasMore(false);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else showNotification("error", String(err));
      }
    },
    [model]
  );

  useEffect(() => {
    if (isInView) setPage(page + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  useEffect(() => {
    fetch(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const retry = () => fetch();

  useEffect(() => {
    setLocalList({ type: "reset" });
    setPage(1);
    if (page === 1) retry();
  }, [model]);

  const navigate = useNavigate();
  const editToDo = (selected) =>
    navigate(`/${parsePluralName(model)}/form?id=${selected[0]}`);

  const removeToDo = async (selected) => {
    setLoading(1);
    try {
      if (selected.length) {
        const response = await deleteModels(parsePluralName(model), selected);
        if (response.status === 200) {
          showNotification("success", messages.deletedSuccessful);
          retry();
        } else showNotification("error", errors.someWrong);
      }
    } catch (error) {
      showNotification("error", errors.someWrong);
    }
  };

  const showToDo = async (selected) => {
    setLoading(true);
    try {
      let error = false;
      for (const item of selected) {
        const realItem = realPlaceTypes.filter((jtem) => {
          if (jtem.id === item) return jtem;
          return null;
        })[0];
        if (!realItem.visibility) {
          realItem.visibility = true;
          const response = await modifyModel("placeTypes", realItem);
          if (!response.status === 200) {
            error = true;
            break;
          }
        }
      }
      if (error) showNotification("error", Errors.SomeWrong);
      else {
        showNotification("success", Messages.SaveSuccessful);
        retry();
      }
    } catch (error) {
      showNotification("error", Errors.SomeWrong);
    }
  };

  const hideToDo = async (selected) => {
    setLoading(1);
    try {
      let error = false;
      for (const item of selected) {
        const realItem = realModels.filter((jtem) => {
          if (jtem.id === item) return jtem;
          return null;
        })[0];
        if (realItem.visibility) {
          realItem.visibility = false;
          const response = await modifyModel("placeTypes", realItem);
          if (!response.status === 200) {
            error = true;
            break;
          }
        }
      }
      if (error) showNotification("error", errors.someWrong);
      else showNotification("success", messages.saveSuccessful);
    } catch (error) {
      showNotification("error", errors.someWrong);
    }
    retry();
  };

  /* useEffect(() => {
    retry();
  }, [model]); */

  const onPageChange = (page) => {
    if (page > 0 && localList[page * 10] && !localList[page * 10].id)
      fetch(page);
    setCurrentPage(page);
  };

  return (
    <div className="w-full h-full mt-2 overflow-auto relative">
      <Suspense>
        <h2 className="text-h4 font-bold dark:text-white text-dark-background2">
          {models[model].titles.list} {models[model].label}
        </h2>
        {localList.length ? (
          <>
            {biggerThanMD ? (
              <Table
                model={model}
                rows={localList}
                onDelete={!noAction ? removeToDo : undefined}
                onEdit={!noAction ? editToDo : undefined}
                onShow={!noAction ? showToDo : undefined}
                onHide={!noAction ? hideToDo : undefined}
                onPageChange={onPageChange}
                page={currentPage}
              />
            ) : (
              <ResponsiveList
                model={model}
                rows={localList}
                onDelete={!noAction ? removeToDo : undefined}
                onEdit={!noAction ? editToDo : undefined}
                onShow={!noAction ? showToDo : undefined}
                onHide={!noAction ? hideToDo : undefined}
                onPageChange={onPageChange}
                page={currentPage}
              />
            )}
          </>
        ) : null}

        {localList !== -1 && hasMore && loading !== 1 ? (
          <div ref={ref}>
            <Loading
              visible
              sx={{ height: "64px", position: "inherit", marginTop: "20px" }}
            />
          </div>
        ) : null}
        {loading === 1 && !localList.length ? (
          <Loading className="bg-light-background dark:bg-dark-background2 w-full h-full" />
        ) : null}
        {loading === 0 && !localList.length ? (
          <Empty text={models[model].empty} />
        ) : null}
        {loading === -1 ? <Error /> : null}
      </Suspense>
    </div>
  );
}
