import { TouchableOpacity } from "react-native";

function IconButtom({ onPress, Icon, ...propsIcon }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon {...propsIcon} />
    </TouchableOpacity>
  );
}

export default IconButtom;
