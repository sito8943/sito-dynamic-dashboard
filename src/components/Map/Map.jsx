import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import loadable from "@loadable/component";

//Services
/* import loadFromServerGet from "services/get"; */

// @emotion/css
import { css } from "@emotion/css";

import config from "../../config";

//Image
import Crash from "../../assets/images/no-product.jpg";

//Styles
import "mapbox-gl/dist/mapbox-gl.css";

// components
const Map = loadable((props) => import("react-map-gl"));
const Layer = loadable((props) => import("./Externals/Layer"));
const Marker = loadable((props) => import("./Externals/Marker"));
const Popup = loadable((props) => import("./Externals/Popup"));
const Source = loadable((props) => import("./Externals/Source"));

function Pin({ imagePlace }) {
  return (
    <div
      className={css({
        backgroundImage: `url(${imagePlace || Crash})`,
        width: "45px",
        height: "45px",
        objectFit: "contain",
        backgroundPosition: "center",
        backgroundSize: "cover",
        borderRadius: "50%",
        border: "4px solid #ffa726",
      })}
    />
  );
}

Pin = React.memo(Pin);

function MapBox({
  coordinates,
  points,
  point,
  flyTo,
  visible,
  sx,
  style,
  onClick,
}) {
  const [routeData, setRouteData] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: point ? point.longitude : -79.98476050000002,
    latitude: point ? point.latitude : 21.801503428305598,
    zoom: 16,
    bearing: 0,
    pitch: 0,
    width: "100%",
    height: "100%",
  });

  const map = useRef();

  // Funcion que crea los Marcadores de los LUgares

  function Places() {
    return points
      ?.filter((item) => item.location.lng && item.location.lat)
      .map((point, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={point.location.lng}
          latitude={point.location.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(point);
          }}
        >
          <Pin
            imagePlace={
              point?.headerImages?.length ? point?.headerImages[0]?.url : Crash
            }
          />
        </Marker>
      ));
  }

  Places = React.memo(Places);

  function Place() {
    return (
      <Marker
        key={`marker-${point?.id}`}
        longitude={point?.longitude}
        latitude={point?.latitude}
        anchor="bottom"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setPopupInfo(point);
        }}
      >
        <Pin
          imagePlace={
            point?.headerImages.length ? point?.headerImages[0].url : Crash
          }
        />
      </Marker>
    );
  }
  Place = React.memo(Place);

  const getMatch = useCallback(async (coordinates, radius, profile) => {
    try {
      // Separate the radiuses with semicolons
      const radiuses = radius.join(";");
      // Create the query
      const query = await fetch(
        `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${config.mapBoxAPI}`,
        { method: "GET" }
      );
      const { matchings } = await query.json();
      if (matchings) {
        setRouteData({ type: "Feature", ...matchings[0].geometry });
      }
    } catch (error) {
      // Handle errors
      console.error(
        error
      )`${error.code} - ${error.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`;
    }
  }, []);

  const updateRoute = useCallback(
    (profileUpd = "walking") => {
      // Set the profile
      const profile = profileUpd;
      // Format the coordinates
      const newCoords = coordinates.join(";");
      // Set the radius for each coordinate pair to 25 meters
      const radius = coordinates.map(() => 50);
      getMatch(newCoords, radius, profile);
    },
    [coordinates, getMatch]
  );

  function HandlePopUp() {
    const { location, headerImages, name, placeType, id } = popupInfo;
    return (
      <Popup
        anchor="top"
        longitude={Number(location.lng)}
        latitude={Number(location.lat)}
        onClose={() => setPopupInfo(null)}
      >
        <Link to={`/places/form?id=${id}`}>
          <div
            className={`flex justify-between items-center px-2 bg-dark-background2 rounded-2xl ${css(
              {
                width: "200px",
                height: "120px",
              }
            )}`}
          >
            <div className={css({ display: "flex", flexDirection: "column" })}>
              <div className={css({ flex: "1 0 auto" })}>
                <p sx={{ fontWeight: 800 }}>{name ? name : ""}</p>
                {/* <p>{placeType.length ? placeType[0].name : ""}</p> */}
              </div>
            </div>
            <img
              className={`${css({
                width: "100px",
                height: "100px",
              })} object-cover rounded-circle`}
              src={
                headerImages && headerImages[0] ? headerImages[0].url : Crash
              }
              alt={name}
            />
          </div>
        </Link>
      </Popup>
    );
  }

  HandlePopUp = React.memo(HandlePopUp);

  function Route() {
    return (
      <>
        <Source id="route" type="geojson" data={routeData} />
        <Layer
          id="route"
          type="line"
          source="route"
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
          paint={{
            "line-color": "#004f83",
            "line-width": 2.5,
            "line-dasharray": [0.1, 1.5],
          }}
        />
      </>
    );
  }
  Route = React.memo(Route);

  const onSelectPoint = useCallback(() => {
    if (flyTo) {
      const { longitude, latitude } = flyTo;
      map.current.flyTo({
        center: [longitude, latitude],
        duration: 1500,
        zoom: 17,
      });
    }
  }, [flyTo]);

  useEffect(() => {
    if (map.current) {
      map.current.resize();
    }
  }, [visible]);

  useEffect(() => {
    if (coordinates) {
      updateRoute();
    }
  }, [coordinates, updateRoute]);

  useEffect(() => {
    if (!flyTo) return;
    else onSelectPoint();
  }, [flyTo, onSelectPoint, point]);

  useLayoutEffect(() => {
    if (!point) return;
    else {
      const { longitude, latitude } = point;
      map?.current?.flyTo({
        center: [longitude, latitude],
        duration: 1000,
        zoom: 16,
      });
    }
  }, [point]);

  const handleViewportChange = useCallback(
    (viewport) => {
      setViewState({
        viewport: { ...viewState, ...viewport },
      });
    },
    [viewState]
  );

  useEffect(() => {
    if (point && (point.latitude === 0 || point.longitude === 0))
      setTimeout(
        () =>
          onClick({
            lngLat: {
              lat: 21.8032183,
              lng: -79.9900431,
            },
          }),
        1000
      );
  }, [point]);

  return (
    <div className={css({ ...sx })}>
      <Map
        ref={map}
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={config.mapBoxAPI}
        onMove={(evt) => setViewState(evt.viewState)}
        onViewportChange={handleViewportChange}
        cooperativeGestures
        onClick={onClick}
        style={{
          width: "100%",
          height: "100%",
          ...style,
        }}
      >
        {console.log("render")}
        {/* point && <Place />*/}
        {points && <Places />}
        {point ? <Place /> : null}
        {popupInfo && <HandlePopUp />}
        {routeData && <Route />}
      </Map>
    </div>
  );
}

MapBox.defaultProps = {
  width: "100%",
  height: "100%",
};

MapBox.propTypes = {
  /*  visible: PropTypes.bool.isRequired, */
  width: PropTypes.string,
  height: PropTypes.string,
  point: PropTypes.object,
  onClick: PropTypes.func,
};

export default MapBox;
