/* Takes in the list of uuid of friends of current user
 * returns profile info of these friends.
 */
const getHostInfo = async (friendIDs) => {
  const response = await supabase
    .from("profiles")
    .select("*")
    .eq("id", friendIDs);
  console.log("HOST INFO FETCH", response.data);
  return response.data;
};

export default getFriendInfo;
