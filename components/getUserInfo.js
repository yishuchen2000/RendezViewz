import supabase from "../Supabase";

const getUserInfo = async (id) => {
  if (id) {
    const profileInfo = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id);

    console.log("PROFILE INFO FROM COMP", profileInfo);
    return profileInfo;
  }
  return null;
};

export default getUserInfo;
