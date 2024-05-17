import React from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from "../../styles/MessageStyles";

const Messages = [
  {
    id: "1",
    userName: "Jenny Doe",
    userImg:
      "https://enpuyfxhpaelfcrutmcy.supabase.co/storage/v1/object/sign/rendezviewz/people/charlotte.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZW5kZXp2aWV3ei9wZW9wbGUvY2hhcmxvdHRlLnBuZyIsImlhdCI6MTcxNTcwNjE4OCwiZXhwIjoxNzQ3MjQyMTg4fQ.6kQjtfl7d-ZfuY-EQrsXC7Q64ECK3cBsC-588AFuJ98&t=2024-05-14T17%3A03%3A08.823Z",
    messageTime: "4 mins ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "2",
    userName: "John Doe",
    userImg:
      "https://enpuyfxhpaelfcrutmcy.supabase.co/storage/v1/object/sign/rendezviewz/people/charlotte.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZW5kZXp2aWV3ei9wZW9wbGUvY2hhcmxvdHRlLnBuZyIsImlhdCI6MTcxNTcwNjE4OCwiZXhwIjoxNzQ3MjQyMTg4fQ.6kQjtfl7d-ZfuY-EQrsXC7Q64ECK3cBsC-588AFuJ98&t=2024-05-14T17%3A03%3A08.823Z",
    messageTime: "2 hours ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "3",
    userName: "Ken William",
    userImg:
      "https://enpuyfxhpaelfcrutmcy.supabase.co/storage/v1/object/sign/rendezviewz/people/charlotte.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZW5kZXp2aWV3ei9wZW9wbGUvY2hhcmxvdHRlLnBuZyIsImlhdCI6MTcxNTcwNjE4OCwiZXhwIjoxNzQ3MjQyMTg4fQ.6kQjtfl7d-ZfuY-EQrsXC7Q64ECK3cBsC-588AFuJ98&t=2024-05-14T17%3A03%3A08.823Z",
    messageTime: "1 hours ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "4",
    userName: "Selina Paul",
    userImg:
      "https://enpuyfxhpaelfcrutmcy.supabase.co/storage/v1/object/sign/rendezviewz/people/charlotte.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZW5kZXp2aWV3ei9wZW9wbGUvY2hhcmxvdHRlLnBuZyIsImlhdCI6MTcxNTcwNjE4OCwiZXhwIjoxNzQ3MjQyMTg4fQ.6kQjtfl7d-ZfuY-EQrsXC7Q64ECK3cBsC-588AFuJ98&t=2024-05-14T17%3A03%3A08.823Z",
    messageTime: "1 day ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "5",
    userName: "Christy Alex",
    userImg:
      "https://enpuyfxhpaelfcrutmcy.supabase.co/storage/v1/object/sign/rendezviewz/people/charlotte.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZW5kZXp2aWV3ei9wZW9wbGUvY2hhcmxvdHRlLnBuZyIsImlhdCI6MTcxNTcwNjE4OCwiZXhwIjoxNzQ3MjQyMTg4fQ.6kQjtfl7d-ZfuY-EQrsXC7Q64ECK3cBsC-588AFuJ98&t=2024-05-14T17%3A03%3A08.823Z",
    messageTime: "2 days ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
];

const MessagesScreen = ({ navigation }) => {
  return (
    <Container>
      <FlatList
        data={Messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            onPress={() =>
              navigation.navigate("ChatScreen", { userName: item.userName })
            }
          >
            <UserInfo>
              <UserImgWrapper>
                <UserImg source={item.userImg} />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.userName}</UserName>
                  <PostTime>{item.messageTime}</PostTime>
                </UserInfoText>
                <MessageText>{item.messageText}</MessageText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
    </Container>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
