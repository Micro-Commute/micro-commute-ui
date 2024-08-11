import HelloWorld from "./HelloWorld";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/HelloWorld",
  component: HelloWorld,
  parameters: {
    layout: "centered", // Optional parameter to center the component in the Canvas
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  // Use the spread operator (...) to include any default props from your HelloWorld component
  args: { ...HelloWorld.defaultProps },
};
