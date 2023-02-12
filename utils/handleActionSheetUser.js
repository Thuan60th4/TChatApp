export const handleActionSheet = (
  data,
  showActionSheetWithOptions,
  handleNavigate,
  handleRemoveUser
) => {

  showActionSheetWithOptions(
    {
      options: ["Message", "Remove from group", "Cancel"],
      tintColor: "#11a0ff",
      destructiveButtonIndex: 1,
      destructiveColor: "red",
      cancelButtonIndex: 2,
    },
    async (buttonIndex) => {
      if (buttonIndex === 0) {
        handleNavigate(data);
      } else if (buttonIndex === 1) {
        await handleRemoveUser(data);
      }
    }
  );
};
