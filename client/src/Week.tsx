import { Box, Card, Center, Grid, GridItem } from "@chakra-ui/react";
import { FC } from "react";
import { Course, Session } from "./types";

interface WeekProps {
  scheduler: Course[];
}

const Week: FC<WeekProps> = (props: WeekProps) => {

  return (
    <Box 
      style={{
        display: 'block',
        width: '100%',
        overflowX: 'auto'
      }}
      fontSize={{ lg: 'md', md: 'sm', base: 'xs' }}
      padding={2}
      shadow='lg'
      rounded='md'
    >
      <Grid autoRows='1fr' templateColumns='repeat(7, 1fr)' gap={2} width='100%'>
        <GridItem></GridItem>
        <GridItem as='b'><Center>Lunes</Center></GridItem>
        <GridItem as='b'><Center>Martes</Center></GridItem>
        <GridItem as='b'><Center>Miercoles</Center></GridItem>
        <GridItem as='b'><Center>Jueves</Center></GridItem>
        <GridItem as='b'><Center>Viernes</Center></GridItem>
        <GridItem as='b'><Center>Sabado</Center></GridItem>

        <GridItem rowStart={2}>8:00 am</GridItem>
        <GridItem rowStart={3}>9:00 am</GridItem>
        <GridItem rowStart={4}>10:00 am</GridItem>
        <GridItem rowStart={5}>11:00 am</GridItem>
        <GridItem rowStart={6}>12:00 am</GridItem>
        <GridItem rowStart={7}>1:00 pm</GridItem>
        <GridItem rowStart={8}>2:00 pm</GridItem>
        <GridItem rowStart={9}>3:00 pm</GridItem>
        <GridItem rowStart={10}>4:00 pm</GridItem>
        <GridItem rowStart={11}>5:00 pm</GridItem>
        <GridItem rowStart={12}>6:00 pm</GridItem>
        <GridItem rowStart={13}>7:00 pm</GridItem>
        <GridItem rowStart={14}>8:00 pm</GridItem>

        {
          props.scheduler.map((course: Course) => (
           course.sessions.map((session: Session, i: Number) => (
            <GridItem
              key={course.name + i.toString()}
              rowStart={parseInt(session.begin.split(':')[0]) - 6}
              rowEnd={parseInt(session.end.split(':')[0]) - 6}
              colStart={parseInt(session.day) + 1}
            >
              <Card
                variant='filled'
                p={2}
                rounded='md'
                height='full'
              >
                {course.name} ({session.place})
              </Card>
            </GridItem>
          )) 
          ))
        }
      </Grid>
    </Box>
  );
}

export default Week;
