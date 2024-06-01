/* Takes in the list of uuid of friends of current user
 * returns profile info of these friends.
 */
const getFriendInfo = async (friendIDs) => {
  const response = await supabase
    .from("profiles")
    .select("*")
    .in("id", friendIDs);
  return response.data;
};

export default getFriendInfo;
