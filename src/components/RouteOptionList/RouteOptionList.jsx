// import React from "react";
// import PropTypes from "prop-types";
// import RouteOption from "../RouteOption/RouteOption";

// export default function RouteOptionList({routeOptionProps}) {
//   return (
//     <div>
//       {routeOptionProps.map(props => RouteOption(props))}
//     </div>
//   );
// }

// RouteOptionList.propTypes = {
//   routeOptionProps: PropTypes.arrayOf(RouteOption.propTypes),
// }




import React, { useState } from "react";
import PropTypes from "prop-types";
import RouteOption from "../RouteOption/RouteOption";

export default function RouteOptionList({ routeOptionProps, onRouteOptionSelected }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleOptionClick = (index, providerId, routeType) => {
    setSelectedIndex(index);
    if (onRouteOptionSelected) {
      onRouteOptionSelected(providerId, routeType);
    }
  };

  return (
    <div>
      {routeOptionProps.map((props, index) => (
        <RouteOption
          key={index}
          {...props}
          isSelected={index === selectedIndex}
          onClick={() => handleOptionClick(index, props.provider.name, props.type)}
        />
      ))}
    </div>
  );
}

RouteOptionList.propTypes = {
  routeOptionProps: PropTypes.arrayOf(PropTypes.shape(RouteOption.propTypes)),
  onRouteOptionSelected: PropTypes.func.isRequired,
};