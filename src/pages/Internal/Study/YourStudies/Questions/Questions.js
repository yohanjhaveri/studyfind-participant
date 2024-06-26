import { Grid } from "@chakra-ui/react";

import QuestionCard from "components/feature/Participants/QuestionCard/QuestionCard";
import QuestionsEmpty from "./QuestionsEmpty";

function Questions({ questions, responses }) {
  if (!questions || questions.length === 0) {
    return <QuestionsEmpty />;
  }

  if (!responses || responses.length === 0) {
    return null;
  }

  return (
    <Grid gap="15px" padding="15px">
      {questions.map((question, i) => (
        <QuestionCard key={i} question={question} response={responses[i]} />
      ))}
    </Grid>
  );
}

export default Questions;
