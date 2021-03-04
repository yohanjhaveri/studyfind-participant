import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { Page } from "components";

import { auth, firestore } from "database/firebase";
import { useDocument, useCollection } from "hooks";

import Sidebar from "./Sidebar";

import Settings from "views/Internal/Settings/Settings";
import FindStudies from "views/Internal/FindStudies/FindStudies";
import Notifications from "views/Internal/Notifications/Notifications";

import Account from "views/Internal/Account/Account"
import ViewStudy from "views/Internal/ViewStudy/ViewStudy"
import Questionnaire from "views/Internal/ViewStudy/Questionnaire"
import MyStudies from "views/Internal/MyStudies/MyStudies";

function Internal() {
  const { uid } = auth.currentUser;
  const [user] = useDocument(firestore.collection("participants").doc(uid));

  const [studies] = useCollection(
    firestore.collection("studies")
  );

  const pages = [
    { path: "/", component: <FindStudies user={user} />},
    { path: "/search", component: <FindStudies user={user} />},
    { path: "/notifications", component: <Notifications />},
    { path: "/settings", component: <Settings />},
    { path: "/study/:nctID", component: <ViewStudy studies={studies} /> },
    { path: "/account", component: <Account user={user}/> },
    { path: "/study/:nctID/questionnaire", component: <Questionnaire studies={studies} />},
    { path: "/mystudies", component: <MyStudies user={user} studies={studies}/> }
  ];

  return (
    <Flex bg="#f8f9fa">
      <Sidebar />
      <Box ml="280px" w="100%" minH="100vh">
        <Page isLoading={!(user)}>
          <Switch>
            {pages.map(({ path, component }, index) => (
              <Route exact path={path} key={index}>
                {component}
              </Route>
            ))}
            <Redirect to={"/"} />
          </Switch>
        </Page>
      </Box>
    </Flex>
  );
}

export default Internal;
