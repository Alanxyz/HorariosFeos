import { Box, Card, Center, Grid, GridItem, Text } from "@chakra-ui/react";
import { FC } from "react";
import { Scheduler, Course, Session } from "./types";

interface WeekProps {
  scheduler: Scheduler;
}

const Week: FC<WeekProps> = (props: WeekProps) => {

  const formatName = (name: string) => 
    name.split(' ').length >= 3 
      ? name.split(' ').map(word => word[0]).join('.') + '.' 
      : name;

      return (
        <Box
          fontSize={{ lg: "md", md: "sm", base: "xs" }}
        >
          <Grid templateColumns="repeat(8, 1fr)" gap={4}>
            <GridItem></GridItem>
            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day) => (
              <GridItem key={day} as="b">
                <Center>{day}</Center>
              </GridItem>
            ))}

            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((_, i) => (
              <GridItem rowStart={i + 2} key={i}>
                <Text>{i + 8}:00 {i + 8 < 12 ? "am" : "pm"}</Text>
              </GridItem>
            ))}

            {props.scheduler.courses.map((course: Course) => (
              course.sessions.map((session: Session, i: number) => (
                <GridItem
                  key={`${course.name}-${i}`}
                  rowStart={parseInt(session.begin.split(':')[0]) - 6 + 2}
                  rowEnd={parseInt(session.end.split(':')[0]) - 6 + 2}
                  colStart={session.day + 1}
                >
                  <Card
                    variant="filled"
                    p={2}
                    rounded="md"
                    height="full"
                    boxShadow="base"
                  >
                    <Text fontWeight="bold">{formatName(course.name)}</Text>
                    <Text fontSize="sm">{session.place}</Text>
                  </Card>
                </GridItem>
              ))
            ))}
          </Grid>
        </Box>
      );
};

export default Week;

