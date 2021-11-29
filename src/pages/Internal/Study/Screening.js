import { useState, useContext, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { auth, firestore } from "database/firebase";
import { UserContext } from "context";
import { Card, Loader, Message } from "components";

import {
  Box,
  SimpleGrid,
  Grid,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Text,
  Button,
} from "@chakra-ui/react";
import { useDocument, usePathParams, useTriggerToast } from "hooks";
import { participant } from "database/mutations";

function Screening() {
  const history = useHistory();
  const triggerToast = useTriggerToast();
  const verified = auth.currentUser.emailVerified;
  const user = useContext(UserContext);

  const { studyID } = usePathParams();
  const [study, loading, error] = useDocument(
    firestore.collection("studies").doc(studyID)
  );
  const [responses, setResponses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!verified) {
      history.goBack();
    }
  }, [verified]);

  useEffect(() => {
    if (study) {
      setResponses(study?.questions?.map(() => ""));
    }
  }, [study]);

  const handleResponseChange = (index, value) => {
    setResponses((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  //Generating random padded numbers
  const trailingDigits = Math.floor(Math.random() * 10000);
  const stringDigits = trailingDigits.toString()
  const paddedDigits = stringDigits.length < 4 ? stringDigits.padStart(4, 0) : stringDigits
  console.log(user, user.firstName + paddedDigits)

  //Generating random color
  const color = ['blue.500', 'pink.300', 'black', 'yellow.500', 'green.500', 'red.500', 'orange.500', 'teal.500', 'cyan.500', 'purple.500', 'grey'][Math.floor(Math.random() * 11)]

  const handleSave = async () => {
    setIsSubmitting(true);
    const creatingStudyParticipantDocument = firestore
      .collection("studies")
      .doc(studyID)
      .collection("participants")
      .doc(user.id)
      .set({
        status: "interested",
        firstname: user.firstName + paddedDigits,
        color: color,
        timezone: user.timezone.region,
        availability: user.availability,
        responses,
      });

    const appendingStudyToParticipantEnrolled =
      participant.appendStudyToEnrolled(auth.currentUser.uid, study.id);

    await Promise.all([
      creatingStudyParticipantDocument,
      appendingStudyToParticipantEnrolled,
    ])
      .then(() => {
        triggerToast({
          title: "Successfully Enrolled",
          description:
            "You have successfully enrolled for this research study!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        history.push(`/study/${study.id}/details`);
      })
      .then(() => setIsSubmitting(true));
  };

  if (loading) {
    return <Loader height="calc(100vh - 80px)" />;
  }

  return (
    <>
      <Heading fontSize="28px">Screening Survey</Heading>
      <SimpleGrid spacing="20px" marginY="20px">
        {study?.questions?.length ? (
          study?.questions.map((question, i) => (
            <Card key={i} padding="20px">
              <Text fontWeight="500" mb="5px">
                {i + 1}. {question.prompt}
              </Text>
              <RadioGroup
                value={responses[i]}
                onChange={(v) => handleResponseChange(i, v)}
              >
                <Grid>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                  <Radio value="Unsure">Unsure</Radio>
                </Grid>
              </RadioGroup>
            </Card>
          ))
        ) : (
          <Box height="400px">
            <Message
              title="No Questions"
              description={`This research study does not have any questions for you to answer. Click "Submit" to complete your enrollment process`}
              showBackground
            />
          </Box>
        )}
      </SimpleGrid>
      <Flex justify="flex-end" gridGap="10px">
        <Button variant="outline" color="gray.500" onClick={history.goBack}>
          Back
        </Button>
        <Button
          colorScheme="green"
          onClick={handleSave}
          isLoading={isSubmitting}
        >
          Submit
        </Button>
      </Flex>
    </>
  );
}

export default Screening;
