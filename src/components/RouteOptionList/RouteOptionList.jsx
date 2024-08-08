import React, {useState} from "react";
import PropTypes from "prop-types";
import RouteOption from "../RouteOption/RouteOption";

export default function RouteOptionList({routeOptionProps, onRouteOptionSelected}) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleOptionClick = (index, provider, routeType) => {
    setSelectedIndex(index);
    onRouteOptionSelected(provider.id, routeType);
  };

  return (
    <div>
      {routeOptionProps.map((props, index) => (
        <RouteOption
          {...props}
          isSelected={index === selectedIndex}
          onClick={() => handleOptionClick(index, props.provider, props.type)}
        />
      ))}
    </div>
  );
}

RouteOptionList.propTypes = {
  routeOptionProps: PropTypes.arrayOf(PropTypes.shape(RouteOption.propTypes)),
  onRouteOptionSelected: PropTypes.func.isRequired,
}
