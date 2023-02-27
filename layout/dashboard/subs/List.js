import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faChevronRight,
  faChevronLeft,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

// services
import { fetchModel, useModel } from "../../../services/services";

// contexts
import { useLanguage } from "../../../context/LanguageProvider";

// components
import Empty from "../../../components/Empty/Empty";
import Loading from "../../../components/Loading/Loading";

// styles
import styles from "../../../styles/Dashboard.module.css";

// utils
import { parseAttributes, parseAttributesWidth, prefabs } from "./utils";

const List = (props) => {
  const { model } = props;
  const { languageState } = useLanguage();

  const [page, setPage] = useState(0);

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => setShowFilters(!showFilters);

  const { data, isLoading, isFetching } = useModel(
    model,
    page,
    10,
    prefabs[model]
  );

  const { labels } = useMemo(() => {
    return { labels: languageState.texts.Labels };
  }, [languageState]);

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <Loading type="400" />
      ) : (
        <div className="flex w-full h-full items-center justify-center flex-col">
          <div className={`w-full flex items-center ${styles.filters}`}>
            <button
              onClick={toggleFilters}
              className="transition hover:bg-dodger rounded-circle w-icon h-icon"
            >
              <FontAwesomeIcon icon={faFilter} />
            </button>
          </div>
          {data?.list.length ? (
            <table className={`${styles.bordered} w-full h-full min-h-full`}>
              <tbody>
                <tr>
                  {Object.keys(data?.list[0])
                    .filter((item) => item !== "id")
                    .map((item, i) => (
                      <th
                        key={item}
                        className={styles[parseAttributesWidth(item)]}
                      >
                        {labels[item]}
                      </th>
                    ))}

                  <th className={`${styles.operation} w-operation`}></th>
                </tr>
                {data?.list.map((item) => (
                  <tr key={item.id}>
                    {Object.keys(item)
                      .filter((jtem) => jtem !== "id")
                      .map((jtem) => (
                        <td key={jtem}>{parseAttributes(jtem, item[jtem])}</td>
                      ))}

                    <td
                      className={`${styles.operation} flex gap-10 w-operation`}
                    >
                      <button className="transition hover:bg-dodger rounded-circle w-icon h-icon">
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <button className="transition hover:bg-dodger rounded-circle w-icon h-icon">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty />
          )}
          {data?.totalPages > 1 ? (
            <div
              className={`w-full flex items-center gap-2 ${styles.pagination}`}
            >
              <button
                className="transition hover:bg-dodger rounded-circle w-icon h-icon"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span>{page + 1}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === data?.totalPages - 1}
                className="transition hover:bg-dodger rounded-circle w-icon h-icon"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

List.propTypes = {
  model: PropTypes.string.isRequired,
};

export default List;
