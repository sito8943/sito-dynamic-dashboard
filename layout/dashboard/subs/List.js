import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { dehydrate, QueryClient } from "@tanstack/react-query";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

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

  const { data, isLoading, isFetching } = useModel(
    model,
    0,
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
        <div className="flex w-full h-full items-center justify-center">
          {data?.length ? (
            <table className={`${styles.bordered} w-full h-full`}>
              <tbody>
                <tr>
                  {Object.keys(data[0])
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
                {data?.map((item) => (
                  <tr key={item.id}>
                    {Object.keys(item)
                      .filter((jtem) => jtem !== "id")
                      .map((jtem) => (
                        <td key={jtem}>{parseAttributes(jtem, item[jtem])}</td>
                      ))}

                    <td
                      className={`${styles.operation} flex gap-10 w-operation`}
                    >
                      <button>
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <button>
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
        </div>
      )}
    </div>
  );
};

List.propTypes = {
  model: PropTypes.string.isRequired,
};

export default List;
