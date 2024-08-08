// import React from "react";
// import PropTypes from "prop-types";
// import DockedEbikeRouteOption from "./DockedEbikeRouteOption";

// export default function RouteOption({type, ...props}) {
//   if (type === DockedEbikeRouteOption.TYPE) {
//     return DockedEbikeRouteOption(props);
//   } else {
//     throw TypeError(`Unknown route option type: '${type}'.`);
//   }
// }

// RouteOption.propTypes = {
//   type: PropTypes.oneOf([
//     DockedEbikeRouteOption.TYPE,
//   ]),
// }


import React from "react";
import PropTypes from "prop-types";
import DockedEbikeRouteOption from "./DockedEbikeRouteOption";

export default function RouteOption({ type, isSelected, onClick, ...props }) {
  const style = {
    backgroundColor: isSelected ? "blue" : "transparent",
    cursor: "pointer",
  };

  if (type === DockedEbikeRouteOption.TYPE) {
    return (
      <div onClick={onClick} style={style}>
        <DockedEbikeRouteOption {...props} />
      </div>
    );
  } else {
    throw new TypeError(`Unknown route option type: '${type}'.`);
  }
}

RouteOption.propTypes = {
  type: PropTypes.oneOf([DockedEbikeRouteOption.TYPE]),
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
};
