import { FC, useState } from 'react';

import rawData from './data.json';

import { Scheduler, Course, Session } from './types';

import { Box, Button, Center, Container, Fade, Flex, FormControl, Heading, Input, InputGroup, InputLeftElement, Spacer, Table, TableContainer, Tag, TagCloseButton, TagLabel, Tbody, Td, Th, Thead, Tr, useColorMode, VStack, Wrap, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel } from '@chakra-ui/react';
import { AddIcon, MoonIcon, RepeatIcon, SearchIcon, SunIcon } from '@chakra-ui/icons';
import Week from './Week';

const App: FC = () => {

  const avalibleCourses: Course[] = rawData.courses; 
  const avalibleUDAs: string[] = rawData.options; 

  // Hooks
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [sugestedCourses, setSugestedCourses] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [schedulers, setSchedulers] = useState<Scheduler[]>([]);
  const [god, setGod] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode();

  const generateSchedulers = (): void => {
    const time2num = (time: string): number => parseInt(time.replace(':', ''))

    const sessionsDisjoin = (x: Session, y: Session): boolean => {
      if (x.day !== y.day) return true;
      
      const x_begin: number = time2num(x.begin);
      const x_end: number = time2num(x.end);
      const y_begin: number = time2num(y.begin);
      const y_end: number = time2num(y.end);
      
      const begin = Math.min(x_begin, y_begin);
      const end = Math.max(x_end, y_end);

      return end - begin >= x_end - x_begin + y_end - y_begin;
    }

    const coursesDisjoin = (x: Course, y: Course): boolean => {
      let disjoin = true;

      x.sessions.map((xSession: Session) => {
        y.sessions.map((ySession: Session) => {
            if (!sessionsDisjoin(xSession, ySession)) disjoin = false;
            return null;
          })
          return null;
        });

      return disjoin;
    }

    const isAValidScheduler = (scheduler: Scheduler): boolean => {
      let isValid = true;
      scheduler.courses.map((i: Course) => {
        scheduler.courses.map((j: Course) => {
            if (i.id !== j.id) if (!coursesDisjoin(i, j)) isValid = false;
            return null;
          });
          return null;
        });

      return isValid;
    }

    const cartesian = (...a: any[]) => a.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => [d, e].flat())));

    const classes = selectedCourses.map(className => avalibleCourses.filter(course => className === course.name));

    let validSchedulers: Scheduler[];
    if (selectedCourses.length === 0)
      validSchedulers = [];
    else if (selectedCourses.length === 1)
      validSchedulers = classes[0].map(x => { return { courses: [x] } });
    else {
      const schedulers = cartesian(...classes).map((courses: Course[]) => { return { courses } });
      validSchedulers = schedulers.filter((scheduler: Scheduler) => isAValidScheduler(scheduler));
    } 

    const possibleCourses: Course[] = avalibleCourses
      .filter((course: Course) => 
        validSchedulers.map(scheduler => 
          isAValidScheduler({ courses: [...scheduler.courses, course] })
        ).includes(true)
      );

     let sugestions = possibleCourses.map(course => course.name);
     sugestions = sugestions
      .filter((value, index) => sugestions.indexOf(value) === index)
      .filter(name => !selectedCourses.includes(name));
    
    setSchedulers(validSchedulers);
    setSugestedCourses(sugestions);
    setGod(validSchedulers.length === 0);
  }

  // Render
  return (
    <Box mx='4' className="App">
      <Flex
        h={16}
        p='3'
      >
        <Center>Increible</Center>
        <Spacer />
        <Box>
          <Button onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Box>
      </Flex>

      <Container>
        <Center>
          <Heading as='h1' size='3xl' my='10'>Horarios feos :u</Heading>
        </Center>

        <Center>
          <Wrap>
            {
              selectedCourses.map(course => (
                <Tag key={course}>
                  <TagLabel>{ course }</TagLabel>
                  <TagCloseButton
                  onClick={() => {
                    setSelectedCourses(selectedCourses.filter(x => x !== course));
                    setSchedulers([]);
                  }}
                  />
                </Tag>
              ))
            }
            
          </Wrap>
        </Center>

        <FormControl my='6'>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<SearchIcon color='gray.300' />}
            />
            <Input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder='Busca tus asignaturas'
            />
          </InputGroup>
        </FormControl>

        <VStack>
          {
            searchInput !== '' && avalibleUDAs
              .filter(course => course
                .toLowerCase()
                .normalize('NFD').replace(/\p{Diacritic}/gu, '')
                .includes(searchInput.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')))
            .filter(course => !selectedCourses.includes(course))
              .map(course => (
                <Button
                  key={course}
                  onClick={() => {
                    setSelectedCourses([...selectedCourses, course]);
                    setSearchInput('');
                    setSchedulers([]);
                  }}
                  width='100%'
                  size='sm'
                >{ course }</Button>
              ))
          }
        </VStack>

        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
                <Heading size='sm'>Sugerencias</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Center>
                <Wrap>
                  {
                    sugestedCourses.map(course => (
                      <Tag key={course}>
                        <TagLabel>{ course }</TagLabel>
                        <TagCloseButton
                          as={AddIcon}
                          onClick={() => {
                            setSelectedCourses([...selectedCourses, course]);
                            setSearchInput('');
                            setSchedulers([]);
                          }}
                        />
                      </Tag>
                    ))
                  }
                </Wrap>
              </Center>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

      </Container>

      <Center>
        <Button
          onClick={() => generateSchedulers()}
          leftIcon={<RepeatIcon />}
          size='lg'
          m='10'
        >
          Generar
        </Button>
      </Center>

      <Fade in={selectedCourses.length !== 0 && schedulers.length > 0}>
        {
          schedulers.map((scheduler: Scheduler, i: number) => (
              <VStack spacing='12' key={i.toString()}>
                <Heading size='lg' my='10'>Opción {i + 1}</Heading>
                <TableContainer fontSize='sm'>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Nombre</Th>
                        <Th>Grupo</Th>
                        <Th>Profesor</Th>
                      </Tr>
                    </Thead>
                  <Tbody>
                  {
                    scheduler.courses.map((course: Course) => (
                      <Tr key={course.id}>
                        <Td>{course.id}</Td>
                        <Td>{course.name}</Td>
                        <Td>{course.group}</Td>
                        <Td>{course.teacher}</Td>
                      </Tr>
                    ))
                  }
                  </Tbody>
                  </Table>
                </TableContainer>
                <Week scheduler={scheduler} />
              </VStack>
          ))
        }
      </Fade>

      <Fade in={god}>
        <Center>
          <Heading size='lg' my='10'>Llamen a Dios :0</Heading>
        </Center>
      </Fade>

    </Box>
  );
}


export default App;
